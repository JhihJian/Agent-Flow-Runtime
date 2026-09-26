import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
	resolveCommandResources,
	resolvePromptResources,
} from "./flow-loader.ts";
import {
	FLOW_REFERENCE_FAILURE_RESULT,
	FLOW_REFERENCE_SUCCESS_RESULT,
	renderCommandRequest,
	renderFlowReferenceTask,
} from "./parser.ts";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	CommandExecutor,
	CommandRequest,
	CommandResult,
	FlowDefinition,
	FlowDestination,
	FlowError,
	FlowErrorCategory,
	FlowNode,
	FlowObservationEvent,
	FlowObservationPublisherApi,
	FlowPackage,
	FlowReferenceAction,
	FlowResourceContext,
	FlowRunRecord,
	FlowRunSnapshot,
	FlowValue,
	NodeOutcome,
	NodeRunRecord,
	NodeRunSource,
	NodeSession,
	OutcomeOption,
	ParallelRoundRecord,
	RouteDecisionRecord,
	RunFactCommit,
	RunRecoveryRecord,
	RunStore,
} from "./types.ts";

type FactChanges = Omit<RunFactCommit, "run" | "expectedSequence">;

type ObservationSpec = {
	type: FlowObservationEvent["type"];
	summary: string;
	nodeRunId?: string;
	nodeName?: string;
	nodeRef?: string;
	parallelRoundId?: string;
	result?: string;
	destination?: FlowDestination;
	nodeStatus?: NodeRunRecord["status"];
	parallelStatus?: ParallelRoundRecord["status"];
};

export class InMemoryRunStore implements RunStore {
	protected readonly runs = new Map<string, FlowRunRecord>();
	protected readonly nodeRuns = new Map<string, NodeRunRecord>();
	protected readonly routeDecisions = new Map<string, RouteDecisionRecord>();
	protected readonly parallelRounds = new Map<string, ParallelRoundRecord>();
	protected readonly recoveries = new Map<string, RunRecoveryRecord>();

	async createRun(run: FlowRunRecord): Promise<void> {
		if (this.runs.has(run.id)) throw new Error(`Flow 运行已存在: ${run.id}`);
		const normalized = normalizeRun(run);
		this.runs.set(normalized.id, clone(normalized));
		if (normalized.currentParallelRound) {
			const round = normalizeParallelRound(
				normalized.currentParallelRound,
				normalized.id,
			);
			this.parallelRounds.set(round.id, clone(round));
			normalized.currentParallelRoundId = round.id;
			delete normalized.currentParallelRound;
			this.runs.set(normalized.id, clone(normalized));
		}
	}

	async commit(fact: RunFactCommit): Promise<void> {
		const stored = this.runs.get(fact.run.id);
		if (!stored) throw new Error(`Flow 运行不存在: ${fact.run.id}`);
		if (stored.sequence !== fact.expectedSequence) {
			throw new Error(
				`Flow 运行版本冲突: ${fact.run.id}，期望 ${fact.expectedSequence}，实际 ${stored.sequence}`,
			);
		}
		if (fact.run.sequence !== fact.expectedSequence + 1) {
			throw new Error(`Flow 运行提交序号无效: ${fact.run.id}`);
		}
		this.validateFactRecords(fact);
		this.runs.set(fact.run.id, clone(normalizeRun(fact.run)));
		for (const record of fact.nodeRuns ?? []) {
			this.nodeRuns.set(record.id, clone(normalizeNodeRun(record)));
		}
		for (const decision of fact.routeDecisions ?? []) {
			this.routeDecisions.set(decision.id, clone(decision));
		}
		for (const round of fact.parallelRounds ?? []) {
			this.parallelRounds.set(
				round.id,
				clone(normalizeParallelRound(round, fact.run.id)),
			);
		}
		for (const recovery of fact.recoveries ?? []) {
			this.recoveries.set(recovery.id, clone(recovery));
		}
	}

	private validateFactRecords(fact: RunFactCommit): void {
		for (const record of fact.nodeRuns ?? []) {
			if (record.runId !== fact.run.id)
				throw new Error(`NodeRun 不属于当前 Flow 运行: ${record.id}`);
		}
		for (const decision of fact.routeDecisions ?? []) {
			if (decision.runId !== fact.run.id)
				throw new Error(`路由记录不属于当前 Flow 运行: ${decision.id}`);
		}
		for (const round of fact.parallelRounds ?? []) {
			if (round.runId !== fact.run.id)
				throw new Error(`并行轮次不属于当前 Flow 运行: ${round.id}`);
		}
		for (const recovery of fact.recoveries ?? []) {
			if (recovery.runId !== fact.run.id)
				throw new Error(`恢复记录不属于当前 Flow 运行: ${recovery.id}`);
		}
	}

	async updateRun(run: FlowRunRecord): Promise<void> {
		if (!this.runs.has(run.id)) throw new Error(`Flow 运行不存在: ${run.id}`);
		this.runs.set(run.id, clone(normalizeRun(run)));
	}

	async getRun(runId: string): Promise<FlowRunRecord | undefined> {
		const run = this.runs.get(runId);
		return run && clone(run);
	}

	async getRunSnapshot(runId: string): Promise<FlowRunSnapshot | undefined> {
		const run = this.runs.get(runId);
		if (!run) return undefined;
		return {
			run: clone(run),
			nodeRuns: this.recordsFor(this.nodeRuns, runId),
			routeDecisions: this.recordsFor(this.routeDecisions, runId),
			parallelRounds: this.recordsFor(this.parallelRounds, runId),
			recoveries: this.recordsFor(this.recoveries, runId),
		};
	}

	private recordsFor<T extends { runId: string; sequence: number }>(
		records: ReadonlyMap<string, T>,
		runId: string,
	): T[] {
		return [...records.values()]
			.filter((record) => record.runId === runId)
			.sort((left, right) => left.sequence - right.sequence)
			.map(clone);
	}

	async listRuns(flowId: string): Promise<FlowRunRecord[]> {
		return [...this.runs.values()]
			.filter((run) => run.flowId === flowId)
			.map(clone);
	}

	async listAllRuns(): Promise<FlowRunRecord[]> {
		return [...this.runs.values()].map(clone);
	}

	async listRunningRuns(): Promise<FlowRunRecord[]> {
		return [...this.runs.values()]
			.filter((run) => run.status === "running")
			.map(clone);
	}

	async createNodeRun(record: NodeRunRecord): Promise<void> {
		if (this.nodeRuns.has(record.id))
			throw new Error(`节点运行已存在: ${record.id}`);
		this.nodeRuns.set(record.id, clone(normalizeNodeRun(record)));
	}

	async updateNodeRun(record: NodeRunRecord): Promise<void> {
		if (!this.nodeRuns.has(record.id))
			throw new Error(`节点运行不存在: ${record.id}`);
		this.nodeRuns.set(record.id, clone(normalizeNodeRun(record)));
	}

	async listNodeRuns(runId: string): Promise<NodeRunRecord[]> {
		return [...this.nodeRuns.values()]
			.filter((record) => record.runId === runId)
			.sort((left, right) => left.sequence - right.sequence)
			.map(clone);
	}

	async listRouteDecisions(runId: string): Promise<RouteDecisionRecord[]> {
		return [...this.routeDecisions.values()]
			.filter((record) => record.runId === runId)
			.sort((left, right) => left.sequence - right.sequence)
			.map(clone);
	}

