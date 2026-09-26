import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadFlow } from "../src/flow-loader.ts";
import {
	FlowSyntaxError,
	parseFlow,
	renderFlowReferenceTask,
} from "../src/parser.ts";
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
	FlowObservationEvent,
	FlowObservationPublisherApi,
	FlowObservationSubscription,
	FlowPackage,
	FlowRunRecord,
	NodeRunRecord,
	NodeSession,
	OutcomeOption,
	UnifiedMessage,
} from "../src/types.ts";

const FENCE = "```";

function requireNodeRun(
	records: Awaited<ReturnType<InMemoryRunStore["listNodeRuns"]>>,
	nodeRef: string,
) {
	const record = records.find((candidate) => candidate.nodeRef === nodeRef);
	assert.ok(record, `缺少节点记录: ${nodeRef}`);
	return record;
}

class FakeAdapter implements AgentIntegrationAdapter {
	readonly created: string[] = [];
	readonly released: string[] = [];
	readonly takenOver: string[] = [];
	readonly executedOn: string[] = [];
	readonly prompts: string[] = [];
	readonly outcomes: Array<{ result: string; content: string }>;

	constructor(outcomes: Array<{ result: string; content: string }> = []) {
		this.outcomes = [...outcomes];
	}

	async createAgent(request: { runId: string }): Promise<AgentConnection> {
		this.created.push(request.runId);
		return {
			id: `${request.runId}:agent`,
			platformReference: `${request.runId}:agent`,
			sessionReference: `session-${request.runId}`,
		};
	}

	async takeOverAgent(request: {
		agentReference: string;
	}): Promise<AgentConnection> {
		this.takenOver.push(request.agentReference);
		return {
			id: request.agentReference,
			platformReference: request.agentReference,
			sessionReference: request.agentReference,
		};
	}

	async executeNode(request: {
		connection: AgentConnection;
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		const next = this.outcomes.shift();
		if (!next) throw new Error("Fake Agent 缺少预设结果");
		this.executedOn.push(request.connection.platformReference);
		this.prompts.push(request.prompt);
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			result: next.result,
			content: next.content,
			sessionReference: request.connection.sessionReference,
			interactionReference: request.nodeExecutionReference,
		});
		return {
			id: request.nodeExecutionReference,
			sessionReference: request.connection.sessionReference,
			interactionReference: request.nodeExecutionReference,
		};
	}

	async getNodeSession(): Promise<UnifiedMessage[]> {
		return [];
	}

	async releaseAgent(connection: AgentConnection): Promise<void> {
		this.released.push(connection.id);
	}
}

class FakeCommandExecutor implements CommandExecutor {
	readonly requests: CommandRequest[] = [];
	async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		return { status: "success", exitCode: 0, stdout: "ok", stderr: "" };
	}
}

class RecordingPublisher implements FlowObservationPublisherApi {
	readonly events: FlowObservationEvent[] = [];
	publish(event: FlowObservationEvent): void {
		this.events.push(event);
	}
	subscribe(): FlowObservationSubscription {
		return { unsubscribe: () => undefined };
	}
}

function packageOf(markdown: string, id: string): FlowPackage {
	return {
		flow: parseFlow(markdown, id),
		path: `/virtual/${id}/FLOW.md`,
		resources: { packageRoot: `/virtual/${id}`, resourcePaths: new Map() },
	};
}

const CHILD_HAPPY = `---
name: 发布检查
description: 子流程。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> probe[执行检查]
  probe -->|已完成| finish((结束))
${FENCE}

## 执行检查

${FENCE}新建Agent
检查：{outcome}
${FENCE}

### 已完成

检查完成。
`;

const CHILD_REUSE_FIRST = `---
name: 发布检查
description: 子流程。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> probe[执行检查]
  probe -->|已完成| finish((结束))
${FENCE}

## 执行检查

${FENCE}复用Agent
检查：{outcome}
${FENCE}

### 已完成

检查完成。
`;

const CHILD_FAIL_LATE = `---
name: 发布检查
description: 子流程。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> probe[执行检查]
  probe -->|已检查| verify[复核结果]
  verify -->|通过| finish((结束))
${FENCE}

## 执行检查

${FENCE}新建Agent
检查：{outcome}
${FENCE}

### 已检查

已得到初步检查结论。

## 复核结果

${FENCE}复用Agent
复核：{outcome}
${FENCE}

### 通过

复核通过。
`;

