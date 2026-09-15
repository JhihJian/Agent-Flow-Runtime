import type {
	FlowNodeEvidence,
	FlowNodeRunView,
	FlowObservationEvent,
	FlowObservationSubscription,
	FlowRunHistory,
	FlowRunSummary,
	NodeRunStatus,
	ParallelRoundRecord,
	RouteDecisionRecord,
	RunRecoveryRecord,
} from "./types.ts";

export interface FlowRunVisualizationRuntime {
	listRecentRuns(limit?: number): Promise<FlowRunSummary[]>;
	inspectRun(runId: string): Promise<FlowRunHistory | undefined>;
	inspectNodeEvidence(
		runId: string,
		nodeRunId: string,
	): Promise<FlowNodeEvidence | undefined>;
	openRunObservation(
		runId: string,
		listener: (event: FlowObservationEvent) => void,
	): Promise<
		| {
				snapshot: FlowRunHistory;
				subscription: FlowObservationSubscription;
		  }
		| undefined
	>;
}

export type FlowRunCenterFilter = "all" | "running" | "terminal" | "attention";

export interface FlowRunListItem {
	runId: string;
	flowId: string;
	flowVersion: string;
	taskSummary: string;
	status: FlowRunSummary["status"];
	phase: FlowRunSummary["phase"];
	startedAt: string;
	completedAt?: string;
	errorSummary?: string;
	historyCompleteness: FlowRunSummary["historyCompleteness"];
}

export interface FlowRunCenterState {
	runs: FlowRunListItem[];
	filter: FlowRunCenterFilter;
	selectedRunId?: string;
	loading: boolean;
	error?: string;
	refreshedAt?: string;
}

export type FlowFactSelection =
	| { kind: "node"; nodeRunId: string }
	| { kind: "route"; routeDecisionId: string }
	| { kind: "parallel"; parallelRoundId: string }
	| { kind: "recovery"; recoveryId: string };

interface FlowTimelineBase {
	id: string;
	sequence: number;
	occurredAt?: string;
}

export interface FlowNodeTimelineItem extends FlowTimelineBase {
	kind: "node";
	nodeRunId: string;
	nodeRef: string;
	nodeName?: string;
	status: NodeRunStatus;
	result?: string;
	retryOf?: string;
	parallelRoundId?: string;
}

export interface FlowRouteTimelineItem extends FlowTimelineBase {
	kind: "route";
	routeDecisionId: string;
	sourceNodeRunId: string;
	result: string;
	destination: RouteDecisionRecord["destination"];
}

export interface FlowParallelBranchTimelineItem {
	branchRef: string;
	nodeRunId?: string;
	nodeName?: string;
	status?: NodeRunStatus;
	result?: string;
}

export interface FlowParallelTimelineItem extends FlowTimelineBase {
	kind: "parallel";
	parallelRoundId: string;
	parallelRef: string;
	status: ParallelRoundRecord["status"];
	branches: FlowParallelBranchTimelineItem[];
	joinNodeRunId?: string;
	joinNodeName?: string;
	joinResult?: string;
}

export interface FlowRecoveryTimelineItem extends FlowTimelineBase {
	kind: "recovery";
	recoveryId: string;
	interruptedNodeRunId?: string;
	retryNodeRunId?: string;
	strategy: RunRecoveryRecord["strategy"];
	summary: string;
}

export interface FlowRunTerminalTimelineItem extends FlowTimelineBase {
	kind: "terminal";
	status: Extract<
		FlowRunSummary["status"],
		"completed" | "failed" | "interrupted"
	>;
	errorSummary?: string;
}

export type FlowTimelineItem =
	| FlowNodeTimelineItem
	| FlowRouteTimelineItem
	| FlowParallelTimelineItem
	| FlowRecoveryTimelineItem
	| FlowRunTerminalTimelineItem;