	async listParallelRounds(runId: string): Promise<ParallelRoundRecord[]> {
		return [...this.parallelRounds.values()]
			.filter((record) => record.runId === runId)
			.sort((left, right) => left.sequence - right.sequence)
			.map(clone);
	}

	async listRunRecoveries(runId: string): Promise<RunRecoveryRecord[]> {
		return [...this.recoveries.values()]
			.filter((record) => record.runId === runId)
			.sort((left, right) => left.sequence - right.sequence)
			.map(clone);
	}

	async listChildRuns(parentRunId: string): Promise<FlowRunRecord[]> {
		return [...this.runs.values()]
			.filter((run) => run.parentRunId === parentRunId)
			.sort((left, right) => left.startedAt.localeCompare(right.startedAt))
			.map(clone);
	}
}

interface PersistedRuns {
	runs: FlowRunRecord[];
	nodeRuns: NodeRunRecord[];
	routeDecisions?: RouteDecisionRecord[];
	parallelRounds?: ParallelRoundRecord[];
	recoveries?: RunRecoveryRecord[];
}

/** Single-process JSON persistence. Each mutation writes one complete snapshot. */
export class JsonFileRunStore extends InMemoryRunStore {
	private initialized = false;
	private loadPromise?: Promise<void>;
	private mutations = Promise.resolve();
	private readonly file: string;

	constructor(file: string) {
		super();
		this.file = file;
	}

	private async load(): Promise<void> {
		if (this.initialized) return;
		if (!this.loadPromise) {
			this.loadPromise = this.loadPersisted().then(
				() => {
					this.initialized = true;
				},
				(error: unknown) => {
					this.loadPromise = undefined;
					throw error;
				},
			);
		}
		await this.loadPromise;
	}

	private async loadPersisted(): Promise<void> {
		try {
			const saved = JSON.parse(
				await readFile(this.file, "utf8"),
			) as PersistedRuns;
			for (const run of saved.runs ?? []) await super.createRun(run);
			for (const nodeRun of saved.nodeRuns ?? [])
				await super.createNodeRun(nodeRun);
			for (const decision of saved.routeDecisions ?? [])
				this.routeDecisions.set(decision.id, clone(decision));
			for (const round of saved.parallelRounds ?? [])
				this.parallelRounds.set(
					round.id,
					clone(normalizeParallelRound(round, round.runId)),
				);
			for (const recovery of saved.recoveries ?? [])
				this.recoveries.set(recovery.id, clone(recovery));
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
		}
	}

