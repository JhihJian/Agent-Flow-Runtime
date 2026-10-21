import { createHash } from "node:crypto";
import {
	type AgentSession,
	type CreateAgentSessionOptions,
	createAgentSession,
	DefaultResourceLoader,
	defineTool,
	getAgentDir,
	type SessionEntry,
	SessionManager,
	type ToolDefinition,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { normalizeAgentCapabilities } from "../contracts/agent-capabilities.ts";
import type {
	AgentAssemblyIdentity,
	AgentCapabilityDeclaration,
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	AgentProfileReference,
	FlowValue,
	FlowVariables,
	NodeSession,
	OutcomeOption,
	UnifiedMessage,
} from "../contracts/types.ts";
import type { FlowRuntime } from "../observability/index.ts";

interface PendingSdkNode {
	nodeExecutionReference: string;
	submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	outcomes: OutcomeOption[];
	startEntryId?: string;
	submitted: boolean;
}

interface SdkHandle {
	connection: AgentConnection;
	session: AgentSession;
	manager: SessionManager;
	capabilities: AgentCapabilityDeclaration;
	pending?: PendingSdkNode;
}

interface PendingCliNode extends PendingSdkNode {
	resolve: (session: NodeSession) => void;
	reject: (error: Error) => void;
	prompt: string;
	retryCount: number;
	endEntryId?: string;
	candidate?: {
		outcome: string;
		variables?: FlowVariables;
	};
}

// 网关（LiteLLM→GLM 上游）无法解析 TypeBox Type.Cyclic 生成的嵌套 $defs/$ref 工具参数，
// 会报 All available accounts exhausted。这里用一层扁平联合代替递归引用；
// 变量值的完整递归校验由运行时 validateJsonValue 负责。
const flowValueSchema = Type.Union([
	Type.String(),
	Type.Number(),
	Type.Boolean(),
	Type.Null(),
	Type.Array(Type.Unknown()),
	Type.Record(Type.String(), Type.Unknown()),
]);

function flowOutcomeParametersSchema() {
	return Type.Object(
		{
			outcome: Type.String({
				description: "One result name allowed by the current Flow node",
			}),
			variables: Type.Optional(Type.Record(Type.String(), flowValueSchema)),
		},
		{ additionalProperties: false },
	);
}

function validateVariableName(name: unknown): asserts name is string {
	if (
		typeof name !== "string" ||
		!/^[\p{Script=Han}a-zA-Z0-9_-]+$/u.test(name) ||
		["__proto__", "prototype", "constructor"].includes(name)
	)
		throw new Error(`非法 Flow 变量名: ${String(name)}`);
}

function validateJsonValue(
	value: unknown,
	ancestors = new Set<object>(),
): asserts value is FlowValue {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "boolean" ||
		(typeof value === "number" && Number.isFinite(value))
	)
		return;
	if (
		typeof value !== "object" ||
		ancestors.has(value) ||
		(!Array.isArray(value) &&
			Object.getPrototypeOf(value) !== Object.prototype &&
			Object.getPrototypeOf(value) !== null)
	)
		throw new Error("Flow 变量值必须是 JSON 值");
	ancestors.add(value);
	const keys = Reflect.ownKeys(value);
	if (Array.isArray(value) && keys.length !== value.length + 1)
		throw new Error("Flow 变量值必须是 JSON 值");
	for (const key of keys) {
		if (Array.isArray(value) && key === "length") continue;
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		if (
			typeof key !== "string" ||
			!descriptor?.enumerable ||
			!("value" in descriptor) ||
			(Array.isArray(value) &&
				(!/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= value.length))
		)
			throw new Error("Flow 变量值必须是 JSON 值");
		validateJsonValue(descriptor.value, ancestors);
	}
	ancestors.delete(value);
}

function submissionVariables(
	variables?: FlowVariables,
): FlowVariables | undefined {
	if (variables !== undefined) {
		if (
			variables === null ||
			typeof variables !== "object" ||
			Array.isArray(variables)
		)
			throw new Error("Flow variables 必须是 JSON 字典");
		validateJsonValue(variables);
		for (const name of Object.keys(variables)) validateVariableName(name);
	}
	return variables === undefined ? undefined : structuredClone(variables);
}