function parentNoEdge(taskBlock: string): string {
	return `---
name: 发布
description: 验证引用执行。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> prep[准备发布]
  prep -->|已准备| check[执行发布检查]
  check --> summary[汇总结果]
  summary -->|已执行| finish((结束))
${FENCE}

## 准备发布

${FENCE}新建Agent
准备：{outcome}
${FENCE}

### 已准备

已准备。

## 执行发布检查

${FENCE}执行Flow
${taskBlock}
${FENCE}

## 汇总结果

${FENCE}执行自定义命令
{"command": "merge", "stdin": {"task": "{outcome}"}}
${FENCE}

### 已执行

已汇总。
`;
}

const PARENT_DOUBLE_EDGE = `---
name: 发布
description: 验证双结果边。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> prep[准备发布]
  prep -->|已准备| check[执行发布检查]
  check -->|已完成| ok[成功处理]
  check -->|已失败| handle[失败处理]
  ok -->|已执行| finish((结束))
  handle -->|已执行| finish
${FENCE}

## 准备发布

${FENCE}新建Agent
准备：{outcome}
${FENCE}

### 已准备

已准备。

## 执行发布检查

${FENCE}执行Flow
{"flow": "release-check"}
${FENCE}

### 已完成

子 Flow 已走完自身路径。

### 已失败

子 Flow 未能走完自身路径。

## 成功处理

${FENCE}执行自定义命令
{"command": "ok", "stdin": {"task": "{outcome}"}}
${FENCE}

### 已执行

已处理成功路径。

## 失败处理

${FENCE}执行自定义命令
{"command": "handle", "stdin": {"task": "{outcome}"}}
${FENCE}

### 已执行

已处理失败路径。
`;

const PARENT_REUSE_AFTER_CHILD = `---
name: 发布
description: 验证父子 Agent 绑定隔离。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> prep[准备发布]
  prep -->|已准备| check[执行发布检查]
  check --> report[汇报结果]
  report -->|已完成| finish((结束))
${FENCE}

## 准备发布

${FENCE}新建Agent
准备：{outcome}
${FENCE}

### 已准备

已准备。

## 执行发布检查

${FENCE}执行Flow
{"flow": "release-check"}
${FENCE}

## 汇报结果

${FENCE}复用Agent
汇报：{outcome}
${FENCE}

### 已完成

已汇报。
`;

async function writePackage(
	root: string,
	id: string,
	markdown: string,
): Promise<string> {
	const directory = join(root, id);
	await mkdir(directory, { recursive: true });
	await writeFile(join(directory, "FLOW.md"), markdown, "utf8");
	return directory;
}

function coordinator(
	store: InMemoryRunStore,
	adapter: FakeAdapter,
	commands: FakeCommandExecutor,
	pkg: FlowPackage,
	references: ReadonlyMap<string, FlowPackage>,
): FlowCoordinator {
	return new FlowCoordinator(
		pkg.flow,
		store,
		new AgentRunModel(adapter),
		commands,
		undefined,
		undefined,
		pkg.resources,
		references,
	);
}

test("执行Flow 无结果边：子 Run 完成后注入最终结论并继续", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
		{ result: "已完成", content: "检查通过：可以发布" },
	]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(
		parentNoEdge(
			'{"flow": "release-check", "task": "为以下变更执行发布检查：{outcome}"}',
		),
		"release",
	);
	const child = packageOf(CHILD_HAPPY, "release-check");
	const registry = new Map([["release-check", child]]);

	const result = await coordinator(
		store,
		adapter,
		commands,
		parent,
		registry,
	).run("发布变更X");

	assert.equal(result.status, "completed");
	const records = await store.listNodeRuns(result.id);
	const check = requireNodeRun(records, "check");
	assert.ok(check.childRunId, "父 NodeRun 应记录 childRunId");
	assert.deepEqual(check.outcome, {
		result: "已完成",
		content: "检查通过：可以发布",
	});
	const childRun = await store.getRun(check.childRunId);
	assert.equal(childRun?.status, "completed");
	assert.equal(childRun.parentRunId, result.id);
	assert.equal(childRun.parentNodeRunId, check.id);
	assert.equal(childRun.task, '为以下变更执行发布检查："变更X已准备"');
	const summary = requireNodeRun(records, "summary");
	assert.equal(summary.input, "检查通过：可以发布");
	assert.deepEqual(adapter.created, [result.id, check.childRunId]);
});

