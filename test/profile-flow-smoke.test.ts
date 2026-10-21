import { describe, expect, it } from "vitest";
import { parseFlow } from "../src/parser.ts";
import {
	AgentRunModel,
	FlowCoordinator,
	InMemoryRunStore,
} from "../src/runtime.ts";
import type {
	AgentCapabilityDeclaration,
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	AgentProfileReference,
	NodeSession,
	OutcomeOption,
	UnifiedMessage,
} from "../src/types.ts";

const smokeFlow = `---
name: Profile 冒烟流程
description: 验证 Profile 选择能够贯通一次真实 Flow 运行。
capabilities:
  tools: [read]
  skills: []
variables:
  任务:
    description: 本次验证任务
---

\`\`\`mermaid
flowchart TD
  start((开始)) --> analyze[分析]
  analyze -->|已完成| finish((结束))
\`\`\`

## 分析
\`\`\`新建Agent
{"profile":"reviewer","params":{"focus":"{var.任务}"},"prompt":"请完成 Profile 冒烟验证。"}
\`\`\`
### 已完成
Agent 已完成 Profile 冒烟验证。
`;

class ProfileSmokeAgent implements AgentIntegrationAdapter {
	profile?: unknown;
	capabilities?: unknown;

	async createAgent(request: {
		runId: string;
		capabilities: AgentCapabilityDeclaration;
		profile?: AgentProfileReference;
	}): Promise<AgentConnection> {
		this.capabilities = request.capabilities;
		this.profile = request.profile;
		return {
			id: `${request.runId}:agent`,
			platformReference: `${request.runId}:profile-reviewer`,
			assembly: {
				hostId: "profile-smoke",
				pluginId: "smoke-plugin",
				pluginVersion: "1.0.0",
				pluginDigest: "smoke-digest",
				profileId: request.profile?.id ?? "",
				paramsDigest: "smoke-params",
				resolvedCapabilityDigest: "smoke-capabilities",
			},
		};
	}

	async takeOverAgent(): Promise<AgentConnection> {
		throw new Error("smoke test does not take over a session");
	}

	async executeNode(request: {
		connection: AgentConnection;
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		if (!request.prompt.includes("Profile 冒烟验证"))
			throw new Error("Profile prompt was not rendered");
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

describe("Profile Flow smoke", () => {
	it("runs a structured Profile action through parsing, Runtime routing and persistence", async () => {
		const flow = parseFlow(smokeFlow, "profile-smoke");
		const store = new InMemoryRunStore();
		const agent = new ProfileSmokeAgent();
		const run = await new FlowCoordinator(
			flow,
			store,
			new AgentRunModel(agent),
		).run({ variables: { 任务: "Profile 冒烟验证" } });

		expect(run.status).toBe("completed");
		expect(agent.capabilities).toEqual({ tools: ["read"], skills: [] });
		expect(agent.profile).toEqual({
			id: "reviewer",
			params: { focus: "Profile 冒烟验证" },
		});
		expect(run.agentProfile).toEqual(agent.profile);
		expect(run.agentAssembly).toMatchObject({
			hostId: "profile-smoke",
			pluginId: "smoke-plugin",
			profileId: "reviewer",
		});

		const snapshot = await store.getRunSnapshot(run.id);
		expect(snapshot?.run.status).toBe("completed");
		expect(snapshot?.nodeRuns).toHaveLength(1);
		expect(snapshot?.nodeRuns[0].agentAssembly).toEqual(run.agentAssembly);
		expect(snapshot?.nodeRuns[0].outcome).toEqual({ result: "已完成" });
	});
});
