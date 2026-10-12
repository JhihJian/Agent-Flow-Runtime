import assert from "node:assert/strict";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadFlow } from "../src/flow-loader.ts";
import {
	AgentRunModel,
	FlowCoordinator,
	InMemoryRunStore,
} from "../src/runtime.ts";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	CommandExecutor,
	CommandRequest,
	CommandResult,
	NodeSession,
	OutcomeOption,
	UnifiedMessage,
} from "../src/types.ts";

class PackageAdapter implements AgentIntegrationAdapter {
	prompt = "";

	async createAgent(): Promise<AgentConnection> {
		return { id: "agent", platformReference: "agent" };
	}

	async takeOverAgent(): Promise<AgentConnection> {
		throw new Error("unused");
	}

	async executeNode(request: {
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		this.prompt = request.prompt;
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			result: "继续",
			content: "开始检查",
		});
		return { id: request.nodeExecutionReference };
	}

	async getNodeSession(): Promise<UnifiedMessage[]> {
		return [];
	}

	async releaseAgent(): Promise<void> {}
}

class RecordingCommandExecutor implements CommandExecutor {
	readonly requests: CommandRequest[] = [];

	async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		return { status: "success", exitCode: 0, stdout: "ok", stderr: "" };
	}
}

test("目录包以父目录作为 Flow ID，并在业务 cwd 下运行包内脚本", async () => {
	const parent = await mkdtemp(join(tmpdir(), "flow-package-"));
	const root = join(parent, "漏洞报告生成v2.9");
	const references = join(root, "references");
	const scripts = join(root, "scripts");
	await mkdir(references, { recursive: true });
	await mkdir(scripts, { recursive: true });
	await writeFile(join(references, "检查清单.md"), "# 检查清单\n", "utf8");
	await writeFile(join(scripts, "check.mjs"), "process.exit(0);\n", "utf8");
	await writeFile(
		join(root, "FLOW.md"),
		`---
name: 包检查
description: 读取参考资料并运行检查脚本。
---









\`\`\`mermaid
flowchart TD
  start((开始)) --> read[阅读检查清单]
  read -->|继续| check[运行检查]
  check -->|已执行| finish((结束))
\`\`\`

## 阅读检查清单

\`\`\`新建Agent
请阅读[检查清单](references/检查清单.md)。
任务：{outcome}
\`\`\`

### 继续

已完成阅读。

## 运行检查

\`\`\`执行自定义命令
{
  "command": "node",
  "args": ["scripts/check.mjs"]
}
\`\`\`

### 已执行

已运行检查脚本。
`,
		"utf8",
	);

	const fromDirectory = await loadFlow(root);
	const fromEntry = await loadFlow(join(root, "FLOW.md"));
	assert.equal(fromDirectory.flow.id, "漏洞报告生成v2.9");
	assert.equal(fromEntry.flow.id, "漏洞报告生成v2.9");
	assert.equal(fromDirectory.path, join(root, "FLOW.md"));
	assert.equal(fromDirectory.resources?.packageRoot, root);
	assert.equal(
		fromDirectory.resources?.resourcePaths.get("references/检查清单.md"),
		join(references, "检查清单.md"),
	);

	const adapter = new PackageAdapter();
	const commands = new RecordingCommandExecutor();
	const businessCwd = join(parent, "业务项目");
	await mkdir(businessCwd);
	const run = await new FlowCoordinator(
		fromDirectory.flow,
		new InMemoryRunStore(),
		new AgentRunModel(adapter),
		commands,
		undefined,
		undefined,
		fromDirectory.resources,
	).run("[动态内容](references/unknown.txt)", { cwd: businessCwd });

	assert.equal(run.status, "completed");
	assert.match(adapter.prompt, new RegExp(join(references, "检查清单.md")));
	assert.match(adapter.prompt, /\[动态内容\]\(references\/unknown\.txt\)/);
	assert.deepEqual(commands.requests[0]?.args, [join(scripts, "check.mjs")]);
	assert.equal(commands.requests[0]?.cwd, businessCwd);
});

test("拒绝不是 FLOW.md 的单文件入口", async () => {
	const directory = await mkdtemp(join(tmpdir(), "single-flow-"));
	const path = join(directory, "ordinary.md");
	await writeFile(
		path,
		`---
name: 单文件
description: 用于验证单文件加载。
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> check[检查]
  check -->|已执行| finish((结束))
\`\`\`

## 检查

\`\`\`执行自定义命令
{"command":"node","args":["scripts/check.mjs"]}
\`\`\`

### 已执行

已执行。
`,
		"utf8",
	);

	await assert.rejects(() => loadFlow(path), /入口必须命名为 FLOW\.md/);
});

test("没有资源目录的 FLOW.md 仍是目录包", async () => {
	const root = await mkdtemp(join(tmpdir(), "empty-flow-package-"));
	const entry = join(root, "FLOW.md");
	await writeFile(
		entry,
		`---
name: 空包
description: 用于验证固定入口。
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> check[检查]
  check -->|已执行| finish((结束))
\`\`\`

## 检查

\`\`\`执行自定义命令
{"command":"node","args":["-e","process.exit(0)"]}
\`\`\`

### 已执行

已执行。
`,
		"utf8",
	);

	const fromDirectory = await loadFlow(root);
	const fromEntry = await loadFlow(entry);
	assert.equal(fromDirectory.flow.id, fromEntry.flow.id);
	assert.equal(fromDirectory.path, entry);
	assert.ok(fromDirectory.resources);
	assert.deepEqual([...fromDirectory.resources.resourcePaths], []);
});

test("目录包缺少入口或引用资源时拒绝加载", async () => {
	const directory = await mkdtemp(join(tmpdir(), "invalid-flow-package-"));
	await assert.rejects(() => loadFlow(directory), /缺少入口 FLOW\.md/);
	await writeFile(
		join(directory, "FLOW.md"),
		`---
name: 缺失资料
description: 用于验证缺失参考资料。
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> read[阅读]
  read -->|完成| finish((结束))
\`\`\`

## 阅读

\`\`\`新建Agent
请阅读[不存在的资料](references/missing.md)。
\`\`\`

### 完成

已完成。
`,
		"utf8",
	);
	await assert.rejects(() => loadFlow(directory), /Flow 包资源不存在/);

	const parent = await mkdtemp(join(tmpdir(), "flow-package-link-"));
	const root = join(parent, "package");
	const references = join(root, "references");
	await mkdir(references, { recursive: true });
	const external = join(parent, "external.md");
	await writeFile(external, "# 外部资料\n", "utf8");
	await symlink(external, join(references, "external.md"));
	await writeFile(
		join(root, "FLOW.md"),
		`---
name: 外部链接
description: 用于拒绝符号链接逃逸。
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> read[阅读]
  read -->|完成| finish((结束))
\`\`\`

## 阅读

\`\`\`新建Agent
请阅读[外部资料](references/external.md)。
\`\`\`

### 完成

已完成。
`,
		"utf8",
	);
	await assert.rejects(() => loadFlow(root), /不能位于包根之外/);
});