export interface FlowRunDetailState {
	runId: string;
	snapshot?: FlowRunHistory;
	timeline: FlowTimelineItem[];
	selectedFact?: FlowFactSelection;
	evidence?: FlowNodeEvidence;
	evidenceState: "idle" | "loading" | "available" | "unavailable";
	connection: "connecting" | "connected" | "disconnected" | "refreshing";
	lastConfirmedSequence?: number;
	lastEvent?: FlowObservationEvent;
	error?: string;
}

export interface FlowRunVisualizationState {
	center: FlowRunCenterState;
	detail?: FlowRunDetailState;
}

export type FlowRunVisualizationListener = (
	state: Readonly<FlowRunVisualizationState>,
) => void;

/**
 * Builds a renderer-neutral sequence of persisted facts. It never synthesizes
 * missing state transitions from transient observation events.
 */
export function buildFlowTimeline(history: FlowRunHistory): FlowTimelineItem[] {
	const nodesById = new Map(history.nodeRuns.map((node) => [node.id, node]));
	const items: FlowTimelineItem[] = [
		...history.nodeRuns.map(toNodeTimelineItem),
		...history.routeDecisions.map(toRouteTimelineItem),
		...history.parallelRounds.map((round) =>
			toParallelTimelineItem(round, nodesById),
		),
		...history.recoveries.map((recovery) =>
			toRecoveryTimelineItem(recovery, history.nodeRuns),
		),
	];
	if (
		history.run.status === "completed" ||
		history.run.status === "failed" ||
		history.run.status === "interrupted"
	) {
		items.push({
			kind: "terminal",
			id: `terminal:${history.run.id}`,
			sequence: history.run.sequence,
			occurredAt: history.run.completedAt,
			status: history.run.status,
			errorSummary: history.run.error?.summary,
		});
	}
	return items.sort(compareTimelineItems);
}

export function filterFlowRuns(
	runs: readonly FlowRunListItem[],
	filter: FlowRunCenterFilter,
): FlowRunListItem[] {
	switch (filter) {
		case "running":
			return runs.filter((run) => run.status === "running");
		case "terminal":
			return runs.filter((run) => run.status !== "running");
		case "attention":
			return runs.filter(
				(run) =>
					run.status === "failed" ||
					run.status === "interrupted" ||
					run.errorSummary !== undefined ||
					run.historyCompleteness === "legacy",
			);
		default:
			return [...runs];
	}
}

/**
 * Renderer-neutral state controller. It owns only view state and observation
 * subscriptions. Flow execution and persisted state remain outside this class.
 */
export class FlowRunVisualizationController {
	private readonly runtime: FlowRunVisualizationRuntime;
	private readonly listeners = new Set<FlowRunVisualizationListener>();
	private state: FlowRunVisualizationState = {
		center: { runs: [], filter: "all", loading: false },
	};
	private detailSubscription?: FlowObservationSubscription;
	private centerGeneration = 0;
	private observationGeneration = 0;
	private evidenceGeneration = 0;
	private refreshScheduled = false;
	private refreshInFlight = false;
	private refreshGeneration?: number;
	private refreshRequested = false;
	private observedSequence?: number;
	private refreshRetryCount = 0;
	private refreshRetryTimer?: ReturnType<typeof setTimeout>;

	constructor(runtime: FlowRunVisualizationRuntime) {
		this.runtime = runtime;
	}

	getState(): Readonly<FlowRunVisualizationState> {
		return clone(this.state);
	}

	subscribe(listener: FlowRunVisualizationListener): () => void {
		this.listeners.add(listener);
		listener(this.getState());
		return () => this.listeners.delete(listener);
	}

	async loadRecentRuns(limit = 50): Promise<void> {
		const generation = ++this.centerGeneration;
		this.updateCenter({ loading: true, error: undefined });
		try {
			const summaries = await this.runtime.listRecentRuns(limit);
			if (generation !== this.centerGeneration) return;
			this.updateCenter({
				runs: summaries.map(toRunListItem),
				loading: false,
				refreshedAt: new Date().toISOString(),
			});
		} catch (error) {
			if (generation !== this.centerGeneration) return;
			this.updateCenter({
				loading: false,
				error: errorMessage(error),
			});
		}
	}

