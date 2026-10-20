import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { getCliFlowState } from "../src/cli-state.ts";
import flowExtension from "../src/extension.ts";

test("CLI 无法隔离能力时拒绝启动 Flow Agent", async () => {
	const state = getCliFlowState() as unknown as Record<string, unknown>;
	for (const key of Object.keys(state)) delete state[key];
	const commands = new Map<
		string,
		(args: string, ctx: unknown) => Promise<unknown>
	>();
	const events = new Map<
		string,
		((...args: unknown[]) => Promise<unknown>)[]
	>();
	const notifications: string[] = [];
	const pi = {
		registerFlag() {},
		registerTool() {},
		registerCommand(
			name: string,
			definition: { handler: (args: string, ctx: unknown) => Promise<unknown> },
		) {
			commands.set(name, definition.handler);
		},
		on(name: string, handler: (...args: unknown[]) => Promise<unknown>) {
			const handlers = events.get(name) ?? [];
			handlers.push(handler);
			events.set(name, handlers);
		},
		getFlag() {
			return undefined;
		},
		sendMessage() {},
		sendUserMessage() {},
	};
	flowExtension(pi as unknown as ExtensionAPI);
	const context = {
		cwd: resolve(import.meta.dirname, "fixtures", "ordinary"),
		mode: "tui",
		hasUI: false,
		sessionManager: {
			getSessionFile: () => "session.jsonl",
			getSessionId: () => "session",
			getLeafId: () => undefined,
			getEntries: () => [],
		},
		ui: {
			notify(message: string) {
				notifications.push(message);
			},
		},
		async waitForIdle() {},
		isIdle() {
			return true;
		},
	};
	await events.get("session_start")?.[0]({ reason: "new" }, context);
	const flowCommand = commands.get("flow");
	assert.ok(flowCommand);
	await assert.rejects(
		flowCommand(
			`run ${resolve(import.meta.dirname, "fixtures", "ordinary", "FLOW.md")} 完成测试`,
			context,
		),
		/无法隔离 Flow Agent/,
	);
	assert.match(notifications.at(-1) ?? "", /Flow 失败/);
});
