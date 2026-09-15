import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
	FlowObservationPublisher,
	FlowRunInspector,
	FlowRuntime,
	toFlowEventEnvelope,
} from "../src/observability.ts";
import { parseFlow } from "../src/parser.ts";
import { PiAgentIntegrationAdapter } from "../src/pi.ts";
import {
	AgentRunModel,
	FlowCoordinator,
	InMemoryRunStore,
	JsonFileRunStore,
	ProcessCommandExecutor,
} from "../src/runtime.ts";
import type {
	AgentIntegrationAdapter,
	CommandExecutor,
	CommandRequest,
	CommandResult,
	FlowObservationEvent,
} from "../src/types.ts";

const fixture = (name: string) =>
	readFile(join(import.meta.dirname, "fixtures", name), "utf8");

/** 最小 Agent 适配器，按预设顺序提交节点结果。 */
class SequencedAdapter implements AgentIntegrationAdapter {
	private readonly outcomes: Array<{ result: string; content: string }>;

	constructor(outcomes: Array<{ result: string; content: string }>) {
		this.outcomes = outcomes;
	}

	async createAgent(request: { runId: string }) {
		return { id: `${request.runId}:agent`, platformReference: request.runId };
	}

	async takeOverAgent(request: { agentReference: string }) {
		return {
			id: request.agentReference,
			platformReference: request.agentReference,
		};
	}

	async executeNode(request: {
		nodeExecutionReference: string;
		outcomes: ReadonlyArray<{ name: string }>;
		submitOutcome: (submission: {
			nodeExecutionReference: string;
			result: string;
			content: string;
		}) => Promise<void>;
	}) {
		const next = this.outcomes.shift();
		if (!next) throw new Error("Fake Agent 缺少预设结果");
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			result: next.result,
			content: next.content,
		});
		return { id: request.nodeExecutionReference };
	}

	async getNodeSession() {
		return [];
	}

	async releaseAgent() {}
}

/** 记录请求的命令执行器，用于断言运行时传入的执行上下文。 */
class RecordingCommandExecutor implements CommandExecutor {
	readonly requests: CommandRequest[] = [];

	async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		return { status: "success", exitCode: 0, stdout: "", stderr: "" };
	}
}

interface FakePending {
	nodeExecutionReference: string;
	submitOutcome: (submission: {
		nodeExecutionReference: string;
		result: string;
		content: string;
	}) => Promise<void>;
	outcomes: Array<{ name: string; description: string }>;
	submitted: boolean;
}

interface AdapterInternals {
	handles: Map<string, { connection: unknown; pending?: FakePending }>;
	sessionHandles: Map<string, { connection: unknown; pending?: FakePending }>;
	flowOutcomeTool(): {
		execute(
			toolCallId: string,
			params: { outcome: string; content: string },
			signal?: undefined,
			onUpdate?: undefined,
			ctx?: { sessionManager: { getSessionFile(): string | undefined } },
		): Promise<unknown>;
	};
	submitSdkOutcome(
		outcome: string,
		content: string,
		sessionFile?: string,
	): Promise<void>;
}

function makePending(nodeExecutionReference: string) {
	const submittedTo: Array<{ nodeExecutionReference: string; result: string }> =
		[];
	const pending: FakePending = {
		nodeExecutionReference,
		submitOutcome: async (submission) => {
			submittedTo.push({
				nodeExecutionReference: submission.nodeExecutionReference,
				result: submission.result,
			});
		},
		outcomes: [{ name: "完成", description: "节点完成" }],
		submitted: false,
	};
	return { pending, submittedTo };
}

function makeHandle(sessionFile: string, pending: FakePending) {
	return {
		connection: { id: `${sessionFile}:agent`, sessionReference: sessionFile },
		pending,
	};
}

test("ProcessCommandExecutor 在请求指定的 cwd 下执行命令", async () => {
	const dir = await mkdtemp(join(tmpdir(), "flow-cwd-"));
	const result = await new ProcessCommandExecutor().execute({
		command: "pwd",
		cwd: dir,
	});
	assert.equal(result.status, "success");
	assert.equal(result.stdout.trim(), dir);
});

test("FlowCoordinator 将运行 cwd 传递给命令节点请求", async () => {
	const adapter = new SequencedAdapter([
		{ result: "执行检查", content: "check task" },
		{ result: "通过", content: "approved" },
	]);
	const commands = new RecordingCommandExecutor();
	const flow = parseFlow(
		await fixture("command-parallel.md"),
		"command-parallel.md",
	);
	const result = await new FlowCoordinator(
		flow,
		new InMemoryRunStore(),
		new AgentRunModel(adapter),
		commands,
	).run("task", { cwd: "/flow-workspace" });
	assert.equal(result.status, "completed");
	assert.ok(commands.requests.length > 0, "应当执行了命令节点");
	for (const request of commands.requests) {
		assert.equal(request.cwd, "/flow-workspace");
	}
});

