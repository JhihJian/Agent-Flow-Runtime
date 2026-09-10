import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import type {
	ExtensionAPI,
	ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { parseFlow } from "./parser.ts";
import {
	createFlowOutcomeTool,
	PiAgentIntegrationAdapter,
	type PiCliBridge,
} from "./pi.ts";
import { AgentRunModel, FlowCoordinator, JsonFileRunStore } from "./runtime.ts";
import type { FlowDefinition, UnifiedMessage } from "./types.ts";

interface ActiveFlow {
	path: string;
	promise: Promise<void>;
}

/** Install with `pi install <package>` or load with `pi -e ./dist/extension.js`. */
export default function flowExtension(pi: ExtensionAPI) {
	let configuredPath: string | undefined;
	let active: ActiveFlow | undefined;
	let adapter: PiAgentIntegrationAdapter | undefined;

	const bridge: PiCliBridge = {
		sendNodePrompt(prompt) {
			pi.sendUserMessage(prompt, { deliverAs: "followUp" });
		},
		getSessionReference() {
			return adapterSessionReference;
		},
		getLeafEntryId() {
			return latestContext?.sessionManager.getLeafId() ?? undefined;
		},
		getMessages(startEntryId, endEntryId) {
			const entries = latestContext?.sessionManager.getEntries() ?? [];
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
	let latestContext: ExtensionContext | undefined;
	let adapterSessionReference = "pi-current-session";

	pi.registerFlag("flow", {
		description: "Run a Markdown Flow file",
		type: "string",
	});
	pi.registerTool(
		createFlowOutcomeTool({
			submitCliOutcome: async (outcome, content) => {
				if (!adapter) throw new Error("Flow 尚未启动");
				await adapter.submitCliOutcome(outcome, content);
			},
		}),
	);

	pi.on("session_start", (_event, ctx) => {
		latestContext = ctx;
		adapterSessionReference =
			ctx.sessionManager.getSessionFile() ?? ctx.sessionManager.getSessionId();
		const flag = pi.getFlag("flow");
		configuredPath = typeof flag === "string" && flag.trim() ? flag : undefined;
	});

	pi.on("turn_end", async () => {
		if (adapter) await adapter.finalizeCliTurn();
	});

	pi.on("input", async (event, ctx) => {
		latestContext = ctx;
		if (event.source === "extension" || !configuredPath)
			return { action: "continue" };
		await startFlow(configuredPath, event.text, ctx);
		return { action: "handled" };
	});

	pi.registerCommand("flow", {
		description: "Run a Flow: /flow run <file> <task>",
		handler: async (args, ctx) => {
			latestContext = ctx;
			const match = /^run\s+(\S+)\s+([\s\S]+)$/.exec(args.trim());
			if (!match) {
				ctx.ui.notify("用法: /flow run <文件> <任务>", "warning");
				return;
			}
			await startFlow(match[1], match[2], ctx);
		},
	});

	pi.on("session_shutdown", async () => {
		if (active) await active.promise.catch(() => undefined);
	});

	async function startFlow(
		path: string,
		task: string,
		ctx: ExtensionContext,
	): Promise<void> {
		if (active) throw new Error(`Flow 正在运行: ${active.path}`);
		const absolutePath = isAbsolute(path) ? path : resolve(ctx.cwd, path);
		const flow = await loadFlow(absolutePath);
		adapter = new PiAgentIntegrationAdapter({ cliBridge: bridge });
		const store = new JsonFileRunStore(join(ctx.cwd, ".pi", "flow-runs.json"));
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
							cwd: ctx.cwd,
						}
					: { cwd: ctx.cwd },
			)
			.then(() => ctx.ui.notify(`Flow 已完成: ${flow.name}`, "info"))
			.catch((error) => {
				ctx.ui.notify(
					`Flow 失败: ${error instanceof Error ? error.message : String(error)}`,
					"error",
				);
				throw error;
			})
			.finally(() => {
				active = undefined;
				adapter = undefined;
			});
		active = { path: absolutePath, promise };
		await promise;
	}
}

async function loadFlow(path: string): Promise<FlowDefinition> {
	return parseFlow(await readFile(path, "utf8"), path);
}
