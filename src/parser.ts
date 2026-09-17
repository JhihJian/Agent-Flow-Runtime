import type {
	CommandAction,
	CommandRequest,
	FlowAction,
	FlowDefinition,
	FlowDestination,
	FlowNode,
	FlowValue,
} from "./types.ts";

const IDENTIFIER = "[A-Za-z][A-Za-z0-9_-]*";
const NODE_DECLARATION = new RegExp(
	`\\b(${IDENTIFIER})\\s*\\[([^\\]]+)\\]`,
	"g",
);
const PARALLEL_DECLARATION = new RegExp(
	`\\b(${IDENTIFIER})\\s*\\{\\{并行\\}\\}`,
	"g",
);
const EDGE = new RegExp(
	`^\\s*(${IDENTIFIER})\\s*-->\\s*(?:\\|([^|]+)\\|\\s*)?(${IDENTIFIER})\\s*$`,
);
const BRANCH_REFERENCE = new RegExp(`\\{(${IDENTIFIER})\\.outcome\\}`, "g");

interface GraphEdge {
	from: string;
	result?: string;
	to: string;
}

interface ParsedSection {
	action: FlowAction;
	results: Map<string, string>;
}

export class FlowSyntaxError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FlowSyntaxError";
	}
}

export function parseFlow(markdown: string, id: string): FlowDefinition {
	if (!id) throw new FlowSyntaxError("Flow 必须有非空标识");
	const metadata = parseMetadata(markdown);
	const graph = parseGraph(extractSingleMermaid(markdown));
	const sections = parseSections(markdown);
	const nodes = new Map<string, FlowNode>();
	for (const [ref, name] of graph.nodes) {
		const section = sections.get(name);
		if (!section)
			throw new FlowSyntaxError(`节点 ${ref} 缺少同名二级标题“${name}”`);
		nodes.set(ref, {
			ref,
			name,
			action: section.action,
			results: section.results,
			successors: new Map(),
		});
	}
	if (sections.size !== nodes.size) {
		for (const name of sections.keys()) {
			if (![...nodes.values()].some((node) => node.name === name))
				throw new FlowSyntaxError(`二级标题“${name}”不对应任何工作节点`);
		}
	}
	const definition: FlowDefinition = {
		id,
		name: metadata.name,
		description: metadata.description,
		startNodeRef: "",
		nodes,
		parallels: new Map(),
	};
	validateAndWireGraph(definition, graph);
	return definition;
}

function parseMetadata(markdown: string): {
	name: string;
	description: string;
} {
	const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
	if (!match)
		throw new FlowSyntaxError("元信息必须位于文件开头并使用 --- 包裹");
	const values = new Map<string, string>();
	for (const line of match[1].split(/\r?\n/)) {
		const item = /^([A-Za-z]+):\s*(.*?)\s*$/.exec(line);
		if (!item || !item[2])
			throw new FlowSyntaxError("元信息只允许非空的 name 和 description");
		if (
			(item[1] !== "name" && item[1] !== "description") ||
			values.has(item[1])
		) {
			throw new FlowSyntaxError("元信息只允许唯一的 name 和 description");
		}
		values.set(item[1], item[2]);
	}
	const name = values.get("name");
	const description = values.get("description");
	if (values.size !== 2 || !name || !description)
		throw new FlowSyntaxError("元信息必须包含非空的 name 和 description");
	return { name, description };
}

function extractSingleMermaid(markdown: string): string {
	const blocks = [...markdown.matchAll(/```mermaid\r?\n([\s\S]*?)\r?\n```/g)];
	if (blocks.length !== 1)
		throw new FlowSyntaxError("Flow 必须恰有一张 Mermaid 图");
	const diagram = blocks[0][1];
	if (!/^flowchart TD\s*(?:\r?\n|$)/.test(diagram))
		throw new FlowSyntaxError("Mermaid 图必须以 flowchart TD 开始");
	return diagram;
}

