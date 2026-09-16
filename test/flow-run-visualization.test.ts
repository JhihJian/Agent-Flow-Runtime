import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
	buildFlowTimeline,
	FlowRunVisualizationController,
	type FlowRunVisualizationRuntime,
	filterFlowRuns,
} from "../src/flow-run-visualization.ts";
import { FlowRunInspector } from "../src/observability.ts";
import { InMemoryRunStore, JsonFileRunStore } from "../src/runtime.ts";
import type {
	FlowNodeEvidence,
	FlowObservationEvent,
	FlowObservationSubscription,
	FlowRunHistory,
	FlowRunSummary,
} from "../src/types.ts";

const runId = "run-1";

function createHistory(
	overrides: Partial<FlowRunHistory["run"]> = {},
): FlowRunHistory {
	const historyRunId = overrides.id ?? runId;
	const run = {
		id: historyRunId,
		flowId: "code-change",
		flowVersion: "sha256:flow",
		task: "fix timeout",
		status: "completed" as const,
		phase: "completed" as const,
		sequence: 9,
		historyCompleteness: "complete" as const,
		startedAt: "2026-01-01T00:00:00.000Z",
		completedAt: "2026-01-01T00:02:00.000Z",
		...overrides,
	};
	return {
		run,
		nodeRuns: [
			{
				id: "analyze-1",
				runId: historyRunId,
				sequence: 2,
				nodeRef: "analyze",
				nodeName: "分析",
				actionKind: "新建Agent",
				input: "fix timeout",
				status: "interrupted",
				startedAt: "2026-01-01T00:00:01.000Z",
				retryOf: undefined,
				enteredFrom: { kind: "start" },
			},
			{
				id: "analyze-2",
				runId: historyRunId,
				sequence: 5,
				nodeRef: "analyze",
				nodeName: "分析",
				actionKind: "复用Agent",
				input: "fix timeout",
				status: "completed",
				startedAt: "2026-01-01T00:00:10.000Z",
				result: "已分析",
				retryOf: "analyze-1",
				enteredFrom: { kind: "recovery", nodeRunId: "analyze-1" },
			},
			{
				id: "test-1",
				runId: historyRunId,
				sequence: 7,
				nodeRef: "test",
				nodeName: "测试",
				actionKind: "执行自定义命令",
				input: "analysis",
				status: "completed",
				startedAt: "2026-01-01T00:00:15.000Z",
				result: "已执行",
				enteredFrom: { kind: "parallel", parallelRoundId: "round-1" },
				parallelRoundId: "round-1",
			},
		],
		routeDecisions: [
			{
				id: "route-1",
				runId: historyRunId,
				sequence: 6,
				sourceNodeRunId: "analyze-2",
				result: "已分析",
				destination: { kind: "parallel", ref: "checks" },
				parallelRoundId: "round-1",
				selectedAt: "2026-01-01T00:00:12.000Z",
			},
		],
		parallelRounds: [
			{
				id: "round-1",
				runId: historyRunId,
				sequence: 7,
				parallelRef: "checks",
				input: "analysis",
				status: "completed",
				startedAt: "2026-01-01T00:00:14.000Z",
				completedAt: "2026-01-01T00:00:20.000Z",
				branchNodeRunIds: { test: "test-1" },
				branchStatuses: { test: "completed" },
				joinNodeRunId: "test-1",
				joinOutcome: { result: "已执行", content: "ok" },
			},
		],
		recoveries: [
			{
				id: "recovery-1",
				runId: historyRunId,
				sequence: 4,
				interruptedNodeRunId: "analyze-1",
				strategy: "retry_agent",
				resumedAt: "2026-01-01T00:00:09.000Z",
				summary: "恢复分析节点",
			},
		],
		current: { kind: "none" },
		evidence: {
			"analyze-2": {
				sessionReference: "session-1",
				commandOutputAvailable: false,
			},
		},
	};
}

