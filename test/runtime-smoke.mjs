import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { FlowDirectory } from "../dist/directory.js";
import { loadFlow } from "../dist/flow-loader.js";
import { PiAgentIntegrationAdapter } from "../dist/pi.js";
import {
	AgentRunModel,
	FlowCoordinator,
	InMemoryRunStore,
} from "../dist/runtime.js";

class FakeAdapter {
	constructor(outcomes) {
		this.outcomes = outcomes;
		this.released = 0;
		this.created = [];
		this.takenOver = [];
		this.executed = [];
	}

	async createAgent({ runId }) {
		this.created.push(runId);
		return { id: runId, platformReference: runId };
	}

	async takeOverAgent({ agentReference }) {
		this.takenOver.push(agentReference);
		return { id: agentReference, platformReference: agentReference };
	}

	async executeNode(request) {
		const outcome = this.outcomes.shift();
		if (!outcome) throw new Error("Fake Agent 缺少预设结果");
		this.executed.push(request.nodeExecutionReference);
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			...outcome,
			interactionReference: request.nodeExecutionReference,
		});
		return {
			id: request.nodeExecutionReference,
			interactionReference: request.nodeExecutionReference,
		};
	}

	async getNodeSession() {
		return [];
	}

	async releaseAgent() {
		this.released += 1;
	}
}

class FakeCommandExecutor {
	constructor() {
		this.requests = [];
	}

	async execute(request) {
		this.requests.push(request);
		return {
			status: "success",
			exitCode: 0,
			stdout: request.command,
			stderr: "",
		};
	}
}

async function fixture(name) {
	return (await loadFlow(join(import.meta.dirname, "fixtures", name))).flow;
}

test("parses ordinary routing, a gate loop, and a command join", async () => {
	const ordinary = await fixture("ordinary");
	assert.equal(ordinary.startNodeRef, "analyze");
	assert.deepEqual(ordinary.nodes.get("finishNode").successors.get("已完成"), {
		kind: "finish",
	});
	const loop = await fixture("gate-loop");
	assert.deepEqual(loop.nodes.get("review").successors.get("返工"), {
		kind: "node",
		ref: "review",
	});
	const parallel = await fixture("command-parallel");
	assert.deepEqual(parallel.parallels.get("parallel"), {
		ref: "parallel",
		branches: ["test", "lint"],
		joinRef: "merge",
	});
});

test("discovers reusable Flow packages by directory identifier", async () => {
	const directory = new FlowDirectory(join(import.meta.dirname, "fixtures"));
	assert.deepEqual(
		(await directory.list()).map((flow) => flow.id),
		["command-parallel", "gate-loop", "ordinary"],
	);
	assert.equal((await directory.load("ordinary")).name, "普通流转");
});

test("discovers nested Flow packages and ignores resource directories", async () => {
	const root = await mkdtemp(join(tmpdir(), "flow-directory-"));
	const fixturePath = join(import.meta.dirname, "fixtures", "ordinary");
	await mkdir(join(root, "group"), { recursive: true });
	await mkdir(join(root, "references"), { recursive: true });
	await cp(fixturePath, join(root, "group", "ordinary"), {
		recursive: true,
	});
	await cp(fixturePath, join(root, "references", "ignored"), {
		recursive: true,
	});

	const directory = new FlowDirectory(root);
	assert.deepEqual(
		(await directory.list()).map((flow) => flow.id),
		["ordinary"],
	);
});

test("runs the simplify flow through a self-gated loop", async () => {
	const simplify = (
		await loadFlow(join(import.meta.dirname, "..", "examples", "simplify"))
	).flow;
	assert.deepEqual(simplify.nodes.get("simplify").successors.get("已精简"), {
		kind: "node",
		ref: "simplify",
	});
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		simplify,
		store,
		new AgentRunModel(
			new FakeAdapter([
				{ result: "已精简", content: "first pass found more" },
				{ result: "已精简", content: "second pass found more" },
				{ result: "无法精简", content: "no further simplification" },
			]),
		),
	).run("review the project");
	assert.equal(run.status, "completed");
	assert.deepEqual(
		(await store.listNodeRuns(run.id)).map((record) => record.nodeRef),
		["simplify", "simplify", "simplify"],
	);
});

test("coordinates parallel commands and persists every node visit", async () => {
	const flow = await fixture("command-parallel");
	const adapter = new FakeAdapter([
		{ result: "执行检查", content: "check" },
		{ result: "通过", content: "approved" },
	]);
	const commands = new FakeCommandExecutor();
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(adapter),
		commands,
	).run("task");
	assert.equal(run.status, "completed");
	assert.deepEqual(commands.requests.map((request) => request.command).sort(), [
		"lint",
		"merge",
		"test",
	]);
	const merge = commands.requests.find(
		(request) => request.command === "merge",
	);
	assert.equal(merge.stdin.test.result, "已执行");
	assert.equal(merge.stdin.lint.result, "已执行");
	assert.equal((await store.listNodeRuns(run.id)).length, 5);
});