	setFilter(filter: FlowRunCenterFilter): void {
		this.updateCenter({ filter });
	}

	getVisibleRuns(): FlowRunListItem[] {
		return clone(
			filterFlowRuns(this.state.center.runs, this.state.center.filter),
		);
	}

	async openRun(runId: string): Promise<void> {
		this.disconnectDetail();
		this.state = {
			...this.state,
			center: { ...this.state.center, selectedRunId: runId },
			detail: {
				runId,
				timeline: [],
				evidenceState: "idle",
				connection: "connecting",
			},
		};
		this.emit();
		await this.connectRun(runId, false);
	}

	async reconnect(runId = this.state.detail?.runId): Promise<void> {
		if (!runId) return;
		if (this.state.detail?.runId !== runId) {
			await this.openRun(runId);
			return;
		}
		this.disconnectDetail();
		const detail = this.state.detail;
		if (detail?.runId === runId) {
			this.state = {
				...this.state,
				detail: { ...detail, connection: "connecting", error: undefined },
			};
			this.emit();
		}
		await this.connectRun(runId, true);
	}

	markDisconnected(): void {
		const detail = this.state.detail;
		if (!detail) return;
		this.disconnectDetail();
		this.state = {
			...this.state,
			detail: { ...detail, connection: "disconnected" },
		};
		this.emit();
	}

	closeRun(): void {
		this.disconnectDetail();
		this.state = {
			...this.state,
			center: { ...this.state.center, selectedRunId: undefined },
			detail: undefined,
		};
		this.emit();
	}

	selectFact(selection: FlowFactSelection | undefined): void {
		const detail = this.state.detail;
		if (!detail) return;
		this.evidenceGeneration += 1;
		this.state = {
			...this.state,
			detail: {
				...detail,
				selectedFact: selection,
				evidence: undefined,
				evidenceState: "idle",
			},
		};
		this.emit();
	}

	async loadSelectedNodeEvidence(): Promise<void> {
		const detail = this.state.detail;
		if (!detail || detail.selectedFact?.kind !== "node") return;
		const generation = ++this.evidenceGeneration;
		const nodeRunId = detail.selectedFact.nodeRunId;
		this.updateDetail({ evidenceState: "loading", error: undefined });
		try {
			const evidence = await this.runtime.inspectNodeEvidence(
				detail.runId,
				nodeRunId,
			);
			const current = this.state.detail;
			if (
				generation !== this.evidenceGeneration ||
				current?.runId !== detail.runId ||
				current.selectedFact?.kind !== "node" ||
				current.selectedFact.nodeRunId !== nodeRunId
			) {
				return;
			}
			this.updateDetail({
				evidence: evidence && clone(evidence),
				evidenceState: evidence ? "available" : "unavailable",
			});
		} catch (error) {
			const current = this.state.detail;
			if (
				generation !== this.evidenceGeneration ||
				current?.runId !== detail.runId
			)
				return;
			this.updateDetail({
				evidenceState: "unavailable",
				error: errorMessage(error),
			});
		}
	}

	dispose(): void {
		this.disconnectDetail();
		this.listeners.clear();
	}

