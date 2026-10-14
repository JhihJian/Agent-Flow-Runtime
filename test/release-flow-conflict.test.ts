import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadFlow } from "../src/flow-loader.ts";
import { FlowCoordinator, InMemoryRunStore } from "../src/runtime.ts";
import type {
	CommandExecutor,
	CommandRequest,
	CommandResult,
} from "../src/types.ts";

class ConflictCommands implements CommandExecutor {
	readonly requests: CommandRequest[] = [];
	private readonly values: { a: string; b: string };

	constructor(values: { a: string; b: string }) {
		this.values = values;
	}

	async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		const value =
			request.command === "conflict-a" ? this.values.a : this.values.b;
		return {
			status: "success",
			exitCode: 0,
			stdout: JSON.stringify({
				variables: { 冲突变量: value },
			}),
			stderr: "",
		};
	}
}

describe("release Flow parallel conflict", () => {
	it.each([
		{ name: "different values", values: { a: "A", b: "B" } },
		{ name: "same values", values: { a: "same", b: "same" } },
	])("fails deterministically for $name", async ({ values }) => {
		const loaded = await loadFlow(
			join(import.meta.dirname, "fixtures", "release-smoke", "conflict-flow"),
		);
		const commands = new ConflictCommands(values);
		const store = new InMemoryRunStore();
		const runId = `conflict-smoke-${values.a}-${values.b}`;
		await expect(
			new FlowCoordinator(
				loaded.flow,
				store,
				{ start: async () => undefined, end: async () => undefined } as never,
				commands,
				undefined,
				undefined,
				loaded.resources,
				loaded.references,
			).run({ variables: {} }, { runId }),
		).rejects.toThrow("冲突变量");
		const run = await store.getRun(runId);

		expect(run?.status).toBe("failed");
		expect(run?.error?.category).toBe("variable_conflict");
		expect(run?.error?.summary).toContain("冲突变量");
		expect(commands.requests.map((request) => request.command)).toEqual([
			"setup-conflict",
			"conflict-a",
			"conflict-b",
		]);
		expect(run?.variables).toHaveProperty("冲突变量", "尚未更新");
		const records = await store.listNodeRuns(runId);
		expect(records.filter((record) => record.nodeRef === "a")).toHaveLength(1);
		expect(records.filter((record) => record.nodeRef === "b")).toHaveLength(1);
		expect(
			records.find((record) => record.nodeRef === "a")?.outcome?.variables,
		).toEqual({
			冲突变量: values.a,
		});
		expect(
			records.find((record) => record.nodeRef === "b")?.outcome?.variables,
		).toEqual({
			冲突变量: values.b,
		});
		expect(
			records.find((record) => record.nodeRef === "setup")?.outcome?.variables,
		).toBeUndefined();
	});
});