test("records repeated gate visits independently", async () => {
	const flow = await fixture("gate-loop");
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(
			new FakeAdapter([
				{ result: "返工", content: "retry" },
				{ result: "通过", content: "done" },
			]),
		),
	).run("task");
	assert.deepEqual(
		(await store.listNodeRuns(run.id)).map((record) => record.nodeRef),
		["review", "review"],
	);
});

test("resumes an interrupted new-agent node in its persisted Pi session", async () => {
	const flow = await fixture("ordinary");
	const adapter = new FakeAdapter([
		{ result: "已分析", content: "analysis" },
		{ result: "已完成", content: "done" },
	]);
	const store = new InMemoryRunStore();
	await store.createRun({
		id: "interrupted-run",
		flowId: flow.id,
		task: "task",
		status: "running",
		startedAt: "2026-01-01T00:00:00.000Z",
		flowPath: "/flows/ordinary/FLOW.md",
		cwd: "/work",
		sessionReference: "saved-pi-session",
		currentNodeRef: "analyze",
		currentInput: "task",
	});
	await store.createNodeRun({
		id: "interrupted-node",
		runId: "interrupted-run",
		nodeRef: "analyze",
		input: "task",
		startedAt: "2026-01-01T00:01:00.000Z",
	});

	const result = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(adapter),
	).resume("interrupted-run", { cwd: "/work" });

	assert.equal(result.status, "completed");
	assert.deepEqual(adapter.takenOver, ["saved-pi-session"]);
	assert.deepEqual(adapter.created, []);
	assert.deepEqual(await store.listRunningRuns(), []);
	assert.equal((await store.listNodeRuns(result.id)).length, 3);
});

test("routes a completed checkpoint without re-executing its node", async () => {
	const flow = await fixture("ordinary");
	const adapter = new FakeAdapter([{ result: "已完成", content: "done" }]);
	const store = new InMemoryRunStore();
	await store.createRun({
		id: "completed-checkpoint-run",
		flowId: flow.id,
		task: "task",
		status: "running",
		startedAt: "2026-01-01T00:00:00.000Z",
		sessionReference: "saved-pi-session",
		currentNodeRef: "analyze",
		currentInput: "task",
		currentNodeRunId: "completed-node",
	});
	await store.createNodeRun({
		id: "completed-node",
		runId: "completed-checkpoint-run",
		nodeRef: "analyze",
		input: "task",
		startedAt: "2026-01-01T00:01:00.000Z",
		completedAt: "2026-01-01T00:02:00.000Z",
		outcome: { result: "已分析", content: "analysis" },
	});

	const result = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(adapter),
	).resume("completed-checkpoint-run");

	assert.equal(result.status, "completed");
	assert.equal(adapter.executed.length, 1);
	assert.equal((await store.listNodeRuns(result.id)).length, 2);
});

test("reuses completed parallel branches and restores their join inputs", async () => {
	const flow = await fixture("command-parallel");
	const adapter = new FakeAdapter([{ result: "通过", content: "approved" }]);
	const commands = new FakeCommandExecutor();
	const store = new InMemoryRunStore();
	await store.createRun({
		id: "parallel-run",
		flowId: flow.id,
		task: "task",
		status: "running",
		startedAt: "2026-01-01T00:00:00.000Z",
		sessionReference: "saved-pi-session",
		currentInput: "check task",
		currentParallelRound: {
			id: "parallel-round",
			parallelRef: "parallel",
			input: "check task",
			branchNodeRunIds: { test: "completed-test" },
		},
	});
	await store.createNodeRun({
		id: "completed-test",
		runId: "parallel-run",
		nodeRef: "test",
		input: "check task",
		startedAt: "2026-01-01T00:01:00.000Z",
		completedAt: "2026-01-01T00:02:00.000Z",
		outcome: { result: "已执行", content: { status: "success" } },
	});

	const result = await new FlowCoordinator(
		flow,
		store,
		new AgentRunModel(adapter),
		commands,
	).resume("parallel-run");

	assert.equal(result.status, "completed");
	assert.deepEqual(commands.requests.map((request) => request.command).sort(), [
		"lint",
		"merge",
	]);
	assert.equal(
		commands.requests.find((request) => request.command === "merge")?.stdin.test
			.result,
		"已执行",
	);
});

