import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	FlowSyntaxError,
	parseFlow,
	renderCommandRequest,
} from "../src/parser.ts";

const fixture = (name: string) =>
	readFile(join(import.meta.dirname, "fixtures", name, "FLOW.md"), "utf8");

describe("parseFlow", () => {
	it("parses ordinary results and destinations", async () => {
		const flow = parseFlow(await fixture("ordinary"), "ordinary");
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
		const flow = parseFlow(await fixture("gate-loop"), "gate-loop");
		expect(flow.nodes.get("review")?.successors.get("返工")).toEqual({
			kind: "node",
			ref: "review",
		});
	});

	it("recognizes parallel branches, join, and branch result references", async () => {
		const flow = parseFlow(
			await fixture("command-parallel"),
			"command-parallel",
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
		const source = (await fixture("ordinary"))
			.replace("```新建Agent", "```执行自定义命令")
			.replace(
				"分析任务：\n{outcome}",
				'{"command":"echo","args":["{outcome}"]}',
			)
			.replace("### 已分析", "### 其他结果");
		expect(() => parseFlow(source, "invalid")).toThrow(FlowSyntaxError);
	});

	it("首节点提示词允许缺少 {outcome}", async () => {
		const source = (await fixture("ordinary")).replace("{outcome}", "");
		expect(parseFlow(source, "no-outcome").startNodeRef).toBe("analyze");
	});

	it("首节点是命令动作时允许在命令请求中引用 {outcome}", async () => {
		const source = (await fixture("ordinary"))
			.replace("```新建Agent", "```执行自定义命令")
			.replace(
				"分析任务：\n{outcome}",
				'{"command":"node","args":["-e","1"],"stdin":{"task":"{outcome}"}}',
			)
			.replace("### 已分析", "### 已执行")
			.replace("|已分析|", "|已执行|");
		const flow = parseFlow(source, "command-first");
		expect(flow.startNodeRef).toBe("analyze");
	});

	it("首节点是 执行Flow 时省略 task 视为继承流程开始任务", () => {
		const flow = parseFlow(
			`---
name: 引用
description: 首节点引用子流程。
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> check[执行检查]
  check --> finish((结束))
\`\`\`

## 执行检查

\`\`\`执行Flow
{"flow": "check"}
\`\`\`
`,
			"ref-inherit",
		);
		expect(flow.startNodeRef).toBe("check");
	});

	it("首节点是 执行Flow 时允许 task 为固定值", () => {
		expect(() =>
			parseFlow(
				`---
name: 引用
description: 首节点引用子流程。
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> check[执行检查]
  check --> finish((结束))
\`\`\`

## 执行检查

\`\`\`执行Flow
{"flow": "check", "task": "固定任务"}
\`\`\`
`,
				"ref-fixed-task",
			),
		).not.toThrow();
	});
});
