import {
	type AgentSession,
	createAgentSession,
	defineTool,
	type SessionEntry,
	SessionManager,
	type ToolDefinition,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	AgentOutcomeSubmission,
	NodeSession,
	OutcomeOption,
	UnifiedMessage,
} from "./types.ts";

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
	pending?: PendingSdkNode;
}

interface PendingCliNode extends PendingSdkNode {
	resolve: (session: NodeSession) => void;
	reject: (error: Error) => void;
	endEntryId?: string;
	candidate?: { outcome: string; content: string };
}

export interface PiCliBridge {
	sendNodePrompt(prompt: string): void;
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
}

/** Pi SDK and current-CLI implementation of the runtime adapter boundary. */
export class PiAgentIntegrationAdapter implements AgentIntegrationAdapter {
	private readonly handles = new Map<string, SdkHandle>();
	private readonly sessionHandles = new Map<string, SdkHandle>();
	private pendingCli?: PendingCliNode;
	private cliConnection?: AgentConnection;
	private readonly options: PiAgentAdapterOptions;

	constructor(options: PiAgentAdapterOptions = {}) {
		this.options = options;
	}

	async createAgent(request: {
		runId: string;
		cwd?: string;
	}): Promise<AgentConnection> {
		if (this.options.cliBridge) {
			const connection = this.createCliConnection(request.runId);
			return connection;
		}
		return this.createSdkConnection(request.runId, request.cwd);
	}

	async takeOverAgent(request: {
		runId: string;
		agentReference: string;
		cwd?: string;
	}): Promise<AgentConnection> {
		if (this.options.cliBridge) return this.createCliConnection(request.runId);
		const active = this.sessionHandles.get(request.agentReference);
		if (active) return active.connection;
		const manager = SessionManager.open(request.agentReference);
		const { session } = await createAgentSession({
			cwd: request.cwd ?? manager.getCwd(),
			sessionManager: manager,
			customTools: [this.flowOutcomeTool()],
		});
		const connection = {
			id: `${request.runId}:agent`,
			platformReference: request.agentReference,
			sessionReference: session.sessionFile,
		};
		const handle = { connection, session, manager };
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
			await handle.session.prompt(request.prompt);
			if (!pending.submitted)
				throw new Error("Pi Agent 没有调用 submit_flow_outcome");
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
	async submitCliOutcome(outcome: string, content: string): Promise<void> {
		const pending = this.pendingCli;
		if (!pending) throw new Error("当前没有等待结果的 Flow 节点");
		if (pending.submitted || pending.candidate)
			throw new Error("当前 Flow 节点已经提交结果");
		if (!pending.outcomes.some((option) => option.name === outcome))
			throw new Error(`当前节点不允许结果: ${outcome}`);
		pending.candidate = { outcome, content };
	}

	/** Called by the extension turn_end event after Pi has persisted the interaction entries. */
	async finalizeCliTurn(): Promise<void> {
		const pending = this.pendingCli;
		if (!pending?.candidate || pending.submitted) return;
		try {
			pending.endEntryId = this.options.cliBridge?.getLeafEntryId();
			await pending.submitOutcome({
				nodeExecutionReference: pending.nodeExecutionReference,
				result: pending.candidate.outcome,
				content: pending.candidate.content,
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
	): Promise<AgentConnection> {
		const manager = SessionManager.create(
			cwd ?? this.options.cwd ?? process.cwd(),
			this.options.sessionDir,
		);
		const { session } = await createAgentSession({
			cwd: cwd ?? this.options.cwd,
			sessionManager: manager,
			customTools: [this.flowOutcomeTool()],
		});
		const connection = {
			id: `${runId}:agent`,
			platformReference: session.sessionId,
			sessionReference: session.sessionFile,
		};
		const handle = { connection, session, manager };
		this.handles.set(connection.id, handle);
		if (connection.sessionReference)
			this.sessionHandles.set(connection.sessionReference, handle);
		return connection;
	}

	private createCliConnection(runId: string): AgentConnection {
		const bridge = this.options.cliBridge;
		if (!bridge) throw new Error("Pi CLI bridge 不可用");
		if (this.cliConnection) return this.cliConnection;
		const reference = bridge.getSessionReference();
		this.cliConnection = {
			id: `${runId}:cli-agent`,
			platformReference: reference,
			sessionReference: reference,
		};
		return this.cliConnection;
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
				"Call submit_flow_outcome exactly once as the final action of each Flow node.",
			],
			parameters: Type.Object({
				outcome: Type.String({
					description: "One result name allowed by the current Flow node",
				}),
				content: Type.String({
					description:
						"Markdown conclusion and evidence for the next Flow node",
				}),
			}),
			executionMode: "sequential",
			execute: async (_id, params) => {
				await this.submitSdkOutcome(params.outcome, params.content);
				return {
					content: [
						{ type: "text", text: `Flow outcome submitted: ${params.outcome}` },
					],
					details: { outcome: params.outcome, content: params.content },
					terminate: true,
				};
			},
		});
	}

	private async submitSdkOutcome(
		outcome: string,
		content: string,
	): Promise<void> {
		const pending = [...this.handles.values()]
			.map((handle) => handle.pending)
			.find((value) => value !== undefined);
		if (!pending) throw new Error("当前没有等待结果的 Flow 节点");
		if (pending.submitted) throw new Error("当前 Flow 节点已经提交结果");
		if (!pending.outcomes.some((option) => option.name === outcome))
			throw new Error(`当前节点不允许结果: ${outcome}`);
		await pending.submitOutcome({
			nodeExecutionReference: pending.nodeExecutionReference,
			result: outcome,
			content,
		});
		pending.submitted = true;
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
			"Call submit_flow_outcome exactly once as the final action of each Flow node.",
		],
		parameters: Type.Object({
			outcome: Type.String({
				description: "One result name allowed by the current Flow node",
			}),
			content: Type.String({
				description: "Markdown conclusion and evidence for the next Flow node",
			}),
		}),
		executionMode: "sequential",
		execute: async (_id, params) => {
			await adapter.submitCliOutcome(params.outcome, params.content);
			return {
				content: [
					{ type: "text", text: `Flow outcome submitted: ${params.outcome}` },
				],
				details: { outcome: params.outcome, content: params.content },
				terminate: true,
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

function normalizeRole(role: unknown): UnifiedMessage["role"] | undefined {
	if (role === "user" || role === "assistant") return role;
	if (role === "toolResult") return "tool";
	return undefined;
}