function parseGraph(diagram: string): {
	nodes: Map<string, string>;
	parallels: Set<string>;
	edges: GraphEdge[];
} {
	const nodes = new Map<string, string>();
	const parallels = new Set<string>();
	const edges: GraphEdge[] = [];
	for (const rawLine of diagram.split(/\r?\n/).slice(1)) {
		let line = rawLine;
		for (const match of line.matchAll(NODE_DECLARATION)) {
			if (match[1] === "start" || match[1] === "finish")
				throw new FlowSyntaxError("start 和 finish 不能作为工作节点引用");
			if (nodes.has(match[1]) || [...nodes.values()].includes(match[2].trim()))
				throw new FlowSyntaxError(`工作节点必须唯一: ${match[1]}`);
			nodes.set(match[1], match[2].trim());
		}
		for (const match of line.matchAll(PARALLEL_DECLARATION)) {
			if (parallels.has(match[1]))
				throw new FlowSyntaxError(`并行开始点重复: ${match[1]}`);
			parallels.add(match[1]);
		}
		line = line
			.replace(/\bstart\s*\(\(开始\)\)/g, "start")
			.replace(/\bfinish\s*\(\(结束\)\)/g, "finish")
			.replace(NODE_DECLARATION, "$1")
			.replace(PARALLEL_DECLARATION, "$1");
		const edge = EDGE.exec(line);
		if (edge)
			edges.push({ from: edge[1], result: edge[2]?.trim(), to: edge[3] });
		else if (
			line.trim() &&
			!/^\s*%%/.test(line) &&
			!new RegExp(`^\\s*(?:start|finish|${IDENTIFIER})\\s*$`).test(line)
		)
			throw new FlowSyntaxError(`无法解析 Mermaid 行: ${rawLine.trim()}`);
		NODE_DECLARATION.lastIndex = 0;
		PARALLEL_DECLARATION.lastIndex = 0;
	}
	return { nodes, parallels, edges };
}

function parseSections(markdown: string): Map<string, ParsedSection> {
	const heading = /^## (.+?)\s*$/gm;
	const headers = [...markdown.matchAll(heading)];
	const sections = new Map<string, ParsedSection>();
	for (let index = 0; index < headers.length; index++) {
		const name = headers[index][1].trim();
		if (sections.has(name)) throw new FlowSyntaxError(`二级标题重复: ${name}`);
		const bodyStart = matchIndex(headers[index]) + headers[index][0].length;
		const bodyEnd =
			index + 1 < headers.length
				? matchIndex(headers[index + 1])
				: markdown.length;
		const body = markdown.slice(bodyStart, bodyEnd);
		const firstOutcome = /^### /m.exec(body);
		const action = parseAction(
			name,
			body.slice(0, firstOutcome?.index ?? body.length),
		);
		sections.set(name, {
			action,
			results: parseResults(
				name,
				body.slice(firstOutcome?.index ?? body.length),
			),
		});
	}
	return sections;
}

function parseAction(nodeName: string, actionArea: string): FlowAction {
	const blocks = [
		...actionArea.matchAll(/```([^\r\n]*)\r?\n([\s\S]*?)\r?\n```/g),
	];
	if (blocks.length !== 1 || !blocks[0][2].trim())
		throw new FlowSyntaxError(
			`节点“${nodeName}”必须有且仅有一个非空动作代码块`,
		);
	const kind = blocks[0][1].trim();
	const content = blocks[0][2].trim();
	if (kind === "新建Agent" || kind === "复用Agent")
		return { kind, prompt: content };
	if (kind !== "执行自定义命令")
		throw new FlowSyntaxError(`节点“${nodeName}”的动作标记无效: ${kind}`);
	return parseCommandAction(nodeName, content);
}

