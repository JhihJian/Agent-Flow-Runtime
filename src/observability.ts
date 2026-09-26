import type {
	FlowNodeEvidence,
	FlowNodeEvidenceAuthorizer,
	FlowNodeEvidenceReader,
	FlowNodeEvidenceSummary,
	FlowNodeRunView,
	FlowObservationEvent,
	FlowObservationPublisherApi,
	FlowObservationPublisherOptions,
	FlowObservationSubscription,
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

/** In-process best-effort publisher. It is not an event log or state store. */
export class FlowObservationPublisher implements FlowObservationPublisherApi {
	private readonly listeners = new Map<
		string,
		Set<(event: FlowObservationEvent) => void>
	>();
	private readonly onError: (
		error: unknown,
		event: FlowObservationEvent,
	) => void;

	constructor(options: FlowObservationPublisherOptions = {}) {
		this.onError = options.onError ?? (() => undefined);
	}

	publish(event: FlowObservationEvent): void {
		const listeners = [...(this.listeners.get(event.runId) ?? [])];
		for (const listener of listeners) {
			try {
				listener(structuredClone(event));
			} catch (error) {
				try {
					this.onError(error, event);
				} catch {
					// Diagnostics must not affect a persisted Run or its execution.
				}
			}
		}
	}

	subscribe(
		runId: string,
		listener: (event: FlowObservationEvent) => void,
	): FlowObservationSubscription {
		let listeners = this.listeners.get(runId);
		if (!listeners) {
			listeners = new Set();
			this.listeners.set(runId, listeners);
		}
		listeners.add(listener);
		let active = true;
		return {
			unsubscribe: () => {
				if (!active) return;
				active = false;
				listeners?.delete(listener);
				if (listeners?.size === 0) this.listeners.delete(runId);
			},
		};
	}
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

	async listRecentRuns(limit = 10): Promise<FlowRunSummary[]> {
		const runs = await this.store.listAllRuns();
		return runs
			.sort((left, right) => right.startedAt.localeCompare(left.startedAt))
			.slice(0, Math.max(0, limit))
			.map(toRunSummary);
	}

	async inspectRun(runId: string): Promise<FlowRunHistory | undefined> {
		const persisted = await this.store.getRunSnapshot(runId);
		if (!persisted) return undefined;
		const { run, nodeRuns, routeDecisions, parallelRounds, recoveries } =
			persisted;
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
			nodeRuns: orderedNodeRuns.map(toNodeRunView),
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
			nodeName: record.nodeName,
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

export interface FlowRunObservation {
	snapshot: FlowRunHistory;
	subscription: FlowObservationSubscription;
}

/** Unified read/observe facade used by SDK, Pi, and protocol adapters. */

export class FlowRuntime implements FlowRunInspectorApi {
	private readonly inspector: FlowRunInspectorApi;
	private readonly publisher: FlowObservationPublisherApi;

	constructor(
		inspector: FlowRunInspectorApi,
		publisher: FlowObservationPublisherApi,
	) {
		this.inspector = inspector;
		this.publisher = publisher;
	}

	listRecentRuns(limit?: number): Promise<FlowRunSummary[]> {
		return this.inspector.listRecentRuns(limit);
	}

	inspectRun(runId: string): Promise<FlowRunHistory | undefined> {
		return this.inspector.inspectRun(runId);
	}

	inspectNodeEvidence(
		runId: string,
		nodeRunId: string,
	): Promise<FlowNodeEvidence | undefined> {
		return this.inspector.inspectNodeEvidence(runId, nodeRunId);
	}

	subscribe(
		runId: string,
		listener: (event: FlowObservationEvent) => void,
	): FlowObservationSubscription {
		return this.publisher.subscribe(runId, listener);
	}

	/** Register first, buffer the race window, then expose a stable snapshot. */
	async openRunObservation(
		runId: string,
		listener: (event: FlowObservationEvent) => void,
	): Promise<FlowRunObservation | undefined> {
		let snapshotReady = false;
		const buffered: FlowObservationEvent[] = [];
		const subscription = this.subscribe(runId, (event) => {
			if (!snapshotReady) buffered.push(event);
			else listener(event);
		});
		try {
			const snapshot = await this.inspectRun(runId);
			if (!snapshot) {
				subscription.unsubscribe();
				return undefined;
			}
			snapshotReady = true;
			for (const event of buffered.sort(
				(left, right) => left.sequence - right.sequence,
			)) {
				if (event.sequence > snapshot.run.sequence) listener(event);
			}
			return { snapshot, subscription };
		} catch (error) {
			subscription.unsubscribe();
			throw error;
		}
	}
}

export function formatFlowRunHistory(history: FlowRunHistory): string {
	const lines = [
		`Run ${history.run.id} | Flow ${history.run.flowId} | ${history.run.status} / ${history.run.phase}`,
		`Task: ${formatValue(history.run.task)}`,
		`Flow version: ${history.run.flowVersion}`,
		`History: ${history.run.historyCompleteness} | sequence ${history.run.sequence}`,
		"Path:",
	];
	for (const node of history.nodeRuns) {
		const result = node.result ? ` -> ${node.result}` : "";
		lines.push(
			`  ${node.sequence}. ${node.nodeName ?? node.nodeRef} [${node.status}]${result}`,
		);
	}
	for (const route of history.routeDecisions) {
		lines.push(
			`Route ${route.sourceNodeRunId}: ${route.result} -> ${formatDestination(route.destination)}`,
		);
	}
	for (const round of history.parallelRounds) {
		lines.push(
			`Parallel ${round.id} [${round.status}] branches: ${Object.keys(round.branchNodeRunIds).join(", ")}`,
		);
	}
	if (history.run.error) lines.push(`Error: ${history.run.error.summary}`);
	return lines.join("\n");
}

export function toFlowEventEnvelope(event: FlowObservationEvent): {
	type: "flow_event";
	event: FlowObservationEvent;
} {
	return { type: "flow_event", event };
}

function formatDestination(
	destination: FlowRunHistory["routeDecisions"][number]["destination"],
): string {
	if (destination.kind === "finish") return "finish";
	return `${destination.kind}:${destination.ref}`;
}

function formatValue(value: FlowValue): string {
	return typeof value === "string" ? value : JSON.stringify(value);
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

function toNodeRunView(record: NodeRunRecord): FlowNodeRunView {
	return {
		id: record.id,
		runId: record.runId,
		sequence: record.sequence,
		nodeName: record.nodeName,
		nodeRef: record.nodeRef,
		actionKind: record.actionKind,
		input: record.input,
		status: record.status,
		startedAt: record.startedAt,
		completedAt: record.completedAt,
		result: record.outcome?.result,
		error: record.error,
		session: record.session,
		retryOf: record.retryOf,
		enteredFrom: record.enteredFrom,
		parallelRoundId: record.parallelRoundId,
		childRunId: record.childRunId,
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
			nodeName: nodeRun?.nodeName,
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