class FakeVisualizationRuntime implements FlowRunVisualizationRuntime {
	recentRuns: FlowRunSummary[] = [];
	histories = new Map<string, FlowRunHistory>();
	evidence = new Map<string, FlowNodeEvidence | undefined>();
	inspectCalls = 0;
	evidenceCalls: Array<{ runId: string; nodeRunId: string }> = [];
	inspectionResponses: Array<Promise<FlowRunHistory | undefined>> = [];
	evidenceResponses: Array<Promise<FlowNodeEvidence | undefined>> = [];
	returnReferences = false;
	private readonly listeners = new Map<
		string,
		Set<(event: FlowObservationEvent) => void>
	>();

	async listRecentRuns(limit?: number): Promise<FlowRunSummary[]> {
		return structuredClone(this.recentRuns.slice(0, limit));
	}

	async listFlowRuns(
		flowId: string,
		limit?: number,
	): Promise<FlowRunSummary[]> {
		return structuredClone(
			this.recentRuns.filter((run) => run.flowId === flowId).slice(0, limit),
		);
	}

	async inspectRun(id: string): Promise<FlowRunHistory | undefined> {
		this.inspectCalls += 1;
		const response = this.inspectionResponses.shift();
		if (response) return await response;
		const history = this.histories.get(id);
		return (
			history && (this.returnReferences ? history : structuredClone(history))
		);
	}

	async inspectNodeEvidence(
		id: string,
		nodeRunId: string,
	): Promise<FlowNodeEvidence | undefined> {
		this.evidenceCalls.push({ runId: id, nodeRunId });
		const response = this.evidenceResponses.shift();
		if (response) return await response;
		const evidence = this.evidence.get(`${id}:${nodeRunId}`);
		return (
			evidence && (this.returnReferences ? evidence : structuredClone(evidence))
		);
	}

	async openRunObservation(
		id: string,
		listener: (event: FlowObservationEvent) => void,
	): Promise<
		| { snapshot: FlowRunHistory; subscription: FlowObservationSubscription }
		| undefined
	> {
		const snapshot = this.histories.get(id);
		if (!snapshot) return undefined;
		let listeners = this.listeners.get(id);
		if (!listeners) {
			listeners = new Set();
			this.listeners.set(id, listeners);
		}
		listeners.add(listener);
		let active = true;
		return {
			snapshot: this.returnReferences ? snapshot : structuredClone(snapshot),
			subscription: {
				unsubscribe: () => {
					if (!active) return;
					active = false;
					listeners?.delete(listener);
				},
			},
		};
	}

	emit(event: FlowObservationEvent): void {
		for (const listener of this.listeners.get(event.runId) ?? [])
			listener(event);
	}

	listenerCount(id: string): number {
		return this.listeners.get(id)?.size ?? 0;
	}
}

function createSummary(
	id: string,
	status: FlowRunSummary["status"],
	startedAt: string,
): FlowRunSummary {
	return {
		id,
		flowId: "code-change",
		flowVersion: "sha256:flow",
		task: `task ${id}`,
		status,
		phase: status === "running" ? "executing_node" : status,
		sequence: 1,
		historyCompleteness: "complete",
		startedAt,
		error:
			status === "failed"
				? { category: "unknown", summary: "failed" }
				: undefined,
	};
}

function event(sequence: number): FlowObservationEvent {
	return eventFor(runId, sequence);
}

function eventFor(id: string, sequence: number): FlowObservationEvent {
	return {
		type: "node.completed",
		runId: id,
		flowId: "code-change",
		sequence,
		occurredAt: "2026-01-01T00:02:01.000Z",
		status: "running",
		phase: "routing",
		nodeRunId: "analyze-2",
		nodeRef: "analyze",
		summary: "分析已完成",
	};
}

async function flush(): Promise<void> {
	await new Promise<void>((resolve) => setImmediate(resolve));
	await new Promise<void>((resolve) => setImmediate(resolve));
}

function deferred<T>() {
	let resolve: (value: T) => void = () => undefined;
	const promise = new Promise<T>((fulfill) => {
		resolve = fulfill;
	});
	return { promise, resolve };
}

