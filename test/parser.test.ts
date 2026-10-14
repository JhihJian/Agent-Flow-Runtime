import { describe, expect, it } from "vitest";
import {
	FlowSyntaxError,
	parseFlow,
	renderCommandRequest,
	renderTemplate,
} from "../src/parser.ts";
import { validateVariableDeclarations } from "../src/variables.ts";

const table = "| 变量 | 含义 |\n| --- | --- |\n| 问题 | 需要处理的问题 |";
const serial = (
	options: {
		metadata?: string;
		first?: string;
		next?: string;
		result?: string;
	} = {},
) => `---
name: 变量流程
description: 校验串行作用域。
${options.metadata ?? "variables:\n  任务:\n    description: 工作目标\n    default: 检查"}
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> analyze[分析]
  analyze -->|已分析| next[处理]
  next -->|已完成| finish((结束))
\`\`\`

## 分析
\`\`\`新建Agent
${options.first ?? "任务：{var.任务}"}
\`\`\`
### 已分析
${options.result ?? table}

## 处理
\`\`\`复用Agent
${options.next ?? "问题：{input.问题}，任务：{var.任务}"}
\`\`\`
### 已完成
处理完毕。
`;

const parallel = (
	stdin = '{"test":{branch.test.状态},"lint":{branch.lint.状态}}',
	extra = "",
) =>
	`---
name: 并行变量
description: 汇合引用。
---
\`\`\`mermaid
flowchart TD
  start((开始)) --> plan[准备]
  plan -->|检查| fork{{并行}}
  fork --> test[测试]
  fork --> lint[静态检查]
  test -->|已执行| merge[汇合]
  lint -->|已执行| merge
  merge -->|已执行| finish((结束))
\`\`\`
## 准备
\`\`\`新建Agent
准备检查。
\`\`\`
### 检查
开始检查。
## 测试
\`\`\`执行自定义命令
{"command":"test"}
\`\`\`
### 已执行
| 变量 | 含义 |
| --- | --- |
| 状态 | 测试状态 |
| 摘要 | 测试摘要 |
## 静态检查
\`\`\`执行自定义命令
{"command":"lint"}
\`\`\`
### 已执行
| 变量 | 含义 |
| --- | --- |
| 状态 | 静态检查状态 |
## 汇合
\`\`\`执行自定义命令
{"command":"merge","stdin":${stdin}${extra}}
\`\`\`
### 已执行
汇合完成。
`;

const reference = (content: string) => `---
name: 子流程
description: 显式输入。
---
\`\`\`mermaid
flowchart TD
  start((开始)) --> child[调用]
  child --> finish((结束))
\`\`\`
## 调用
\`\`\`执行Flow
${content}
\`\`\`
`;