test("并发 Flow 会话的 submit_flow_outcome 路由到正确会话", async () => {
	const adapter = new PiAgentIntegrationAdapter();
	const internal = adapter as unknown as AdapterInternals;
	const a = makePending("node-run-a");
	const b = makePending("node-run-b");
	const handleA = makeHandle("/sessions/run-a.jsonl", a.pending);
	const handleB = makeHandle("/sessions/run-b.jsonl", b.pending);
	internal.handles.set("run-a:agent", handleA);
	internal.handles.set("run-b:agent", handleB);
	internal.sessionHandles.set("/sessions/run-a.jsonl", handleA);
	internal.sessionHandles.set("/sessions/run-b.jsonl", handleB);

	const tool = internal.flowOutcomeTool();
	await tool.execute(
		"call-1",
		{ outcome: "完成", content: "B 会话的结果" },
		undefined,
		undefined,
		{
			sessionManager: { getSessionFile: () => "/sessions/run-b.jsonl" },
		},
	);

	assert.equal(b.submittedTo.length, 1, "结果应提交到 B 会话的节点");
	assert.deepEqual(b.submittedTo[0], {
		nodeExecutionReference: "node-run-b",
		result: "完成",
	});
	assert.equal(a.submittedTo.length, 0, "A 会话不应收到 B 的结果");
});

test("会话没有等待节点时按会话路由报错而不是提交到其他会话", async () => {
	const adapter = new PiAgentIntegrationAdapter();
	const internal = adapter as unknown as AdapterInternals;
	const a = makePending("node-run-a");
	const handleA = makeHandle("/sessions/run-a.jsonl", a.pending);
	internal.handles.set("run-a:agent", handleA);
	internal.sessionHandles.set("/sessions/run-a.jsonl", handleA);

	await assert.rejects(
		internal.submitSdkOutcome(
			"完成",
			"闲置会话的结果",
			"/sessions/run-b.jsonl",
		),
		/当前会话没有等待结果的 Flow 节点/,
	);
	assert.equal(a.submittedTo.length, 0);
});

test("单会话无会话上下文时仍按唯一等待节点提交", async () => {
	const adapter = new PiAgentIntegrationAdapter();
	const internal = adapter as unknown as AdapterInternals;
	const a = makePending("node-run-a");
	const handleA = makeHandle("/sessions/run-a.jsonl", a.pending);
	internal.handles.set("run-a:agent", handleA);
	internal.sessionHandles.set("/sessions/run-a.jsonl", handleA);

	await internal.submitSdkOutcome("完成", "唯一节点的结果");
	assert.equal(a.submittedTo.length, 1);
});

test("多会话并发且缺少会话上下文时拒绝猜测归属", async () => {
	const adapter = new PiAgentIntegrationAdapter();
	const internal = adapter as unknown as AdapterInternals;
	const a = makePending("node-run-a");
	const b = makePending("node-run-b");
	const handleA = makeHandle("/sessions/run-a.jsonl", a.pending);
	const handleB = makeHandle("/sessions/run-b.jsonl", b.pending);
	internal.handles.set("run-a:agent", handleA);
	internal.handles.set("run-b:agent", handleB);

	await assert.rejects(
		internal.submitSdkOutcome("完成", "无法归属的结果"),
		/无法确定结果归属会话/,
	);
	assert.equal(a.submittedTo.length, 0);
	assert.equal(b.submittedTo.length, 0);
});

test("运行事实保存 Flow 指纹、节点顺序和每次路由决定", async () => {
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "已分析", content: "analysis" },
				{ result: "已完成", content: "done" },
			]),
		),
	).run("task");

	const records = await store.listNodeRuns(run.id);
	const routes = await store.listRouteDecisions(run.id);
	assert.equal(run.historyCompleteness, "complete");
	assert.match(run.flowVersion, /^sha256:/);
	assert.deepEqual(
		records.map((record) => [record.sequence, record.nodeRef, record.status]),
		[
			[2, "analyze", "completed"],
			[5, "finishNode", "completed"],
		],
	);
	assert.deepEqual(
		routes.map((route) => [
			route.sourceNodeRunId,
			route.result,
			route.destination.kind,
		]),
		[
			[records[0]?.id, "已分析", "node"],
			[records[1]?.id, "已完成", "finish"],
		],
	);
	assert.equal(run.sequence, 8);
});