test("执行Flow 无结果边：子 Run 失败使父 Run 失败且错误携带子 Run 标识", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
	]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(
		parentNoEdge('{"flow": "release-check"}'),
		"release",
	);
	const child = packageOf(CHILD_REUSE_FIRST, "release-check");
	const registry = new Map([["release-check", child]]);

	await assert.rejects(
		coordinator(store, adapter, commands, parent, registry).run("发布变更X"),
		/子 Flow 运行失败/,
	);
	const [parentRun] = (await store.listAllRuns()).filter(
		(run) => !run.parentRunId,
	);
	assert.equal(parentRun.status, "failed");
	assert.equal(parentRun.error?.category, "flow_reference");
	const failed = requireNodeRun(
		await store.listNodeRuns(parentRun.id),
		"check",
	);
	assert.ok(failed.childRunId);
	assert.ok(parentRun.error?.summary.includes(failed.childRunId));
	const childRun = await store.getRun(failed.childRunId);
	assert.equal(childRun?.status, "failed");
});

test("执行Flow 双结果边：成功走已完成，失败走已失败且结果内容形状正确", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
		{ result: "已检查", content: "检查结论：基本通过" },
		{ result: "不存在的门禁", content: "不应被接受" },
	]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(PARENT_DOUBLE_EDGE, "release");
	const child = packageOf(CHILD_FAIL_LATE, "release-check");
	const registry = new Map([["release-check", child]]);

	const result = await coordinator(
		store,
		adapter,
		commands,
		parent,
		registry,
	).run("发布变更X");
	assert.equal(result.status, "completed");
	const records = await store.listNodeRuns(result.id);
	const check = requireNodeRun(records, "check");
	assert.ok(check.childRunId);
	assert.equal(check.outcome?.result, "已失败");
	assert.deepEqual(check.outcome?.content, {
		status: "failure",
		runId: check.childRunId,
		flowId: "release-check",
		result: "检查结论：基本通过",
		error: {
			category: "outcome_validation",
			summary: "节点不允许结果: 不存在的门禁",
		},
	});
	const visited = records.map((record) => record.nodeRef);
	assert.ok(visited.includes("handle"));
	assert.ok(!visited.includes("ok"));
	assert.equal(commands.requests.at(-1)?.command, "handle");
});

test("执行Flow 双结果边：子 Run 成功注入最终结论并走已完成", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
		{ result: "已完成", content: "检查通过：可以发布" },
	]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(PARENT_DOUBLE_EDGE, "release");
	const child = packageOf(CHILD_HAPPY, "release-check");
	const registry = new Map([["release-check", child]]);

	const result = await coordinator(
		store,
		adapter,
		commands,
		parent,
		registry,
	).run("发布变更X");
	assert.equal(result.status, "completed");
	const records = await store.listNodeRuns(result.id);
	const check = requireNodeRun(records, "check");
	assert.deepEqual(check.outcome, {
		result: "已完成",
		content: "检查通过：可以发布",
	});
	assert.equal(commands.requests.at(-1)?.command, "ok");
});

test("子 Flow 新建Agent 不影响父绑定，父复用Agent 拿到原 Agent", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
		{ result: "已完成", content: "检查通过：可以发布" },
		{ result: "已完成", content: "已汇报" },
	]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(PARENT_REUSE_AFTER_CHILD, "release");
	const child = packageOf(CHILD_HAPPY, "release-check");
	const registry = new Map([["release-check", child]]);

	const result = await coordinator(
		store,
		adapter,
		commands,
		parent,
		registry,
	).run("发布变更X");
	assert.equal(result.status, "completed");
	assert.equal(adapter.takenOver.length, 0);
	assert.equal(adapter.created.length, 2);
	assert.deepEqual(adapter.executedOn, [
		`${result.id}:agent`,
		`${adapter.created[1]}:agent`,
		`${result.id}:agent`,
	]);
});

