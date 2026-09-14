import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFlow } from "../src/parser.ts";
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

const fixture = (name: string) =>
	readFile(join(import.meta.dirname, "fixtures", name), "utf8");

class FakeAdapter implements AgentIntegrationAdapter {
	readonly executed: string[] = [];
	readonly released: string[] = [];
	readonly created: string[] = [];
	readonly takenOver: string[] = [];
	readonly sessions = new Map<string, UnifiedMessage[]>();
	private readonly outcomes: Array<{ result: string; content: string }>;

	constructor(outcomes: Array<{ result: string; content: string }>) {
		this.outcomes = outcomes;
	}

	async createAgent(request: { runId: string }): Promise<AgentConnection> {
		this.created.push(request.runId);
		return {
			id: `${request.runId}:agent`,
			platformReference: `${request.runId}:agent`,
			sessionReference: "fake-session",
		};
	}

	async takeOverAgent(request: {
		agentReference: string;
	}): Promise<AgentConnection> {
		this.takenOver.push(request.agentReference);
		return {
			id: "taken-over",
			platformReference: request.agentReference,
			sessionReference: "fake-session",
		};
	}

	async executeNode(request: {
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		const next = this.outcomes.shift();
		if (!next) throw new Error("Fake Agent 缺少预设结果");
		this.executed.push(request.nodeExecutionReference);
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			result: next.result,
			content: next.content,
			sessionReference: "fake-session",
			interactionReference: request.nodeExecutionReference,
		});
		const session = {
			id: request.nodeExecutionReference,
			sessionReference: "fake-session",
			interactionReference: request.nodeExecutionReference,
		};
		this.sessions.set(session.id, [
			{
				id: request.nodeExecutionReference,
				role: "assistant",
				content: request.prompt,
			},
		]);
		return session;
	}

	async getNodeSession(session: NodeSession): Promise<UnifiedMessage[]> {
		return this.sessions.get(session.id) ?? [];
	}

	async releaseAgent(connection: AgentConnection): Promise<void> {
		this.released.push(connection.id);
	}
}

class FakeCommandExecutor implements CommandExecutor {
	readonly requests: CommandRequest[] = [];
	async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		return {
			status: "success",
			exitCode: 0,
			stdout: request.command,
			stderr: "",
		};
	}
}

describe("FlowCoordinator", () => {
	it("runs ordinary Agent nodes and stores independent records", async () => {
		const adapter = new FakeAdapter([
			{ result: "已分析", content: "analysis" },
			{ result: "已完成", content: "done" },
		]);
		const store = new InMemoryRunStore();
		const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
		const result = await new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(adapter),
		).run("task");
		expect(result.status).toBe("completed");
		const records = await store.listNodeRuns(result.id);
		expect(records).toHaveLength(2);
		expect(records.map((record) => record.input)).toEqual(["task", "analysis"]);
		expect(adapter.released).toHaveLength(1);
	});

	it("runs a gate loop as distinct visits", async () => {
		const adapter = new FakeAdapter([
			{ result: "返工", content: "try again" },
			{ result: "通过", content: "approved" },
		]);
		const store = new InMemoryRunStore();
		const flow = parseFlow(await fixture("gate-loop.md"), "gate-loop.md");
		const result = await new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(adapter),
		).run("task");
		const records = await store.listNodeRuns(result.id);
		expect(records.map((record) => record.nodeRef)).toEqual([
			"review",
			"review",
		]);
		expect(records[1].input).toBe("try again");
	});

	it("resumes an interrupted new-agent node in its persisted Pi session", async () => {
		const adapter = new FakeAdapter([
			{ result: "已分析", content: "analysis" },
			{ result: "已完成", content: "done" },
		]);
		const store = new InMemoryRunStore();
		const flow = parseFlow(await fixture("ordinary.md"), "ordinary.md");
		await store.createRun({
			id: "interrupted-run",
			flowId: flow.id,
			task: "task",
			status: "running",
			startedAt: "2026-01-01T00:00:00.000Z",
			flowPath: "/flows/ordinary.md",
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

		expect(result.status).toBe("completed");
		expect(adapter.takenOver).toEqual(["saved-pi-session"]);
		expect(adapter.created).toEqual([]);
		expect(await store.listRunningRuns()).toEqual([]);
		expect(await store.listNodeRuns(result.id)).toHaveLength(3);
	});

	it("runs command branches in parallel and gives the join this round's outcomes", async () => {
		const adapter = new FakeAdapter([
			{ result: "执行检查", content: "check task" },
			{ result: "通过", content: "approved" },
		]);
		const commands = new FakeCommandExecutor();
		const store = new InMemoryRunStore();
		const flow = parseFlow(
			await fixture("command-parallel.md"),
			"command-parallel.md",
		);
		const result = await new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(adapter),
			commands,
		).run("task");
		expect(result.status).toBe("completed");
		expect(commands.requests.map((request) => request.command)).toEqual(
			expect.arrayContaining(["test", "lint", "merge"]),
		);
		const merge = commands.requests.find(
			(request) => request.command === "merge",
		);
		expect(merge).toBeDefined();
		if (!merge) throw new Error("expected merge command");
		expect(merge.stdin).toMatchObject({
			test: { result: "已执行" },
			lint: { result: "已执行" },
		});
		expect(
			(await store.listNodeRuns(result.id)).map((record) => record.nodeRef),
		).toEqual(
			expect.arrayContaining(["plan", "test", "lint", "merge", "judge"]),
		);
	});
});
