import type {
	FlowDefinition,
	FlowDefinitionSnapshot,
	FlowNodeRunView,
	FlowRunHistory,
	FlowRunLocation,
	FlowRunRecord,
	FlowRunSummary,
	RunStatus,
} from "../contracts/types.ts";
import { snapshotFlowDefinition } from "../definition/snapshot.ts";

export type FlowDefinitionView = FlowDefinitionSnapshot;

export interface FlowSessionListItem {
	id: string;
	flowId: string;
	flowName?: string;
	flowVersion: string;
	status: RunStatus;
	phase: FlowRunSummary["phase"];
	sequence: number;
	historyCompleteness: FlowRunSummary["historyCompleteness"];
	startedAt: string;
	completedAt?: string;
	lastActivityAt: string;
	current: FlowRunLocation;
	currentLabel?: string;
	error?: FlowRunSummary["error"];
}

export interface FlowRunView {
	definition?: FlowDefinitionView;
	definitionSource?:
		| "current-file"
		| "git-history"
		| "run-snapshot"
		| "run-history";
	definitionError?: string;
	history: FlowRunHistory;
}

export function serializeFlowDefinition(
	flow: FlowDefinition,
	version: string,
): FlowDefinitionView {
	return snapshotFlowDefinition(flow, version);
}

export function toSessionListItem(
	run: FlowRunRecord,
	history: FlowRunHistory,
	flowName?: string,
): FlowSessionListItem {
	const timestamps = [
		run.startedAt,
		run.completedAt,
		...history.nodeRuns.flatMap((node) => [node.startedAt, node.completedAt]),
		...history.routeDecisions.map((route) => route.selectedAt),
		...history.parallelRounds.flatMap((round) => [
			round.startedAt,
			round.completedAt,
		]),
		...history.recoveries.map((recovery) => recovery.resumedAt),
	].filter((value): value is string => Boolean(value));
	const currentLabel = currentLocationLabel(history.current);
	return {
		id: run.id,
		flowId: run.flowId,
		flowName,
		flowVersion: run.flowVersion,
		status: run.status,
		phase: run.phase,
		sequence: run.sequence,
		historyCompleteness: run.historyCompleteness,
		startedAt: run.startedAt,
		completedAt: run.completedAt,
		lastActivityAt: timestamps.sort().at(-1) ?? run.startedAt,
		current: history.current,
		currentLabel,
		error: run.error,
	};
}

export function currentLocationLabel(
	location: FlowRunLocation,
): string | undefined {
	if (location.kind === "node") return location.nodeName ?? location.nodeRef;
	if (location.kind === "parallel") return `并行轮次 ${location.parallelRef}`;
	return undefined;
}

export function nodeVisitSummary(
	history: FlowRunHistory,
	nodeRef: string,
): { count: number; latest?: FlowNodeRunView } {
	const visits = history.nodeRuns.filter((node) => node.nodeRef === nodeRef);
	return { count: visits.length, latest: visits.at(-1) };
}