	private async connectRun(
		runId: string,
		preserveSnapshot: boolean,
	): Promise<void> {
		const generation = ++this.observationGeneration;
		let ready = false;
		const pendingEvents: FlowObservationEvent[] = [];
		try {
			const observation = await this.runtime.openRunObservation(
				runId,
				(event) => {
					if (!ready) pendingEvents.push(event);
					else this.handleObservation(generation, event);
				},
			);
			if (generation !== this.observationGeneration) {
				observation?.subscription.unsubscribe();
				return;
			}
			if (!observation) {
				const detail = this.state.detail;
				if (detail?.runId !== runId) return;
				this.updateDetail({
					connection: "disconnected",
					error: "Flow 运行不存在或当前不可读取",
					...(preserveSnapshot ? {} : { snapshot: undefined, timeline: [] }),
				});
				return;
			}
			this.detailSubscription = observation.subscription;
			this.applySnapshot(runId, observation.snapshot, "connected");
			ready = true;
			for (const event of pendingEvents)
				this.handleObservation(generation, event);
		} catch (error) {
			if (generation !== this.observationGeneration) return;
			const detail = this.state.detail;
			if (detail?.runId !== runId) return;
			this.updateDetail({
				connection: "disconnected",
				error: errorMessage(error),
				...(preserveSnapshot ? {} : { snapshot: undefined, timeline: [] }),
			});
		}
	}

	private handleObservation(
		generation: number,
		event: FlowObservationEvent,
	): void {
		const detail = this.state.detail;
		if (
			generation !== this.observationGeneration ||
			!detail ||
			event.runId !== detail.runId ||
			event.sequence <= (detail.lastConfirmedSequence ?? 0)
		) {
			return;
		}
		this.observedSequence = Math.max(
			this.observedSequence ?? 0,
			event.sequence,
		);
		this.updateDetail({
			lastEvent: clone(event),
			connection: "refreshing",
		});
		this.scheduleRefresh(generation, detail.runId);
	}

	private scheduleRefresh(generation: number, runId: string, delay = 0): void {
		this.refreshRequested = true;
		if (this.refreshScheduled || this.refreshInFlight) return;
		this.refreshScheduled = true;
		const refresh = async () => {
			this.refreshScheduled = false;
			this.refreshRetryTimer = undefined;
			if (generation !== this.observationGeneration) return;
			this.refreshInFlight = true;
			this.refreshGeneration = generation;
			this.refreshRequested = false;
			try {
				const snapshot = await this.runtime.inspectRun(runId);
				if (generation !== this.observationGeneration) return;
				if (!snapshot) {
					this.markDetailUnavailable(runId, "Flow 运行不存在或当前不可读取");
					return;
				}
				const caughtUp =
					snapshot.run.sequence >=
					(this.observedSequence ?? snapshot.run.sequence);
				this.applySnapshot(
					runId,
					snapshot,
					caughtUp ? "connected" : "refreshing",
				);
				if (caughtUp) {
					this.observedSequence = undefined;
					this.refreshRetryCount = 0;
				} else {
					this.refreshRequested = true;
					this.refreshRetryCount += 1;
				}
			} catch (error) {
				if (generation !== this.observationGeneration) return;
				this.markDetailUnavailable(runId, errorMessage(error));
			} finally {
				if (this.refreshGeneration === generation) {
					this.refreshInFlight = false;
					this.refreshGeneration = undefined;
					if (
						this.refreshRequested &&
						generation === this.observationGeneration
					) {
						this.scheduleRefresh(
							generation,
							runId,
							this.refreshRetryCount > 1 ? 50 : 0,
						);
					}
				}
			}
		};
		if (delay > 0) {
			this.refreshRetryTimer = setTimeout(() => {
				void refresh();
			}, delay);
		} else {
			queueMicrotask(() => {
				void refresh();
			});
		}
	}

	private applySnapshot(
		runId: string,
		snapshot: FlowRunHistory,
		connection: FlowRunDetailState["connection"],
	): void {
		const detail = this.state.detail;
		if (detail?.runId !== runId) return;
		const persisted = clone(snapshot);
		if (
			detail.lastConfirmedSequence !== undefined &&
			persisted.run.sequence < detail.lastConfirmedSequence
		) {
			return;
		}
		const selectedFact = resolveSelection(detail.selectedFact, persisted);
		const sequenceAdvanced =
			detail.lastConfirmedSequence === undefined ||
			persisted.run.sequence > detail.lastConfirmedSequence;
		const selectionChanged = !sameSelection(detail.selectedFact, selectedFact);
		if (sequenceAdvanced || selectionChanged) this.evidenceGeneration += 1;
		this.state = {
			...this.state,
			detail: {
				...detail,
				snapshot: persisted,
				timeline: buildFlowTimeline(persisted),
				selectedFact,
				...(sequenceAdvanced || selectionChanged
					? { evidence: undefined, evidenceState: "idle" as const }
					: {}),
				connection,
				lastConfirmedSequence: persisted.run.sequence,
				error: undefined,
			},
		};
		this.emit();
	}