const MAX_MISSING_OUTCOME_RETRIES = 1;

function missingOutcomeRetryPrompt(prompt: string): string {
	return `${prompt}\n\n本节点上一轮执行结束时没有调用 submit_flow_outcome。请重新完成本节点工作，并在最后调用 submit_flow_outcome exactly once，提供有效的 outcome，并通过可选 variables 提交已声明的全局变量或当前结果的下一跳变量。`;
}

export interface PiCliBridge {
	sendNodePrompt(prompt: string): void;
	createNewSession(): Promise<void>;
	getSessionReference(): string;
	getLeafEntryId(): string | undefined;
	getMessages(
		startEntryId: string | undefined,
		endEntryId: string | undefined,
	): UnifiedMessage[];
}

export interface PiAgentAdapterOptions {
	cwd?: string;
	sessionDir?: string;
	cliBridge?: PiCliBridge;
	profilePlugins?: readonly PiAgentProfilePlugin[];
}

export interface PiAgentProfilePlugin {
	pluginId: string;
	pluginVersion: string;
	pluginDigest: string;
	profiles: readonly PiAgentProfileDefinition[];
}

export interface PiAgentProfileDefinition {
	id: string;
	resolve(request: {
		params: Record<string, FlowValue>;
		cwd: string;
	}): Promise<PiAgentProfileContribution> | PiAgentProfileContribution;
}

export interface PiAgentProfileContribution {
	/** Effective business tool names. Must be a subset of the Flow allowlist. */
	tools?: readonly string[];
	/** Optional custom tool implementations for names in tools. */
	customTools?: readonly ToolDefinition[];
	/** Inline Skill definitions made available to this session. */
	skills?: readonly import("@earendil-works/pi-coding-agent").Skill[];
	/** Effective Skill names. Must be a subset of the Flow allowlist. */
	skillNames?: readonly string[];
	/** Additional Skill directories controlled by the trusted plugin. */
	additionalSkillPaths?: readonly string[];
	systemPrompt?: string;
	model?: CreateAgentSessionOptions["model"];
	thinkingLevel?: CreateAgentSessionOptions["thinkingLevel"];
}

/** Pi SDK and current-CLI implementation of the runtime adapter boundary. */
export class PiAgentIntegrationAdapter implements AgentIntegrationAdapter {
	private readonly handles = new Map<string, SdkHandle>();
	private readonly sessionHandles = new Map<string, SdkHandle>();
	private pendingCli?: PendingCliNode;
	private readonly options: PiAgentAdapterOptions;

	constructor(options: PiAgentAdapterOptions = {}) {
		this.options = options;
	}

	async createAgent(request: {
		runId: string;
		cwd?: string;
		capabilities: AgentCapabilityDeclaration;
		profile?: AgentProfileReference;
	}): Promise<AgentConnection> {
		if (this.options.cliBridge)
			throw new Error(
				"Pi CLI 当前无法隔离 Flow Agent 的工具和 Skill 能力，已拒绝启动",
			);
		return this.createSdkConnection(
			request.runId,
			request.cwd,
			request.capabilities,
			request.profile,
		);
	}

	async takeOverAgent(request: {
		runId: string;
		agentReference: string;
		cwd?: string;
		capabilities: AgentCapabilityDeclaration;
		expectedAssembly?: AgentAssemblyIdentity;
		expectedProfile?: AgentProfileReference;
	}): Promise<AgentConnection> {
		if (this.options.cliBridge)
			throw new Error(
				"Pi CLI 当前无法隔离 Flow Agent 的工具和 Skill 能力，已拒绝接管",
			);
		const active = this.sessionHandles.get(request.agentReference);
		const capabilities = normalizeAgentCapabilities(request.capabilities);
		if (active) {
			if (!sameCapabilities(active.capabilities, capabilities))
				throw new Error(
					`Pi Agent 会话能力与当前 Flow 不匹配: ${request.agentReference}`,
				);
			assertAssemblyIdentity(
				active.connection.assembly,
				request.expectedAssembly,
			);
			return active.connection;
		}
		const manager = SessionManager.open(request.agentReference);
		const { session, assembly } = await this.createSdkSession({
			cwd: request.cwd ?? manager.getCwd(),
			sessionManager: manager,
			capabilities,
			profile: request.expectedProfile,
		});
		const connection = {
			id: `${request.runId}:agent`,
			platformReference: request.agentReference,
			sessionReference: session.sessionFile,
			assembly,
		};
		const handle = { connection, session, manager, capabilities };
		this.handles.set(connection.id, handle);
		if (connection.sessionReference)
			this.sessionHandles.set(connection.sessionReference, handle);
		return connection;
	}