describe("变量声明和结果变量表", () => {
	it("保留声明、默认值和每个结果独立的下一跳变量", () => {
		const flow = parseFlow(serial(), "serial");
		expect(flow.variables).toEqual({
			任务: { description: "工作目标", default: "检查" },
		});
		expect(flow.nodes.get("analyze")?.resultVariables?.get("已分析")).toEqual({
			问题: { description: "需要处理的问题" },
		});
		expect(flow.nodes.get("next")?.resultVariables?.get("已完成")).toEqual({});
		expect(flow.nodes.get("analyze")?.successors.get("已分析")).toEqual({
			kind: "node",
			ref: "next",
		});
	});

	it.each([
		"null",
		"[]",
		"{任务: 检查}",
		"{任务: {default: 检查}}",
		"{任务: {description: ''}}",
		"{任务: {description: 123}}",
		"{'a.b': {description: 用途}}",
		"{constructor: {description: 用途}}",
		"{任务: {description: 用途, type: string}}",
		"{任务: {description: 用途, default: .inf}}",
		"{任务: &x {description: 用途, default: *x}}",
	])("拒绝非法全局声明 %s", (declarations) => {
		expect(() =>
			parseFlow(serial({ metadata: `variables: ${declarations}` }), "invalid"),
		).toThrow(FlowSyntaxError);
	});

	it.each(["null", "false", "0", "[]", "{strict: true, values: [1, null, x]}"])(
		"接受 JSON 默认值 %s",
		(value) => {
			expect(() =>
				parseFlow(
					serial({
						metadata: `variables: {配置: {description: 配置, default: ${value}}}`,
					}),
					"defaults",
				),
			).not.toThrow();
		},
	);

	it("默认值不能是 undefined，变量值不能包含循环", () => {
		expect(() =>
			validateVariableDeclarations({
				x: { description: "用途", default: undefined },
			}),
		).toThrow();
		const cycle: unknown[] = [];
		cycle.push(cycle);
		expect(() =>
			validateVariableDeclarations({
				x: { description: "用途", default: cycle },
			}),
		).toThrow(/循环/);
	});

	it("结果可以没有变量表，并且循环边可以再次进入同一节点", () => {
		const source = `${serial({ result: "分析完毕。" }).replace(
			"next -->|已完成| finish((结束))",
			"next -->|返工| analyze\n  next -->|已完成| finish((结束))",
		)}\n### 返工\n重新分析。\n`;
		expect(
			parseFlow(source, "loop").nodes.get("next")?.successors.get("返工"),
		).toEqual({ kind: "node", ref: "analyze" });
	});

	it.each([
		`${table}\n| 问题 | 重复 |`,
		table.replace("问题", "a.b"),
		table.replace("问题", "constructor"),
		table.replace("需要处理的问题", ""),
		table.replace("| --- | --- |", "| broken | --- |"),
		`${table}\n\n${table}`,
		`${table}\n| 新变量 | 含义 | 多余列 |`,
	])("拒绝非法结果变量表", (result) => {
		expect(() => parseFlow(serial({ result }), "invalid-table")).toThrow(
			FlowSyntaxError,
		);
	});

	it("同一节点的不同结果各自声明变量，保留独立作用域", () => {
		const source = serial()
			.replace(
				"analyze -->|已分析| next[处理]",
				"analyze -->|已分析| next[处理]\n  analyze -->|跳过| next",
			)
			.replace(
				"## 处理",
				"### 跳过\n| 变量 | 含义 |\n| --- | --- |\n| 原因 | 跳过原因 |\n\n## 处理",
			);
		const declarations = parseFlow(source, "results").nodes.get(
			"analyze",
		)?.resultVariables;
		expect(declarations?.get("已分析")).toEqual({
			问题: { description: "需要处理的问题" },
		});
		expect(declarations?.get("跳过")).toEqual({
			原因: { description: "跳过原因" },
		});
	});

	it("禁止下一跳变量与全局声明同名", () => {
		expect(() =>
			parseFlow(serial({ result: table.replace("问题", "任务") }), "shadow"),
		).toThrow(/同时声明/);
	});

	it("识别对齐表格、转义竖线，并忽略代码块中的示例表", () => {
		const result = `${table.replace("| --- | --- |", "| :--- | ---: |").replace("需要处理的问题", "甲\\|乙")}\n\n\`\`\`markdown\n${table}\n\`\`\``;
		expect(
			parseFlow(serial({ result }), "table")
				.nodes.get("analyze")
				?.resultVariables?.get("已分析"),
		).toEqual({ 问题: { description: "甲|乙" } });
	});
});

describe("模板作用域", () => {
	it.each([
		"{outcome}",
		"{test.outcome}",
		"{{var.任务}}",
		"\\{{var.任务}}",
		"{var.任务.path}",
		"{input.问题.path}",
		"{branch.test}",
		"{var.constructor}",
		"{var.任务",
		"{var.}",
	])("解析和渲染均拒绝旧协议或非法语法 %s", (next) => {
		expect(() => parseFlow(serial({ next }), "invalid-template")).toThrow(
			FlowSyntaxError,
		);
		expect(() => renderTemplate(next, {})).toThrow(FlowSyntaxError);
	});

	it("首节点只有全局作用域，普通节点不能引用分支", () => {
		expect(() =>
			parseFlow(serial({ first: "{input.问题}" }), "first-input"),
		).toThrow(/首节点/);
		expect(() =>
			parseFlow(serial({ next: "{branch.test.状态}" }), "outside-join"),
		).toThrow(/汇合/);
	});

	it("命令首节点读取全局变量，仍要求固定的已执行结果", () => {
		const source = serial({
			first: '{"command":"echo","stdin":"{var.任务}"}',
		}).replace("```新建Agent", "```执行自定义命令");
		expect(() => parseFlow(source, "command-result")).toThrow(/已执行/);
		expect(
			parseFlow(source.replaceAll("已分析", "已执行"), "command-start")
				.startNodeRef,
		).toBe("analyze");
		expect(() =>
			parseFlow(
				source
					.replaceAll("已分析", "已执行")
					.replace('"stdin":"{var.任务}"', '"stdin":"{input.任务}"'),
				"command-input",
			),
		).toThrow(/首节点/);
	});

	it("解析只校验引用语法，渲染检查本次实际可见值", () => {
		expect(() =>
			parseFlow(serial({ next: "{input.其他}" }), "runtime-scope"),
		).not.toThrow();
		expect(() =>
			renderTemplate("{input.其他}", { input: { 问题: "x" } }),
		).toThrow(/input.其他/);
		expect(() =>
			renderTemplate("{var.问题}", { input: { 问题: "x" } }),
		).toThrow(/var.问题/);
		expect(() =>
			renderTemplate("{input.问题}", { variables: { 问题: "x" } }),
		).toThrow(/input.问题/);
		expect(() => renderTemplate("{var.constructor}", {})).toThrow();
	});

	it("结构化值保留类型，嵌入文本的值进行 JSON 序列化且不再解释内容", () => {
		expect(
			renderTemplate(
				{
					data: "{input.问题}",
					count: "{var.数量}",
					text: "问题：{input.问题}",
					literal: "{var.原文}",
				},
				{
					input: { 问题: ["甲", "乙"] },
					variables: { 数量: 0, 原文: "{input.缺失}" },
				},
			),
		).toEqual({
			data: ["甲", "乙"],
			count: 0,
			text: '问题：["甲","乙"]',
			literal: "{input.缺失}",
		});
		expect(
			renderCommandRequest(
				{
					command: "{var.命令}",
					args: ["{input.数值}"],
					stdin: "{input.配置}",
				},
				{ 数值: 0, 配置: { strict: false } },
				new Map(),
				{ 命令: "echo" },
			),
		).toEqual({ command: "echo", args: ["0"], stdin: { strict: false } });
	});
});

