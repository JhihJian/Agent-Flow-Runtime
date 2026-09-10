import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	FlowSyntaxError,
	parseFlow,
	renderCommandRequest,
} from "../src/parser.ts";

const fixture = (name: string) =>
	readFile(join(import.meta.dirname, "fixtures", name), "utf8");

describe("parseFlow", () => {
	it("parses ordinary results and destinations", async () => {
		const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
		expect(flow.startNodeRef).toBe("analyze");
		expect(flow.nodes.get("analyze")?.successors.get("已分析")).toEqual({
			kind: "node",
			ref: "finishNode",
		});
		expect(flow.nodes.get("finishNode")?.successors.get("已完成")).toEqual({
			kind: "finish",
		});
	});

	it("accepts a gate loop", async () => {
		const flow = parseFlow(await fixture("gate-loop.md"), "gate-loop.md");
		expect(flow.nodes.get("review")?.successors.get("返工")).toEqual({
			kind: "node",
			ref: "review",
		});
	});

	it("recognizes parallel branches, join, and branch result references", async () => {
		const flow = parseFlow(
			await fixture("command-parallel.md"),
			"command-parallel.md",
		);
		expect(flow.parallels.get("parallel")).toMatchObject({
			branches: ["test", "lint"],
			joinRef: "merge",
		});
		const merge = flow.nodes.get("merge");
		expect(merge).toBeDefined();
		if (!merge) throw new Error("expected merge node");
		const action = merge.action;
		expect(action.kind).toBe("执行自定义命令");
		if (action.kind !== "执行自定义命令")
			throw new Error("expected command action");
		const request = renderCommandRequest(
			action.request,
			"task",
			new Map([
				["test", { result: "已执行", content: { status: "success" } }],
				["lint", { result: "已执行", content: { status: "success" } }],
			]),
		);
		expect(request.stdin).toMatchObject({
			task: '"task"',
			test: { result: "已执行" },
			lint: { result: "已执行" },
		});
	});

	it("rejects a command node without the fixed result", async () => {
		const source = (await fixture("ordinary.md"))
			.replace("```新建Agent", "```执行自定义命令")
			.replace("分析任务：\n{outcome}", '{"command":"echo"}')
			.replace("### 已分析", "### 其他结果");
		expect(() => parseFlow(source, "invalid.md")).toThrow(FlowSyntaxError);
	});
});
