import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadFlow } from "../src/flow-loader.ts";
import {
	AgentRunModel,
	FlowCoordinator,
	JsonFileRunStore,
	ProcessCommandExecutor,
} from "../src/runtime.ts";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	CommandRequest,
	CommandResult,
	NodeSession,
	OutcomeOption,
	UnifiedMessage,
} from "../src/types.ts";

class ReleaseSmokeAgent implements AgentIntegrationAdapter {
	readonly prompts: string[] = [];

	async createAgent(request: { runId: string }): Promise<AgentConnection> {
		return { id: `${request.runId}:agent`, platformReference: request.runId };
	}

	async takeOverAgent(request: {
		runId: string;
		agentReference: string;
	}): Promise<AgentConnection> {
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
		this.prompts.push(request.prompt);
		const child = request.prompt.includes("子任务：");
		const final = request.prompt.includes("子 Flow 消息：");
		await request.submitOutcome({
			nodeExecutionReference: request.nodeExecutionReference,
			result: child || final ? "已完成" : "已识别",
			variables: child
				? { 子结果: "通过" }
				: final
					? undefined
					: { agent标记: "通过", 项目: "Agent 覆盖值" },
		});
		return { id: request.nodeExecutionReference };
	}

	async getNodeSession(_session: NodeSession): Promise<UnifiedMessage[]> {
		return [];
	}

	async releaseAgent(_connection: AgentConnection): Promise<void> {}
}

class ReleaseSmokeCommands extends ProcessCommandExecutor {
	readonly requests: CommandRequest[] = [];

	override async execute(request: CommandRequest): Promise<CommandResult> {
		this.requests.push(request);
		return super.execute(request);
	}
}

describe("release Flow smoke", () => {
	it("runs the complete variables, outcome, parallel, child Flow and persistence path", async () => {
		const root = join(
			import.meta.dirname,
			"fixtures",
			"release-smoke",
			"parent-flow",
		);
		const loaded = await loadFlow(root);
		const file = join(
			await mkdtemp(join(tmpdir(), "release-flow-")),
			"flow-runs.json",
		);
		const store = new JsonFileRunStore(file);
		const agent = new ReleaseSmokeAgent();
		const commands = new ReleaseSmokeCommands();
		const run = await new FlowCoordinator(
			loaded.flow,
			store,
			new AgentRunModel(agent),
			commands,
			undefined,
			undefined,
			loaded.resources,
			loaded.references,
		).run({
			variables: {
				任务: "发布前验收",
				项目: "release-smoke",
				临时变量: "待删除",
			},
		});

		expect(run.status).toBe("completed");
		expect(run.variables).toMatchObject({
			任务: "发布前验收",
			项目: "Agent 覆盖值",
			默认检查范围: "全部源码",
			agent标记: "通过",
			command状态: "通过",
		});
		expect(run.variables).not.toHaveProperty("lint状态");
		expect(run.variables).not.toHaveProperty("test状态");
		expect(run.variables).not.toHaveProperty("子结果");
		expect(run.variables).toHaveProperty("临时变量", "待删除");
		expect(
			agent.prompts.some((prompt) => prompt.includes("子 Flow 消息：通过")),
		).toBe(true);
		expect(commands.requests.map((request) => request.command)).toEqual([
			"node",
			"node",
			"node",
			"node",
		]);
		expect(commands.requests.map((request) => request.args?.at(-1))).toEqual([
			"emit",
			"lint",
			"test",
			"merge",
		]);
		expect(commands.requests.map((request) => request.stdin)).toEqual([
			{ message: "发布前验收", project: "Agent 覆盖值" },
			"发布前验收",
			"发布前验收",
			{
				lint: "通过",
				test: "通过",
				command状态: "通过",
			},
		]);

		const snapshot = await store.getRunSnapshot(run.id);
		expect(snapshot?.run.variables).toEqual(run.variables);
		expect(snapshot?.nodeRuns.some((record) => record.childRunId)).toBe(true);
		expect(snapshot?.nodeRuns).toHaveLength(7);
		expect(
			snapshot?.nodeRuns
				.filter((record) => record.actionKind === "执行自定义命令")
				.every((record) => record.commandResult?.status === "success"),
		).toBe(true);
		expect(
			snapshot?.nodeRuns
				.filter((record) => record.actionKind === "执行自定义命令")
				.every(
					(record) =>
						record.commandResult?.stdout.includes('"variables"') &&
						record.commandResult.stderr.length > 0 &&
						!Object.hasOwn(record.outcome ?? {}, "content"),
				),
		).toBe(true);
		expect(
			snapshot?.nodeRuns.find((record) => record.nodeRef === "lint")?.outcome
				?.variables,
		).toEqual({ lint状态: "通过" });
		expect(
			snapshot?.nodeRuns.find((record) => record.nodeRef === "test")?.outcome
				?.variables,
		).toEqual({ test状态: "通过" });
		expect(
			snapshot?.nodeRuns.find((record) => record.nodeRef === "finishCheck")
				?.input,
		).toEqual({ 子结果: "通过" });
		expect(snapshot?.parallelRounds.at(-1)?.status).toBe("completed");
		const children = await store.listChildRuns(run.id);
		expect(children).toHaveLength(1);
		expect(children[0]?.variables).toEqual({
			子任务: "测试和静态检查均已通过",
			父侧变量: "Agent 覆盖值",
		});
		expect(children[0]?.variables).not.toHaveProperty("任务");
		const restored = new JsonFileRunStore(file);
		const restoredSnapshot = await restored.getRunSnapshot(run.id);
		expect(restoredSnapshot?.run.variables).toEqual(run.variables);
		expect(restoredSnapshot?.nodeRuns).toHaveLength(7);
		expect(await restored.listChildRuns(run.id)).toHaveLength(1);
	});
});
