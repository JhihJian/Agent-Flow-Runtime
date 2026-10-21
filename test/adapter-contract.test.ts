import { describe, expect, it } from "vitest";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	NodeSession,
	UnifiedMessage,
} from "../src/contracts/types.ts";
import { AgentRunModel } from "../src/execution/runtime.ts";

describe("AgentRunModel adapter contract", () => {
	it("forwards the Flow capability declaration only when creating an Agent", async () => {
		let createdCapabilities: unknown;
		const adapter: AgentIntegrationAdapter = {
			async createAgent(request) {
				createdCapabilities = request.capabilities;
				return { id: "agent", platformReference: "agent" };
			},
			async takeOverAgent() {
				throw new Error("not used");
			},
			async executeNode(request) {
				await request.submitOutcome({
					nodeExecutionReference: request.nodeExecutionReference,
					result: "合法",
				});
				return { id: "node" };
			},
			async getNodeSession() {
				return [];
			},
			async releaseAgent() {},
		};
		const model = new AgentRunModel(adapter);
		const capabilities = { tools: ["read"], skills: ["code-review"] };

		await model.executeNode({
			runId: "run",
			action: "新建Agent",
			nodeExecutionReference: "node",
			capabilities,
			prompt: "work",
			outcomes: [{ name: "合法", description: "ok" }],
		});

		expect(createdCapabilities).toEqual(capabilities);
	});

	it("forwards Profile selection and requires a verifiable assembly identity", async () => {
		let createdProfile: unknown;
		const adapter: AgentIntegrationAdapter = {
			async createAgent(request) {
				createdProfile = request.profile;
				return {
					id: "agent",
					platformReference: "agent",
					assembly: {
						hostId: "test",
						pluginId: "review",
						pluginVersion: "1",
						pluginDigest: "digest",
						profileId: "reviewer",
						paramsDigest: "params",
						resolvedCapabilityDigest: "capabilities",
					},
				};
			},
			async takeOverAgent() {
				throw new Error("not used");
			},
			async executeNode(request) {
				await request.submitOutcome({
					nodeExecutionReference: request.nodeExecutionReference,
					result: "合法",
				});
				return { id: "node" };
			},
			async getNodeSession() {
				return [];
			},
			async releaseAgent() {},
		};
		const model = new AgentRunModel(adapter);
		await model.executeNode({
			runId: "run",
			action: "新建Agent",
			nodeExecutionReference: "node",
			capabilities: { tools: [], skills: [] },
			profile: { id: "reviewer", params: { focus: "security" } },
			prompt: "work",
			outcomes: [{ name: "合法", description: "ok" }],
		});
		expect(createdProfile).toEqual({
			id: "reviewer",
			params: { focus: "security" },
		});
	});

	it("does not change capabilities when reusing an Agent", async () => {
		const created: unknown[] = [];
		const adapter: AgentIntegrationAdapter = {
			async createAgent(request) {
				created.push(request.capabilities);
				return { id: "agent", platformReference: "agent" };
			},
			async takeOverAgent() {
				throw new Error("not used");
			},
			async executeNode(request) {
				await request.submitOutcome({
					nodeExecutionReference: request.nodeExecutionReference,
					result: "合法",
				});
				return { id: "node" };
			},
			async getNodeSession() {
				return [];
			},
			async releaseAgent() {},
		};
		const model = new AgentRunModel(adapter);
		await model.executeNode({
			runId: "run",
			action: "新建Agent",
			nodeExecutionReference: "first",
			capabilities: { tools: ["read"], skills: [] },
			prompt: "work",
			outcomes: [{ name: "合法", description: "ok" }],
		});
		await model.executeNode({
			runId: "run",
			action: "复用Agent",
			nodeExecutionReference: "second",
			capabilities: { tools: ["bash"], skills: ["other"] },
			prompt: "work",
			outcomes: [{ name: "合法", description: "ok" }],
		});
		expect(created).toEqual([{ tools: ["read"], skills: [] }]);
	});

	it("rejects a result that is not declared by the current node", async () => {
		const adapter: AgentIntegrationAdapter = {
			async createAgent() {
				return { id: "agent", platformReference: "agent" };
			},
			async takeOverAgent() {
				throw new Error("not used");
			},
			async executeNode(request) {
				await request.submitOutcome({
					nodeExecutionReference: request.nodeExecutionReference,
					result: "非法结果",
					variables: { 证据: "x" },
				});
				return { id: "node" };
			},
			async getNodeSession(_session: NodeSession): Promise<UnifiedMessage[]> {
				return [];
			},
			async releaseAgent(_connection: AgentConnection) {},
		};
		const model = new AgentRunModel(adapter);
		await expect(
			model.executeNode({
				runId: "run",
				action: "新建Agent",
				nodeExecutionReference: "node",
				prompt: "work",
				outcomes: [{ name: "合法", description: "ok" }],
			}),
		).rejects.toThrow("节点不允许结果");
	});

	it("keeps the adapter interaction reference available for lookup", async () => {
		const messages: UnifiedMessage[] = [
			{ id: "entry", role: "assistant", content: "evidence" },
		];
		const adapter: AgentIntegrationAdapter = {
			async createAgent() {
				return { id: "agent", platformReference: "agent" };
			},
			async takeOverAgent() {
				throw new Error("not used");
			},
			async executeNode(request) {
				await request.submitOutcome({
					nodeExecutionReference: request.nodeExecutionReference,
					result: "合法",
					variables: { 证据: "done" },
					interactionReference: "entry",
				});
				return { id: "session", interactionReference: "entry" };
			},
			async getNodeSession(_session) {
				return messages;
			},
			async releaseAgent(_connection: AgentConnection) {},
		};
		const model = new AgentRunModel(adapter);
		const executed = await model.executeNode({
			runId: "run",
			action: "新建Agent",
			nodeExecutionReference: "node",
			prompt: "work",
			outcomes: [{ name: "合法", description: "ok" }],
		});
		expect(executed.session.interactionReference).toBe("entry");
		expect(await model.getNodeSession(executed.session)).toEqual(messages);
	});
});