	private disconnectDetail(): void {
		this.detailSubscription?.unsubscribe();
		this.detailSubscription = undefined;
		this.observationGeneration += 1;
		this.evidenceGeneration += 1;
		this.refreshScheduled = false;
		this.refreshInFlight = false;
		this.refreshGeneration = undefined;
		this.refreshRequested = false;
		this.observedSequence = undefined;
		this.refreshRetryCount = 0;
		if (this.refreshRetryTimer) clearTimeout(this.refreshRetryTimer);
		this.refreshRetryTimer = undefined;
	}

	private markDetailUnavailable(runId: string, error: string): void {
		const detail = this.state.detail;
		if (detail?.runId !== runId) return;
		this.disconnectDetail();
		this.updateDetail({ connection: "disconnected", error });
	}

	private updateCenter(update: Partial<FlowRunCenterState>): void {
		this.state = {
			...this.state,
			center: { ...this.state.center, ...update },
		};
		this.emit();
	}

	private updateDetail(update: Partial<FlowRunDetailState>): void {
		const detail = this.state.detail;
		if (!detail) return;
		this.state = {
			...this.state,
			detail: { ...detail, ...update },
		};
		this.emit();
	}

	private emit(): void {
		const snapshot = this.getState();
		for (const listener of [...this.listeners]) listener(snapshot);
	}
}

function toRunListItem(summary: FlowRunSummary): FlowRunListItem {
	return {
		runId: summary.id,
		flowId: summary.flowId,
		flowVersion: summary.flowVersion,
		taskSummary: summarizeValue(summary.task),
		status: summary.status,
		phase: summary.phase,
		startedAt: summary.startedAt,
		completedAt: summary.completedAt,
		errorSummary: summary.error?.summary,
		historyCompleteness: summary.historyCompleteness,
	};
}

function toNodeTimelineItem(node: FlowNodeRunView): FlowNodeTimelineItem {
	return {
		kind: "node",
		id: `node:${node.id}`,
		sequence: node.sequence,
		occurredAt: node.startedAt,
		nodeRunId: node.id,
		nodeRef: node.nodeRef,
		nodeName: node.nodeName,
		status: node.status,
		result: node.result,
		retryOf: node.retryOf,
		parallelRoundId: node.parallelRoundId,
	};
}

function toRouteTimelineItem(
	route: RouteDecisionRecord,
): FlowRouteTimelineItem {
	return {
		kind: "route",
		id: `route:${route.id}`,
		sequence: route.sequence,
		occurredAt: route.selectedAt,
		routeDecisionId: route.id,
		sourceNodeRunId: route.sourceNodeRunId,
		result: route.result,
		destination: route.destination,
	};
}

function toParallelTimelineItem(
	round: ParallelRoundRecord,
	nodesById: ReadonlyMap<string, FlowNodeRunView>,
): FlowParallelTimelineItem {
	const branches = Object.entries(round.branchNodeRunIds).map(
		([branchRef, nodeRunId]) => {
			const node = nodesById.get(nodeRunId);
			return {
				branchRef,
				nodeRunId,
				nodeName: node?.nodeName,
				status: node?.status ?? round.branchStatuses[branchRef],
				result: node?.result,
			};
		},
	);
	const join = round.joinNodeRunId
		? nodesById.get(round.joinNodeRunId)
		: undefined;
	return {
		kind: "parallel",
		id: `parallel:${round.id}`,
		sequence: round.sequence,
		occurredAt: round.startedAt,
		parallelRoundId: round.id,
		parallelRef: round.parallelRef,
		status: round.status,
		branches,
		joinNodeRunId: round.joinNodeRunId,
		joinNodeName: join?.nodeName,
		joinResult: round.joinOutcome?.result ?? join?.result,
	};
}

