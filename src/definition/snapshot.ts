import type {
	FlowDefinition,
	FlowDefinitionSnapshot,
	FlowValue,
} from "../contracts/types.ts";

export function snapshotFlowDefinition(
	flow: FlowDefinition,
	version: string,
): FlowDefinitionSnapshot {
	const nodes = [...flow.nodes.values()].map((node) => ({
		ref: node.ref,
		name: node.name,
		actionKind: node.action.kind,
		results: [...node.successors.entries()].map(([name, destination]) => ({
			name,
			destination,
		})),
	}));
	const edges: FlowDefinitionSnapshot["edges"] = [];
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
		parallels: [...flow.parallels.values()].map((parallel) => ({
			ref: parallel.ref,
			branches: [...parallel.branches],
			joinRef: parallel.joinRef,
		})),
		mermaid: toMermaid(flow, nodes, edges),
	};
}

function toMermaid(
	flow: FlowDefinition,
	nodes: FlowDefinitionSnapshot["nodes"],
	edges: FlowDefinitionSnapshot["edges"],
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