	private async persist(): Promise<void> {
		const saved: PersistedRuns = {
			runs: [...this.runs.values()].map(clone),
			nodeRuns: [...this.nodeRuns.values()].map(clone),
			routeDecisions: [...this.routeDecisions.values()].map(clone),
			parallelRounds: [...this.parallelRounds.values()].map(clone),
			recoveries: [...this.recoveries.values()].map(clone),
		};
		await mkdir(dirname(this.file), { recursive: true });
		const temporary = `${this.file}.${process.pid}.${randomUUID()}.tmp`;
		await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`, "utf8");
		await rename(temporary, this.file);
	}

	private async mutate<T>(operation: () => Promise<T>): Promise<T> {
		const mutation = this.mutations.then(async () => {
			await this.load();
			const result = await operation();
			await this.persist();
			return result;
		});
		this.mutations = mutation.then(
			() => undefined,
			() => undefined,
		);
		return mutation;
	}

	private async ready(): Promise<void> {
		await this.mutations;
		await this.load();
	}

	override async createRun(run: FlowRunRecord): Promise<void> {
		await this.mutate(() => super.createRun(run));
	}

	override async commit(fact: RunFactCommit): Promise<void> {
		await this.mutate(() => super.commit(fact));
	}

	override async updateRun(run: FlowRunRecord): Promise<void> {
		await this.mutate(() => super.updateRun(run));
	}

	override async getRun(runId: string): Promise<FlowRunRecord | undefined> {
		await this.ready();
		return super.getRun(runId);
	}

	override async getRunSnapshot(
		runId: string,
	): Promise<FlowRunSnapshot | undefined> {
		await this.ready();
		return super.getRunSnapshot(runId);
	}

	override async listRuns(flowId: string): Promise<FlowRunRecord[]> {
		await this.ready();
		return super.listRuns(flowId);
	}

	override async listAllRuns(): Promise<FlowRunRecord[]> {
		await this.ready();
		return super.listAllRuns();
	}

	override async listRunningRuns(): Promise<FlowRunRecord[]> {
		await this.ready();
		return super.listRunningRuns();
	}

	override async createNodeRun(record: NodeRunRecord): Promise<void> {
		await this.mutate(() => super.createNodeRun(record));
	}

	override async updateNodeRun(record: NodeRunRecord): Promise<void> {
		await this.mutate(() => super.updateNodeRun(record));
	}

	override async listNodeRuns(runId: string): Promise<NodeRunRecord[]> {
		await this.ready();
		return super.listNodeRuns(runId);
	}

	override async listRouteDecisions(
		runId: string,
	): Promise<RouteDecisionRecord[]> {
		await this.ready();
		return super.listRouteDecisions(runId);
	}

	override async listParallelRounds(
		runId: string,
	): Promise<ParallelRoundRecord[]> {
		await this.ready();
		return super.listParallelRounds(runId);
	}

	override async listRunRecoveries(
		runId: string,
	): Promise<RunRecoveryRecord[]> {
		await this.ready();
		return super.listRunRecoveries(runId);
	}

	override async listChildRuns(parentRunId: string): Promise<FlowRunRecord[]> {
		await this.ready();
		return super.listChildRuns(parentRunId);
	}
}

export class ProcessCommandExecutor implements CommandExecutor {
	async execute(request: CommandRequest): Promise<CommandResult> {
		return await new Promise((resolve, reject) => {
			const child = spawn(request.command, request.args ?? [], {
				stdio: ["pipe", "pipe", "pipe"],
				cwd: request.cwd,
			});
			let stdout = "";
			let stderr = "";
			child.stdout.setEncoding("utf8");
			child.stderr.setEncoding("utf8");
			child.stdout.on("data", (chunk: string) => {
				stdout += chunk;
			});
			child.stderr.on("data", (chunk: string) => {
				stderr += chunk;
			});
			child.once("error", reject);
			child.once("close", (exitCode) =>
				resolve({
					status: exitCode === 0 ? "success" : "failure",
					exitCode,
					stdout,
					stderr,
				}),
			);
			if (request.stdin !== undefined)
				child.stdin.end(JSON.stringify(request.stdin));
			else child.stdin.end();
		});
	}
}

export class AgentRunModel {
	private readonly bindings = new Map<string, AgentConnection>();
	private readonly adapter: AgentIntegrationAdapter;

	constructor(adapter: AgentIntegrationAdapter) {
		this.adapter = adapter;
	}

	async start(
		runId: string,
		existingAgentReference?: string,
		cwd?: string,
	): Promise<void> {
		if (existingAgentReference) {
			if (
				[...this.bindings.values()].some(
					(binding) => binding.platformReference === existingAgentReference,
				)
			) {
				throw new Error(
					`Agent 已绑定到另一个 Flow 运行: ${existingAgentReference}`,
				);
			}
			this.bindings.set(
				runId,
				await this.adapter.takeOverAgent({
					runId,
					agentReference: existingAgentReference,
					cwd,
				}),
			);
		}
	}

	async executeNode(request: {
		runId: string;
		action: "新建Agent" | "复用Agent";
		nodeExecutionReference: string;
		prompt: string;
		outcomes: OutcomeOption[];
		cwd?: string;
		onConnection?: (connection: AgentConnection) => Promise<void>;
	}): Promise<{ outcome: NodeOutcome; session: NodeSession }> {
		let connection = this.bindings.get(request.runId);
		if (request.action === "新建Agent") {
			if (connection) await this.adapter.releaseAgent(connection);
			connection = await this.adapter.createAgent({
				runId: request.runId,
				cwd: request.cwd,
			});
			this.bindings.set(request.runId, connection);
		} else if (!connection) {
			throw new Error("复用Agent前必须先新建或接管 Agent");
		}
		await request.onConnection?.(connection);
		let accepted: NodeOutcome | undefined;
		let sessionReference: string | undefined;
		let interactionReference: string | undefined;
		const session = await this.adapter.executeNode({
			connection,
			nodeExecutionReference: request.nodeExecutionReference,
			prompt: request.prompt,
			outcomes: request.outcomes,
			submitOutcome: async (submission) => {
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
				accepted = { result: submission.result, content: submission.content };
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
		await this.adapter.releaseAgent(connection);
	}
}

export class FlowCoordinator {
	private readonly flow: FlowDefinition;
	private readonly store: RunStore;
	private readonly agentModel: AgentRunModel;
	private readonly commandExecutor: CommandExecutor;
	private readonly publisher?: FlowObservationPublisherApi;
	private readonly resources?: FlowResourceContext;
	/** 引用闭包：标识到已加载子 Flow 的映射，供执行Flow 节点与更深层引用使用。 */
	private readonly references?: ReadonlyMap<string, FlowPackage>;
	private readonly onObservationError: (
		error: unknown,
		event: FlowObservationEvent,
	) => void;
	private writes = Promise.resolve();

	constructor(
		flow: FlowDefinition,
		store: RunStore,
		agentModel: AgentRunModel,
		commandExecutor: CommandExecutor = new ProcessCommandExecutor(),
		publisher?: FlowObservationPublisherApi,
		onObservationError: (
			error: unknown,
			event: FlowObservationEvent,
		) => void = () => undefined,
		resources?: FlowResourceContext,
		references?: ReadonlyMap<string, FlowPackage>,
	) {
		this.flow = flow;
		this.store = store;
		this.agentModel = agentModel;
		this.commandExecutor = commandExecutor;
		this.publisher = publisher;
		this.onObservationError = onObservationError;
		this.resources = resources;
		this.references = references;
	}

	async run(
		task: FlowValue,
		options: {
			runId?: string;
			existingAgentReference?: string;
			cwd?: string;
			flowPath?: string;
			sessionReference?: string;
			parentRunId?: string;
			parentNodeRunId?: string;
		} = {},
	): Promise<FlowRunRecord> {
		const run: FlowRunRecord = {
			id: options.runId ?? randomUUID(),
			flowId: this.flow.id,
			flowVersion: fingerprintFlow(this.flow, this.references),
			task,
			status: "running",
			phase: "starting",
			sequence: 1,
			historyCompleteness: "complete",
			startedAt: now(),
			flowPath: options.flowPath,
			cwd: options.cwd,
			sessionReference: options.sessionReference,
			parentRunId: options.parentRunId,
			parentNodeRunId: options.parentNodeRunId,
			currentNodeRef: this.flow.startNodeRef,
			currentInput: task,
		};
		await this.store.createRun(run);
		const startNodeName =
			this.flow.nodes.get(this.flow.startNodeRef)?.name ??
			this.flow.startNodeRef;
		this.publishObservation(run, {
			type: "run.started",
			nodeRef: run.currentNodeRef,
			nodeName: startNodeName,
			summary: `Flow 运行已开始，首节点为“${startNodeName}”`,
		});
		return this.continueRun(run, this.flow.startNodeRef, task, options, {
			kind: "start",
		});
	}

	/** Continue a persisted Run. Incomplete Agent work becomes a new NodeRun. */
	async resume(
		runId: string,
		options: { existingAgentReference?: string; cwd?: string } = {},
	): Promise<FlowRunRecord> {
		const run = await this.store.getRun(runId);
		if (!run) throw new Error(`Flow 运行不存在: ${runId}`);
		if (run.parentRunId)
			throw new Error(
				`子 Flow 运行不支持直接恢复，请恢复父运行: ${run.parentRunId}`,
			);
		return this.resumeRun(runId, options);
	}

	/** 父级续接路径使用的恢复入口：子 Run 只随父 Run 恢复，不检查直接恢复。 */
	private async resumeRun(
		runId: string,
		options: { existingAgentReference?: string; cwd?: string } = {},
	): Promise<FlowRunRecord> {
		const run = await this.store.getRun(runId);
		if (!run) throw new Error(`Flow 运行不存在: ${runId}`);
		if (run.flowId !== this.flow.id)
			throw new Error(`Flow 运行不属于当前 Flow: ${runId}`);
		if (
			run.historyCompleteness === "complete" &&
			run.flowVersion !== fingerprintFlow(this.flow, this.references)
		) {
			throw new Error(`Flow 版本与运行记录不匹配: ${runId}`);
		}
		if (run.status !== "running" && run.status !== "interrupted") {
			throw new Error(`Flow 运行不可恢复: ${runId}`);
		}

		const resumedOptions = {
			existingAgentReference:
				options.existingAgentReference ?? run.sessionReference,
			cwd: options.cwd ?? run.cwd,
		};
		if (run.currentParallelRoundId) {
			await this.agentModel.start(
				run.id,
				resumedOptions.existingAgentReference,
				resumedOptions.cwd,
			);
			return this.continueRun(
				run,
				run.currentNodeRef ?? this.flow.startNodeRef,
				run.currentInput ?? run.task,
				resumedOptions,
				{ kind: "start" },
				true,
			);
		}

		const nodeRuns = await this.store.listNodeRuns(run.id);
		const current = run.currentNodeRunId
			? nodeRuns.find((record) => record.id === run.currentNodeRunId)
			: [...nodeRuns]
					.reverse()
					.find(
						(record) =>
							record.nodeRef === run.currentNodeRef &&
							record.status === "running",
					);
		const nodeRef = current?.nodeRef ?? run.currentNodeRef;
		if (!nodeRef) throw new Error(`Flow 运行缺少可恢复的执行位置: ${runId}`);
		const node = this.flow.nodes.get(nodeRef);
		if (!node) throw new Error(`工作节点不存在: ${nodeRef}`);

		if (current?.status === "running" || current?.status === "interrupted") {
			if (node.action.kind === "执行Flow") {
				return this.resumeFlowReferenceNode(run, current, node, resumedOptions);
			}
			await this.interruptNode(run, current);
			if (node.action.kind === "执行自定义命令") {
				return this.failInterruptedCommand(run, current);
			}
			await this.agentModel.start(
				run.id,
				resumedOptions.existingAgentReference,
				resumedOptions.cwd,
			);
			return this.continueRun(
				run,
				nodeRef,
				current.input,
				resumedOptions,
				{ kind: "recovery", nodeRunId: current.id },
				true,
				undefined,
				current,
			);
		}

		await this.agentModel.start(
			run.id,
			resumedOptions.existingAgentReference,
			resumedOptions.cwd,
		);
		if (current?.status === "completed" && current.outcome) {
			await this.recordRecovery(
				run,
				current.id,
				"continue_routing",
				"从已完成节点继续路由",
			);
			return this.continueRun(
				run,
				nodeRef,
				current.input,
				resumedOptions,
				current.enteredFrom,
				true,
				{ record: current, outcome: current.outcome },
			);
		}
		throw new Error(`Flow 运行没有可恢复的节点事实: ${runId}`);
	}

	private async continueRun(
		run: FlowRunRecord,
		initialNodeRef: string,
		initialInput: FlowValue,
		options: { existingAgentReference?: string; cwd?: string },
		initialSource: NodeRunSource,
		agentStarted = false,
		initialResult?: { record: NodeRunRecord; outcome: NodeOutcome },
		retryOf?: NodeRunRecord,
	): Promise<FlowRunRecord> {
		if (!agentStarted) {
			await this.agentModel.start(
				run.id,
				options.existingAgentReference,
				options.cwd,
			);
		}
		let nodeRef = initialNodeRef;
		let input = initialInput;
		let source = initialSource;
		let result = initialResult;
		let retry = retryOf;
		let branchOutcomes = new Map<string, NodeOutcome>();
		try {
			while (true) {
				if (run.currentParallelRoundId) {
					const round = await this.requireParallelRound(
						run,
						run.currentParallelRoundId,
					);
					const parallel = this.flow.parallels.get(round.parallelRef);
					if (!parallel)
						throw new FlowRuntimeError(
							"parallel_configuration",
							`并行开始点不存在: ${round.parallelRef}`,
						);
					const branchResults = await this.executeParallel(
						run,
						round,
						parallel,
						options.cwd,
					);
					nodeRef = parallel.joinRef;
					input = branchResults.input;
					branchOutcomes = branchResults.outcomes;
					source = {
						kind: "parallel",
						parallelRoundId: round.id,
						branchNodeRunIds: Object.values(round.branchNodeRunIds),
					};
					result = undefined;
					retry = undefined;
				}

				const executed =
					result ??
					(await this.executeNode(
						run,
						nodeRef,
						input,
						options.cwd,
						branchOutcomes,
						source,
						retry,
					));
				result = undefined;
				retry = undefined;
				branchOutcomes = new Map();

				let destination: FlowDestination;
				try {
					destination = this.destination(nodeRef, executed.outcome.result);
				} catch (error) {
					await this.failNode(
						run,
						executed.record,
						toFlowError(error, "route_not_found"),
					);
					throw error;
				}

				const nextRoundId =
					destination.kind === "parallel" ? randomUUID() : undefined;
				const decision = await this.selectRoute(
					run,
					executed.record,
					executed.outcome.result,
					destination,
					nextRoundId,
				);
				if (destination.kind === "finish") {
					await this.completeRun(run);
					await this.agentModel.end(run.id);
					return clone(run);
				}
				if (destination.kind === "node") {
					nodeRef = destination.ref;
					input = executed.outcome.content;
					source = {
						kind: "route",
						routeDecisionId: decision.id,
						sourceNodeRunId: executed.record.id,
					};
					continue;
				}
				await this.enterParallel(
					run,
					destination.ref,
					executed.outcome.content,
					executed.record.id,
					nextRoundId ?? randomUUID(),
				);
			}
		} catch (error) {
			if (run.status !== "failed") {
				await this.failRun(run, toFlowError(error, "unknown"));
			}
			await this.agentModel.end(run.id);
			throw error;
		}
	}

	private async executeParallel(
		run: FlowRunRecord,
		round: ParallelRoundRecord,
		parallel: { branches: string[]; joinRef: string },
		cwd?: string,
	): Promise<{ input: FlowValue; outcomes: Map<string, NodeOutcome> }> {
		const existing = new Map(
			(await this.store.listNodeRuns(run.id)).map((record) => [
				record.id,
				record,
			]),
		);
		const branchRecords = new Map<string, NodeRunRecord>();
		for (const branchRef of parallel.branches) {
			const existingId = round.branchNodeRunIds[branchRef];
			const record = existingId ? existing.get(existingId) : undefined;
			if (record) {
				if (record.status !== "completed") {
					await this.interruptNode(run, record, round, branchRef);
					return this.failInterruptedCommand(run, record, round);
				}
				branchRecords.set(branchRef, record);
				continue;
			}
			branchRecords.set(
				branchRef,
				await this.startNode(
					run,
					branchRef,
					round.input,
					{
						kind: "parallel",
						parallelRoundId: round.id,
					},
					undefined,
					round,
					branchRef,
				),
			);
		}

		const completed = await Promise.all(
			parallel.branches.map(async (branchRef) => {
				const record = branchRecords.get(branchRef);
				if (!record) throw new Error(`并行分支缺少执行记录: ${branchRef}`);
				if (record.status === "completed" && record.outcome) {
					return [branchRef, record.outcome] as const;
				}
				const result = await this.executePreparedNode(
					run,
					record,
					cwd,
					new Map(),
					round,
					branchRef,
				);
				const destination = this.destination(branchRef, result.outcome.result);
				await this.selectRoute(
					run,
					result.record,
					result.outcome.result,
					destination,
					undefined,
					false,
				);
				return [branchRef, result.outcome] as const;
			}),
		);
		const persistedRound = (await this.store.listParallelRounds(run.id)).find(
			(record) => record.id === round.id,
		);
		if (persistedRound) {
			const finalizedRound = clone(persistedRound);
			for (const branchRef of parallel.branches) {
				finalizedRound.branchStatuses[branchRef] = "completed";
			}
			await this.commit(run, () => ({ parallelRounds: [finalizedRound] }), [
				{
					type: "parallel.completed",
					parallelRoundId: finalizedRound.id,
					parallelStatus: "completed",
					summary: `并行轮次“${finalizedRound.parallelRef}”的分支已全部完成，准备汇合`,
				},
			]);
			replaceObject(round, finalizedRound);
		}
		return { input: round.input, outcomes: new Map(completed) };
	}

	private async executeNode(
		run: FlowRunRecord,
		nodeRef: string,
		input: FlowValue,
		cwd: string | undefined,
		branchOutcomes: ReadonlyMap<string, NodeOutcome>,
		source: NodeRunSource,
		retryOf?: NodeRunRecord,
	): Promise<{ record: NodeRunRecord; outcome: NodeOutcome }> {
		const round =
			source.kind === "parallel"
				? await this.requireParallelRound(run, source.parallelRoundId)
				: undefined;
		const record = await this.startNode(
			run,
			nodeRef,
			input,
			source,
			retryOf,
			round,
		);
		return this.executePreparedNode(run, record, cwd, branchOutcomes, round);
	}

	private async startNode(
		run: FlowRunRecord,
		nodeRef: string,
		input: FlowValue,
		source: NodeRunSource,
		retryOf?: NodeRunRecord,
		round?: ParallelRoundRecord,
		branchRef?: string,
	): Promise<NodeRunRecord> {
		const node = this.flow.nodes.get(nodeRef);
		if (!node) {
			const error = new FlowRuntimeError(
				"route_not_found",
				`工作节点不存在: ${nodeRef}`,
			);
			await this.failRun(run, toFlowError(error, "route_not_found"));
			throw error;
		}
		const record: NodeRunRecord = {
			id: randomUUID(),
			runId: run.id,
			sequence: 0,
			nodeName: node.name,
			nodeRef,
			actionKind: node.action.kind,
			input,
			status: "running",
			startedAt: now(),
			enteredFrom: source,
			retryOf: retryOf?.id,
			parallelRoundId: round?.id,
		};
		if (node.action.kind === "执行Flow") record.childRunId = randomUUID();
		const recovery =
			source.kind === "recovery" && retryOf
				? {
						id: randomUUID(),
						runId: run.id,
						sequence: 0,
						interruptedNodeRunId: retryOf.id,
						strategy: "retry_agent" as const,
						resumedAt: now(),
						summary: `从中断节点“${displayNodeName(retryOf)}”创建新的 Agent 访问`,
					}
				: undefined;
		await this.commit(
			run,
			(next, sequence) => {
				record.sequence = sequence;
				if (recovery) recovery.sequence = sequence;
				next.status = "running";
				next.phase = "executing_node";
				delete next.error;
				next.currentNodeRef = nodeRef;
				next.currentInput = input;
				next.currentNodeRunId = record.id;
				delete next.currentParallelRoundId;
				if (round) {
					if (branchRef) {
						round.branchNodeRunIds[branchRef] = record.id;
						round.branchStatuses[branchRef] = "running";
						next.phase = "waiting_parallel";
						delete next.currentNodeRef;
						delete next.currentNodeRunId;
						next.currentParallelRoundId = round.id;
					} else {
						round.status = "joining";
						round.joinNodeRunId = record.id;
						round.joinInput = input;
						next.currentParallelRoundId = round.id;
					}
				}
				return {
					nodeRuns: [record],
					parallelRounds: round ? [round] : undefined,
					recoveries: recovery ? [recovery] : undefined,
				};
			},
			[
				...(recovery
					? [
							{
								type: "run.resumed" as const,
								nodeRunId: record.id,
								nodeName: record.nodeName,
								nodeRef,
								summary: `Flow 运行已恢复，创建节点“${displayNodeName(record)}”的新访问`,
							},
						]
					: []),
				{
					type: "node.started",
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef,
					summary: `节点“${displayNodeName(record)}”开始执行`,
				},
			],
		);
		return record;
	}

	private async executePreparedNode(
		run: FlowRunRecord,
		record: NodeRunRecord,
		cwd: string | undefined,
		branchOutcomes: ReadonlyMap<string, NodeOutcome>,
		round?: ParallelRoundRecord,
		branchRef?: string,
	): Promise<{ record: NodeRunRecord; outcome: NodeOutcome }> {
		const node = this.flow.nodes.get(record.nodeRef);
		if (!node) {
			const error = new FlowRuntimeError(
				"route_not_found",
				`工作节点不存在: ${record.nodeRef}`,
			);
			await this.failNode(
				run,
				record,
				toFlowError(error, "route_not_found"),
				round,
				branchRef,
			);
			throw error;
		}
		try {
			let outcome: NodeOutcome;
			if (node.action.kind === "执行Flow") {
				outcome = await this.executeFlowReference(run, record, node, cwd);
			} else if (node.action.kind === "执行自定义命令") {
				const request = resolveCommandResources(
					{
						...renderCommandRequest(
							node.action.request,
							record.input,
							branchOutcomes,
						),
						cwd,
					},
					this.resources,
				);
				const commandResult = await this.commandExecutor.execute(request);
				outcome = {
					result: "已执行",
					content: {
						status: commandResult.status,
						exitCode: commandResult.exitCode,
						stdout: commandResult.stdout,
						stderr: commandResult.stderr,
					},
				};
			} else {
				const result = await this.agentModel.executeNode({
					runId: run.id,
					action: record.retryOf ? "复用Agent" : node.action.kind,
					nodeExecutionReference: record.id,
					prompt: renderAgentPrompt(
						node.action.prompt,
						record.input,
						node,
						this.resources,
					),
					outcomes: [...node.results].map(([name, description]) => ({
						name,
						description,
					})),
					cwd,
					onConnection: async (connection) => {
						if (run.sessionReference === connection.sessionReference) return;
						await this.commit(run, (next) => {
							next.sessionReference = connection.sessionReference;
							return {};
						});
					},
				});
				outcome = result.outcome;
				record.session = result.session;
			}
			await this.completeNode(run, record, outcome, round, branchRef);
			return { record, outcome };
		} catch (error) {
			if (record.status !== "failed") {
				await this.failNode(
					run,
					record,
					toFlowError(
						error,
						node.action.kind === "执行自定义命令"
							? "command_execution"
							: node.action.kind === "执行Flow"
								? "flow_reference"
								: "agent_execution",
					),
					round,
					branchRef,
				);
			}
			throw error;
		}
	}

	/** 执行Flow 节点：把输入交给子 Flow 作为独立 Run 运行到终态，再映射回节点结果。 */
	private async executeFlowReference(
		run: FlowRunRecord,
		record: NodeRunRecord,
		node: FlowNode,
		cwd: string | undefined,
	): Promise<NodeOutcome> {
		if (node.action.kind !== "执行Flow")
			throw new FlowRuntimeError(
				"flow_reference",
				`节点 ${node.ref} 不是 Flow 引用节点`,
			);
		const child = await this.startChildRun(run, record, node.action, cwd);
		return this.childOutcome(node, child);
	}

	private async startChildRun(
		run: FlowRunRecord,
		record: NodeRunRecord,
		action: FlowReferenceAction,
		cwd: string | undefined,
	): Promise<FlowRunRecord> {
		const pkg = this.references?.get(action.flow);
		if (!pkg)
			throw new FlowRuntimeError(
				"flow_reference",
				`被引用的 Flow 未在闭包中加载: ${action.flow}`,
			);
		const childTask =
			action.task === undefined
				? record.input
				: renderFlowReferenceTask(action.task, record.input);
		const childRunId = record.childRunId ?? randomUUID();
		try {
			return await this.coordinatorFor(pkg).run(childTask, {
				runId: childRunId,
				cwd,
				flowPath: pkg.path,
				parentRunId: run.id,
				parentNodeRunId: record.id,
			});
		} catch (error) {
			const persisted = await this.store.getRun(childRunId);
			if (persisted) return persisted;
			throw error;
		}
	}

	/** 子 Run 终态映射：completed 注入最终结论，failed 按节点写法处理。 */
	private async childOutcome(
		node: FlowNode,
		child: FlowRunRecord,
	): Promise<NodeOutcome> {
		const conclusion = await this.childConclusion(child.id);
		if (child.status === "completed") {
			return { result: FLOW_REFERENCE_SUCCESS_RESULT, content: conclusion };
		}
		if (node.successors.has(FLOW_REFERENCE_FAILURE_RESULT)) {
			return {
				result: FLOW_REFERENCE_FAILURE_RESULT,
				content: {
					status: "failure",
					runId: child.id,
					flowId: child.flowId,
					result: conclusion,
					error: child.error ?? {
						category: "flow_reference",
						summary: "子 Flow 运行失败",
					},
				},
			};
		}
		throw new FlowRuntimeError(
			"flow_reference",
			`子 Flow 运行失败 (${child.id}): ${child.error?.summary ?? "未知错误"}`,
		);
	}

	/** 子 Run 最终结论：最后一个已完成工作节点的结果内容。 */
	private async childConclusion(childRunId: string): Promise<FlowValue> {
		const records = (await this.store.listNodeRuns(childRunId))
			.filter((candidate) => candidate.status === "completed")
			.sort((left, right) => left.sequence - right.sequence);
		return records.at(-1)?.outcome?.content ?? null;
	}

	private coordinatorFor(pkg: FlowPackage): FlowCoordinator {
		return new FlowCoordinator(
			pkg.flow,
			this.store,
			this.agentModel,
			this.commandExecutor,
			this.publisher,
			this.onObservationError,
			pkg.resources,
			this.references,
		);
	}

	/** 父 NodeRun 中断后的引用节点恢复：先把子 Run 推到终态，再补全父节点结果并续接路由。 */
	private async resumeFlowReferenceNode(
		run: FlowRunRecord,
		current: NodeRunRecord,
		node: FlowNode,
		options: { existingAgentReference?: string; cwd?: string },
	): Promise<FlowRunRecord> {
		const child = (await this.store.listChildRuns(run.id)).find(
			(candidate) => candidate.parentNodeRunId === current.id,
		);
		let terminal: FlowRunRecord | undefined =
			child && (child.status === "completed" || child.status === "failed")
				? child
				: undefined;
		if (!terminal && child) {
			const pkg = this.references?.get(child.flowId);
			if (!pkg)
				throw new FlowRuntimeError(
					"flow_reference",
					`被引用的 Flow 未在闭包中加载: ${child.flowId}`,
				);
			terminal = await this.coordinatorFor(pkg).resumeRun(child.id, {
				cwd: options.cwd,
			});
		}
		if (!terminal) {
			// 没有子 Run：子 Flow 尚未启动，按中断重试整个节点。
			await this.interruptNode(run, current);
			await this.agentModel.start(
				run.id,
				options.existingAgentReference,
				options.cwd,
			);
			return this.continueRun(
				run,
				current.nodeRef,
				current.input,
				options,
				{ kind: "recovery", nodeRunId: current.id },
				true,
				undefined,
				current,
			);
		}
		try {
			const outcome = await this.childOutcome(node, terminal);
			if (current.status !== "completed")
				await this.completeNode(run, current, outcome);
			await this.agentModel.start(
				run.id,
				options.existingAgentReference,
				options.cwd,
			);
			await this.recordRecovery(
				run,
				current.id,
				"continue_routing",
				"从已终态的子 Flow 运行补全节点结果并续接路由",
			);
			return this.continueRun(
				run,
				current.nodeRef,
				current.input,
				options,
				current.enteredFrom,
				true,
				{ record: current, outcome },
			);
		} catch (error) {
			if (current.status !== "failed")
				await this.failNode(run, current, toFlowError(error, "flow_reference"));
			throw error;
		}
	}

	private async completeNode(
		run: FlowRunRecord,
		record: NodeRunRecord,
		outcome: NodeOutcome,
		round?: ParallelRoundRecord,
		branchRef?: string,
	): Promise<void> {
		record.status = "completed";
		record.outcome = outcome;
		record.completedAt = now();
		await this.commit(
			run,
			(next) => {
				next.phase = branchRef ? "waiting_parallel" : "routing";
				const updatedRound = round ? clone(round) : undefined;
				if (updatedRound && !branchRef) {
					updatedRound.status = "completed";
					updatedRound.joinOutcome = outcome;
					updatedRound.completedAt = record.completedAt;
					delete next.currentParallelRoundId;
				}
				return {
					nodeRuns: [record],
					parallelRounds: updatedRound ? [updatedRound] : undefined,
				};
			},
			[
				{
					type: "node.completed",
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef: record.nodeRef,
					nodeStatus: "completed",
					summary: `节点“${displayNodeName(record)}”已完成，结果为“${outcome.result}”`,
				},
			],
		);
	}

	private async selectRoute(
		run: FlowRunRecord,
		record: NodeRunRecord,
		result: string,
		destination: FlowDestination,
		parallelRoundId?: string,
		affectRun = true,
	): Promise<RouteDecisionRecord> {
		const decision: RouteDecisionRecord = {
			id: randomUUID(),
			runId: run.id,
			sequence: 0,
			sourceNodeRunId: record.id,
			result,
			destination,
			parallelRoundId,
			selectedAt: now(),
		};
		await this.commit(
			run,
			(next, sequence) => {
				decision.sequence = sequence;
				if (affectRun) next.phase = "routing";
				return { routeDecisions: [decision] };
			},
			[
				{
					type: "route.selected",
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef: record.nodeRef,
					result,
					destination,
					summary: `节点“${displayNodeName(record)}”选择结果“${result}”的去向`,
				},
			],
		);
		return decision;
	}

	private async enterParallel(
		run: FlowRunRecord,
		parallelRef: string,
		input: FlowValue,
		sourceNodeRunId: string,
		roundId: string,
	): Promise<void> {
		if (!this.flow.parallels.has(parallelRef)) {
			const error = new FlowRuntimeError(
				"parallel_configuration",
				`并行开始点不存在: ${parallelRef}`,
			);
			await this.failRun(run, toFlowError(error, "parallel_configuration"));
			throw error;
		}
		const round: ParallelRoundRecord = {
			id: roundId,
			runId: run.id,
			sequence: 0,
			parallelRef,
			input,
			status: "running",
			startedAt: now(),
			branchNodeRunIds: {},
			branchStatuses: {},
			sourceNodeRunId,
		};
		await this.commit(
			run,
			(next, sequence) => {
				round.sequence = sequence;
				next.phase = "waiting_parallel";
				delete next.currentNodeRef;
				delete next.currentNodeRunId;
				next.currentInput = input;
				next.currentParallelRoundId = round.id;
				return { parallelRounds: [round] };
			},
			[
				{
					type: "parallel.started",
					parallelRoundId: round.id,
					parallelStatus: "running",
					summary: `并行轮次“${parallelRef}”已开始`,
				},
			],
		);
	}

	private async completeRun(run: FlowRunRecord): Promise<void> {
		await this.commit(
			run,
			(next) => {
				next.status = "completed";
				next.phase = "completed";
				next.completedAt = now();
				delete next.currentNodeRef;
				delete next.currentNodeRunId;
				delete next.currentParallelRoundId;
				delete next.currentInput;
				return {};
			},
			[
				{
					type: "run.completed",
					summary: "Flow 运行已完成",
				},
			],
		);
	}

	private async interruptNode(
		run: FlowRunRecord,
		record: NodeRunRecord,
		round?: ParallelRoundRecord,
		branchRef?: string,
	): Promise<void> {
		record.status = "interrupted";
		record.completedAt = now();
		record.error = {
			category: "recovery",
			summary: "运行进程在节点完成前中断",
		};
		await this.commit(
			run,
			(next) => {
				next.status = "interrupted";
				next.phase = "interrupted";
				if (round) {
					round.status = "interrupted";
					round.error = record.error;
					if (branchRef) round.branchStatuses[branchRef] = "interrupted";
				}
				return {
					nodeRuns: [record],
					parallelRounds: round ? [round] : undefined,
				};
			},
			[
				{
					type: "node.interrupted",
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef: record.nodeRef,
					nodeStatus: "interrupted",
					summary: `节点“${displayNodeName(record)}”已中断`,
				},
				{
					type: "run.interrupted",
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef: record.nodeRef,
					summary: `节点“${displayNodeName(record)}”执行中断，Flow 运行已中断`,
				},
			],
		);
		await this.interruptActiveChildRuns(run.id, record.id);
	}

	/** 父节点被中断时，同节点仍活跃的子 Run 同步标记为 interrupted。 */
	private async interruptActiveChildRuns(
		runId: string,
		nodeRunId: string,
	): Promise<void> {
		const children = (await this.store.listChildRuns(runId)).filter(
			(child) =>
				child.status === "running" && child.parentNodeRunId === nodeRunId,
		);
		for (const child of children) {
			const running = (await this.store.listNodeRuns(child.id)).filter(
				(record) => record.status === "running",
			);
			for (const nodeRun of running) {
				nodeRun.status = "interrupted";
				nodeRun.completedAt = now();
				nodeRun.error = {
					category: "recovery",
					summary: "父节点中断，子 Flow 运行同步中断",
				};
			}
			const next = clone(child);
			next.status = "interrupted";
			next.phase = "interrupted";
			next.completedAt = now();
			next.sequence = child.sequence + 1;
			await this.store.commit({
				run: next,
				expectedSequence: child.sequence,
				nodeRuns: running,
			});
			this.publishObservation(next, {
				type: "run.interrupted",
				nodeRunId: undefined,
				summary: `父节点中断，子 Flow 运行 ${child.id} 已同步中断`,
			});
		}
	}

	private async failInterruptedCommand(
		run: FlowRunRecord,
		record: NodeRunRecord,
		round?: ParallelRoundRecord,
	): Promise<never> {
		const error: FlowError = {
			category: "command_interrupted",
			summary: `自定义命令节点“${displayNodeName(record)}”在完成前中断，无法安全自动重试`,
		};
		const recovery: RunRecoveryRecord = {
			id: randomUUID(),
			runId: run.id,
			sequence: 0,
			interruptedNodeRunId: record.id,
			strategy: "fail_command",
			resumedAt: now(),
			summary: error.summary,
		};
		await this.commit(
			run,
			(next, sequence) => {
				recovery.sequence = sequence;
				next.status = "failed";
				next.phase = "failed";
				next.error = error;
				next.completedAt = now();
				if (round) {
					round.status = "failed";
					round.error = error;
				}
				return {
					parallelRounds: round ? [round] : undefined,
					recoveries: [recovery],
				};
			},
			[
				{
					type: "run.failed",
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef: record.nodeRef,
					summary: error.summary,
				},
			],
		);
		throw new FlowRuntimeError(error.category, error.summary);
	}

	private async failNode(
		run: FlowRunRecord,
		record: NodeRunRecord,
		error: FlowError,
		round?: ParallelRoundRecord,
		branchRef?: string,
	): Promise<void> {
		record.status = "failed";
		record.error = error;
		record.completedAt ??= now();
		await this.commit(run, (next) => {
			next.status = "failed";
			next.phase = "failed";
			next.error = error;
			next.completedAt = now();
			if (round) {
				round.status = "failed";
				round.error = error;
				if (branchRef) round.branchStatuses[branchRef] = "failed";
			}
			return {
				nodeRuns: [record],
				parallelRounds: round ? [round] : undefined,
			};
		});
	}

	private async failRun(run: FlowRunRecord, error: FlowError): Promise<void> {
		await this.commit(run, (next) => {
			next.status = "failed";
			next.phase = "failed";
			next.error = error;
			next.completedAt = now();
			return {};
		});
	}

	private async recordRecovery(
		run: FlowRunRecord,
		interruptedNodeRunId: string | undefined,
		strategy: RunRecoveryRecord["strategy"],
		summary: string,
	): Promise<void> {
		const recovery: RunRecoveryRecord = {
			id: randomUUID(),
			runId: run.id,
			sequence: 0,
			interruptedNodeRunId,
			strategy,
			resumedAt: now(),
			summary,
		};
		await this.commit(run, (next, sequence) => {
			recovery.sequence = sequence;
			next.status = "running";
			next.phase = "routing";
			delete next.error;
			return { recoveries: [recovery] };
		});
	}

	private async requireParallelRound(
		run: FlowRunRecord,
		roundId: string,
	): Promise<ParallelRoundRecord> {
		const round = (await this.store.listParallelRounds(run.id)).find(
			(record) => record.id === roundId,
		);
		if (!round) {
			const error = new FlowRuntimeError(
				"parallel_configuration",
				`并行轮次不存在: ${roundId}`,
			);
			await this.failRun(run, toFlowError(error, "parallel_configuration"));
			throw error;
		}
		return round;
	}

	private destination(nodeRef: string, resultName: string): FlowDestination {
		const node = this.flow.nodes.get(nodeRef);
		const destination = node?.successors.get(resultName);
		if (!destination)
			throw new FlowRuntimeError(
				"route_not_found",
				`节点 ${nodeRef} 没有结果“${resultName}”的去向`,
			);
		return destination;
	}

	private publishObservationChanges(
		previous: FlowRunRecord,
		next: FlowRunRecord,
		changes: FactChanges,
		observationSpecs: ObservationSpec[] = [],
	): void {
		const specs: ObservationSpec[] = [...observationSpecs];
		if (specs.length === 0) {
			for (const record of changes.nodeRuns ?? []) {
				const type =
					record.status === "running"
						? "node.started"
						: record.status === "completed"
							? "node.completed"
							: record.status === "failed"
								? "node.failed"
								: "node.interrupted";
				specs.push({
					type,
					nodeRunId: record.id,
					nodeName: record.nodeName,
					nodeRef: record.nodeRef,
					nodeStatus: record.status,
					summary:
						type === "node.started"
							? `节点“${displayNodeName(record)}”开始执行`
							: `节点“${displayNodeName(record)}”状态为 ${record.status}`,
				});
			}
			for (const decision of changes.routeDecisions ?? []) {
				specs.push({
					type: "route.selected",
					nodeRunId: decision.sourceNodeRunId,
					result: decision.result,
					destination: decision.destination,
					summary: `节点选择结果“${decision.result}”的去向`,
				});
			}
			for (const round of changes.parallelRounds ?? []) {
				if (round.sequence === next.sequence) {
					specs.push({
						type: "parallel.started",
						parallelRoundId: round.id,
						parallelStatus: round.status,
						summary: `并行轮次“${round.parallelRef}”已开始`,
					});
				} else if (round.status === "completed") {
					specs.push({
						type: "parallel.completed",
						parallelRoundId: round.id,
						parallelStatus: round.status,
						summary: `并行轮次“${round.parallelRef}”已完成并准备汇合`,
					});
				}
			}
			for (const recovery of changes.recoveries ?? []) {
				if (recovery.strategy !== "fail_command") {
					specs.push({ type: "run.resumed", summary: recovery.summary });
				}
			}
			if (previous.status !== next.status) {
				if (next.status === "completed")
					specs.push({ type: "run.completed", summary: "Flow 运行已完成" });
				if (next.status === "failed") {
					const failedNode = [...(changes.nodeRuns ?? [])]
						.reverse()
						.find((record) => record.status === "failed");
					specs.push({
						type: "run.failed",
						nodeRunId: failedNode?.id,
						nodeName: failedNode?.nodeName,
						nodeRef: failedNode?.nodeRef,
						summary: failedNode
							? `节点“${displayNodeName(failedNode)}”执行失败：${next.error?.summary ?? "未知错误"}`
							: (next.error?.summary ?? "Flow 运行失败"),
					});
				}
				if (next.status === "interrupted")
					specs.push({ type: "run.interrupted", summary: "Flow 运行已中断" });
			}
		}
		for (const spec of specs) this.publishObservation(next, spec);
	}

	private publishObservation(run: FlowRunRecord, spec: ObservationSpec): void {
		if (!this.publisher) return;
		const event: FlowObservationEvent = {
			type: spec.type,
			runId: run.id,
			flowId: run.flowId,
			sequence: run.sequence,
			occurredAt: now(),
			status: run.status,
			phase: run.phase,
			nodeRunId: spec.nodeRunId,
			nodeName: spec.nodeName,
			nodeRef: spec.nodeRef,
			parallelRoundId: spec.parallelRoundId,
			result: spec.result,
			destination: spec.destination,
			nodeStatus: spec.nodeStatus,
			parallelStatus: spec.parallelStatus,
			summary: spec.summary,
		};
		try {
			this.publisher.publish(event);
		} catch (error) {
			try {
				this.onObservationError(error, event);
			} catch {
				// Diagnostics must never affect a persisted Run.
			}
		}
	}

	private async commit(
		run: FlowRunRecord,
		prepare: (next: FlowRunRecord, sequence: number) => FactChanges,
		observationSpecs: ObservationSpec[] = [],
	): Promise<void> {
		const write = this.writes.then(async () => {
			const expectedSequence = run.sequence;
			const next = clone(run);
			const sequence = expectedSequence + 1;
			const changes = prepare(next, sequence);
			next.sequence = sequence;
			await this.store.commit({
				run: next,
				expectedSequence,
				...changes,
			});
			const previous = clone(run);
			replaceObject(run, next);
			this.publishObservationChanges(previous, next, changes, observationSpecs);
		});
		this.writes = write.then(
			() => undefined,
			() => undefined,
		);
		return write;
	}
}

class FlowRuntimeError extends Error {
	readonly category: FlowErrorCategory;

	constructor(category: FlowErrorCategory, message: string) {
		super(message);
		this.category = category;
	}
}

function now(): string {
	return new Date().toISOString();
}

function toFlowError(error: unknown, fallback: FlowErrorCategory): FlowError {
	if (error instanceof FlowRuntimeError)
		return { category: error.category, summary: error.message };
	const summary = error instanceof Error ? error.message : String(error);
	if (
		/节点不允许结果|必须通过结果提交工具|只能提交一次结果|引用不匹配/.test(
			summary,
		)
	) {
		return { category: "outcome_validation", summary };
	}
	return { category: fallback, summary };
}

function fingerprintFlow(
	flow: FlowDefinition,
	references?: ReadonlyMap<string, FlowPackage>,
): string {
	const childIds = new Set<string>();
	for (const node of flow.nodes.values()) {
		if (node.action.kind === "执行Flow") childIds.add(node.action.flow);
	}
	const children = [...childIds].sort().map((id) => {
		const pkg = references?.get(id);
		if (!pkg)
			throw new FlowRuntimeError(
				"flow_reference",
				`被引用的 Flow 未在闭包中加载: ${id}`,
			);
		return fingerprintFlow(pkg.flow, references);
	});
	const definition = {
		id: flow.id,
		name: flow.name,
		description: flow.description,
		startNodeRef: flow.startNodeRef,
		nodes: [...flow.nodes.values()].map((node) => ({
			ref: node.ref,
			name: node.name,
			action: node.action,
			results: [...node.results.entries()],
			successors: [...node.successors.entries()],
		})),
		parallels: [...flow.parallels.values()],
	};
	return `sha256:${createHash("sha256").update(JSON.stringify({ definition, children })).digest("hex")}`;
}

function normalizeRun(run: FlowRunRecord): FlowRunRecord {
	const legacy = run as Partial<FlowRunRecord> & { error?: FlowError | string };
	const status = legacy.status ?? "running";
	const phase =
		legacy.phase ??
		(status === "completed" || status === "failed" || status === "interrupted"
			? status
			: legacy.currentParallelRound || legacy.currentParallelRoundId
				? "waiting_parallel"
				: legacy.currentNodeRef
					? "executing_node"
					: "starting");
	return {
		...run,
		flowVersion: legacy.flowVersion ?? "legacy:unknown",
		status,
		phase,
		sequence: legacy.sequence ?? 1,
		historyCompleteness:
			legacy.historyCompleteness ??
			(legacy.flowVersion ? "complete" : "legacy"),
		error:
			typeof legacy.error === "string"
				? { category: "legacy", summary: legacy.error }
				: legacy.error,
	} as FlowRunRecord;
}

function normalizeNodeRun(record: NodeRunRecord): NodeRunRecord {
	const legacy = record as Partial<NodeRunRecord>;
	return {
		...record,
		sequence: legacy.sequence ?? 0,
		actionKind: legacy.actionKind ?? "执行自定义命令",
		status:
			legacy.status ??
			(legacy.completedAt || legacy.outcome ? "completed" : "running"),
		enteredFrom: legacy.enteredFrom ?? { kind: "start" },
	} as NodeRunRecord;
}

function displayNodeName(
	record: Pick<NodeRunRecord, "nodeName" | "nodeRef">,
): string {
	return record.nodeName ?? record.nodeRef;
}

function normalizeParallelRound(
	round: ParallelRoundRecord,
	runId: string,
): ParallelRoundRecord {
	const legacy = round as Partial<ParallelRoundRecord>;
	const branchStatuses = { ...(legacy.branchStatuses ?? {}) };
	for (const branchRef of Object.keys(legacy.branchNodeRunIds ?? {})) {
		branchStatuses[branchRef] ??= "running";
	}
	return {
		...round,
		runId: legacy.runId ?? runId,
		sequence: legacy.sequence ?? 0,
		status: legacy.status ?? "running",
		startedAt: legacy.startedAt ?? now(),
		branchNodeRunIds: { ...(legacy.branchNodeRunIds ?? {}) },
		branchStatuses,
	} as ParallelRoundRecord;
}

function renderAgentPrompt(
	prompt: string,
	input: FlowValue,
	node: FlowNode,
	resources?: FlowResourceContext,
): string {
	const renderedInput =
		typeof input === "string" ? input : JSON.stringify(input, null, 2);
	const outcomes = [...node.results]
		.map(([name, description]) => `- ${name}: ${description}`)
		.join("\n");
	return `${resolvePromptResources(prompt, resources).replaceAll("{outcome}", renderedInput)}\n\n本节点只允许提交以下一个结果：\n${outcomes}\n\n完成工作后必须调用 submit_flow_outcome，并提供 outcome 和 content。`;
}

function replaceObject<T extends object>(target: T, source: T): void {
	for (const key of Object.keys(target)) {
		if (!(key in source)) delete (target as Record<string, unknown>)[key];
	}
	Object.assign(target, source);
}

function clone<T>(value: T): T {
	return structuredClone(value);
}
