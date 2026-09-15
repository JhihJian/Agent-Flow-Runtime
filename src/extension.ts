import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import type {
	ExtensionAPI,
	ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import {
	getCliFlowState,
	rejectPendingSessionReplacement,
} from "./cli-state.ts";
import {
	FlowObservationPublisher,
	FlowRunInspector,
	FlowRuntime,
	formatFlowRunHistory,
	toFlowEventEnvelope,
} from "./observability.ts";
import { parseFlow } from "./parser.ts";
import {
	createFlowInspectionTool,
	createFlowOutcomeTool,
	PiAgentIntegrationAdapter,
	type PiCliBridge,
} from "./pi.ts";
import { AgentRunModel, FlowCoordinator, JsonFileRunStore } from "./runtime.ts";
import type {
	FlowDefinition,
	FlowObservationEvent,
	FlowRunSummary,
	UnifiedMessage,
} from "./types.ts";

/** Install with `pi install <package>` or load with `pi -e ./dist/extension.js`. */
export default function flowExtension(pi: ExtensionAPI) {
	const state = getCliFlowState();

	const bindContext = (
		ctx: ExtensionContext,
		sendPrompt: (prompt: string) => void = (prompt) => {
			pi.sendUserMessage(prompt, { deliverAs: "followUp" });
		},
		sendCommand: (command: string) => void = (command) => {
			pi.sendUserMessage(command, { expandPromptTemplates: true });
		},
	): void => {
		state.currentContext = ctx;
		state.sessionReference =
			ctx.sessionManager.getSessionFile() ?? ctx.sessionManager.getSessionId();
		state.notify = (message, level) => ctx.ui.notify(message, level);
		state.sendNodePrompt = sendPrompt;
		state.sendCommand = sendCommand;
	};

	const bridge: PiCliBridge = {
		sendNodePrompt(prompt) {
			if (!state.sendNodePrompt) throw new Error("Pi Flow 当前会话不可用");
			state.sendNodePrompt(prompt);
		},
		async createNewSession() {
			if (!state.sendCommand) throw new Error("Pi Flow 当前会话不可用");
			if (state.pendingSessionReplacement) {
				throw new Error("Pi Flow 已有正在进行的会话替换");
			}
			state.pendingModel = state.currentContext?.model;
			const promise = new Promise<void>((resolve, reject) => {
				state.pendingSessionReplacement = { resolve, reject };
			});
			try {
				state.sendCommand("/flow-new-session");
				await promise;
			} catch (error) {
				state.pendingModel = undefined;
				throw error;
			}
		},
		getSessionReference() {
			return state.sessionReference;
		},
		getLeafEntryId() {
			return state.currentContext?.sessionManager.getLeafId() ?? undefined;
		},
		getMessages(startEntryId, endEntryId) {
			const entries = state.currentContext?.sessionManager.getEntries() ?? [];
			const start = startEntryId
				? entries.findIndex((entry) => entry.id === startEntryId) + 1
				: 0;
			const end = endEntryId
				? entries.findIndex((entry) => entry.id === endEntryId)
				: entries.length - 1;
			return entries.slice(start, end + 1).flatMap((entry) => {
				if (entry.type !== "message") return [];
				const message = entry.message as unknown as {
					role?: unknown;
					content?: unknown;
				};
				const role =
					message.role === "user" || message.role === "assistant"
						? message.role
						: message.role === "toolResult"
							? "tool"
							: undefined;
				if (!role) return [];
				return [
					{
						id: entry.id,
						role,
						content: message.content as UnifiedMessage["content"],
					},
				];
			});
		},
	};

	pi.registerFlag("flow", {
		description: "Run a Markdown Flow file",
		type: "string",
	});
	pi.registerTool(
		createFlowOutcomeTool({
			submitCliOutcome: async (outcome, content) => {
				if (!state.adapter) throw new Error("Flow 尚未启动");
				await state.adapter.submitCliOutcome(outcome, content);
			},
		}),
	);
	pi.registerTool(createFlowInspectionTool(() => state.runtime));

	const showRun = async (
		runId: string,
		ctx: ExtensionContext,
	): Promise<void> => {
		const runtime = state.runtime ?? createRuntimeForContext(ctx);
		const history = await runtime.inspectRun(runId);
		ctx.ui.notify(
			history ? formatFlowRunHistory(history) : `Flow 运行不存在: ${runId}`,
			history ? "info" : "warning",
		);
	};

	pi.registerCommand("flow-new-session", {
		description: "Start a fresh Pi session for an injected Flow transition",
		handler: async (_args, ctx) => {
			const pending = state.pendingSessionReplacement;
			if (!pending) return;
			try {
				await ctx.waitForIdle();
				const parentSession = ctx.sessionManager.getSessionFile();
				const result = await ctx.newSession({
					parentSession,
					withSession: async (replacementContext) => {
						bindContext(
							replacementContext,
							(prompt) => {
								replacementContext.sendUserMessage(prompt, {
									deliverAs: "followUp",
								});
							},
							(command) => {
								replacementContext.sendUserMessage(command, {
									expandPromptTemplates: true,
								});
							},
						);
					},
				});
				if (result.cancelled) {
					throw new Error("创建新的 Pi 会话已取消");
				}
				state.pendingSessionReplacement = undefined;
				pending.resolve();
			} catch (error) {
				const failure =
					error instanceof Error ? error : new Error(String(error));
				rejectPendingSessionReplacement(failure);
				throw error;
			}
		},
	});

	pi.on("session_start", async (event, ctx) => {
		bindContext(ctx);
		if (event.reason === "new" && state.pendingModel) {
			const model = state.pendingModel;
			state.pendingModel = undefined;
			try {
				const restored = await pi.setModel(model);
				if (!restored) {
					throw new Error(
						`无法在新 Pi 会话中恢复模型: ${model.provider}/${model.id}`,
					);
				}
			} catch (error) {
				rejectPendingSessionReplacement(
					error instanceof Error ? error : new Error(String(error)),
				);
				throw error;
			}
		}
		const flag = pi.getFlag("flow");
		if (!state.active) {
			state.configuredPath =
				typeof flag === "string" && flag.trim() ? flag : undefined;
		}
		if (
			state.active &&
			state.runtime &&
			state.activeRunId &&
			!state.observation
		) {
			const observation = await state.runtime.openRunObservation(
				state.activeRunId,
				(event) => publishHostObservation(pi, event, ctx),
			);
			if (observation) {
				state.observation = observation.subscription;
				renderRunSnapshot(ctx, observation.snapshot);
			}
		}
		if (event.reason === "resume" && !state.active && !state.resuming) {
			state.resuming = resumeFlow(ctx)
				.catch((error) => {
					state.notify?.(
						`Flow 恢复失败: ${error instanceof Error ? error.message : String(error)}`,
						"error",
					);
				})
				.finally(() => {
					state.resuming = undefined;
				});
		}
	});

	pi.on("turn_end", async () => {
		if (state.adapter) await state.adapter.finalizeCliTurn();
	});

	pi.on("input", async (event, ctx) => {
		bindContext(ctx);
		if (event.source === "extension" || !state.configuredPath) {
			return { action: "continue" };
		}
		await startFlow(state.configuredPath, event.text, ctx);
		return { action: "handled" };
	});

	pi.registerCommand("flow", {
		description: "Run a Flow: /flow run <file> <task>",
		handler: async (args, ctx) => {
			bindContext(ctx);
			const show = /^show\s+(\S+)$/.exec(args.trim());
			if (show) {
				await showRun(show[1], ctx);
				return;
			}
			const list = /^list(?:\s+(\d+))?$/.exec(args.trim());
			if (list) {
				const runtime = state.runtime ?? createRuntimeForContext(ctx);
				const recent = await runtime.listRecentRuns(
					list[1] ? Number(list[1]) : 10,
				);
				if (!recent.length) {
					ctx.ui.notify("暂无 Flow 运行记录", "info");
					return;
				}
				if (ctx.hasUI) {
					const labels = recent.map(formatRunSummaryOption);
					const selected = await ctx.ui.select("选择 Flow 运行", labels);
					const index = selected ? labels.indexOf(selected) : -1;
					if (index >= 0) await showRun(recent[index].id, ctx);
					return;
				}
				ctx.ui.notify(formatRecentRuns(recent), "info");
				return;
			}
			const match = /^run\s+(\S+)\s+([\s\S]+)$/.exec(args.trim());
			if (!match) {
				ctx.ui.notify("用法: /flow run <文件> <任务>", "warning");
				return;
			}
			await startFlow(match[1], match[2], ctx);
		},
	});

	pi.on("session_shutdown", async () => {
		state.observation?.unsubscribe();
		state.observation = undefined;
	});

	async function startFlow(
		path: string,
		task: string,
		ctx: ExtensionContext,
	): Promise<void> {
		if (state.resuming) await state.resuming;
		if (state.active) throw new Error(`Flow 正在运行: ${state.active.path}`);
		const absolutePath = isAbsolute(path) ? path : resolve(ctx.cwd, path);
		const cwd = ctx.cwd;
		const flow = await loadFlow(absolutePath);
		const adapter = new PiAgentIntegrationAdapter({ cliBridge: bridge });
		state.adapter = adapter;
		const store = new JsonFileRunStore(join(cwd, ".pi", "flow-runs.json"));
		const publisher = new FlowObservationPublisher({
			onError: (error, event) =>
				state.notify?.(
					`Flow 观测通知异常 (${event.type}): ${error instanceof Error ? error.message : String(error)}`,
					"warning",
				),
		});
		const runtime = new FlowRuntime(
			new FlowRunInspector(store, { evidenceReader: adapter }),
			publisher,
		);
		state.runtime = runtime;
		const runId = randomUUID();
		state.activeRunId = runId;
		state.observation = runtime.subscribe(runId, (event) => {
			publishHostObservation(pi, event, ctx);
		});
		const coordinator = new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(adapter),
			undefined,
			publisher,
		);
		const first = flow.nodes.get(flow.startNodeRef);
		if (!first) throw new Error(`Flow 首节点不存在: ${flow.startNodeRef}`);
		const promise = coordinator
			.run(
				task,
				first.action.kind === "复用Agent"
					? {
							runId,
							existingAgentReference: bridge.getSessionReference(),
							cwd,
							flowPath: absolutePath,
							sessionReference: bridge.getSessionReference(),
						}
					: {
							runId,
							cwd,
							flowPath: absolutePath,
							sessionReference: bridge.getSessionReference(),
						},
			)
			.then(() => {
				state.notify?.(`Flow 已完成: ${flow.name}`, "info");
			})
			.catch((error) => {
				state.notify?.(
					`Flow 失败: ${error instanceof Error ? error.message : String(error)}`,
					"error",
				);
				throw error;
			})
			.finally(() => {
				state.observation?.unsubscribe();
				state.observation = undefined;
				state.activeRunId = undefined;
				ctx.ui.setStatus("flow-runtime", undefined);
				ctx.ui.setWidget("flow-runtime", undefined);
				state.active = undefined;
				state.adapter = undefined;
			});
		state.active = { path: absolutePath, promise };
		await promise;
	}

	async function resumeFlow(ctx: ExtensionContext): Promise<void> {
		const cwd = ctx.cwd;
		const store = new JsonFileRunStore(join(cwd, ".pi", "flow-runs.json"));
		const sessionReference = bridge.getSessionReference();
		const candidates = (await store.listRunningRuns()).filter(
			(run) =>
				run.cwd === cwd &&
				run.sessionReference === sessionReference &&
				typeof run.flowPath === "string",
		);
		if (!candidates.length) return;
		if (candidates.length > 1) {
			state.notify?.("发现多个待恢复的 Flow，无法确定要继续的运行", "error");
			return;
		}

		const run = candidates[0];
		if (!run) return;
		const flowPath = run.flowPath;
		if (!flowPath) return;
		const flow = await loadFlow(flowPath);
		if (flow.id !== run.flowId) {
			state.notify?.(`无法恢复 Flow: 文件与运行记录不匹配`, "error");
			return;
		}
		const adapter = new PiAgentIntegrationAdapter({ cliBridge: bridge });
		state.adapter = adapter;
		const publisher = new FlowObservationPublisher({
			onError: (error, event) =>
				state.notify?.(
					`Flow 观测通知异常 (${event.type}): ${error instanceof Error ? error.message : String(error)}`,
					"warning",
				),
		});
		const runtime = new FlowRuntime(
			new FlowRunInspector(store, { evidenceReader: adapter }),
			publisher,
		);
		state.runtime = runtime;
		state.activeRunId = run.id;
		const observation = await runtime.openRunObservation(run.id, (event) => {
			publishHostObservation(pi, event, ctx);
		});
		if (!observation) return;
		state.observation = observation.subscription;
		renderRunSnapshot(ctx, observation.snapshot);
		const coordinator = new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(adapter),
			undefined,
			publisher,
		);
		const promise = coordinator
			.resume(run.id, { existingAgentReference: sessionReference, cwd })
			.then(() => {
				state.notify?.(`Flow 已恢复并完成: ${flow.name}`, "info");
			})
			.catch((error) => {
				state.notify?.(
					`Flow 恢复失败: ${error instanceof Error ? error.message : String(error)}`,
					"error",
				);
			})
			.finally(() => {
				state.observation?.unsubscribe();
				state.observation = undefined;
				state.activeRunId = undefined;
				ctx.ui.setStatus("flow-runtime", undefined);
				ctx.ui.setWidget("flow-runtime", undefined);
				state.active = undefined;
				state.adapter = undefined;
			});
		state.active = { path: flowPath, promise };
	}
}