test("时间线保留节点访问、路由、并行、恢复和终态事实", () => {
	const timeline = buildFlowTimeline(createHistory());
	assert.deepEqual(
		timeline.map((item) => item.kind),
		["node", "recovery", "node", "route", "node", "parallel", "terminal"],
	);
	const recovery = timeline.find((item) => item.kind === "recovery");
	assert.equal(recovery?.kind, "recovery");
	if (recovery?.kind === "recovery") {
		assert.equal(recovery.interruptedNodeRunId, "analyze-1");
		assert.equal(recovery.retryNodeRunId, "analyze-2");
	}
	const parallel = timeline.find((item) => item.kind === "parallel");
	assert.equal(parallel?.kind, "parallel");
	if (parallel?.kind === "parallel") {
		assert.deepEqual(parallel.branches, [
			{
				branchRef: "test",
				nodeRunId: "test-1",
				nodeName: "测试",
				status: "completed",
				result: "已执行",
			},
		]);
	}
});

test("Inspector 通过单次 Store 快照读取一个 Run 聚合", async () => {
	class SnapshotOnlyStore extends InMemoryRunStore {
		override async getRun(): Promise<never> {
			throw new Error("Inspector 不应单独读取 Run");
		}

		override async listNodeRuns(): Promise<never> {
			throw new Error("Inspector 不应单独读取 NodeRun");
		}

		override async listRouteDecisions(): Promise<never> {
			throw new Error("Inspector 不应单独读取 RouteDecision");
		}

		override async listParallelRounds(): Promise<never> {
			throw new Error("Inspector 不应单独读取 ParallelRound");
		}

		override async listRunRecoveries(): Promise<never> {
			throw new Error("Inspector 不应单独读取恢复记录");
		}
	}
	const store = new SnapshotOnlyStore();
	await store.createRun({
		id: runId,
		flowId: "code-change",
		flowVersion: "sha256:flow",
		task: "fix timeout",
		status: "completed",
		phase: "completed",
		sequence: 1,
		historyCompleteness: "complete",
		startedAt: "2026-01-01T00:00:00.000Z",
	});
	const history = await new FlowRunInspector(store).inspectRun(runId);
	assert.equal(history?.run.id, runId);
});

test("JSON Store 冷启动读取与写入并发时保留既有 Run", async () => {
	const directory = await mkdtemp(join(tmpdir(), "flow-json-load-"));
	const file = join(directory, "runs.json");
	const oldRun = createSummary(
		"existing",
		"completed",
		"2026-01-01T00:00:00.000Z",
	);
	await writeFile(
		file,
		JSON.stringify({ runs: [oldRun], nodeRuns: [] }),
		"utf8",
	);
	const store = new JsonFileRunStore(file);
	const newRun = createSummary(
		"created",
		"running",
		"2026-01-02T00:00:00.000Z",
	);
	await Promise.all([
		store.getRunSnapshot("existing"),
		store.createRun(newRun),
	]);
	const verified = new JsonFileRunStore(file);
	assert.deepEqual((await verified.listAllRuns()).map((run) => run.id).sort(), [
		"created",
		"existing",
	]);
});

test("运行中心保持最近记录，筛选只改变展示结果", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.recentRuns = [
		createSummary("running", "running", "2026-01-03T00:00:00.000Z"),
		createSummary("failed", "failed", "2026-01-02T00:00:00.000Z"),
		createSummary("completed", "completed", "2026-01-01T00:00:00.000Z"),
	];
	const controller = new FlowRunVisualizationController(runtime);
	await controller.loadRecentRuns();
	assert.equal(controller.getState().center.runs.length, 3);
	controller.setFilter("attention");
	assert.deepEqual(
		controller.getVisibleRuns().map((item) => item.runId),
		["failed"],
	);
	assert.equal(controller.getState().center.runs.length, 3);
	assert.deepEqual(
		filterFlowRuns(controller.getState().center.runs, "running").map(
			(item) => item.runId,
		),
		["running"],
	);
});

