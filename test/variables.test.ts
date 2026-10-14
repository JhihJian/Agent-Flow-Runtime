import { describe, expect, it } from "vitest";
import {
	parseFlow,
	renderCommandRequest,
	renderTemplate,
} from "../src/parser.ts";
import {
	FlowCoordinator,
	InMemoryRunStore,
	ProcessCommandExecutor,
} from "../src/runtime.ts";
import type { CommandRequest, CommandResult } from "../src/types.ts";

class RecordingCommands extends ProcessCommandExecutor {
	readonly requests: CommandRequest[] = [];
	private index = 0;

	override async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		this.index += 1;
		return this.index === 1
			? {
					status: "success",
					exitCode: 0,
					stdout: JSON.stringify({
						variables: { 路径: "src/runtime.ts" },
					}),
					stderr: "",
				}
			: {
					status: "success",
					exitCode: 0,
					stdout: JSON.stringify({ variables: { 完成: true } }),
					stderr: "",
				};
	}
}

const flow = parseFlow(
	`---
name: 变量测试
description: 测试运行变量和节点消息。
variables:
  任务:
    description: 工作目标
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> capture[定位]
  capture -->|已执行| next[继续]
  next -->|已执行| finish((结束))
\`\`\`

## 定位

\`\`\`执行自定义命令
{"command":"capture","output":"variables","stdin":"{var.任务}"}
\`\`\`

### 已执行
已执行定位。

## 继续

\`\`\`执行自定义命令
{"command":"continue","output":"variables","stdin":{"message":"{input.路径}","path":"{var.任务}"}}
\`\`\`

### 已执行
已完成继续。
`,
	"variables-test",
);
const capture = flow.nodes.get("capture");
const next = flow.nodes.get("next");
if (!capture || !next) throw new Error("测试 Flow 缺少变量节点");
capture.resultVariables = new Map([
	["已执行", { 路径: { description: "文件路径" } }],
]);
next.resultVariables = new Map([
	["已执行", { 完成: { description: "是否完成" } }],
]);

describe("Flow variables", () => {
	it("拒绝未声明启动变量和非法启动值", async () => {
		const coordinator = new FlowCoordinator(flow, new InMemoryRunStore(), {
			start: async () => undefined,
			end: async () => undefined,
		} as never);
		await expect(
			coordinator.run({ variables: { 未声明: "x" } }),
		).rejects.toThrow("未声明全局变量");
		await expect(
			coordinator.run({ variables: { 任务: Number.NaN } }),
		).rejects.toThrow("JSON 值");
	});

	it("缺少必填变量时拒绝启动，默认值可以启动", async () => {
		const coordinator = new FlowCoordinator(flow, new InMemoryRunStore(), {
			start: async () => undefined,
			end: async () => undefined,
		} as never);
		await expect(coordinator.run({ variables: {} })).rejects.toThrow(
			"缺少必填全局变量",
		);
		const original = flow.variables;
		flow.variables = { 任务: { description: "工作目标", default: "检查" } };
		try {
			const run = await new FlowCoordinator(
				flow,
				new InMemoryRunStore(),
				{
					start: async () => undefined,
					end: async () => undefined,
				} as never,
				new RecordingCommands(),
			).run({ variables: {} });
			expect(run.variables).toEqual({ 任务: "检查" });
		} finally {
			flow.variables = original;
		}
	});

	it("renders variables in text and structured values", () => {
		expect(
			renderTemplate("任务：{var.任务}", { variables: { 任务: "检查" } }),
		).toBe("任务：检查");
		expect(
			renderCommandRequest(
				{ command: "x", stdin: "{var.config}" },
				undefined,
				new Map(),
				{ config: { strict: true } },
			).stdin,
		).toEqual({ strict: true });
	});

	it("initializes variables and persists node variable patches", async () => {
		const commands = new RecordingCommands();
		const run = await new FlowCoordinator(
			flow,
			new InMemoryRunStore(),
			{
				start: async () => undefined,
				end: async () => undefined,
			} as never,
			commands,
		).run({ variables: { 任务: "检查模板" } });
		expect(run.status).toBe("completed");
		expect(run.variables).toEqual({ 任务: "检查模板" });
		expect(commands.requests[0]?.stdin).toBe("检查模板");
		expect(commands.requests[1]?.stdin).toEqual({
			message: "src/runtime.ts",
			path: "检查模板",
		});
	});
});
