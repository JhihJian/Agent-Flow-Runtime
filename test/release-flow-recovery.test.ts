import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadFlow } from "../src/flow-loader.ts";
import {
	AgentRunModel,
	FlowCoordinator,
	JsonFileRunStore,
} from "../src/runtime.ts";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	CommandExecutor,
	CommandRequest,
	CommandResult,
	FlowDefinition,
	NodeSession,
	OutcomeOption,
	RunStore,
	UnifiedMessage,
} from "../src/types.ts";

class RecoveryAgent implements AgentIntegrationAdapter {
	takeoverCount = 0;
	executionCount = 0;

	async createAgent(request: { runId: string }): Promise<AgentConnection> {
		return { id: `${request.runId}:agent`, platformReference: request.runId };
	}

	async takeOverAgent(request: {
		runId: string;
		agentReference: string;
	}): Promise<AgentConnection> {
		this.takeoverCount += 1;
		return {
			id: `${request.runId}:agent`,
			platformReference: request.agentReference,
		};
	}

	async executeNode(request: {
		connection: AgentConnection;
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		this.executionCount += 1;
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			result: "已完成",
		});
		return { id: request.nodeExecutionReference };
	}

	async getNodeSession(_session: NodeSession): Promise<UnifiedMessage[]> {
		return [];
	}

	async releaseAgent(_connection: AgentConnection): Promise<void> {}
}

class CountingCommands implements CommandExecutor {
	readonly requests: CommandRequest[] = [];

	async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		return { status: "success", exitCode: 0, stdout: "", stderr: "" };
	}
}

async function seedInterruptedNode(
	store: RunStore,
	flow: FlowDefinition,
	options: {
		runId: string;
		nodeRef: string;
		actionKind: "新建Agent" | "执行自定义命令";
	},
): Promise<void> {
	await store.createRun({
		id: options.runId,
		flowId: flow.id,
		flowVersion: "legacy:unknown",
		variables: { 任务: "发布前恢复验收" },
		status: "running",
		phase: "executing_node",
		sequence: 1,
		historyCompleteness: "legacy",
		startedAt: "2026-01-01T00:00:00.000Z",
		sessionReference: "saved-session",
		currentNodeRef: options.nodeRef,
		currentInput: {},
		currentNodeRunId: `${options.runId}-node`,
	});
	await store.createNodeRun({
		id: `${options.runId}-node`,
		runId: options.runId,
		sequence: 2,
		nodeRef: options.nodeRef,
		nodeName: options.nodeRef,
		actionKind: options.actionKind,
		input: {},
		status: "running",
		startedAt: "2026-01-01T00:01:00.000Z",
		enteredFrom: { kind: "start" },
	});
}

describe("release Flow recovery smoke", () => {
	it("从 JSON 快照重试中断的 Agent，并保留旧访问记录", async () => {
		const root = join(
			import.meta.dirname,
			"fixtures",
			"release-smoke",
			"recovery-agent",
		);
		const loaded = await loadFlow(root);
		const file = join(
			await mkdtemp(join(tmpdir(), "release-recovery-agent-")),
			"flow-runs.json",
		);
		const store = new JsonFileRunStore(file);
		await seedInterruptedNode(store, loaded.flow, {
			runId: "recovery-agent-smoke",
			nodeRef: "inspect",
			actionKind: "新建Agent",
		});
		const agent = new RecoveryAgent();
		const result = await new FlowCoordinator(
			loaded.flow,
			store,
			new AgentRunModel(agent),
		).resume("recovery-agent-smoke");

		expect(result.status).toBe("completed");
		expect(agent.takeoverCount).toBe(1);
		expect(agent.executionCount).toBe(1);
		const records = await store.listNodeRuns(result.id);
		expect(
			records.find((record) => record.id === "recovery-agent-smoke-node")
				?.status,
		).toBe("interrupted");
		const retry = records.find(
			(record) => record.retryOf === "recovery-agent-smoke-node",
		);
		expect(retry?.status).toBe("completed");
		expect(retry?.outcome).toEqual({ result: "已完成" });
		expect(await new JsonFileRunStore(file).getRun(result.id)).toMatchObject({
			status: "completed",
			variables: { 任务: "发布前恢复验收" },
		});
	});

	it("从 JSON 快照恢复中断命令时不重放外部副作用", async () => {
		const root = join(
			import.meta.dirname,
			"fixtures",
			"release-smoke",
			"recovery-command",
		);
		const loaded = await loadFlow(root);
		const file = join(
			await mkdtemp(join(tmpdir(), "release-recovery-command-")),
			"flow-runs.json",
		);
		const store = new JsonFileRunStore(file);
		await seedInterruptedNode(store, loaded.flow, {
			runId: "recovery-command-smoke",
			nodeRef: "execute",
			actionKind: "执行自定义命令",
		});
		const commands = new CountingCommands();
		await expect(
			new FlowCoordinator(
				loaded.flow,
				store,
				new AgentRunModel(new RecoveryAgent()),
				commands,
			).resume("recovery-command-smoke"),
		).rejects.toThrow("无法安全自动重试");

		expect(commands.requests).toHaveLength(0);
		const restored = await new JsonFileRunStore(file).getRunSnapshot(
			"recovery-command-smoke",
		);
		expect(restored?.run.status).toBe("failed");
		expect(restored?.run.error?.category).toBe("command_interrupted");
		expect(restored?.nodeRuns[0]?.status).toBe("interrupted");
	});
});