test("崩溃窗口：子 Run 已终态、父 NodeRun 中断，恢复幂等续接", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(
		parentNoEdge('{"flow": "release-check"}'),
		"release",
	);
	const child = packageOf(CHILD_HAPPY, "release-check");
	const registry = new Map([["release-check", child]]);

	await store.createRun({
		id: "parent-run",
		flowId: "release",
		flowVersion: "legacy:unknown",
		task: "发布变更X",
		status: "interrupted",
		phase: "executing_node",
		sequence: 5,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:00.000Z",
		currentNodeRef: "check",
		currentInput: "变更X已准备",
		currentNodeRunId: "nr-check",
	});
	await store.createNodeRun({
		id: "nr-prep",
		runId: "parent-run",
		sequence: 2,
		nodeRef: "prep",
		nodeName: "准备发布",
		actionKind: "新建Agent",
		input: "发布变更X",
		status: "completed",
		startedAt: "2026-01-01T00:00:01.000Z",
		completedAt: "2026-01-01T00:00:02.000Z",
		outcome: { result: "已准备", content: "变更X已准备" },
		enteredFrom: { kind: "start" },
	});
	await store.createNodeRun({
		id: "nr-check",
		runId: "parent-run",
		sequence: 3,
		nodeRef: "check",
		nodeName: "执行发布检查",
		actionKind: "执行Flow",
		input: "变更X已准备",
		status: "interrupted",
		startedAt: "2026-01-01T00:00:03.000Z",
		childRunId: "child-run",
		enteredFrom: {
			kind: "route",
			routeDecisionId: "d1",
			sourceNodeRunId: "nr-prep",
		},
	});
	await store.createRun({
		id: "child-run",
		flowId: "release-check",
		flowVersion: "legacy:unknown",
		task: "变更X已准备",
		status: "completed",
		phase: "completed",
		sequence: 3,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:04.000Z",
		completedAt: "2026-01-01T00:00:06.000Z",
		parentRunId: "parent-run",
		parentNodeRunId: "nr-check",
	});
	await store.createNodeRun({
		id: "nr-probe",
		runId: "child-run",
		sequence: 2,
		nodeRef: "probe",
		nodeName: "执行检查",
		actionKind: "新建Agent",
		input: "变更X已准备",
		status: "completed",
		startedAt: "2026-01-01T00:00:05.000Z",
		completedAt: "2026-01-01T00:00:06.000Z",
		outcome: { result: "已完成", content: "检查通过：可以发布" },
		enteredFrom: { kind: "start" },
	});

	const result = await coordinator(
		store,
		adapter,
		commands,
		parent,
		registry,
	).resume("parent-run");

	assert.equal(result.status, "completed");
	const records = await store.listNodeRuns("parent-run");
	const check = requireNodeRun(records, "check");
	assert.equal(check.id, "nr-check");
	assert.equal(check.status, "completed");
	assert.deepEqual(check.outcome, {
		result: "已完成",
		content: "检查通过：可以发布",
	});
	const summary = requireNodeRun(records, "summary");
	assert.equal(summary.status, "completed");
	assert.equal(summary.input, "检查通过：可以发布");
	assert.equal(adapter.created.length, 0);
	const recoveries = await store.listRunRecoveries("parent-run");
	assert.ok(
		recoveries.some((record) => record.strategy === "continue_routing"),
	);
});

test("崩溃窗口：子 Run 仍在运行，先递归恢复子 Run 再续接", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(
		parentNoEdge('{"flow": "release-check"}'),
		"release",
	);
	const child = packageOf(CHILD_HAPPY, "release-check");
	const registry = new Map([["release-check", child]]);

	await store.createRun({
		id: "parent-run",
		flowId: "release",
		flowVersion: "legacy:unknown",
		task: "发布变更X",
		status: "running",
		phase: "executing_node",
		sequence: 4,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:00.000Z",
		currentNodeRef: "check",
		currentInput: "变更X已准备",
		currentNodeRunId: "nr-check",
	});
	await store.createNodeRun({
		id: "nr-check",
		runId: "parent-run",
		sequence: 2,
		nodeRef: "check",
		nodeName: "执行发布检查",
		actionKind: "执行Flow",
		input: "变更X已准备",
		status: "running",
		startedAt: "2026-01-01T00:00:03.000Z",
		childRunId: "child-run",
		enteredFrom: { kind: "start" },
	});
	await store.createRun({
		id: "child-run",
		flowId: "release-check",
		flowVersion: "legacy:unknown",
		task: "变更X已准备",
		status: "running",
		phase: "executing_node",
		sequence: 2,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:04.000Z",
		sessionReference: "child-session",
		currentNodeRef: "probe",
		currentInput: "变更X已准备",
		currentNodeRunId: "nr-probe",
		parentRunId: "parent-run",
		parentNodeRunId: "nr-check",
	});
	await store.createNodeRun({
		id: "nr-probe",
		runId: "child-run",
		sequence: 2,
		nodeRef: "probe",
		nodeName: "执行检查",
		actionKind: "新建Agent",
		input: "变更X已准备",
		status: "running",
		startedAt: "2026-01-01T00:00:05.000Z",
		enteredFrom: { kind: "start" },
	});
	adapter.outcomes.push({ result: "已完成", content: "递归恢复的检查结论" });

	const result = await coordinator(
		store,
		adapter,
		commands,
		parent,
		registry,
	).resume("parent-run");

	assert.equal(result.status, "completed");
	const childRun = await store.getRun("child-run");
	assert.equal(childRun?.status, "completed");
	const records = await store.listNodeRuns("parent-run");
	const check = requireNodeRun(records, "check");
	assert.equal(check.id, "nr-check");
	assert.deepEqual(check.outcome, {
		result: "已完成",
		content: "递归恢复的检查结论",
	});
	assert.ok(adapter.takenOver.includes("child-session"));
	assert.ok(adapter.executedOn.includes("child-session"));
});

