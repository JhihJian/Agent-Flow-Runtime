import { normalizeAgentCapabilities } from "../contracts/agent-capabilities.ts";
import type {
	AgentAssemblyIdentity,
	AgentCapabilityDeclaration,
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	AgentProfileReference,
	NodeOutcome,
	NodeSession,
	OutcomeOption,
} from "../contracts/types.ts";

/**
 * Run-scoped Agent binding and node execution orchestration.
 *
 * This module deliberately knows nothing about Pi, tools, Skills, or host
 * implementations. It only fixes the declared capabilities at session creation.
 */
function assertAssembly(
	actual: AgentAssemblyIdentity | undefined,
	expected: AgentAssemblyIdentity | undefined,
): void {
	if (!expected) return;
	if (!actual) throw new Error("Agent 接管未返回可验证的 Profile 装配身份");
	if (JSON.stringify(actual) !== JSON.stringify(expected))
		throw new Error("Agent 接管的 Profile 装配身份不匹配");
}

export class AgentRunModel {
	private readonly bindings = new Map<
		string,
		{ connection: AgentConnection; capabilities: AgentCapabilityDeclaration }
	>();
	private readonly adapter: AgentIntegrationAdapter;

	constructor(adapter: AgentIntegrationAdapter) {
		this.adapter = adapter;
	}

	async start(
		runId: string,
		capabilities: AgentCapabilityDeclaration,
		existingAgentReference?: string,
		cwd?: string,
		expectedAssembly?: AgentAssemblyIdentity,
		expectedProfile?: AgentProfileReference,
	): Promise<void> {
		if (existingAgentReference) {
			if (
				[...this.bindings.values()].some(
					(binding) =>
						binding.connection.platformReference === existingAgentReference,
				)
			) {
				throw new Error(
					`Agent 已绑定到另一个 Flow 运行: ${existingAgentReference}`,
				);
			}
			const connection = await this.adapter.takeOverAgent({
				runId,
				agentReference: existingAgentReference,
				cwd,
				capabilities,
				expectedAssembly,
				expectedProfile,
			});
			assertAssembly(connection.assembly, expectedAssembly);
			this.bindings.set(runId, { connection, capabilities });
		}
	}

	async executeNode(request: {
		runId: string;
		action: "新建Agent" | "复用Agent";
		nodeExecutionReference: string;
		capabilities?: AgentCapabilityDeclaration;
		profile?: AgentProfileReference;
		prompt: string;
		outcomes: OutcomeOption[];
		cwd?: string;
		onConnection?: (connection: AgentConnection) => Promise<void>;
	}): Promise<{ outcome: NodeOutcome; session: NodeSession }> {
		let binding = this.bindings.get(request.runId);
		if (request.action === "新建Agent") {
			if (binding) await this.adapter.releaseAgent(binding.connection);
			const capabilities = normalizeAgentCapabilities(request.capabilities);
			const connection = await this.adapter.createAgent({
				runId: request.runId,
				cwd: request.cwd,
				capabilities,
				profile: request.profile,
			});
			if (request.profile && !connection.assembly) {
				await this.adapter.releaseAgent(connection);
				throw new Error(`Agent Profile 未返回装配身份: ${request.profile.id}`);
			}
			binding = { connection, capabilities };
			this.bindings.set(request.runId, binding);
		} else if (!binding) {
			throw new Error("复用Agent前必须先新建或接管 Agent");
		}
		const connection = binding.connection;
		await request.onConnection?.(connection);
		let accepted: NodeOutcome | undefined;
		let sessionReference: string | undefined;
		let interactionReference: string | undefined;
		const session = await this.adapter.executeNode({
			connection,
			nodeExecutionReference: request.nodeExecutionReference,
			prompt: request.prompt,
			outcomes: request.outcomes,
			submitOutcome: async (submission: AgentOutcomeSubmission) => {
				if (accepted) throw new Error("一个 Agent 节点只能提交一次结果");
				if (
					submission.nodeExecutionReference !== request.nodeExecutionReference
				)
					throw new Error("节点执行引用不匹配");
				if (
					!request.outcomes.some(
						(outcome) => outcome.name === submission.result,
					)
				)
					throw new Error(`节点不允许结果: ${submission.result}`);
				accepted = {
					result: submission.result,
					variables: submission.variables,
				};
				sessionReference = submission.sessionReference;
				interactionReference = submission.interactionReference;
			},
		});
		if (!accepted)
			throw new Error("Agent 节点结束前必须通过结果提交工具提交结果");
		return {
			outcome: accepted,
			session: {
				...session,
				sessionReference: sessionReference ?? session.sessionReference,
				interactionReference:
					interactionReference ?? session.interactionReference,
			},
		};
	}

	async getNodeSession(session: NodeSession) {
		return this.adapter.getNodeSession(session);
	}

	async end(runId: string): Promise<void> {
		const connection = this.bindings.get(runId);
		if (!connection) return;
		this.bindings.delete(runId);
		await this.adapter.releaseAgent(connection.connection);
	}
}
