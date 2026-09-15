export type FlowValue =
	| string
	| number
	| boolean
	| null
	| FlowValue[]
	| { [key: string]: FlowValue };

export type AgentActionKind = "新建Agent" | "复用Agent";

export interface AgentAction {
	kind: AgentActionKind;
	prompt: string;
}

export interface CommandRequest {
	command: string;
	args?: string[];
	stdin?: FlowValue;
	/** 命令进程的工作目录；缺省时继承当前进程 cwd。 */
	cwd?: string;
}

export interface CommandAction {
	kind: "执行自定义命令";
	request: CommandRequest;
	branchReferences: string[];
}

export type FlowAction = AgentAction | CommandAction;

export interface FlowNode {
	ref: string;
	name: string;
	action: FlowAction;
	results: Map<string, string>;
	successors: Map<string, FlowDestination>;
}

export type FlowDestination =
	| { kind: "node"; ref: string }
	| { kind: "parallel"; ref: string }
	| { kind: "finish" };

export interface ParallelStart {
	ref: string;
	branches: string[];
	joinRef: string;
}

export interface FlowDefinition {
	id: string;
	name: string;
	description: string;
	startNodeRef: string;
	nodes: Map<string, FlowNode>;
	parallels: Map<string, ParallelStart>;
}

export interface OutcomeOption {
	name: string;
	description: string;
}

export interface NodeOutcome {
	result: string;
	content: FlowValue;
}

export interface AgentConnection {
	id: string;
	platformReference: string;
	sessionReference?: string;
}

export interface NodeSession {
	id: string;
	sessionReference?: string;
	interactionReference?: string;
}

export interface UnifiedMessage {
	id: string;
	role: "user" | "assistant" | "tool" | "system";
	content: FlowValue;
}

export interface AgentOutcomeSubmission extends NodeOutcome {
	nodeExecutionReference: string;
	sessionReference?: string;
	interactionReference?: string;
}

export interface AgentIntegrationAdapter {
	createAgent(request: {
		runId: string;
		cwd?: string;
	}): Promise<AgentConnection>;
	takeOverAgent(request: {
		runId: string;
		agentReference: string;
		cwd?: string;
	}): Promise<AgentConnection>;
	executeNode(request: {
		connection: AgentConnection;
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		submitOutcome: (submission: AgentOutcomeSubmission) => Promise<void>;
	}): Promise<NodeSession>;
	getNodeSession(session: NodeSession): Promise<UnifiedMessage[]>;
	releaseAgent(connection: AgentConnection): Promise<void>;
}

export interface CommandResult {
	status: "success" | "failure";
	exitCode: number | null;
	stdout: string;
	stderr: string;
}

export interface CommandExecutor {
	execute(request: CommandRequest): Promise<CommandResult>;
}

export type RunStatus = "running" | "completed" | "failed" | "interrupted";

export type RunPhase =
	| "starting"
	| "executing_node"
	| "waiting_parallel"
	| "routing"
	| "completed"
	| "failed"
	| "interrupted";

export type NodeRunStatus = "running" | "completed" | "failed" | "interrupted";

export type ParallelRoundStatus =
	| "running"
	| "joining"
	| "completed"
	| "failed"
	| "interrupted";

export type FlowErrorCategory =
	| "agent_execution"
	| "command_execution"
	| "outcome_validation"
	| "route_not_found"
	| "parallel_configuration"
	| "command_interrupted"
	| "recovery"
	| "persistence"
	| "legacy"
	| "unknown";

export interface FlowError {
	category: FlowErrorCategory;
	summary: string;
}

export type NodeRunSource =
	| { kind: "start" }
	| {
			kind: "route";
			routeDecisionId: string;
			sourceNodeRunId: string;
	  }
	| {
			kind: "parallel";
			parallelRoundId: string;
			branchNodeRunIds?: string[];
	  }
	| { kind: "recovery"; nodeRunId: string };

/** An immutable record of one actual visit to a Flow work node. */
export interface NodeRunRecord {
	id: string;
	runId: string;
	/** Stable fact order within the Run. */
	sequence: number;
	nodeRef: string;
	actionKind: FlowAction["kind"];
	input: FlowValue;
	status: NodeRunStatus;
	startedAt: string;
	completedAt?: string;
	outcome?: NodeOutcome;
	error?: FlowError;
	/** Execution evidence references. Full evidence stays with the host. */
	session?: NodeSession;
	retryOf?: string;
	enteredFrom: NodeRunSource;
	parallelRoundId?: string;
}

/** A persisted edge selection. It is never reconstructed from a current Flow file. */
export interface RouteDecisionRecord {
	id: string;
	runId: string;
	sequence: number;
	sourceNodeRunId: string;
	result: string;
	destination: FlowDestination;
	/** Set only when this decision created a concrete parallel execution round. */
	parallelRoundId?: string;
	selectedAt: string;
}

/** One concrete visit to a static parallel entry point. */
export interface ParallelRoundRecord {
	id: string;
	runId: string;
	/** Stable fact order for this concrete parallel entry. */
	sequence: number;
	parallelRef: string;
	input: FlowValue;
	status: ParallelRoundStatus;
	startedAt: string;
	completedAt?: string;
	error?: FlowError;
	branchNodeRunIds: Record<string, string>;
	branchStatuses: Record<string, NodeRunStatus>;
	joinNodeRunId?: string;
	joinInput?: FlowValue;
	joinOutcome?: NodeOutcome;
	sourceNodeRunId?: string;
}