test("高水位事件只触发快照刷新，重复事件不覆盖确认快照", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.histories.set(runId, createHistory({ sequence: 9 }));
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	assert.equal(controller.getState().detail?.lastConfirmedSequence, 9);
	assert.equal(runtime.inspectCalls, 0);

	runtime.histories.set(runId, createHistory({ sequence: 10 }));
	runtime.emit(event(10));
	await flush();
	assert.equal(controller.getState().detail?.lastConfirmedSequence, 10);
	assert.equal(runtime.inspectCalls, 1);

	runtime.emit(event(10));
	await flush();
	assert.equal(runtime.inspectCalls, 1);
	assert.equal(controller.getState().detail?.connection, "connected");
});

test("切换、断线和重连释放旧订阅并保留最后确认快照", async () => {
	const runtime = new FakeVisualizationRuntime();
	const second = createHistory({
		id: "run-2",
		sequence: 4,
		status: "running",
		phase: "executing_node",
		completedAt: undefined,
	});
	runtime.histories.set(runId, createHistory());
	runtime.histories.set("run-2", second);
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	assert.equal(runtime.listenerCount(runId), 1);
	controller.markDisconnected();
	assert.equal(runtime.listenerCount(runId), 0);
	assert.equal(controller.getState().detail?.snapshot?.run.id, runId);
	assert.equal(controller.getState().detail?.connection, "disconnected");

	await controller.reconnect();
	assert.equal(runtime.listenerCount(runId), 1);
	assert.equal(controller.getState().detail?.connection, "connected");
	await controller.reconnect("run-2");
	assert.equal(runtime.listenerCount(runId), 0);
	assert.equal(runtime.listenerCount("run-2"), 1);
	assert.equal(controller.getState().detail?.runId, "run-2");
	controller.dispose();
	assert.equal(runtime.listenerCount("run-2"), 0);
});

test("节点证据仅在选择具体 NodeRun 后按需读取", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.histories.set(runId, createHistory());
	runtime.evidence.set(`${runId}:analyze-2`, {
		runId,
		nodeRunId: "analyze-2",
		nodeRef: "analyze",
		nodeName: "分析",
		status: "completed",
		input: "fix timeout",
		outcome: { result: "已分析", content: "analysis" },
	});
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	assert.equal(runtime.evidenceCalls.length, 0);

	controller.selectFact({ kind: "node", nodeRunId: "analyze-2" });
	await controller.loadSelectedNodeEvidence();
	assert.deepEqual(runtime.evidenceCalls, [{ runId, nodeRunId: "analyze-2" }]);
	assert.equal(controller.getState().detail?.evidenceState, "available");
	assert.equal(
		controller.getState().detail?.evidence?.outcome?.result,
		"已分析",
	);
});

test("串行刷新不会用慢快照回退已确认水位", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.histories.set(runId, createHistory({ sequence: 9 }));
	const slow = deferred<FlowRunHistory | undefined>();
	const fast = deferred<FlowRunHistory | undefined>();
	runtime.inspectionResponses = [slow.promise, fast.promise];
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);

	runtime.emit(event(10));
	runtime.emit(event(11));
	await flush();
	assert.equal(runtime.inspectCalls, 1);
	slow.resolve(createHistory({ sequence: 10 }));
	await flush();
	assert.equal(controller.getState().detail?.lastConfirmedSequence, 10);
	assert.equal(runtime.inspectCalls, 2);
	fast.resolve(createHistory({ sequence: 11 }));
	await flush();
	assert.equal(controller.getState().detail?.lastConfirmedSequence, 11);
});

