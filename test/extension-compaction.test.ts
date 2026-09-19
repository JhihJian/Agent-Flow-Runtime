import assert from "node:assert/strict";
import test from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { getCliFlowState } from "../src/cli-state.ts";
import flowExtension from "../src/extension.ts";

type Handler = (...args: unknown[]) => Promise<unknown>;

test("Flow compact 摘要忽略取消时在 deadline 后写入降级摘要", async () => {
	const events = new Map<string, Handler[]>();
	const flags = new Map<string, string | boolean | undefined>();
	const state = getCliFlowState() as unknown as Record<string, unknown>;
	for (const key of Object.keys(state)) delete state[key];
	state.active = {
		path: "/flows/test/FLOW.md",
		promise: new Promise<void>(() => {}),
	};
	state.sessionReference = "flow-session";

	const pi = {
		registerFlag(name: string, options: { default?: string | boolean }) {
			flags.set(name, options.default);
		},
		registerTool() {},
		registerCommand() {},
		on(name: string, handler: Handler) {
			const handlers = events.get(name) ?? [];
			handlers.push(handler);
			events.set(name, handlers);
		},
		getFlag(name: string) {
			return name === "flow-compaction-timeout-ms" ? "1000" : flags.get(name);
		},
		async setModel() {
			return true;
		},
		sendMessage() {},
		sendUserMessage() {},
	};
	flowExtension(pi as unknown as ExtensionAPI);
	const handler = events.get("session_before_compact")?.[0];
	assert.ok(handler, "extension should register a compaction handler");

	const startedAt = Date.now();
	const result = (await handler(
		{
			type: "session_before_compact",
			preparation: {
				messagesToSummarize: [],
				turnPrefixMessages: [],
				previousSummary: "previous Flow state",
				firstKeptEntryId: "kept-entry",
				tokensBefore: 120_000,
			},
			signal: new AbortController().signal,
			reason: "threshold",
			willRetry: false,
			branchEntries: [],
		},
		{
			model: {} as never,
			modelRegistry: {
				complete: async () => await new Promise<never>(() => {}),
			},
		} as never,
	)) as {
		compaction?: {
			summary: string;
			firstKeptEntryId: string;
			tokensBefore: number;
			details?: { flowCompactionFallback?: boolean; reason?: string };
		};
	};

	assert.ok(
		Date.now() - startedAt < 3_000,
		"deadline should bound the compaction wait",
	);
	assert.equal(result.compaction?.firstKeptEntryId, "kept-entry");
	assert.equal(result.compaction?.tokensBefore, 120_000);
	assert.equal(result.compaction?.details?.flowCompactionFallback, true);
	assert.equal(result.compaction?.details?.reason, "deadline_exceeded");
	assert.match(result.compaction?.summary ?? "", /Previous Summary/);
});