	async executeNode(request: {
		connection: AgentConnection;
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		if (this.options.cliBridge) return this.executeCliNode(request);
		const handle = this.handles.get(request.connection.id);
		if (!handle)
			throw new Error(`Pi Agent 连接不存在: ${request.connection.id}`);
		if (handle.pending)
			throw new Error("同一 Pi 会话不能并行执行多个 Flow 节点");
		const pending: PendingSdkNode = {
			nodeExecutionReference: request.nodeExecutionReference,
			submitOutcome: request.submitOutcome,
			outcomes: request.outcomes,
			startEntryId: handle.manager.getLeafId() ?? undefined,
			submitted: false,
		};
		handle.pending = pending;
		try {
			let prompt = request.prompt;
			for (let attempt = 0; ; attempt += 1) {
				await handle.session.prompt(prompt);
				if (pending.submitted) break;
				if (attempt >= MAX_MISSING_OUTCOME_RETRIES)
					throw new Error("Pi Agent 重试后仍没有调用 submit_flow_outcome");
				prompt = missingOutcomeRetryPrompt(request.prompt);
			}
			const endEntryId = handle.manager.getLeafId() ?? undefined;
			const sessionReference =
				handle.session.sessionFile ?? handle.manager.getSessionFile();
			if (sessionReference) this.sessionHandles.set(sessionReference, handle);
			return nodeSession(sessionReference, pending.startEntryId, endEntryId);
		} finally {
			handle.pending = undefined;
		}
	}

	async getNodeSession(session: NodeSession): Promise<UnifiedMessage[]> {
		if (this.options.cliBridge) {
			const [start, end] = parseInteractionReference(
				session.interactionReference,
			);
			return this.options.cliBridge.getMessages(start, end);
		}
		const handle = session.sessionReference
			? this.sessionHandles.get(session.sessionReference)
			: undefined;
		if (!handle) return [];
		const [start, end] = parseInteractionReference(
			session.interactionReference,
		);
		return messagesFromEntries(handle.manager.getEntries(), start, end);
	}

	async releaseAgent(connection: AgentConnection): Promise<void> {
		if (this.options.cliBridge) return;
		const handle = this.handles.get(connection.id);
		if (!handle) return;
		this.handles.delete(connection.id);
		if (handle.connection.sessionReference)
			this.sessionHandles.delete(handle.connection.sessionReference);
		handle.session.dispose();
	}

	/** Called by the Pi extension tool. It only records the candidate until turn_end. */
	async submitCliOutcome(
		outcome: string,
		variables?: FlowVariables,
	): Promise<void> {
		const pending = this.pendingCli;
		if (!pending) throw new Error("当前没有等待结果的 Flow 节点");
		if (pending.submitted || pending.candidate)
			throw new Error("当前 Flow 节点已经提交结果");
		if (!pending.outcomes.some((option) => option.name === outcome))
			throw new Error(`当前节点不允许结果: ${outcome}`);
		pending.candidate = {
			outcome,
			variables: submissionVariables(variables),
		};
	}

	/** Flow 结果候选待确认时，禁止 Pi 在当前 turn 后压缩上下文。 */
	hasPendingCliOutcome(): boolean {
		return Boolean(this.pendingCli?.candidate && !this.pendingCli.submitted);
	}

	/** Called by agent_settled after Pi has finished compacting and draining queued work. */
	async finalizeCliTurn(): Promise<void> {
		const pending = this.pendingCli;
		if (!pending || pending.submitted) return;
		if (!pending.candidate) {
			if (pending.retryCount < MAX_MISSING_OUTCOME_RETRIES) {
				pending.retryCount += 1;
				this.options.cliBridge?.sendNodePrompt(
					missingOutcomeRetryPrompt(pending.prompt),
				);
				return;
			}
			pending.reject(
				new Error("Pi Agent 重试后仍没有调用 submit_flow_outcome"),
			);
			this.pendingCli = undefined;
			return;
		}
		try {
			pending.endEntryId = this.options.cliBridge?.getLeafEntryId();
			await pending.submitOutcome({
				nodeExecutionReference: pending.nodeExecutionReference,
				result: pending.candidate.outcome,
				variables: submissionVariables(pending.candidate.variables),
				sessionReference: this.options.cliBridge?.getSessionReference(),
				interactionReference: interactionReference(
					pending.startEntryId,
					pending.endEntryId,
				),
			});
			pending.submitted = true;
			pending.resolve(
				nodeSession(
					this.options.cliBridge?.getSessionReference(),
					pending.startEntryId,
					pending.endEntryId,
				),
			);
		} catch (error) {
			pending.reject(error instanceof Error ? error : new Error(String(error)));
		} finally {
			this.pendingCli = undefined;
		}
	}

	private async createSdkConnection(
		runId: string,
		cwd?: string,
		capabilities: AgentCapabilityDeclaration = normalizeAgentCapabilities(),
		profile?: AgentProfileReference,
	): Promise<AgentConnection> {
		const manager = SessionManager.create(
			cwd ?? this.options.cwd ?? process.cwd(),
			this.options.sessionDir,
		);
		const normalizedCapabilities = normalizeAgentCapabilities(capabilities);
		const { session, assembly } = await this.createSdkSession({
			cwd: cwd ?? this.options.cwd,
			sessionManager: manager,
			capabilities: normalizedCapabilities,
			profile,
		});
		const connection = {
			id: `${runId}:agent`,
			platformReference: session.sessionId,
			sessionReference: session.sessionFile,
			assembly,
		};
		const handle = {
			connection,
			session,
			manager,
			capabilities: normalizedCapabilities,
		};
		this.handles.set(connection.id, handle);
		if (connection.sessionReference)
			this.sessionHandles.set(connection.sessionReference, handle);
		return connection;
	}

	private async createSdkSession(request: {
		cwd?: string;
		sessionManager: SessionManager;
		capabilities: AgentCapabilityDeclaration;
		profile?: AgentProfileReference;
	}): Promise<{ session: AgentSession; assembly?: AgentAssemblyIdentity }> {
		const capabilities = normalizeAgentCapabilities(request.capabilities);
		const resolved = await this.resolveProfile(
			request.profile,
			capabilities,
			request.cwd ?? this.options.cwd ?? process.cwd(),
		);
		const effectiveCapabilities = resolved?.capabilities ?? capabilities;
		const profileSystemPrompt = resolved?.contribution.systemPrompt;
		let discoveredSkills: string[] = [];
		const resourceLoader = new DefaultResourceLoader({
			cwd: request.cwd ?? this.options.cwd ?? process.cwd(),
			agentDir: getAgentDir(),
			additionalSkillPaths: resolved?.contribution.additionalSkillPaths
				? [...resolved.contribution.additionalSkillPaths]
				: undefined,
			noExtensions: true,
			noContextFiles: true,
			noPromptTemplates: true,
			noThemes: true,
			skillsOverride: (current) => {
				const skills = [
					...current.skills,
					...(resolved?.contribution.skills ?? []),
				];
				assertUnique(
					skills.map((skill) => skill.name),
					"Pi Skill",
				);
				discoveredSkills = skills.map((skill) => skill.name);
				return {
					...current,
					skills: skills.filter((skill) =>
						effectiveCapabilities.skills.includes(skill.name),
					),
				};
			},
			...(profileSystemPrompt
				? {
						appendSystemPromptOverride: (base: string[]) => [
							...base,
							profileSystemPrompt,
						],
					}
				: {}),
		});
		await resourceLoader.reload();
		const missingSkills = effectiveCapabilities.skills.filter(
			(name) => !discoveredSkills.includes(name),
		);
		if (missingSkills.length > 0)
			throw new Error(`Pi 宿主未提供声明的 Skill: ${missingSkills.join(", ")}`);
		const result = await createAgentSession({
			cwd: request.cwd,
			sessionManager: request.sessionManager,
			resourceLoader,
			tools: [...effectiveCapabilities.tools, "submit_flow_outcome"],
			customTools: [
				...(resolved?.contribution.customTools ?? []),
				this.flowOutcomeTool(),
			],
			...(resolved?.contribution.model
				? { model: resolved.contribution.model }
				: {}),
			...(resolved?.contribution.thinkingLevel
				? { thinkingLevel: resolved.contribution.thinkingLevel }
				: {}),
		});
		const availableTools = result.session.agent.state.tools.map(
			(tool) => tool.name,
		);
		const missingTools = effectiveCapabilities.tools.filter(
			(name) => !availableTools.includes(name),
		);
		if (missingTools.length > 0) {
			result.session.dispose();
			throw new Error(`Pi 宿主未提供声明的工具: ${missingTools.join(", ")}`);
		}
		return { session: result.session, assembly: resolved?.assembly };
	}

	private async resolveProfile(
		profile: AgentProfileReference | undefined,
		flowCapabilities: AgentCapabilityDeclaration,
		cwd: string,
	): Promise<
		| {
				contribution: PiAgentProfileContribution;
				capabilities: AgentCapabilityDeclaration;
				assembly: AgentAssemblyIdentity;
		  }
		| undefined
	> {
		if (!profile) return undefined;
		const matches = (this.options.profilePlugins ?? []).flatMap((plugin) =>
			plugin.profiles
				.filter((definition) => definition.id === profile.id)
				.map((definition) => ({ plugin, definition })),
		);
		if (matches.length === 0)
			throw new Error(`Pi 宿主未提供声明的 Agent Profile: ${profile.id}`);
		if (matches.length > 1)
			throw new Error(`Agent Profile 标识重复: ${profile.id}`);
		const { plugin, definition } = matches[0];
		const contribution = await definition.resolve({
			params: profile.params ?? {},
			cwd,
		});
		const tools = [...(contribution.tools ?? flowCapabilities.tools)];
		const skills = [...(contribution.skillNames ?? flowCapabilities.skills)];
		assertSubset(tools, flowCapabilities.tools, `工具 (${profile.id})`);
		assertSubset(skills, flowCapabilities.skills, `Skill (${profile.id})`);
		const customToolNames = (contribution.customTools ?? []).map(
			(tool) => tool.name,
		);
		assertUnique(customToolNames, "Profile 自定义工具");
		assertSubset(customToolNames, tools, `Profile 自定义工具 (${profile.id})`);
		if (customToolNames.includes("submit_flow_outcome"))
			throw new Error("Profile 不能覆盖协议工具 submit_flow_outcome");
		const inlineSkillNames = (contribution.skills ?? []).map(
			(skill) => skill.name,
		);
		assertUnique(inlineSkillNames, "Profile 内联 Skill");
		const capabilities = { tools, skills };
		return {
			contribution,
			capabilities,
			assembly: {
				hostId: "pi-sdk",
				pluginId: plugin.pluginId,
				pluginVersion: plugin.pluginVersion,
				pluginDigest: plugin.pluginDigest,
				profileId: profile.id,
				paramsDigest: digest(profile.params ?? {}),
				resolvedCapabilityDigest: digest(capabilities),
			},
		};
	}

	private async executeCliNode(request: {
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession> {
		if (this.pendingCli)
			throw new Error("当前 Pi CLI 会话已有正在执行的 Flow 节点");
		const bridge = this.options.cliBridge;
		if (!bridge) throw new Error("Pi CLI bridge 不可用");
		return await new Promise<NodeSession>((resolve, reject) => {
			this.pendingCli = {
				nodeExecutionReference: request.nodeExecutionReference,
				submitOutcome: request.submitOutcome,
				outcomes: request.outcomes,
				prompt: request.prompt,
				retryCount: 0,
				startEntryId: bridge.getLeafEntryId(),
				submitted: false,
				resolve,
				reject,
			};
			bridge.sendNodePrompt(request.prompt);
		});
	}

	private flowOutcomeTool(): ToolDefinition {
		return defineTool({
			name: "submit_flow_outcome",
			label: "Submit Flow Outcome",
			description:
				"Submit the current Flow node result after completing its work.",
			promptSnippet: "Submit the required Flow node outcome",
			promptGuidelines: [
				"Call submit_flow_outcome exactly once as the final action of each Flow node. Use outcome to select a declared result and optional variables to submit declared global or next-hop values.",
			],
			parameters: flowOutcomeParametersSchema(),
			executionMode: "sequential",
			execute: async (_id, params, _signal, _onUpdate, ctx) => {
				const sessionFile = ctx?.sessionManager.getSessionFile();
				await this.submitSdkOutcome(
					params.outcome,
					params.variables as FlowVariables | undefined,
					sessionFile,
				);
				return {
					content: [
						{ type: "text", text: `Flow outcome submitted: ${params.outcome}` },
					],
					details: {
						outcome: params.outcome,
						variables: params.variables,
					},
					terminate: true,
				};
			},
		});
	}

	private async submitSdkOutcome(
		outcome: string,
		variables?: FlowVariables,
		sessionFile?: string,
	): Promise<void> {
		const pending = this.resolvePending(sessionFile);
		if (pending.submitted) throw new Error("当前 Flow 节点已经提交结果");
		if (!pending.outcomes.some((option) => option.name === outcome))
			throw new Error(`当前节点不允许结果: ${outcome}`);
		await pending.submitOutcome({
			nodeExecutionReference: pending.nodeExecutionReference,
			result: outcome,
			variables: submissionVariables(variables),
		});
		pending.submitted = true;
	}

	/** 根据发起提交的 Pi 会话定位等待结果的节点，避免并发 Flow 会话串号。 */
	private resolvePending(sessionFile?: string): PendingSdkNode {
		if (sessionFile) {
			const handle = this.sessionHandles.get(sessionFile);
			if (!handle || !handle.pending)
				throw new Error("当前会话没有等待结果的 Flow 节点");
			return handle.pending;
		}
		const pending = [...this.handles.values()]
			.map((handle) => handle.pending)
			.filter((value) => value !== undefined);
		if (pending.length === 0) throw new Error("当前没有等待结果的 Flow 节点");
		if (pending.length > 1)
			throw new Error("存在多个并发 Flow 节点，无法确定结果归属会话");
		return pending[0];
	}
}

export function createFlowOutcomeTool(
	adapter: Pick<PiAgentIntegrationAdapter, "submitCliOutcome">,
): ToolDefinition {
	return defineTool({
		name: "submit_flow_outcome",
		label: "Submit Flow Outcome",
		description:
			"Submit the current Flow node result after completing its work.",
		promptSnippet: "Submit the required Flow node outcome",
		promptGuidelines: [
			"Call submit_flow_outcome exactly once as the final action of each Flow node. Use outcome to select a declared result and optional variables to submit declared global or next-hop values.",
		],
		parameters: flowOutcomeParametersSchema(),
		executionMode: "sequential",
		execute: async (_id, params) => {
			await adapter.submitCliOutcome(
				params.outcome,
				params.variables as FlowVariables | undefined,
			);
			return {
				content: [
					{ type: "text", text: `Flow outcome submitted: ${params.outcome}` },
				],
				details: {
					outcome: params.outcome,
					variables: params.variables,
				},
				terminate: true,
			};
		},
	});
}

/** Read-only Agent access to the same Runtime history facade as other hosts. */
export function createFlowInspectionTool(
	getRuntime: () => FlowRuntime | undefined,
): ToolDefinition {
	return defineTool({
		name: "inspect_flow_run",
		label: "Inspect Flow Run",
		description: "Read the persisted history of a Flow run by run ID.",
		promptSnippet: "Inspect a Flow run's persisted history",
		promptGuidelines: [
			"Use this to inspect Flow state and history instead of inferring it from prose.",
		],
		parameters: Type.Object({
			runId: Type.String({ description: "Flow Run identifier" }),
		}),
		executionMode: "sequential",
		execute: async (_id, params) => {
			const runtime = getRuntime();
			if (!runtime) throw new Error("Flow 运行查询入口尚未就绪");
			const history = await runtime.inspectRun(params.runId);
			if (!history) throw new Error(`Flow 运行不存在: ${params.runId}`);
			return {
				content: [{ type: "text", text: JSON.stringify(history) }],
				details: history,
			};
		},
	});
}

function nodeSession(
	sessionReference: string | undefined,
	start: string | undefined,
	end: string | undefined,
): NodeSession {
	return {
		id: `${sessionReference ?? "pi"}:${end ?? "pending"}`,
		sessionReference,
		interactionReference: interactionReference(start, end),
	};
}

function interactionReference(
	start: string | undefined,
	end: string | undefined,
): string | undefined {
	return start || end ? `${start ?? ""}:${end ?? ""}` : undefined;
}

function parseInteractionReference(
	reference: string | undefined,
): [string | undefined, string | undefined] {
	if (!reference) return [undefined, undefined];
	const separator = reference.indexOf(":");
	if (separator === -1) return [undefined, undefined];
	return [
		reference.slice(0, separator) || undefined,
		reference.slice(separator + 1) || undefined,
	];
}

function messagesFromEntries(
	entries: SessionEntry[],
	start?: string,
	end?: string,
): UnifiedMessage[] {
	const startIndex = start
		? entries.findIndex((entry) => entry.id === start) + 1
		: 0;
	const endIndex = end
		? entries.findIndex((entry) => entry.id === end)
		: entries.length - 1;
	if (endIndex < startIndex - 1) return [];
	return entries.slice(startIndex, endIndex + 1).flatMap((entry) => {
		if (entry.type !== "message") return [];
		const message = entry.message as unknown as {
			role?: unknown;
			content?: unknown;
		};
		const role = normalizeRole(message.role);
		if (!role) return [];
		return [
			{
				id: entry.id,
				role,
				content: message.content as UnifiedMessage["content"],
			},
		];
	});
}

function sameCapabilities(
	left: AgentCapabilityDeclaration,
	right: AgentCapabilityDeclaration,
): boolean {
	return (
		left.tools.length === right.tools.length &&
		left.skills.length === right.skills.length &&
		left.tools.every((name, index) => name === right.tools[index]) &&
		left.skills.every((name, index) => name === right.skills[index])
	);
}

function assertAssemblyIdentity(
	actual: AgentAssemblyIdentity | undefined,
	expected: AgentAssemblyIdentity | undefined,
): void {
	if (!expected) return;
	if (!actual || digest(actual) !== digest(expected))
		throw new Error("Pi Agent 会话的 Profile 装配身份不匹配");
}

function assertSubset(
	values: readonly string[],
	allowed: readonly string[],
	description: string,
): void {
	assertUnique(values, description);
	const missing = values.filter((value) => !allowed.includes(value));
	if (missing.length > 0)
		throw new Error(
			`Agent Profile 超出 Flow 声明的${description}: ${missing.join(", ")}`,
		);
}

function assertUnique(values: readonly string[], description: string): void {
	const duplicates = values.filter(
		(value, index) => values.indexOf(value) !== index,
	);
	if (duplicates.length > 0)
		throw new Error(
			`${description}存在重复名称: ${[...new Set(duplicates)].join(", ")}`,
		);
}

function digest(value: unknown): string {
	return createHash("sha256").update(stableJson(value)).digest("hex");
}

function stableJson(value: unknown): string {
	if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
	if (value && typeof value === "object") {
		return `{${Object.entries(value as Record<string, unknown>)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`)
			.join(",")}}`;
	}
	return JSON.stringify(value);
}

function normalizeRole(role: unknown): UnifiedMessage["role"] | undefined {
	if (role === "user" || role === "assistant") return role;
	if (role === "toolResult") return "tool";
	return undefined;
}
