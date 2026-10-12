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
						content: "已定位",
						variables: { 路径: "src/runtime.ts" },
					}),
					stderr: "",
				}
			: { status: "success", exitCode: 0, stdout: "完成", stderr: "" };
	}
}

const flow = parseFlow(
	`---
name: 变量测试
description: 测试运行变量和节点消息。
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
{"command":"continue","stdin":{"message":"{outcome}","path":"{var.路径}"}}
\`\`\`

### 已执行
已完成继续。
`,
	"variables-test",
);

describe("Flow variables", () => {
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
		expect(run.variables).toMatchObject({
			任务: "检查模板",
			路径: "src/runtime.ts",
		});
		expect(commands.requests[0]?.stdin).toBe("检查模板");
		expect(commands.requests[1]?.stdin).toEqual({
			message: "已定位",
			path: "src/runtime.ts",
		});
	});
});