async function loadFlow(path: string): Promise<FlowDefinition> {
	return parseFlow(await readFile(path, "utf8"), path);
}

function createRuntimeForContext(ctx: ExtensionContext): FlowRuntime {
	const store = new JsonFileRunStore(join(ctx.cwd, ".pi", "flow-runs.json"));
	return new FlowRuntime(
		new FlowRunInspector(store),
		new FlowObservationPublisher(),
	);
}

function publishHostObservation(
	pi: ExtensionAPI,
	event: FlowObservationEvent,
	ctx: ExtensionContext,
): void {
	if (ctx.mode === "tui") {
		ctx.ui.setStatus(
			"flow-runtime",
			`${event.status}/${event.phase} #${event.sequence}`,
		);
		ctx.ui.setWidget("flow-runtime", [
			`Flow ${event.flowId}  Run ${event.runId}`,
			`${event.type}: ${event.summary}`,
		]);
	}
	if (ctx.mode === "json" || ctx.mode === "rpc") {
		pi.sendMessage(
			{
				customType: "flow_event",
				content: [],
				display: false,
				details: toFlowEventEnvelope(event),
			},
			{ triggerTurn: false },
		);
	}
}

function renderRunSnapshot(
	ctx: ExtensionContext,
	history: Awaited<ReturnType<FlowRuntime["inspectRun"]>>,
): void {
	if (!history || ctx.mode !== "tui") return;
	const current =
		history.current.kind === "node"
			? `node:${history.current.nodeRef}`
			: history.current.kind === "parallel"
				? `parallel:${history.current.parallelRef}`
				: "none";
	ctx.ui.setStatus(
		"flow-runtime",
		`${history.run.status}/${history.run.phase} #${history.run.sequence}`,
	);
	ctx.ui.setWidget("flow-runtime", [
		`Flow ${history.run.flowId}  Run ${history.run.id}`,
		`Current: ${current}`,
		`Nodes: ${history.nodeRuns.length}  Parallel rounds: ${history.parallelRounds.length}`,
	]);
}

function formatRunSummaryOption(summary: FlowRunSummary): string {
	return `${summary.id} | ${summary.flowId} | ${summary.status}/${summary.phase} | ${summary.startedAt}`;
}

function formatRecentRuns(runs: FlowRunSummary[]): string {
	return [
		"Recent Flow runs:",
		...runs.map((run) => `- ${formatRunSummaryOption(run)}`),
	].join("\n");
}