test("父节点中断时活跃子 Run 被同步标记为 interrupted 且提交序号有效", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(
		parentNoEdge('{"flow": "release-check"}'),
		"release",
	);
	const child = packageOf(CHILD_HAPPY, "release-check");
	const registry = new Map([["release-check", child]]);

	await store.createRun({
		id: "parent-run",
		flowId: "release",
		flowVersion: "legacy:unknown",
		task: "发布变更X",
		status: "running",
		phase: "executing_node",
		sequence: 3,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:00.000Z",
		currentNodeRef: "check",
		currentInput: "变更X已准备",
		currentNodeRunId: "nr-check",
	});
	await store.createNodeRun({
		id: "nr-check",
		runId: "parent-run",
		sequence: 2,
		nodeRef: "check",
		nodeName: "执行发布检查",
		actionKind: "执行Flow",
		input: "变更X已准备",
		status: "running",
		startedAt: "2026-01-01T00:00:03.000Z",
		childRunId: "child-run",
		enteredFrom: { kind: "start" },
	});
	await store.createRun({
		id: "child-run",
		flowId: "release-check",
		flowVersion: "legacy:unknown",
		task: "变更X已准备",
		status: "running",
		phase: "executing_node",
		sequence: 2,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:04.000Z",
		currentNodeRef: "probe",
		currentInput: "变更X已准备",
		currentNodeRunId: "nr-probe",
		parentRunId: "parent-run",
		parentNodeRunId: "nr-check",
	});
	await store.createNodeRun({
		id: "nr-probe",
		runId: "child-run",
		sequence: 2,
		nodeRef: "probe",
		nodeName: "执行检查",
		actionKind: "新建Agent",
		input: "变更X已准备",
		status: "running",
		startedAt: "2026-01-01T00:00:05.000Z",
		enteredFrom: { kind: "start" },
	});
	const publisher = new RecordingPublisher();
	const coordinator = new FlowCoordinator(
		parent.flow,
		store,
		new AgentRunModel(adapter),
		commands,
		publisher,
		undefined,
		parent.resources,
		registry,
	);
	const parentRun = await store.getRun("parent-run");
	const check = requireNodeRun(await store.listNodeRuns("parent-run"), "check");
	assert.ok(parentRun);

	const internal = coordinator as unknown as {
		interruptNode: (run: FlowRunRecord, record: NodeRunRecord) => Promise<void>;
	};
	await internal.interruptNode(parentRun, check);

	assert.equal((await store.getRun("parent-run"))?.status, "interrupted");
	const childAfter = await store.getRun("child-run");
	assert.equal(childAfter?.status, "interrupted");
	assert.equal(childAfter?.sequence, 3);
	const probe = requireNodeRun(await store.listNodeRuns("child-run"), "probe");
	assert.equal(probe.status, "interrupted");
	const childEvents = publisher.events.filter(
		(event) => event.runId === "child-run" && event.type === "run.interrupted",
	);
	assert.equal(childEvents.length, 1);
	assert.equal(childEvents[0]?.sequence, childAfter?.sequence);
});

