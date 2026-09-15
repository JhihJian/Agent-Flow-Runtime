import type {
	FlowNodeEvidence,
	FlowNodeEvidenceAuthorizer,
	FlowNodeEvidenceReader,
	FlowNodeEvidenceSummary,
	FlowRunHistory,
	FlowRunInspectorApi,
	FlowRunLocation,
	FlowRunRecord,
	FlowRunSummary,
	FlowValue,
	NodeRunRecord,
	RunStore,
} from "./types.ts";

export interface FlowRunInspectorOptions {
	evidenceReader?: FlowNodeEvidenceReader;
	authorizeEvidence?: FlowNodeEvidenceAuthorizer;
}

/**
 * Runtime's single read model for a Run. It only composes persisted facts and
 * optional evidence readers. It never evaluates Flow edges or changes state.
 */

export class FlowRunInspector implements FlowRunInspectorApi {
	private readonly store: RunStore;
	private readonly evidenceReader?: FlowNodeEvidenceReader;
	private readonly authorizeEvidence: FlowNodeEvidenceAuthorizer;

	constructor(
		store: RunStore,
		options: FlowRunInspectorOptions | FlowNodeEvidenceReader = {},
	) {
		this.store = store;
		if (isEvidenceReader(options)) {
			this.evidenceReader = options;
			this.authorizeEvidence = () => true;
		} else {
			this.evidenceReader = options.evidenceReader;
			this.authorizeEvidence = options.authorizeEvidence ?? (() => true);
		}
	}

	async inspectRun(runId: string): Promise<FlowRunHistory | undefined> {
		const run = await this.store.getRun(runId);
		if (!run) return undefined;
		const [nodeRuns, routeDecisions, parallelRounds, recoveries] =
			await Promise.all([
				this.store.listNodeRuns(runId),
				this.store.listRouteDecisions(runId),
				this.store.listParallelRounds(runId),
				this.store.listRunRecoveries(runId),
			]);
		const orderedNodeRuns = nodeRuns
			.filter((record) => record.runId === runId)
			.sort(bySequence);
		const orderedRoutes = routeDecisions
			.filter((record) => record.runId === runId)
			.sort(bySequence);
		const orderedRounds = parallelRounds
			.filter((record) => record.runId === runId)
			.sort(bySequence);
		const orderedRecoveries = recoveries
			.filter((record) => record.runId === runId)
			.sort(bySequence);

		return {
			run: toRunSummary(run),
			nodeRuns: orderedNodeRuns,
			routeDecisions: orderedRoutes,
			parallelRounds: orderedRounds,
			recoveries: orderedRecoveries,
			current: locateCurrent(run, orderedNodeRuns, orderedRounds),
			evidence: Object.fromEntries(
				orderedNodeRuns.map((record) => [record.id, evidenceSummary(record)]),
			),
		};
	}

	async inspectNodeEvidence(
		runId: string,
		nodeRunId: string,
	): Promise<FlowNodeEvidence | undefined> {
		const run = await this.store.getRun(runId);
		if (!run) return undefined;
		const record = (await this.store.listNodeRuns(runId)).find(
			(candidate) => candidate.runId === runId && candidate.id === nodeRunId,
		);
		if (!record) return undefined;
		if (!(await this.authorizeEvidence({ runId, nodeRun: record }))) {
			return undefined;
		}

		const evidence: FlowNodeEvidence = {
			runId,
			nodeRunId: record.id,
			nodeRef: record.nodeRef,
			status: record.status,
			input: record.input,
			outcome: record.outcome,
			error: record.error,
			session: record.session,
		};
		if (record.session && this.evidenceReader) {
			evidence.messages = await this.evidenceReader.getNodeSession(
				record.session,
			);
		}
		const commandResult =
			record.actionKind === "执行自定义命令"
				? toCommandResult(record.outcome?.content)
				: undefined;
		if (commandResult) evidence.commandResult = commandResult;
		return evidence;
	}
}

function isEvidenceReader(
	value: FlowRunInspectorOptions | FlowNodeEvidenceReader,
): value is FlowNodeEvidenceReader {
	return "getNodeSession" in value;
}

function bySequence(left: { sequence: number }, right: { sequence: number }) {
	return left.sequence - right.sequence;
}

function toRunSummary(run: FlowRunRecord): FlowRunSummary {
	return {
		id: run.id,
		flowId: run.flowId,
		flowVersion: run.flowVersion,
		task: run.task,
		status: run.status,
		phase: run.phase,
		sequence: run.sequence,
		historyCompleteness: run.historyCompleteness,
		startedAt: run.startedAt,
		completedAt: run.completedAt,
		error: run.error,
	};
}

function locateCurrent(
	run: FlowRunRecord,
	nodeRuns: NodeRunRecord[],
	parallelRounds: FlowRunHistory["parallelRounds"],
): FlowRunLocation {
	if (run.currentParallelRoundId) {
		const round = parallelRounds.find(
			(candidate) => candidate.id === run.currentParallelRoundId,
		);
		if (round) {
			return {
				kind: "parallel",
				parallelRoundId: round.id,
				parallelRef: round.parallelRef,
			};
		}
	}
	if (run.currentNodeRef) {
		const nodeRun = run.currentNodeRunId
			? nodeRuns.find((candidate) => candidate.id === run.currentNodeRunId)
			: undefined;
		return {
			kind: "node",
			nodeRunId: nodeRun?.id,
			nodeRef: nodeRun?.nodeRef ?? run.currentNodeRef,
		};
	}
	return { kind: "none" };
}

function evidenceSummary(record: NodeRunRecord): FlowNodeEvidenceSummary {
	return {
		sessionReference: record.session?.sessionReference,
		interactionReference: record.session?.interactionReference,
		commandOutputAvailable:
			record.actionKind === "执行自定义命令" &&
			toCommandResult(record.outcome?.content) !== undefined,
	};
}

function toCommandResult(
	value: FlowValue | undefined,
): FlowNodeEvidence["commandResult"] {
	if (!isRecord(value)) return undefined;
	if (
		(value.status !== "success" && value.status !== "failure") ||
		(typeof value.exitCode !== "number" && value.exitCode !== null) ||
		typeof value.stdout !== "string" ||
		typeof value.stderr !== "string"
	) {
		return undefined;
	}
	return {
		status: value.status,
		exitCode: value.exitCode,
		stdout: value.stdout,
		stderr: value.stderr,
	};
}

function isRecord(value: FlowValue | undefined): value is {
	[key: string]: FlowValue;
} {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