function parseCommandAction(nodeName: string, content: string): CommandAction {
	const references = [...content.matchAll(BRANCH_REFERENCE)].map(
		(match) => match[1],
	);
	const replaced = content.replace(
		BRANCH_REFERENCE,
		(_match, ref: string) => `"__flow_branch_${ref}__"`,
	);
	let parsed: unknown;
	try {
		parsed = JSON.parse(replaced);
	} catch (error) {
		throw new FlowSyntaxError(
			`节点“${nodeName}”的命令不是有效 JSON: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
	if (
		!isRecord(parsed) ||
		typeof parsed.command !== "string" ||
		!parsed.command.trim()
	)
		throw new FlowSyntaxError(`节点“${nodeName}”的命令必须包含非空 command`);
	if (
		parsed.args !== undefined &&
		(!Array.isArray(parsed.args) ||
			parsed.args.some((arg) => typeof arg !== "string"))
	) {
		throw new FlowSyntaxError(`节点“${nodeName}”的 args 必须是字符串数组`);
	}
	if (
		!branchReferencesAreStandalone(content, references) ||
		!referencesOnlyInStdin(parsed)
	) {
		throw new FlowSyntaxError(
			`节点“${nodeName}”的节点结果引用只能作为 stdin 中的独立 JSON 值`,
		);
	}
	return {
		kind: "执行自定义命令",
		request: parsed as unknown as CommandRequest,
		branchReferences: references,
	};
}

function branchReferencesAreStandalone(
	content: string,
	references: string[],
): boolean {
	const standalone = [
		...content.matchAll(
			new RegExp(
				`(?:^|[:,\\[])\\s*\\{(${IDENTIFIER})\\.outcome\\}\\s*(?=[,}\\]])`,
				"gm",
			),
		),
	];
	return standalone.length === references.length;
}

function referencesOnlyInStdin(request: Record<string, unknown>): boolean {
	const visit = (value: unknown, inStdin: boolean): boolean => {
		if (
			typeof value === "string" &&
			value.startsWith("__flow_branch_") &&
			value.endsWith("__")
		)
			return inStdin;
		if (Array.isArray(value))
			return value.every((item) => visit(item, inStdin));
		if (isRecord(value))
			return Object.entries(value).every(([key, item]) =>
				visit(item, inStdin || key === "stdin"),
			);
		return true;
	};
	return visit(request, false);
}

function parseResults(
	nodeName: string,
	resultArea: string,
): Map<string, string> {
	const heading = /^### (.+?)\s*$/gm;
	const headers = [...resultArea.matchAll(heading)];
	const results = new Map<string, string>();
	for (let index = 0; index < headers.length; index++) {
		const result = headers[index][1].trim();
		const start = matchIndex(headers[index]) + headers[index][0].length;
		const end =
			index + 1 < headers.length
				? matchIndex(headers[index + 1])
				: resultArea.length;
		const description = resultArea.slice(start, end).trim();
		if (!result || !description || results.has(result))
			throw new FlowSyntaxError(`节点“${nodeName}”的结果说明必须唯一且非空`);
		results.set(result, description);
	}
	return results;
}

function validateAndWireGraph(
	definition: FlowDefinition,
	graph: {
		nodes: Map<string, string>;
		parallels: Set<string>;
		edges: GraphEdge[];
	},
): void {
	const known = new Set([
		"start",
		"finish",
		...graph.nodes.keys(),
		...graph.parallels,
	]);
	for (const edge of graph.edges)
		if (!known.has(edge.from) || !known.has(edge.to))
			throw new FlowSyntaxError(`连线引用不存在: ${edge.from} -> ${edge.to}`);
	const outgoing = groupEdges(graph.edges, "from");
	const incoming = groupEdges(graph.edges, "to");
	if (
		incoming.get("start")?.length ||
		outgoing.get("finish")?.length ||
		outgoing.get("start")?.length !== 1
	) {
		throw new FlowSyntaxError("start 必须只有一条去向，finish 不可有去向");
	}
	const first = outgoing.get("start")?.[0];
	if (!first) throw new FlowSyntaxError("start 必须有一条去向");
	if (first.result || !definition.nodes.has(first.to))
		throw new FlowSyntaxError("start 必须无结果地指向一个工作节点");
	definition.startNodeRef = first.to;
	for (const node of definition.nodes.values()) {
		const edges = outgoing.get(node.ref) ?? [];
		if (!edges.length || edges.some((edge) => !edge.result))
			throw new FlowSyntaxError(`工作节点 ${node.ref} 的出边必须都带结果名`);
		for (const edge of edges) {
			const result = edge.result;
			if (!result)
				throw new FlowSyntaxError(`工作节点 ${node.ref} 的出边必须带结果名`);
			if (!node.results.has(result))
				throw new FlowSyntaxError(
					`节点 ${node.ref} 缺少结果“${result}”的三级说明`,
				);
			if (node.successors.has(result))
				throw new FlowSyntaxError(`节点 ${node.ref} 的结果边重复: ${result}`);
			node.successors.set(
				result,
				destination(edge.to, definition.nodes, graph.parallels),
			);
		}
		if (node.results.size !== node.successors.size)
			throw new FlowSyntaxError(`节点 ${node.ref} 存在没有结果边的结果说明`);
		if (
			node.action.kind === "执行自定义命令" &&
			(node.results.size !== 1 || !node.results.has("已执行"))
		) {
			throw new FlowSyntaxError(`命令节点 ${node.ref} 必须只有“已执行”结果边`);
		}
	}
	for (const parallelRef of graph.parallels)
		validateParallel(definition, parallelRef, incoming, outgoing);
	validateReachability(definition);
}

function destination(
	ref: string,
	nodes: Map<string, FlowNode>,
	parallels: Set<string>,
): FlowDestination {
	if (ref === "finish") return { kind: "finish" };
	if (nodes.has(ref)) return { kind: "node", ref };
	if (parallels.has(ref)) return { kind: "parallel", ref };
	throw new FlowSyntaxError(`未知去向: ${ref}`);
}

function validateParallel(
	definition: FlowDefinition,
	parallelRef: string,
	incoming: Map<string, GraphEdge[]>,
	outgoing: Map<string, GraphEdge[]>,
): void {
	const inEdges = incoming.get(parallelRef) ?? [];
	const branches = outgoing.get(parallelRef) ?? [];
	if (
		inEdges.length !== 1 ||
		branches.length < 2 ||
		branches.some((edge) => edge.result)
	) {
		throw new FlowSyntaxError(
			`并行开始点 ${parallelRef} 必须有一条入边和两条以上无结果出边`,
		);
	}
	const joinCandidates = new Set<string>();
	for (const branch of branches) {
		const node = definition.nodes.get(branch.to);
		if (
			!node ||
			node.action.kind !== "执行自定义命令" ||
			(incoming.get(branch.to)?.length ?? 0) !== 1
		) {
			throw new FlowSyntaxError(
				`并行分支 ${branch.to} 必须是仅由并行开始点进入的命令节点`,
			);
		}
		const destinations = [...node.successors.values()];
		if (destinations.length !== 1 || destinations[0].kind !== "node")
			throw new FlowSyntaxError(`并行分支 ${branch.to} 必须进入同一汇合节点`);
		joinCandidates.add(destinations[0].ref);
	}
	if (joinCandidates.size !== 1)
		throw new FlowSyntaxError(
			`并行开始点 ${parallelRef} 的分支必须汇合到同一节点`,
		);
	const joinRef = [...joinCandidates][0];
	if (!joinRef)
		throw new FlowSyntaxError(`并行开始点 ${parallelRef} 缺少汇合节点`);
	const join = definition.nodes.get(joinRef);
	if (!join) throw new FlowSyntaxError(`汇合节点不存在: ${joinRef}`);
	const branchRefs = branches.map((branch) => branch.to);
	if (
		(incoming.get(joinRef)?.length ?? 0) < 2 ||
		join.action.kind !== "执行自定义命令"
	) {
		throw new FlowSyntaxError(
			`汇合节点 ${joinRef} 必须是有两个以上入边的命令节点`,
		);
	}
	const actualSources = (incoming.get(joinRef) ?? []).map((edge) => edge.from);
	if (
		actualSources.length !== branchRefs.length ||
		actualSources.some((ref) => !branchRefs.includes(ref))
	) {
		throw new FlowSyntaxError(
			`汇合节点 ${joinRef} 的入边必须恰好来自 ${parallelRef} 的直接分支`,
		);
	}
	const refs = join.action.branchReferences;
	if (
		refs.length !== branchRefs.length ||
		new Set(refs).size !== refs.length ||
		refs.some((ref) => !branchRefs.includes(ref))
	) {
		throw new FlowSyntaxError(
			`汇合节点 ${joinRef} 必须在 stdin 中引用每个直接分支的结果`,
		);
	}
	definition.parallels.set(parallelRef, {
		ref: parallelRef,
		branches: branchRefs,
		joinRef,
	});
}

function validateReachability(definition: FlowDefinition): void {
	const seen = new Set<string>();
	const stack = [definition.startNodeRef];
	let reachesFinish = false;
	while (stack.length) {
		const ref = stack.pop();
		if (!ref) continue;
		if (seen.has(ref)) continue;
		seen.add(ref);
		const node = definition.nodes.get(ref);
		if (!node) throw new FlowSyntaxError(`工作节点不存在: ${ref}`);
		for (const next of node.successors.values()) {
			if (next.kind === "finish") reachesFinish = true;
			else if (next.kind === "node") stack.push(next.ref);
			else {
				const parallel = definition.parallels.get(next.ref);
				if (parallel) stack.push(...parallel.branches, parallel.joinRef);
			}
		}
	}
	if (seen.size !== definition.nodes.size || !reachesFinish)
		throw new FlowSyntaxError("所有工作节点必须从开始可达且存在到结束的路径");
}

function groupEdges(
	edges: GraphEdge[],
	key: "from" | "to",
): Map<string, GraphEdge[]> {
	const grouped = new Map<string, GraphEdge[]>();
	for (const edge of edges) {
		const items = grouped.get(edge[key]) ?? [];
		items.push(edge);
		grouped.set(edge[key], items);
	}
	return grouped;
}

function matchIndex(match: RegExpMatchArray): number {
	if (match.index === undefined)
		throw new FlowSyntaxError("Markdown 标题缺少位置");
	return match.index;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function renderCommandRequest(
	request: CommandRequest,
	input: FlowValue,
	branchOutcomes: ReadonlyMap<string, unknown> = new Map(),
): CommandRequest {
	const render = (value: FlowValue): FlowValue => {
		if (typeof value === "string") {
			const branch = /^__flow_branch_([A-Za-z][A-Za-z0-9_-]*)__$/.exec(value);
			if (branch) {
				const outcome = branchOutcomes.get(branch[1]);
				if (outcome === undefined)
					throw new FlowSyntaxError(`缺少当前并行轮次的分支结果: ${branch[1]}`);
				return outcome as FlowValue;
			}
			return value.replaceAll("{outcome}", JSON.stringify(input));
		}
		if (Array.isArray(value)) return value.map(render);
		if (isRecord(value))
			return Object.fromEntries(
				Object.entries(value).map(([key, item]) => [
					key,
					render(item as FlowValue),
				]),
			);
		return value;
	};
	return render(request as unknown as FlowValue) as unknown as CommandRequest;
}
