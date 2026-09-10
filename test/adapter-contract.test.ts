import { describe, expect, it } from "vitest";
import { AgentRunModel } from "../src/runtime.ts";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	NodeSession,
	UnifiedMessage,
} from "../src/types.ts";

describe("AgentRunModel adapter contract", () => {
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
					content: "x",
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
					content: "done",
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