test("旧 Run 的慢刷新不会解除新 Run 的单飞门禁", async () => {
	const runtime = new FakeVisualizationRuntime();
	const secondRunId = "run-2";
	runtime.histories.set(runId, createHistory({ sequence: 9 }));
	runtime.histories.set(
		secondRunId,
		createHistory({
			id: secondRunId,
			sequence: 9,
			status: "running",
			phase: "executing_node",
			completedAt: undefined,
		}),
	);
	const firstRefresh = deferred<FlowRunHistory | undefined>();
	const secondRefresh = deferred<FlowRunHistory | undefined>();
	const thirdRefresh = deferred<FlowRunHistory | undefined>();
	runtime.inspectionResponses = [
		firstRefresh.promise,
		secondRefresh.promise,
		thirdRefresh.promise,
	];
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	runtime.emit(event(10));
	await flush();
	assert.equal(runtime.inspectCalls, 1);

	await controller.openRun(secondRunId);
	runtime.emit(eventFor(secondRunId, 10));
	await flush();
	assert.equal(runtime.inspectCalls, 2);
	firstRefresh.resolve(createHistory({ sequence: 10 }));
	await flush();
	runtime.emit(eventFor(secondRunId, 11));
	await flush();
	assert.equal(runtime.inspectCalls, 2);

	secondRefresh.resolve(
		createHistory({
			id: secondRunId,
			sequence: 10,
			status: "running",
			phase: "executing_node",
			completedAt: undefined,
		}),
	);
	await flush();
	assert.equal(runtime.inspectCalls, 3);
	thirdRefresh.resolve(
		createHistory({
			id: secondRunId,
			sequence: 11,
			status: "running",
			phase: "executing_node",
			completedAt: undefined,
		}),
	);
	await flush();
	assert.equal(controller.getState().detail?.lastConfirmedSequence, 11);
});

test("刷新后运行不可读时断开订阅并保留最后确认快照", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.histories.set(runId, createHistory({ sequence: 9 }));
	runtime.inspectionResponses = [Promise.resolve(undefined)];
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	runtime.emit(event(10));
	await flush();
	assert.equal(controller.getState().detail?.connection, "disconnected");
	assert.equal(controller.getState().detail?.snapshot?.run.sequence, 9);
	assert.equal(runtime.listenerCount(runId), 0);
});

test("切换选择会阻止旧节点证据回填", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.histories.set(runId, createHistory());
	const response = deferred<FlowNodeEvidence | undefined>();
	runtime.evidenceResponses = [response.promise];
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	controller.selectFact({ kind: "node", nodeRunId: "analyze-2" });
	const loading = controller.loadSelectedNodeEvidence();
	controller.selectFact({ kind: "node", nodeRunId: "test-1" });
	response.resolve({
		runId,
		nodeRunId: "analyze-2",
		nodeRef: "analyze",
		status: "completed",
		input: "fix timeout",
	});
	await loading;
	assert.equal(controller.getState().detail?.evidence, undefined);
	assert.equal(controller.getState().detail?.evidenceState, "idle");
});

test("可见运行列表的返回值不能修改控制器内部状态", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.recentRuns = [
		createSummary("running", "running", "2026-01-03T00:00:00.000Z"),
	];
	const controller = new FlowRunVisualizationController(runtime);
	await controller.loadRecentRuns();
	const visible = controller.getVisibleRuns();
	const item = visible[0];
	if (!item) throw new Error("expected visible run");
	item.taskSummary = "mutated";
	assert.equal(
		controller.getState().center.runs[0]?.taskSummary,
		"task running",
	);
});

test("控制器复制 Runtime 快照和证据，避免外部引用污染状态", async () => {
	const runtime = new FakeVisualizationRuntime();
	runtime.returnReferences = true;
	const history = createHistory({ sequence: 9 });
	const evidence: FlowNodeEvidence = {
		runId,
		nodeRunId: "analyze-2",
		nodeRef: "analyze",
		status: "completed",
		input: "fix timeout",
		outcome: { result: "已分析", content: "analysis" },
	};
	runtime.histories.set(runId, history);
	runtime.evidence.set(`${runId}:analyze-2`, evidence);
	const controller = new FlowRunVisualizationController(runtime);
	await controller.openRun(runId);
	history.run.sequence = 99;
	assert.equal(controller.getState().detail?.snapshot?.run.sequence, 9);

	controller.selectFact({ kind: "node", nodeRunId: "analyze-2" });
	await controller.loadSelectedNodeEvidence();
	if (!evidence.outcome) throw new Error("expected evidence outcome");
	evidence.outcome.result = "changed externally";
	assert.equal(
		controller.getState().detail?.evidence?.outcome?.result,
		"已分析",
	);
});