test("直接恢复子 Run 被拒绝并提示父 Run 标识", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([]);
	const commands = new FakeCommandExecutor();
	const child = packageOf(CHILD_HAPPY, "release-check");
	await store.createRun({
		id: "child-run",
		flowId: "release-check",
		flowVersion: "legacy:unknown",
		task: "变更X已准备",
		status: "running",
		phase: "executing_node",
		sequence: 2,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:00.000Z",
		currentNodeRef: "probe",
		currentInput: "变更X已准备",
		parentRunId: "parent-run",
		parentNodeRunId: "nr-check",
	});
	await assert.rejects(
		coordinator(store, adapter, commands, child, new Map()).resume("child-run"),
		/子 Flow 运行不支持直接恢复，请恢复父运行: parent-run/,
	);
});

test("引用不在闭包中时在创建 Run 前按 flow_reference 失败", async () => {
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
	]);
	const commands = new FakeCommandExecutor();
	const parent = packageOf(
		parentNoEdge('{"flow": "release-check"}'),
		"release",
	);
	await assert.rejects(
		coordinator(store, adapter, commands, parent, new Map()).run("发布变更X"),
		/被引用的 Flow 未在闭包中加载/,
	);
	assert.deepEqual(await store.listAllRuns(), []);
});

test("加载闭包：兄弟包缺失、自引用、互引环在加载期被拒绝", async () => {
	const root = await mkdtemp(join(tmpdir(), "flow-ref-"));
	const referenceFlow = (flowId: string, description: string) =>
		`---
name: ${flowId}
description: ${description}
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> check[执行检查]
  check --> finish((结束))
${FENCE}

## 执行检查

${FENCE}执行Flow
{"flow": "${flowId}"}
${FENCE}
`;
	await writePackage(root, "self", referenceFlow("self", "引用自己。"));
	await assert.rejects(loadFlow(join(root, "self")), /Flow 引用成环/);

	await writePackage(
		root,
		"a",
		referenceFlow("b", "引用 B。").replace('"flow": "b"', '"flow": "b"'),
	);
	await writePackage(
		root,
		"b",
		`---
name: B
description: 引用 A。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> check[执行检查]
  check --> finish((结束))
${FENCE}

## 执行检查

${FENCE}执行Flow
{"flow": "a"}
${FENCE}
`,
	);
	await assert.rejects(loadFlow(join(root, "a")), /Flow 引用成环/);

	await writePackage(
		root,
		"missing",
		`---
name: 缺失引用
description: 引用不存在的兄弟包。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> check[执行检查]
  check --> finish((结束))
${FENCE}

## 执行检查

${FENCE}执行Flow
{"flow": "ghost"}
${FENCE}
`,
	);
	await assert.rejects(
		loadFlow(join(root, "missing")),
		/被引用的兄弟包无法加载/,
	);
});

test("加载闭包：传递闭包包含全部被引用 Flow 及其资源", async () => {
	const root = await mkdtemp(join(tmpdir(), "flow-ref-"));
	await writePackage(
		root,
		"release",
		parentNoEdge('{"flow": "release-check"}'),
	);
	await writePackage(root, "release-check", CHILD_HAPPY);
	const loaded = await loadFlow(join(root, "release"));
	assert.ok(loaded.references.has("release-check"));
	assert.equal(
		loaded.references.get("release-check")?.flow.id,
		"release-check",
	);
});

test("子 Flow 文件漂移后，父 Run 恢复被组合指纹拒绝", async () => {
	const root = await mkdtemp(join(tmpdir(), "flow-ref-"));
	const parentDir = await writePackage(
		root,
		"release",
		parentNoEdge('{"flow": "release-check", "task": "检查：{outcome}"}'),
	);
	const childDir = await writePackage(root, "release-check", CHILD_HAPPY);
	const store = new InMemoryRunStore();
	const adapter = new FakeAdapter([
		{ result: "已准备", content: "变更X已准备" },
		{ result: "已完成", content: "检查通过：可以发布" },
	]);
	const commands = new FakeCommandExecutor();
	const first = await loadFlow(parentDir);
	const result = await coordinator(
		store,
		adapter,
		commands,
		first,
		first.references,
	).run("发布变更X");
	assert.equal(result.status, "completed");

	await writeFile(
		join(childDir, "FLOW.md"),
		CHILD_HAPPY.replace("子流程。", "子流程，已修改。"),
		"utf8",
	);
	const second = await loadFlow(parentDir);
	assert.equal(
		second.references.get("release-check")?.flow.description,
		"子流程，已修改。",
	);
	await assert.rejects(
		coordinator(store, adapter, commands, second, second.references).resume(
			result.id,
		),
		/Flow 版本与运行记录不匹配/,
	);
});

