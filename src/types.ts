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

export interface NodeRunRecord {
	id: string;
	runId: string;
	nodeRef: string;
	input: FlowValue;
	startedAt: string;
	completedAt?: string;
	outcome?: NodeOutcome;
	session?: NodeSession;
}

export interface ParallelRoundRecord {
	id: string;
	parallelRef: string;
	input: FlowValue;
	branchNodeRunIds: Record<string, string>;
}

export interface FlowRunRecord {
	id: string;
	flowId: string;
	task: FlowValue;
	status: "running" | "completed" | "failed";
	startedAt: string;
	completedAt?: string;
	/** CLI recovery metadata. SDK hosts may omit these fields. */
	flowPath?: string;
	cwd?: string;
	sessionReference?: string;
	currentNodeRef?: string;
	currentInput?: FlowValue;
	currentNodeRunId?: string;
	currentParallelRound?: ParallelRoundRecord;
	error?: string;
}

export interface RunStore {
	createRun(run: FlowRunRecord): Promise<void>;
	updateRun(run: FlowRunRecord): Promise<void>;
	getRun(runId: string): Promise<FlowRunRecord | undefined>;
	listRuns(flowId: string): Promise<FlowRunRecord[]>;
	listRunningRuns(): Promise<FlowRunRecord[]>;
	createNodeRun(record: NodeRunRecord): Promise<void>;
	updateNodeRun(record: NodeRunRecord): Promise<void>;
	listNodeRuns(runId: string): Promise<NodeRunRecord[]>;
}
