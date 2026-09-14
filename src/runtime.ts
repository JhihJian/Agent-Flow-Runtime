import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { renderCommandRequest } from "./parser.ts";
import type {
	AgentConnection,
	AgentIntegrationAdapter,
	CommandExecutor,
	CommandRequest,
	CommandResult,
	FlowDefinition,
	FlowNode,
	FlowRunRecord,
	FlowValue,
	NodeOutcome,
	NodeRunRecord,
	NodeSession,
	OutcomeOption,
	ParallelRoundRecord,
	RunStore,
} from "./types.ts";

export class InMemoryRunStore implements RunStore {
	protected readonly runs = new Map<string, FlowRunRecord>();
	protected readonly nodeRuns = new Map<string, NodeRunRecord>();

	async createRun(run: FlowRunRecord): Promise<void> {
		if (this.runs.has(run.id)) throw new Error(`Flow 运行已存在: ${run.id}`);
		this.runs.set(run.id, clone(run));
	}

	async updateRun(run: FlowRunRecord): Promise<void> {
		if (!this.runs.has(run.id)) throw new Error(`Flow 运行不存在: ${run.id}`);
		this.runs.set(run.id, clone(run));
	}

	async getRun(runId: string): Promise<FlowRunRecord | undefined> {
		const run = this.runs.get(runId);
		return run && clone(run);
	}

	async listRuns(flowId: string): Promise<FlowRunRecord[]> {
		return [...this.runs.values()]
			.filter((run) => run.flowId === flowId)
			.map(clone);
	}

	async listRunningRuns(): Promise<FlowRunRecord[]> {
		return [...this.runs.values()]
			.filter((run) => run.status === "running")
			.map(clone);
	}

	async createNodeRun(record: NodeRunRecord): Promise<void> {
		if (this.nodeRuns.has(record.id))
			throw new Error(`节点运行已存在: ${record.id}`);
		this.nodeRuns.set(record.id, clone(record));
	}

	async updateNodeRun(record: NodeRunRecord): Promise<void> {
		if (!this.nodeRuns.has(record.id))
			throw new Error(`节点运行不存在: ${record.id}`);
		this.nodeRuns.set(record.id, clone(record));
	}

	async listNodeRuns(runId: string): Promise<NodeRunRecord[]> {
		return [...this.nodeRuns.values()]
			.filter((record) => record.runId === runId)
			.map(clone);
	}
}

interface PersistedRuns {
	runs: FlowRunRecord[];
	nodeRuns: NodeRunRecord[];
}

export class JsonFileRunStore extends InMemoryRunStore {
	private initialized = false;
	private writes = Promise.resolve();
	private readonly file: string;

	constructor(file: string) {
		super();
		this.file = file;
	}

	private async load(): Promise<void> {
		if (this.initialized) return;
		this.initialized = true;
		try {
			const saved = JSON.parse(
				await readFile(this.file, "utf8"),
			) as PersistedRuns;
			for (const run of saved.runs) await super.createRun(run);
			for (const nodeRun of saved.nodeRuns) await super.createNodeRun(nodeRun);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
		}
	}

	private async persist(): Promise<void> {
		const saved: PersistedRuns = {
			runs: [...this.runs.values()].map(clone),
			nodeRuns: [...this.nodeRuns.values()].map(clone),
		};
		await mkdir(dirname(this.file), { recursive: true });
		await writeFile(this.file, `${JSON.stringify(saved, null, 2)}\n`, "utf8");
	}

	private async mutate(operation: () => Promise<void>): Promise<void> {
		await this.load();
		await operation();
		this.writes = this.writes.then(() => this.persist());
		await this.writes;
	}

	override async createRun(run: FlowRunRecord): Promise<void> {
		await this.mutate(() => super.createRun(run));
	}

	override async updateRun(run: FlowRunRecord): Promise<void> {
		await this.mutate(() => super.updateRun(run));
	}

	override async getRun(runId: string): Promise<FlowRunRecord | undefined> {
		await this.load();
		return super.getRun(runId);
	}

	override async listRuns(flowId: string): Promise<FlowRunRecord[]> {
		await this.load();
		return super.listRuns(flowId);
	}

	override async listRunningRuns(): Promise<FlowRunRecord[]> {
		await this.load();
		return super.listRunningRuns();
	}

	override async createNodeRun(record: NodeRunRecord): Promise<void> {
		await this.mutate(() => super.createNodeRun(record));
	}