test("解释器拒绝非法的执行Flow 写法", () => {
	const mustThrow = (markdown: string, pattern: RegExp) => {
		assert.throws(
			() => parseFlow(markdown, "release"),
			(error: unknown) => {
				assert.ok(error instanceof FlowSyntaxError);
				assert.ok(pattern.test(error.message), error.message);
				return true;
			},
		);
	};

	mustThrow(
		PARENT_DOUBLE_EDGE.replace("### 已失败\n\n子 Flow 未能走完自身路径。", ""),
		/缺少结果/,
	);
	mustThrow(
		PARENT_DOUBLE_EDGE.replace(
			"  check -->|已失败| handle[失败处理]",
			"  handle[失败处理]",
		),
		/两条结果边/,
	);
	mustThrow(
		parentNoEdge('{"flow": "release-check"}').replace(
			"## 汇总结果",
			"### 已完成\n\n不应出现的三级标题。\n\n## 汇总结果",
		),
		/无结果直连时不能声明三级结果标题/,
	);
	mustThrow(
		`---
name: 混用
description: 混用。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> check[执行检查]
  check --> next[汇总]
  check -->|已完成| other[其他]
  next -->|已执行| finish((结束))
  other -->|已执行| finish
${FENCE}

## 执行检查

${FENCE}执行Flow
{"flow": "release-check"}
${FENCE}

### 已完成

完成。

## 汇总

${FENCE}执行自定义命令
{"command": "merge"}
${FENCE}

### 已执行

汇总。

## 其他

${FENCE}执行自定义命令
{"command": "other"}
${FENCE}

### 已执行

其他。
`,
		/必须恰好一条且不与其他出边混用/,
	);
	mustThrow(parentNoEdge('{"flow": "1bad"}'), /flow 必须是字母开头/);
	mustThrow(
		parentNoEdge('{"flow": "release-check", "extra": 1}'),
		/不允许字段/,
	);
	mustThrow(
		`---
name: 并行分支
description: 引用节点作为并行分支。
---

${FENCE}mermaid
flowchart TD
  start((开始)) --> plan[发起检查]
  plan -->|开始| parallel{{并行}}
  parallel --> ref1[引用检查]
  parallel --> cmd[命令检查]
  ref1 --> merge[汇总]
  cmd -->|已执行| merge
  merge -->|已执行| finish((结束))
${FENCE}

## 发起检查

${FENCE}新建Agent
发起：{outcome}
${FENCE}

### 开始

开始。

## 引用检查

${FENCE}执行Flow
{"flow": "release-check"}
${FENCE}

## 命令检查

${FENCE}执行自定义命令
{"command": "check"}
${FENCE}

### 已执行

完成。

## 汇总

${FENCE}执行自定义命令
{"command": "merge"}
${FENCE}

### 已执行

汇总。
`,
		/并行分支 .* 必须是仅由并行开始点进入的命令节点/,
	);
});

test("解析无结果边执行Flow：固定挂在已完成名下且无三级结果", () => {
	const flow = parseFlow(parentNoEdge('{"flow": "release-check"}'), "release");
	const check = flow.nodes.get("check");
	assert.ok(check, "缺少 check 节点定义");
	assert.deepEqual([...check.successors.keys()], ["已完成"]);
	assert.deepEqual(check.successors.get("已完成"), {
		kind: "node",
		ref: "summary",
	});
	assert.equal(check.results.size, 0);
	const action = check.action;
	assert.equal(action.kind, "执行Flow");
	if (action.kind === "执行Flow") {
		assert.equal(action.flow, "release-check");
		assert.equal(action.task, undefined);
	}
});

test("renderFlowReferenceTask 按命令节点语义替换字符串中的 {outcome}", () => {
	assert.deepEqual(
		renderFlowReferenceTask(
			{ text: "检查：{outcome}", list: [{ nested: "{outcome}" }], keep: 1 },
			"变更X",
		),
		{
			text: '检查："变更X"',
			list: [{ nested: '"变更X"' }],
			keep: 1,
		},
	);
});