test("命令非零退出仍是已完成业务结果并继续路由", async () => {
	const flow = parseFlow(
		await fixture("command-parallel.md"),
		"command-parallel.md",
	);
	const commands: CommandExecutor = {
		async execute(request) {
			return {
				status: "failure",
				exitCode: 2,
				stdout: request.command,
				stderr: "business failure",
			};
		},
	};
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "执行检查", content: "check" },
				{ result: "通过", content: "approved" },
			]),
		),
		commands,
	).run("task");

	assert.equal(run.status, "completed");
	const records = await store.listNodeRuns(run.id);
	const commandResults = records
		.filter((record) => record.actionKind === "执行自定义命令")
		.map((record) => record.outcome?.content);
	assert.equal(commandResults.length, 3);
	assert.ok(
		commandResults.every(
			(result) =>
				typeof result === "object" &&
				result !== null &&
				(result as { status: string }).status === "failure",
		),
	);
	const [round] = await store.listParallelRounds(run.id);
	assert.equal(round?.status, "completed");
	assert.deepEqual(Object.keys(round?.branchNodeRunIds ?? {}).sort(), [
		"lint",
		"test",
	]);
	assert.equal(
		round?.joinNodeRunId,
		records.find((record) => record.nodeRef === "merge")?.id,
	);
	assert.ok((round?.sequence ?? 0) > 0);
});

test("Agent 执行异常同时终结 NodeRun 和 Run", async () => {
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const store = new InMemoryRunStore();
	const adapter: AgentIntegrationAdapter = {
		async createAgent() {
			return { id: "agent", platformReference: "agent" };
		},
		async takeOverAgent() {
			throw new Error("unused");
		},
		async executeNode() {
			throw new Error("agent crashed");
		},
		async getNodeSession() {
			return [];
		},
		async releaseAgent() {},
	};

	await assert.rejects(
		() =>
			new FlowCoordinator(flow, store, new AgentRunModel(adapter)).run("task"),
		/agent crashed/,
	);
	const [record] = await store.listNodeRuns(
		(await store.listRuns(flow.id))[0]?.id ?? "",
	);
	assert.equal(record?.status, "failed");
	assert.equal(record?.error?.category, "agent_execution");
	assert.equal((await store.listRuns(flow.id))[0]?.status, "failed");
});

test("恢复会终结旧 Agent NodeRun 并创建带 retryOf 的新访问", async () => {
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const store = new InMemoryRunStore();
	await store.createRun({
		id: "recoverable-run",
		flowId: flow.id,
		flowVersion: "legacy:unknown",
		task: "task",
		status: "running",
		phase: "executing_node",
		sequence: 1,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:00.000Z",
		sessionReference: "saved-session",
		currentNodeRef: "analyze",
		currentInput: "task",
	});
	await store.createNodeRun({
		id: "old-agent-node",
		runId: "recoverable-run",
		sequence: 2,
		nodeRef: "analyze",
		actionKind: "新建Agent",
		input: "task",
		status: "running",
		startedAt: "2026-01-01T00:01:00.000Z",
		enteredFrom: { kind: "start" },
	});

	const result = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "已分析", content: "analysis" },
				{ result: "已完成", content: "done" },
			]),
		),
	).resume("recoverable-run");
	const records = await store.listNodeRuns(result.id);
	assert.equal(
		records.find((record) => record.id === "old-agent-node")?.status,
		"interrupted",
	);
	const retry = records.find((record) => record.retryOf === "old-agent-node");
	assert.equal(retry?.status, "completed");
	assert.equal(result.status, "completed");
});

test("JSON Store 持久化全部事实并将旧快照标记为 legacy", async () => {
	const directory = await mkdtemp(join(tmpdir(), "flow-facts-"));
	const file = join(directory, "runs.json");
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const store = new JsonFileRunStore(file);
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "已分析", content: "analysis" },
				{ result: "已完成", content: "done" },
			]),
		),
	).run("task");
	const saved = JSON.parse(await readFile(file, "utf8")) as {
		runs: unknown[];
		nodeRuns: unknown[];
		routeDecisions: unknown[];
		parallelRounds: unknown[];
	};
	assert.equal(saved.runs.length, 1);
	assert.equal(saved.nodeRuns.length, 2);
	assert.equal(saved.routeDecisions.length, 2);
	assert.equal(saved.parallelRounds.length, 0);
	assert.equal(
		(await new JsonFileRunStore(file).getRun(run.id))?.sequence,
		run.sequence,
	);

	const legacyFile = join(directory, "legacy.json");
	await writeFile(
		legacyFile,
		JSON.stringify({
			runs: [
				{
					id: "legacy",
					flowId: flow.id,
					task: "task",
					status: "completed",
					startedAt: "2026-01-01T00:00:00.000Z",
				},
			],
			nodeRuns: [],
		}),
		"utf8",
	);
	assert.equal(
		(await new JsonFileRunStore(legacyFile).getRun("legacy"))
			?.historyCompleteness,
		"legacy",
	);
});