describe("并行汇合命令", () => {
	it("按分支隔离同名变量，允许同一分支引用多个变量", () => {
		const flow = parseFlow(
			parallel(
				'{"test":{branch.test.状态},"summary":{branch.test.摘要},"lint":{branch.lint.状态}}',
			),
			"parallel",
		);
		expect(flow.parallels.get("fork")).toMatchObject({
			branches: ["test", "lint"],
			joinRef: "merge",
		});
		const action = flow.nodes.get("merge")?.action;
		if (action?.kind !== "执行自定义命令") throw new Error("expected command");
		expect(
			renderCommandRequest(
				action.request,
				undefined,
				new Map([
					["test", { 状态: true, 摘要: ["通过"] }],
					["lint", { 状态: false }],
				]),
			).stdin,
		).toEqual({ test: true, summary: ["通过"], lint: false });
		expect(() =>
			renderCommandRequest(action.request, undefined, new Map()),
		).toThrow(/branch.test/);
	});

	it.each([
		'{"test":{branch.test.状态}}',
		'{"test":{branch.test.状态},"other":{branch.other.状态}}',
		'{"test":"{branch.test.状态}","lint":{branch.lint.状态}}',
		'{"test":"前缀{branch.test.状态}","lint":{branch.lint.状态}}',
		'{"test":{test.outcome},"lint":{lint.outcome}}',
	])("拒绝未覆盖分支或非独立引用 %s", (stdin) => {
		expect(() => parseFlow(parallel(stdin), "invalid-join")).toThrow(
			FlowSyntaxError,
		);
	});

	it("拒绝 stdin 外的引用和把引用作为对象键", () => {
		expect(() =>
			parseFlow(
				parallel(undefined, ',"args":[{branch.test.状态}]'),
				"args-branch",
			),
		).toThrow(FlowSyntaxError);
		expect(() =>
			parseFlow(
				parallel('{"{branch.test.状态}":1,"lint":{branch.lint.状态}}'),
				"key-branch",
			),
		).toThrow(FlowSyntaxError);
		expect(() =>
			parseFlow(
				parallel().replace(
					'{"command":"test"}',
					'{"command":"test","stdin":{branch.test.状态}}',
				),
				"branch-self",
			),
		).toThrow(/汇合/);
	});

	it("允许 stdin 数组中的独立引用，缺少变量时不退回其他分支", () => {
		const flow = parseFlow(
			parallel("[{branch.test.状态},{branch.lint.状态}]"),
			"array-join",
		);
		const action = flow.nodes.get("merge")?.action;
		if (action?.kind !== "执行自定义命令") throw new Error("expected command");
		expect(() =>
			renderCommandRequest(
				action.request,
				undefined,
				new Map([
					["test", {}],
					["lint", { 状态: true }],
				]),
			),
		).toThrow(/branch.test.状态/);
	});
});

describe("显式子 Flow 输入", () => {
	it("使用 inputs，省略时不隐式附加父变量", () => {
		expect(
			parseFlow(
				reference('{"flow":"check","inputs":{"项目":"{var.项目}"}}'),
				"ref",
			).nodes.get("child")?.action,
		).toEqual({
			kind: "执行Flow",
			flow: "check",
			inputs: { 项目: "{var.项目}" },
		});
		expect(
			parseFlow(reference('{"flow":"check"}'), "ref-empty").nodes.get("child")
				?.action,
		).toEqual({ kind: "执行Flow", flow: "check" });
	});

	it.each([
		'{"flow":"check","variables":{}}',
		'{"flow":"check","task":"任务"}',
		'{"flow":"check","inputs":[]}',
		'{"flow":"check","inputs":{"a.b":1}}',
		'{"flow":"check","inputs":{"项目":"{input.项目}"}}',
	])("拒绝非法或首节点不可见的输入 %s", (content) => {
		expect(() => parseFlow(reference(content), "invalid-ref")).toThrow(
			FlowSyntaxError,
		);
	});
});
