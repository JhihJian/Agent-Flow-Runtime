import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { parseFlow } from "../src/parser.ts";
import { PiAgentIntegrationAdapter } from "../src/pi.ts";
import {
	AgentRunModel,
	FlowCoordinator,
	InMemoryRunStore,
	ProcessCommandExecutor,
} from "../src/runtime.ts";
import type {
	AgentIntegrationAdapter,
	CommandExecutor,
	CommandRequest,
	CommandResult,
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
