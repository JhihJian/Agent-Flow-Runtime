import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { FlowDirectory } from "../dist/directory.js";
import { parseFlow } from "../dist/parser.js";
import {
	AgentRunModel,
	FlowCoordinator,
	InMemoryRunStore,
} from "../dist/runtime.js";

class FakeAdapter {
	constructor(outcomes) {
		this.outcomes = outcomes;
		this.released = 0;
	}

	async createAgent({ runId }) {
		return { id: runId, platformReference: runId };
	}

	async takeOverAgent({ agentReference }) {
		return { id: agentReference, platformReference: agentReference };
	}

	async executeNode(request) {
		const outcome = this.outcomes.shift();
		if (!outcome) throw new Error("Fake Agent 缺少预设结果");
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
	return parseFlow(
		await readFile(join(import.meta.dirname, "fixtures", name), "utf8"),
		name,
	);
}

test("parses ordinary routing, a gate loop, and a command join", async () => {
	const ordinary = await fixture("ordinary.md");
	assert.equal(ordinary.startNodeRef, "analyze");
	assert.deepEqual(ordinary.nodes.get("finishNode").successors.get("已完成"), {
		kind: "finish",
	});
	const loop = await fixture("gate-loop.md");
	assert.deepEqual(loop.nodes.get("review").successors.get("返工"), {
		kind: "node",
		ref: "review",
	});
	const parallel = await fixture("command-parallel.md");
	assert.deepEqual(parallel.parallels.get("parallel"), {
		ref: "parallel",
		branches: ["test", "lint"],
		joinRef: "merge",
	});
});

test("discovers reusable Flow files by filename identifier", async () => {
	const directory = new FlowDirectory(join(import.meta.dirname, "fixtures"));
	assert.deepEqual(
		(await directory.list()).map((flow) => flow.id),
		["command-parallel", "gate-loop", "ordinary"],
	);
	assert.equal((await directory.load("ordinary")).name, "普通流转");
});

test("runs the simplify flow through a review gate loop", async () => {
	const simplify = parseFlow(
		await readFile(
			join(import.meta.dirname, "..", "examples", "simplify.md"),
			"utf8",
		),
		"simplify.md",
	);
	assert.deepEqual(simplify.nodes.get("gate").successors.get("继续精简"), {
		kind: "node",
		ref: "simplify",
	});
	const store = new InMemoryRunStore();
	const run = await new FlowCoordinator(
		simplify,
		store,
		new AgentRunModel(
			new FakeAdapter([
				{ result: "已精简", content: "first pass" },
				{ result: "继续精简", content: "gate found more" },
				{ result: "已精简", content: "second pass" },
				{ result: "通过", content: "no further simplification" },
			]),
		),
	).run("review the project");
	assert.equal(run.status, "completed");
	assert.deepEqual(
		(await store.listNodeRuns(run.id)).map((record) => record.nodeRef),
		["simplify", "gate", "simplify", "gate"],
	);
});

test("coordinates parallel commands and persists every node visit", async () => {
	const flow = await fixture("command-parallel.md");
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
	const flow = await fixture("gate-loop.md");
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
