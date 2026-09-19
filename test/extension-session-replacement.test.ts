import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { getCliFlowState } from "../src/cli-state.ts";
import flowExtension from "../src/extension.ts";

type AsyncHandler = (...args: unknown[]) => Promise<unknown>;

test("新建会话后的 Flow 收尾不会访问旧扩展上下文", async () => {
	const cwd = await mkdtemp(join(tmpdir(), "flow-extension-"));
	const commands = new Map<string, AsyncHandler>();
	const events = new Map<string, AsyncHandler[]>();
	const tools: Array<{ name: string; execute: AsyncHandler }> = [];
	const notifications: string[] = [];
	const state = getCliFlowState() as unknown as Record<string, unknown>;
	for (const key of Object.keys(state)) delete state[key];
	state.sessionReference = "pi-current-session";

	const emit = async (name: string, ...args: unknown[]) => {
		for (const handler of events.get(name) ?? []) await handler(...args);
	};
	const pi = {
		registerFlag() {},
		registerTool(tool: { name: string; execute: AsyncHandler }) {
			tools.push(tool);
		},
		registerCommand(name: string, definition: { handler: AsyncHandler }) {
			commands.set(name, definition.handler);
		},
		on(name: string, handler: AsyncHandler) {
			const handlers = events.get(name) ?? [];
			handlers.push(handler);
			events.set(name, handlers);
		},
		getFlag() {
			return undefined;
		},
		async setModel() {
			return true;
		},
		sendMessage() {},
		sendUserMessage(command: string) {
			if (command !== "/flow-new-session") return;
			void commands.get("flow-new-session")?.("", oldContext.value);
		},
	};
	flowExtension(pi as unknown as ExtensionAPI);
	assert.equal(
		events.has("session_before_compact"),
		false,
		"Flow Runtime 不应覆写 Pi 原生 compact",
	);

	let oldContext: ReturnType<typeof context>;
	const outcomeTool = () => {
		const tool = tools.find(
			(candidate) => candidate.name === "submit_flow_outcome",
		);
		assert.ok(tool, "扩展应注册 Flow 结果工具");
		return tool;
	};
	const nodePrompts: string[] = [];
	const newContext = context("new.jsonl", async (prompt) => {
		nodePrompts.push(prompt);
		const outcome = prompt.includes("分析任务") ? "已分析" : "已完成";
		await outcomeTool().execute("tool-call", { outcome, content: outcome });
		await emit("turn_end");
		if (outcome === "已分析") {
			assert.equal(nodePrompts.length, 1, "下游节点不能在 turn_end 内启动");
		}
		await emit("agent_settled");
	});
	oldContext = context("old.jsonl", undefined, async (options) => {
		oldContext.invalidate();
		await emit("session_shutdown");
		await emit("session_start", { reason: "new" }, newContext.value);
		await options.withSession?.(newContext.value);
		return { cancelled: false };
	});

	await emit("session_start", { reason: "new" }, oldContext.value);
	const flowCommand = commands.get("flow");
	assert.ok(flowCommand, "扩展应注册 /flow 命令");
	await flowCommand(
		`run ${resolve(import.meta.dirname, "fixtures", "ordinary", "FLOW.md")} 完成测试`,
		oldContext.value,
	);

	assert.deepEqual(
		notifications,
		["Flow 已完成: 普通流转"],
		"完成通知应发送到替换后的会话",
	);

	function context(
		sessionFile: string,
		onPrompt?: (prompt: string) => Promise<void>,
		onNewSession?: (options: {
			withSession?: AsyncHandler;
		}) => Promise<unknown>,
	) {
		let valid = true;
		const assertCurrent = () => {
			if (!valid) throw new Error("stale extension context accessed");
		};
		return {
			value: {
				cwd,
				mode: "tui",
				hasUI: false,
				sessionManager: {
					getSessionFile: () => sessionFile,
					getSessionId: () => sessionFile,
					getLeafId: () => undefined,
					getEntries: () => [],
				},
				ui: {
					notify(message: string) {
						assertCurrent();
						notifications.push(message);
					},
					setStatus() {
						assertCurrent();
					},
					setWidget() {
						assertCurrent();
					},
				},
				async waitForIdle() {
					assertCurrent();
				},
				isIdle() {
					assertCurrent();
					return true;
				},
				async newSession(options: { withSession?: AsyncHandler }) {
					assertCurrent();
					return onNewSession?.(options);
				},
				async sendUserMessage(prompt: string) {
					assertCurrent();
					await onPrompt?.(prompt);
				},
				async sendMessage() {
					assertCurrent();
				},
			},
			invalidate: () => {
				valid = false;
			},
		};
	}
});
