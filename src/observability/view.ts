import type {
	FlowDefinition,
	FlowDestination,
	FlowNodeRunView,
	FlowRunHistory,
	FlowRunLocation,
	FlowRunRecord,
	FlowRunSummary,
	FlowValue,
	ParallelStart,
	RunStatus,
} from "../contracts/types.ts";

export interface FlowDefinitionView {
	id: string;
	name: string;
	description: string;
	startNodeRef: string;
	version: string;
	nodes: Array<{
		ref: string;
		name: string;
		actionKind: string;
		results: Array<{ name: string; destination: FlowDestination }>;
	}>;
	edges: Array<{
		id: string;
		from: string;
		to: string;
		result?: string;
		kind: "node" | "parallel" | "finish" | "branch" | "join";
	}>;
	parallels: Array<{
		ref: string;
		branches: string[];
		joinRef: string;
	}>;
	mermaid: string;
}

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
	definitionError?: string;
	history: FlowRunHistory;
}

export function serializeFlowDefinition(
	flow: FlowDefinition,
	version: string,
): FlowDefinitionView {
	const nodes = [...flow.nodes.values()].map((node) => ({
		ref: node.ref,
		name: node.name,
		actionKind: node.action.kind,
		results: [...node.successors.entries()].map(([name, destination]) => ({
			name,
			destination,
		})),
	}));
	const edges: FlowDefinitionView["edges"] = [];
	for (const node of flow.nodes.values()) {
		for (const [result, destination] of node.successors.entries()) {
			const parallel = [...flow.parallels.values()].find(
				(candidate) =>
					destination.kind === "node" &&
					candidate.joinRef === destination.ref &&
					candidate.branches.includes(node.ref),
			);
			edges.push({
				id: `${node.ref}:${result}`,
				from: node.ref,
				to: destination.kind === "finish" ? "finish" : destination.ref,
				result,
				kind: parallel ? "join" : destination.kind,
			});
		}
	}
	for (const parallel of flow.parallels.values()) {
		for (const branch of parallel.branches) {
			edges.push({
				id: `${parallel.ref}:branch:${branch}`,
				from: parallel.ref,
				to: branch,
				kind: "branch",
			});
		}
	}
	return {
		id: flow.id,
		name: flow.name,
		description: flow.description,
		startNodeRef: flow.startNodeRef,
		version,
		nodes,
		edges,
		parallels: [...flow.parallels.values()].map(serializeParallel),
		mermaid: toMermaid(flow, nodes, edges),
	};
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

function serializeParallel(parallel: ParallelStart) {
	return {
		ref: parallel.ref,
		branches: [...parallel.branches],
		joinRef: parallel.joinRef,
	};
}

function toMermaid(
	flow: FlowDefinition,
	nodes: FlowDefinitionView["nodes"],
	edges: FlowDefinitionView["edges"],
): string {
	const lines = ["flowchart TD", `  start((开始)) --> ${flow.startNodeRef}`];
	for (const node of nodes) {
		lines.push(`  ${node.ref}[${mermaidText(node.name)}]`);
	}
	for (const parallel of flow.parallels.values()) {
		lines.push(`  ${parallel.ref}{{并行}}`);
	}
	for (const edge of edges) {
		if (edge.kind === "branch") {
			lines.push(`  ${edge.from} --> ${edge.to}`);
		} else {
			const to = edge.to === "finish" ? "finish((结束))" : edge.to;
			lines.push(`  ${edge.from} -->|${mermaidText(edge.result ?? "")}| ${to}`);
		}
	}
	return lines.join("\n");
}

function mermaidText(value: FlowValue | string): string {
	return (
		String(value)
			.replace(/[[\]{}|;]/g, " ")
			.trim() || " "
	);
}