function toRecoveryTimelineItem(
	recovery: RunRecoveryRecord,
	nodeRuns: readonly FlowNodeRunView[],
): FlowRecoveryTimelineItem {
	return {
		kind: "recovery",
		id: `recovery:${recovery.id}`,
		sequence: recovery.sequence,
		occurredAt: recovery.resumedAt,
		recoveryId: recovery.id,
		interruptedNodeRunId: recovery.interruptedNodeRunId,
		retryNodeRunId: recovery.interruptedNodeRunId
			? nodeRuns.find((node) => node.retryOf === recovery.interruptedNodeRunId)
					?.id
			: undefined,
		strategy: recovery.strategy,
		summary: recovery.summary,
	};
}

function resolveSelection(
	selection: FlowFactSelection | undefined,
	history: FlowRunHistory,
): FlowFactSelection | undefined {
	if (!selection) return defaultSelection(history);
	if (
		selection.kind === "node" &&
		history.nodeRuns.some((node) => node.id === selection.nodeRunId)
	) {
		return selection;
	}
	if (
		selection.kind === "route" &&
		history.routeDecisions.some(
			(route) => route.id === selection.routeDecisionId,
		)
	) {
		return selection;
	}
	if (
		selection.kind === "parallel" &&
		history.parallelRounds.some(
			(round) => round.id === selection.parallelRoundId,
		)
	) {
		return selection;
	}
	if (
		selection.kind === "recovery" &&
		history.recoveries.some((recovery) => recovery.id === selection.recoveryId)
	) {
		return selection;
	}
	return defaultSelection(history);
}

function defaultSelection(
	history: FlowRunHistory,
): FlowFactSelection | undefined {
	if (history.current.kind === "node" && history.current.nodeRunId) {
		return { kind: "node", nodeRunId: history.current.nodeRunId };
	}
	if (history.current.kind === "parallel") {
		return {
			kind: "parallel",
			parallelRoundId: history.current.parallelRoundId,
		};
	}
	const failed = [...history.nodeRuns]
		.reverse()
		.find((node) => node.status === "failed" || node.status === "interrupted");
	if (failed) return { kind: "node", nodeRunId: failed.id };
	const latest = history.nodeRuns.at(-1);
	return latest ? { kind: "node", nodeRunId: latest.id } : undefined;
}

function sameSelection(
	left: FlowFactSelection | undefined,
	right: FlowFactSelection | undefined,
): boolean {
	if (!left || !right) return left === right;
	if (left.kind !== right.kind) return false;
	switch (left.kind) {
		case "node":
			return right.kind === "node" && left.nodeRunId === right.nodeRunId;
		case "route":
			return (
				right.kind === "route" && left.routeDecisionId === right.routeDecisionId
			);
		case "parallel":
			return (
				right.kind === "parallel" &&
				left.parallelRoundId === right.parallelRoundId
			);
		case "recovery":
			return right.kind === "recovery" && left.recoveryId === right.recoveryId;
	}
}

function compareTimelineItems(
	left: FlowTimelineItem,
	right: FlowTimelineItem,
): number {
	if (left.sequence !== right.sequence) return left.sequence - right.sequence;
	return timelineKindOrder(left.kind) - timelineKindOrder(right.kind);
}

function timelineKindOrder(kind: FlowTimelineItem["kind"]): number {
	switch (kind) {
		case "node":
			return 1;
		case "route":
			return 2;
		case "parallel":
			return 3;
		case "recovery":
			return 4;
		case "terminal":
			return 5;
	}
}

function summarizeValue(value: unknown): string {
	const text = typeof value === "string" ? value : JSON.stringify(value);
	return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function clone<T>(value: T): T {
	return structuredClone(value);
}
