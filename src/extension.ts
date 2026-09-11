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
import { parseFlow } from "./parser.ts";
import {
	createFlowOutcomeTool,
	PiAgentIntegrationAdapter,
	type PiCliBridge,
} from "./pi.ts";
import { AgentRunModel, FlowCoordinator, JsonFileRunStore } from "./runtime.ts";
import type { FlowDefinition, UnifiedMessage } from "./types.ts";

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
			const promise = new Promise<void>((resolve, reject) => {
				state.pendingSessionReplacement = { resolve, reject };
			});
			state.sendCommand("/new");
			await promise;
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

	pi.registerCommand("new", {
		description: "Start a fresh Pi session for an injected Flow command",
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

	pi.on("session_start", (_event, ctx) => {
		bindContext(ctx);
		const flag = pi.getFlag("flow");
		if (!state.active) {
			state.configuredPath =
				typeof flag === "string" && flag.trim() ? flag : undefined;
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
			const match = /^run\s+(\S+)\s+([\s\S]+)$/.exec(args.trim());
			if (!match) {
				ctx.ui.notify("用法: /flow run <文件> <任务>", "warning");
				return;
			}
			await startFlow(match[1], match[2], ctx);
		},
	});

	pi.on("session_shutdown", async () => {
		// A session replacement reloads this extension while the coordinator
		// continues through the process-level CLI state.
	});

	async function startFlow(
		path: string,
		task: string,
		ctx: ExtensionContext,
	): Promise<void> {
		if (state.active) throw new Error(`Flow 正在运行: ${state.active.path}`);
		const absolutePath = isAbsolute(path) ? path : resolve(ctx.cwd, path);
		const cwd = ctx.cwd;
		const flow = await loadFlow(absolutePath);
		const adapter = new PiAgentIntegrationAdapter({ cliBridge: bridge });
		state.adapter = adapter;
		const store = new JsonFileRunStore(join(cwd, ".pi", "flow-runs.json"));
		const coordinator = new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(adapter),
		);
		const first = flow.nodes.get(flow.startNodeRef);
		if (!first) throw new Error(`Flow 首节点不存在: ${flow.startNodeRef}`);
		const promise = coordinator
			.run(
				task,
				first.action.kind === "复用Agent"
					? {
							existingAgentReference: bridge.getSessionReference(),
							cwd,
						}
					: { cwd },
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
				state.active = undefined;
				state.adapter = undefined;
			});
		state.active = { path: absolutePath, promise };
		await promise;
	}
}

async function loadFlow(path: string): Promise<FlowDefinition> {
	return parseFlow(await readFile(path, "utf8"), path);
}