test("fails an interrupted custom command instead of replaying its side effect", async () => {
	const flow = await fixture("command-parallel");
	const commands = new FakeCommandExecutor();
	const store = new InMemoryRunStore();
	await store.createRun({
		id: "interrupted-command-run",
		flowId: flow.id,
		task: "task",
		status: "running",
		startedAt: "2026-01-01T00:00:00.000Z",
		currentNodeRef: "merge",
		currentInput: "check task",
		currentNodeRunId: "interrupted-command",
	});
	await store.createNodeRun({
		id: "interrupted-command",
		runId: "interrupted-command-run",
		nodeRef: "merge",
		input: "check task",
		startedAt: "2026-01-01T00:01:00.000Z",
	});

	await assert.rejects(
		() =>
			new FlowCoordinator(
				flow,
				store,
				new AgentRunModel(new FakeAdapter([])),
				commands,
			).resume("interrupted-command-run"),
		/无法安全自动重试/,
	);

	assert.deepEqual(commands.requests, []);
	assert.equal(
		(await store.getRun("interrupted-command-run"))?.status,
		"failed",
	);
});

test("does not start other parallel branches when one command was interrupted", async () => {
	const flow = await fixture("command-parallel");
	const commands = new FakeCommandExecutor();
	const store = new InMemoryRunStore();
	await store.createRun({
		id: "interrupted-parallel-run",
		flowId: flow.id,
		task: "task",
		status: "running",
		startedAt: "2026-01-01T00:00:00.000Z",
		currentParallelRound: {
			id: "interrupted-round",
			parallelRef: "parallel",
			input: "check task",
			branchNodeRunIds: { test: "interrupted-test" },
		},
	});
	await store.createNodeRun({
		id: "interrupted-test",
		runId: "interrupted-parallel-run",
		nodeRef: "test",
		input: "check task",
		startedAt: "2026-01-01T00:01:00.000Z",
	});

	await assert.rejects(
		() =>
			new FlowCoordinator(
				flow,
				store,
				new AgentRunModel(new FakeAdapter([])),
				commands,
			).resume("interrupted-parallel-run"),
		/无法安全自动重试/,
	);

	assert.deepEqual(commands.requests, []);
});

test("rejects an adapter result outside the node's declared options", async () => {
	const adapter = new AgentRunModel({
		async createAgent() {
			return { id: "agent", platformReference: "agent" };
		},
		async takeOverAgent() {
			throw new Error("unused");
		},
		async executeNode(request) {
			await request.submitOutcome({
				nodeExecutionReference: request.nodeExecutionReference,
				result: "invalid",
				content: "x",
			});
			return { id: "node" };
		},
		async getNodeSession() {
			return [];
		},
		async releaseAgent() {},
	});
	await assert.rejects(
		() =>
			adapter.executeNode({
				runId: "run",
				action: "新建Agent",
				nodeExecutionReference: "node",
				prompt: "work",
				outcomes: [{ name: "ok", description: "ok" }],
			}),
		/节点不允许结果/,
	);
});

test("keeps an accepted adapter interaction reference queryable", async () => {
	const messages = [{ id: "entry", role: "assistant", content: "evidence" }];
	const adapter = new AgentRunModel({
		async createAgent() {
			return { id: "agent", platformReference: "agent" };
		},
		async takeOverAgent() {
			throw new Error("unused");
		},
		async executeNode(request) {
			await request.submitOutcome({
				nodeExecutionReference: request.nodeExecutionReference,
				result: "ok",
				content: "done",
				interactionReference: "entry",
			});
			return { id: "session", interactionReference: "entry" };
		},
		async getNodeSession() {
			return messages;
		},
		async releaseAgent() {},
	});
	const executed = await adapter.executeNode({
		runId: "run",
		action: "新建Agent",
		nodeExecutionReference: "node",
		prompt: "work",
		outcomes: [{ name: "ok", description: "ok" }],
	});
	assert.equal(executed.session.interactionReference, "entry");
	assert.deepEqual(await adapter.getNodeSession(executed.session), messages);
});

test("creates a new CLI session when a new-agent node loops", async () => {
	let sessionNumber = 0;
	const bridge = {
		sendNodePrompt() {},
		async createNewSession() {
			sessionNumber += 1;
		},
		getSessionReference() {
			return `visible-session-${sessionNumber}`;
		},
		getLeafEntryId() {
			return undefined;
		},
		getMessages() {
			return [];
		},
	};
	const adapter = new PiAgentIntegrationAdapter({ cliBridge: bridge });
	const first = await adapter.createAgent({ runId: "run" });
	const second = await adapter.createAgent({ runId: "run" });
	assert.notEqual(second.id, first.id);
	assert.notEqual(second.sessionReference, first.sessionReference);
	assert.equal(second.sessionReference, "visible-session-2");
});
