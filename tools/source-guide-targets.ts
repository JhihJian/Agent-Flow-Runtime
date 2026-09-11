export interface SourceGuideTarget {
	id: string;
	title: string;
	file: string;
	kind: "function" | "method";
	name: string;
	className?: string;
}

/** Key control-flow boundaries explained by the hand-written reading guide. */
export const sourceGuideTargets: readonly SourceGuideTarget[] = [
	{
		id: "start-flow",
		title: "启动 Flow",
		file: "src/extension.ts",
		kind: "function",
		name: "startFlow",
	},
	{
		id: "parse-flow",
		title: "解析 Flow",
		file: "src/parser.ts",
		kind: "function",
		name: "parseFlow",
	},
	{
		id: "coordinator-run",
		title: "驱动一次运行",
		file: "src/runtime.ts",
		kind: "method",
		className: "FlowCoordinator",
		name: "run",
	},
	{
		id: "execute-node",
		title: "执行单个节点",
		file: "src/runtime.ts",
		kind: "method",
		className: "FlowCoordinator",
		name: "executeNode",
	},
	{
		id: "execute-parallel",
		title: "执行并行分支",
		file: "src/runtime.ts",
		kind: "method",
		className: "FlowCoordinator",
		name: "executeParallel",
	},
	{
		id: "agent-execute-node",
		title: "管理 Agent 节点",
		file: "src/runtime.ts",
		kind: "method",
		className: "AgentRunModel",
		name: "executeNode",
	},
	{
		id: "pi-execute-node",
		title: "执行 Pi 节点",
		file: "src/pi.ts",
		kind: "method",
		className: "PiAgentIntegrationAdapter",
		name: "executeNode",
	},
	{
		id: "finalize-cli-turn",
		title: "提交 CLI 节点结果",
		file: "src/pi.ts",
		kind: "method",
		className: "PiAgentIntegrationAdapter",
		name: "finalizeCliTurn",
	},
];