test("Inspector 用同一份投影还原普通路径、路由和并行轮次", async () => {
	const flow = parseFlow(
		await fixture("command-parallel.md"),
		"command-parallel.md",
	);
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "执行检查", content: "check" },
				{ result: "通过", content: "approved" },
			]),
		),
		new RecordingCommandExecutor(),
	).run("task");

	const history = await new FlowRunInspector(store).inspectRun(run.id);
	assert.ok(history);
	assert.equal(history.run.id, run.id);
	assert.equal(history.run.flowId, flow.id);
	assert.equal(history.run.task, "task");
	assert.deepEqual(
		history.nodeRuns.map((record) => record.nodeRef),
		["plan", "test", "lint", "merge", "judge"],
	);
	assert.ok(
		history.nodeRuns.every(
			(record, index, records) =>
				index === 0 || record.sequence > records[index - 1].sequence,
		),
	);
	assert.equal(history.routeDecisions.length, 5);
	assert.equal(history.parallelRounds.length, 1);
	assert.equal(
		history.parallelRounds[0]?.joinNodeRunId,
		history.nodeRuns[3]?.id,
	);
	assert.equal("outcome" in history.nodeRuns[1], false);
	assert.deepEqual(history.current, { kind: "none" });
	assert.equal(
		await new FlowRunInspector(store).inspectRun("missing-run"),
		undefined,
	);
});

test("Inspector 按 Run 校验 NodeRun，并按权限读取 Agent 证据", async () => {
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "已分析", content: "analysis" },
				{ result: "已完成", content: "done" },
			]),
		),
	).run("task");
	const [node] = await store.listNodeRuns(run.id);
	if (!node) throw new Error("expected an Agent NodeRun");
	node.session = {
		id: "session-1",
		sessionReference: "pi-session",
		interactionReference: "interaction-1",
	};
	await store.updateNodeRun(node);
	const messages = [
		{ id: "message-1", role: "assistant" as const, content: "evidence" },
	];
	const inspector = new FlowRunInspector(store, {
		evidenceReader: {
			async getNodeSession() {
				return messages;
			},
		},
		authorizeEvidence: ({ nodeRun }) => nodeRun.id === node.id,
	});
	const evidence = await inspector.inspectNodeEvidence(run.id, node.id);
	assert.deepEqual(evidence?.messages, messages);
	assert.equal(evidence?.session?.interactionReference, "interaction-1");
	assert.equal(
		await inspector.inspectNodeEvidence(run.id, "not-in-this-run"),
		undefined,
	);

	const denied = new FlowRunInspector(store, {
		authorizeEvidence: () => false,
	});
	assert.equal(await denied.inspectNodeEvidence(run.id, node.id), undefined);
});

test("Coordinator 在事实保存成功后发布普通路径事件", async () => {
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const events: FlowObservationEvent[] = [];
	const publisher = new FlowObservationPublisher();
	const subscription = publisher.subscribe("event-run", (event) => {
		events.push(event);
	});
	const run = await new FlowCoordinator(
		flow,
		new InMemoryRunStore(),
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "已分析", content: "analysis" },
				{ result: "已完成", content: "done" },
			]),
		),
		new RecordingCommandExecutor(),
		publisher,
	).run("task", { runId: "event-run" });

	assert.equal(run.status, "completed");
	assert.deepEqual(
		events.map((event) => event.type),
		[
			"run.started",
			"node.started",
			"node.completed",
			"route.selected",
			"node.started",
			"node.completed",
			"route.selected",
			"run.completed",
		],
	);
	assert.ok(
		events.every(
			(event, index) =>
				event.runId === run.id &&
				event.flowId === flow.id &&
				(index === 0 || event.sequence >= events[index - 1].sequence),
		),
	);
	assert.ok(events.every((event) => event.summary.length > 0));
	subscription.unsubscribe();
	publisher.publish(events[0]);
	assert.equal(events.length, 8);
});