	override async updateNodeRun(record: NodeRunRecord): Promise<void> {
		await this.mutate(() => super.updateNodeRun(record));
	}

	override async listNodeRuns(runId: string): Promise<NodeRunRecord[]> {
		await this.load();
		return super.listNodeRuns(runId);
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

	constructor(
		flow: FlowDefinition,
		store: RunStore,
		agentModel: AgentRunModel,
		commandExecutor: CommandExecutor = new ProcessCommandExecutor(),
	) {
		this.flow = flow;
		this.store = store;
		this.agentModel = agentModel;
		this.commandExecutor = commandExecutor;
	}

	async run(
		task: FlowValue,
		options: {
			runId?: string;
			existingAgentReference?: string;
			cwd?: string;
			flowPath?: string;
			sessionReference?: string;
		} = {},
	): Promise<FlowRunRecord> {
		const run: FlowRunRecord = {
			id: options.runId ?? randomUUID(),
			flowId: this.flow.id,
			task,
			status: "running",
			startedAt: new Date().toISOString(),
			flowPath: options.flowPath,
			cwd: options.cwd,
			sessionReference: options.sessionReference,
			currentNodeRef: this.flow.startNodeRef,
			currentInput: task,
		};
		await this.store.createRun(run);
		return this.continueRun(run, this.flow.startNodeRef, task, options);
	}

	/** Continue a persisted running Flow after its Pi session has been resumed. */
	async resume(
		runId: string,
		options: {
			existingAgentReference?: string;
			cwd?: string;
		} = {},
	): Promise<FlowRunRecord> {
		const run = await this.store.getRun(runId);
		if (!run) throw new Error(`Flow 运行不存在: ${runId}`);
		if (run.flowId !== this.flow.id)
			throw new Error(`Flow 运行不属于当前 Flow: ${runId}`);
		if (run.status !== "running")
			throw new Error(`Flow 运行不是执行中状态: ${runId}`);
		if (!run.currentNodeRef && !run.currentParallelRound) {
			throw new Error(`Flow 运行缺少可恢复的执行位置: ${runId}`);
		}

		const nodeRuns = await this.store.listNodeRuns(run.id);
		const completedCurrentNode = run.currentNodeRunId
			? nodeRuns.find(
					(record) =>
						record.id === run.currentNodeRunId &&
						record.completedAt &&
						record.outcome,
				)
			: undefined;
		const interrupted = run.currentParallelRound
			? undefined
			: [...nodeRuns]
					.reverse()
					.find(
						(record) =>
							record.nodeRef === run.currentNodeRef &&
							!record.completedAt &&
							!record.outcome,
					);
		const currentNodeRef =
			completedCurrentNode?.nodeRef ??
			interrupted?.nodeRef ??
			run.currentNodeRef;
		const currentInput =
			completedCurrentNode?.input ??
			interrupted?.input ??
			run.currentInput ??
			run.task;
		if (!currentNodeRef && !run.currentParallelRound) {
			throw new Error(`Flow 运行缺少当前节点: ${runId}`);
		}
		const interruptedNode = currentNodeRef
			? this.flow.nodes.get(currentNodeRef)
			: undefined;
		if (interrupted && interruptedNode?.action.kind === "执行自定义命令") {
			return this.failInterruptedCommand(run, interrupted.nodeRef);
		}

		const resumedOptions = {
			existingAgentReference:
				options.existingAgentReference ?? run.sessionReference,
			cwd: options.cwd ?? run.cwd,
		};
		await this.agentModel.start(
			run.id,
			resumedOptions.existingAgentReference,
			resumedOptions.cwd,
		);
		return this.continueRun(
			run,
			currentNodeRef ?? this.flow.startNodeRef,
			currentInput,
			resumedOptions,
			interruptedNode?.action.kind === "执行自定义命令"
				? undefined
				: interrupted?.nodeRef,
			true,
			completedCurrentNode?.outcome,
		);
	}

	private async failInterruptedCommand(
		run: FlowRunRecord,
		nodeRef: string,
	): Promise<never> {
		const error = `自定义命令节点“${nodeRef}”在完成前中断，无法安全自动重试`;
		run.status = "failed";
		run.error = error;
		run.completedAt = new Date().toISOString();
		await this.store.updateRun(run);
		throw new Error(error);
	}

	private async continueRun(
		run: FlowRunRecord,
		initialNodeRef: string,
		initialInput: FlowValue,
		options: { existingAgentReference?: string; cwd?: string },
		resumeInterruptedNodeRef?: string,
		agentStarted = false,
		initialOutcome?: NodeOutcome,
	): Promise<FlowRunRecord> {
		if (!agentStarted) {
			await this.agentModel.start(
				run.id,
				options.existingAgentReference,
				options.cwd,
			);
		}
		try {
			let currentNodeRef = initialNodeRef;
			let input = initialInput;
			let branchOutcomes = new Map<string, NodeOutcome>();
			let outcome = initialOutcome;
			let actionOverride: "新建Agent" | "复用Agent" | undefined =
				resumeInterruptedNodeRef ? "复用Agent" : undefined;
			while (true) {
				if (run.currentParallelRound) {
					const round = run.currentParallelRound;
					const parallel = this.flow.parallels.get(round.parallelRef);
					if (!parallel)
						throw new Error(`并行开始点不存在: ${round.parallelRef}`);
					const branchResults = await this.executeParallel(
						run,
						parallel.ref,
						round.input,
						options.cwd,
						round,
					);
					currentNodeRef = parallel.joinRef;
					input = branchResults.input;
					branchOutcomes = branchResults.outcomes;
					run.currentNodeRef = currentNodeRef;
					run.currentInput = input;
					run.currentNodeRunId = undefined;
					run.currentParallelRound = undefined;
					await this.store.updateRun(run);
				}
				const result = outcome
					? { outcome }
					: await this.executeNode(
							run,
							currentNodeRef,
							input,
							options.cwd,
							branchOutcomes,
							actionOverride,
						);
				outcome = undefined;
				branchOutcomes = new Map();
				actionOverride = undefined;
				const destination = this.destination(
					currentNodeRef,
					result.outcome.result,
				);
				if (destination.kind === "finish") {
					run.status = "completed";
					run.completedAt = new Date().toISOString();
					run.currentNodeRef = undefined;
					run.currentNodeRunId = undefined;
					await this.store.updateRun(run);
					await this.agentModel.end(run.id);
					return clone(run);
				}
				if (destination.kind === "node") {
					currentNodeRef = destination.ref;
					input = result.outcome.content;
					run.currentNodeRef = currentNodeRef;
					run.currentInput = input;
					run.currentNodeRunId = undefined;
					await this.store.updateRun(run);
					continue;
				}
				const parallel = this.flow.parallels.get(destination.ref);
				if (!parallel) throw new Error(`并行开始点不存在: ${destination.ref}`);
				const branchResults = await this.executeParallel(
					run,
					parallel.ref,
					input,
					options.cwd,
				);
				currentNodeRef = parallel.joinRef;
				input = branchResults.input;
				run.currentNodeRef = currentNodeRef;
				run.currentInput = input;
				run.currentNodeRunId = undefined;
				run.currentParallelRound = undefined;
				await this.store.updateRun(run);
				const joinResult = await this.executeNode(
					run,
					currentNodeRef,
					input,
					options.cwd,
					branchResults.outcomes,
				);
				const joinDestination = this.destination(
					currentNodeRef,
					joinResult.outcome.result,
				);
				if (joinDestination.kind === "finish") {
					run.status = "completed";
					run.completedAt = new Date().toISOString();
					run.currentNodeRef = undefined;
					run.currentNodeRunId = undefined;
					await this.store.updateRun(run);
					await this.agentModel.end(run.id);
					return clone(run);
				}
				if (joinDestination.kind === "parallel")
					throw new Error("汇合节点不能直接进入另一个并行开始点");
				currentNodeRef = joinDestination.ref;
				input = joinResult.outcome.content;
				run.currentNodeRef = currentNodeRef;
				run.currentInput = input;
				run.currentNodeRunId = undefined;
				await this.store.updateRun(run);
			}
		} catch (error) {
			run.status = "failed";
			run.error = error instanceof Error ? error.message : String(error);
			run.completedAt = new Date().toISOString();
			await this.store.updateRun(run);
			await this.agentModel.end(run.id);
			throw error;
		}
	}

	private async executeParallel(
		run: FlowRunRecord,
		parallelRef: string,
		input: FlowValue,
		cwd?: string,
		existingRound?: ParallelRoundRecord,
	) {
		const parallel = this.flow.parallels.get(parallelRef);
		if (!parallel) throw new Error(`并行开始点不存在: ${parallelRef}`);
		const round: ParallelRoundRecord = existingRound ?? {
			id: randomUUID(),
			parallelRef,
			input,
			branchNodeRunIds: {},
		};
		run.currentNodeRef = undefined;
		run.currentInput = input;
		run.currentNodeRunId = undefined;
		run.currentParallelRound = round;
		await this.store.updateRun(run);
		const records = await this.store.listNodeRuns(run.id);
		for (const branchRef of parallel.branches) {
			let recordId = round.branchNodeRunIds[branchRef];
			if (!recordId) {
				recordId = randomUUID();
				round.branchNodeRunIds[branchRef] = recordId;
				await this.store.updateRun(run);
			}
			const existingRecord = records.find((record) => record.id === recordId);
			if (existingRecord && !existingRecord.outcome) {
				await this.failInterruptedCommand(run, branchRef);
			}
		}
		const results = await Promise.all(
			parallel.branches.map(async (branchRef) => {
				const recordId = round.branchNodeRunIds[branchRef];
				if (!recordId) throw new Error(`并行分支缺少执行记录: ${branchRef}`);
				const existingRecord = records.find((record) => record.id === recordId);
				if (existingRecord?.outcome) {
					return [branchRef, existingRecord.outcome] as const;
				}
				const result = await this.executeNode(
					run,
					branchRef,
					input,
					cwd,
					new Map(),
					undefined,
					false,
					recordId,
				);
				return [branchRef, result.outcome] as const;
			}),
		);
		return { input, outcomes: new Map(results) };
	}

	private async executeNode(
		run: FlowRunRecord,
		nodeRef: string,
		input: FlowValue,
		cwd?: string,
		branchOutcomes: ReadonlyMap<string, NodeOutcome> = new Map(),
		actionOverride?: "新建Agent" | "复用Agent",
		trackAsCurrentNode = true,
		recordId: string = randomUUID(),
	): Promise<{ record: NodeRunRecord; outcome: NodeOutcome }> {
		const node = this.flow.nodes.get(nodeRef);
		if (!node) throw new Error(`工作节点不存在: ${nodeRef}`);
		const record: NodeRunRecord = {
			id: recordId,
			runId: run.id,
			nodeRef,
			input,
			startedAt: new Date().toISOString(),
		};
		await this.store.createNodeRun(record);
		if (trackAsCurrentNode) {
			run.currentNodeRef = nodeRef;
			run.currentInput = input;
			run.currentNodeRunId = record.id;
			await this.store.updateRun(run);
		}
		let outcome: NodeOutcome;
		if (node.action.kind === "执行自定义命令") {
			const request = {
				...renderCommandRequest(node.action.request, input, branchOutcomes),
				cwd,
			};
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
				action: actionOverride ?? node.action.kind,
				nodeExecutionReference: record.id,
				prompt: renderAgentPrompt(node.action.prompt, input, node),
				outcomes: [...node.results].map(([name, description]) => ({
					name,
					description,
				})),
				cwd,
				onConnection: async (connection) => {
					if (run.sessionReference === connection.sessionReference) return;
					run.sessionReference = connection.sessionReference;
					await this.store.updateRun(run);
				},
			});
			outcome = result.outcome;
			record.session = result.session;
		}
		record.outcome = outcome;
		record.completedAt = new Date().toISOString();
		await this.store.updateNodeRun(record);
		return { record, outcome };
	}

	private destination(nodeRef: string, resultName: string) {
		const node = this.flow.nodes.get(nodeRef);
		const destination = node?.successors.get(resultName);
		if (!destination)
			throw new Error(`节点 ${nodeRef} 没有结果“${resultName}”的去向`);
		return destination;
	}
}

function renderAgentPrompt(
	prompt: string,
	input: FlowValue,
	node: FlowNode,
): string {
	const renderedInput =
		typeof input === "string" ? input : JSON.stringify(input, null, 2);
	const outcomes = [...node.results]
		.map(([name, description]) => `- ${name}: ${description}`)
		.join("\n");
	return `${prompt.replaceAll("{outcome}", renderedInput)}\n\n本节点只允许提交以下一个结果：\n${outcomes}\n\n完成工作后必须调用 submit_flow_outcome，并提供 outcome 和 content。`;
}

function clone<T>(value: T): T {
	return structuredClone(value);
}