export interface RunRecoveryRecord {
	id: string;
	runId: string;
	sequence: number;
	interruptedNodeRunId?: string;
	strategy: "retry_agent" | "fail_command" | "continue_routing";
	resumedAt: string;
	summary: string;
}

/**
 * Current Run snapshot. Historical facts live in NodeRun, RouteDecision,
 * ParallelRound and RunRecovery records, rather than in the current cursor.
 */
export interface FlowRunRecord {
	id: string;
	flowId: string;
	/** Immutable content fingerprint calculated from the parsed Flow definition. */
	flowVersion: string;
	task: FlowValue;
	status: RunStatus;
	phase: RunPhase;
	/** Monotonically incremented after every successful state-fact commit. */
	sequence: number;
	/** Legacy snapshots are queryable but cannot claim complete route/version history. */
	historyCompleteness: "complete" | "legacy";
	startedAt: string;
	completedAt?: string;
	/** CLI recovery metadata. SDK hosts may omit these fields. */
	flowPath?: string;
	cwd?: string;
	sessionReference?: string;
	currentNodeRef?: string;
	currentInput?: FlowValue;
	currentNodeRunId?: string;
	currentParallelRoundId?: string;
	error?: FlowError;
	/** @deprecated Read only while migrating old JSON snapshots. */
	currentParallelRound?: ParallelRoundRecord;
}

/** All writes in a commit become visible together, or not at all. */
export interface RunFactCommit {
	run: FlowRunRecord;
	expectedSequence: number;
	nodeRuns?: NodeRunRecord[];
	routeDecisions?: RouteDecisionRecord[];
	parallelRounds?: ParallelRoundRecord[];
	recoveries?: RunRecoveryRecord[];
}

export interface RunStore {
	createRun(run: FlowRunRecord): Promise<void>;
	commit(fact: RunFactCommit): Promise<void>;
	getRun(runId: string): Promise<FlowRunRecord | undefined>;
	listRuns(flowId: string): Promise<FlowRunRecord[]>;
	listRunningRuns(): Promise<FlowRunRecord[]>;
	listNodeRuns(runId: string): Promise<NodeRunRecord[]>;
	listRouteDecisions(runId: string): Promise<RouteDecisionRecord[]>;
	listParallelRounds(runId: string): Promise<ParallelRoundRecord[]>;
	listRunRecoveries(runId: string): Promise<RunRecoveryRecord[]>;
	/** Compatibility and test setup APIs. Coordinators must use commit instead. */
	updateRun(run: FlowRunRecord): Promise<void>;
	createNodeRun(record: NodeRunRecord): Promise<void>;
	updateNodeRun(record: NodeRunRecord): Promise<void>;
}

export interface FlowRunSummary {
	id: string;
	flowId: string;
	flowVersion: string;
	task: FlowValue;
	status: RunStatus;
	phase: RunPhase;
	sequence: number;
	historyCompleteness: "complete" | "legacy";
	startedAt: string;
	completedAt?: string;
	error?: FlowError;
}

export type FlowRunLocation =
	| {
			kind: "node";
			nodeRunId?: string;
			nodeRef: string;
	  }
	| {
			kind: "parallel";
			parallelRoundId: string;
			parallelRef: string;
	  }
	| { kind: "none" };

export interface FlowNodeEvidenceSummary {
	sessionReference?: string;
	interactionReference?: string;
	commandOutputAvailable: boolean;
}

/** Stable, adapter-independent projection of one Run's persisted facts. */
export interface FlowRunHistory {
	run: FlowRunSummary;
	nodeRuns: NodeRunRecord[];
	routeDecisions: RouteDecisionRecord[];
	parallelRounds: ParallelRoundRecord[];
	recoveries: RunRecoveryRecord[];
	current: FlowRunLocation;
	evidence: Record<string, FlowNodeEvidenceSummary>;
}

export interface FlowNodeEvidence {
	runId: string;
	nodeRunId: string;
	nodeRef: string;
	status: NodeRunStatus;
	input: FlowValue;
	outcome?: NodeOutcome;
	error?: FlowError;
	session?: NodeSession;
	messages?: UnifiedMessage[];
	commandResult?: {
		status: "success" | "failure";
		exitCode: number | null;
		stdout: string;
		stderr: string;
	};
}

export interface FlowNodeEvidenceReader {
	getNodeSession(session: NodeSession): Promise<UnifiedMessage[]>;
}

export interface FlowNodeEvidenceAccessRequest {
	runId: string;
	nodeRun: NodeRunRecord;
}

export type FlowNodeEvidenceAuthorizer = (
	request: FlowNodeEvidenceAccessRequest,
) => boolean | Promise<boolean>;

export interface FlowRunInspectorApi {
	inspectRun(runId: string): Promise<FlowRunHistory | undefined>;
	inspectNodeEvidence(
		runId: string,
		nodeRunId: string,
	): Promise<FlowNodeEvidence | undefined>;
}