test("并行事件带有独立轮次引用，订阅者异常不影响 Run", async () => {
	const flow = parseFlow(
		await fixture("command-parallel.md"),
		"command-parallel.md",
	);
	const errors: unknown[] = [];
	const events: FlowObservationEvent[] = [];
	const publisher = new FlowObservationPublisher({
		onError: (error) => errors.push(error),
	});
	publisher.subscribe("parallel-events", () => {
		throw new Error("render failed");
	});
	publisher.subscribe("parallel-events", (event) => events.push(event));
	const run = await new FlowCoordinator(
		flow,
		new InMemoryRunStore(),
		new AgentRunModel(
			new SequencedAdapter([
				{ result: "执行检查", content: "check" },
				{ result: "通过", content: "approved" },
			]),
		),
		new RecordingCommandExecutor(),
		publisher,
	).run("task", { runId: "parallel-events" });

	assert.equal(run.status, "completed");
	assert.ok(events.some((event) => event.type === "parallel.started"));
	assert.ok(events.some((event) => event.type === "parallel.completed"));
	assert.ok(
		events
			.filter((event) => event.type.startsWith("parallel."))
			.every((event) => event.parallelRoundId),
	);
	assert.ok(errors.length > 0);
});

test("RunStore 保存失败时不会发布未保存的节点成功事件", async () => {
	class FailingStore extends InMemoryRunStore {
		private failNextCommit = true;

		override async commit(fact: Parameters<InMemoryRunStore["commit"]>[0]) {
			if (this.failNextCommit) {
				this.failNextCommit = false;
				throw new Error("store unavailable");
			}
			return super.commit(fact);
		}
	}
	const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
	const publisher = new FlowObservationPublisher();
	const events: FlowObservationEvent[] = [];
	publisher.subscribe("failed-save", (event) => events.push(event));
	const store = new FailingStore();
	await assert.rejects(
		() =>
			new FlowCoordinator(
				flow,
				store,
				new AgentRunModel(
					new SequencedAdapter([{ result: "已完成", content: "done" }]),
				),
				new RecordingCommandExecutor(),
				publisher,
			).run("task", { runId: "failed-save" }),
		/store unavailable/,
	);
	assert.deepEqual(
		events.map((event) => event.type),
		["run.started", "run.failed"],
	);
});

test("统一 Runtime 门面先建立订阅再应用快照，不丢失水位之后的事件", async () => {
	const publisher = new FlowObservationPublisher();
	const snapshot = {
		run: {
			id: "race-run",
			flowId: "flow",
			flowVersion: "sha256:test",
			task: "task",
			status: "running" as const,
			phase: "executing_node" as const,
			sequence: 1,
			historyCompleteness: "complete" as const,
			startedAt: "2026-01-01T00:00:00.000Z",
		},
		nodeRuns: [],
		routeDecisions: [],
		parallelRounds: [],
		recoveries: [],
		current: { kind: "none" as const },
		evidence: {},
	};
	const inspector = {
		async listRecentRuns() {
			return [];
		},
		async inspectRun() {
			publisher.publish({
				type: "node.started",
				runId: "race-run",
				flowId: "flow",
				sequence: 2,
				occurredAt: "2026-01-01T00:00:01.000Z",
				status: "running",
				phase: "executing_node",
				nodeRunId: "node-2",
				nodeRef: "verify",
				summary: "node started",
			});
			return snapshot;
		},
		async inspectNodeEvidence() {
			return undefined;
		},
	};
	const runtime = new FlowRuntime(inspector, publisher);
	const events: FlowObservationEvent[] = [];
	const observation = await runtime.openRunObservation("race-run", (event) =>
		events.push(event),
	);
	assert.ok(observation);
	assert.deepEqual(
		events.map((event) => event.sequence),
		[2],
	);
	assert.deepEqual(toFlowEventEnvelope(events[0]), {
		type: "flow_event",
		event: events[0],
	});
	observation.subscription.unsubscribe();
});

test("Inspector 返回按开始时间倒序排列的近期运行摘要", async () => {
	const store = new InMemoryRunStore();
	const base = {
		flowId: "flow",
		flowVersion: "sha256:test",
		task: "task",
		status: "completed" as const,
		phase: "completed" as const,
		sequence: 1,
		historyCompleteness: "complete" as const,
	};
	await store.createRun({
		...base,
		id: "older",
		startedAt: "2026-01-01T00:00:00.000Z",
	});
	await store.createRun({
		...base,
		id: "newer",
		startedAt: "2026-01-02T00:00:00.000Z",
	});
	const runtime = new FlowRuntime(
		new FlowRunInspector(store),
		new FlowObservationPublisher(),
	);
	assert.deepEqual(
		(await runtime.listRecentRuns(1)).map((run) => run.id),
		["newer"],
	);
});
