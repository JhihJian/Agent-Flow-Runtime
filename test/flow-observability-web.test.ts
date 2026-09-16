import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { FlowObservabilityWebHost } from "../src/flow-observability-web.ts";
import type { FlowRunVisualizationRuntime } from "../src/flow-run-visualization.ts";
import type {
	FlowNodeEvidence,
	FlowObservationEvent,
	FlowObservationSubscription,
	FlowRunHistory,
	FlowRunSummary,
} from "../src/types.ts";

const runId = "web-run";

const summary: FlowRunSummary = {
	id: runId,
	flowId: "code-change",
	flowVersion: "sha256:flow",
	task: "fix timeout",
	status: "completed",
	phase: "completed",
	sequence: 4,
	historyCompleteness: "complete",
	startedAt: "2026-01-01T00:00:00.000Z",
	completedAt: "2026-01-01T00:01:00.000Z",
};

const history: FlowRunHistory = {
	run: summary,
	flowDefinition: {
		flowId: "code-change",
		flowVersion: "sha256:flow",
		name: "代码修改",
		description: "测试流程图快照",
		startNodeRef: "analyze",
		nodes: [
			{
				ref: "analyze",
				name: "分析",
				actionKind: "新建Agent",
				successors: [{ result: "已分析", destination: { kind: "finish" } }],
			},
		],
		parallels: [],
	},
	nodeRuns: [
		{
			id: "node-1",
			runId,
			sequence: 2,
			nodeRef: "analyze",
			nodeName: "分析",
			actionKind: "新建Agent",
			input: "fix timeout",
			status: "completed",
			startedAt: "2026-01-01T00:00:01.000Z",
			result: "已分析",
			enteredFrom: { kind: "start" },
		},
	],
	routeDecisions: [],
	parallelRounds: [],
	recoveries: [],
	current: { kind: "none" },
	evidence: {
		"node-1": { commandOutputAvailable: false },
	},
};

const evidence: FlowNodeEvidence = {
	runId,
	nodeRunId: "node-1",
	nodeRef: "analyze",
	nodeName: "分析",
	status: "completed",
	input: "fix timeout",
	outcome: { result: "已分析", content: "analysis" },
	session: { id: "session-1", sessionReference: "session.jsonl" },
};

class FakeWebRuntime implements FlowRunVisualizationRuntime {
	async listRecentRuns(): Promise<FlowRunSummary[]> {
		return [structuredClone(summary)];
	}

	async listFlowRuns(flowId: string): Promise<FlowRunSummary[]> {
		return flowId === summary.flowId ? [structuredClone(summary)] : [];
	}

	async inspectRun(id: string): Promise<FlowRunHistory | undefined> {
		return id === runId ? structuredClone(history) : undefined;
	}

	async inspectNodeEvidence(
		requestedRunId: string,
		nodeRunId: string,
	): Promise<FlowNodeEvidence | undefined> {
		return requestedRunId === runId && nodeRunId === "node-1"
			? structuredClone(evidence)
			: undefined;
	}

	async openRunObservation(
		id: string,
		_listener: (event: FlowObservationEvent) => void,
	): Promise<
		| { snapshot: FlowRunHistory; subscription: FlowObservationSubscription }
		| undefined
	> {
		if (id !== runId) return undefined;
		return {
			snapshot: structuredClone(history),
			subscription: { unsubscribe() {} },
		};
	}
}

test("Web 观察站通过令牌提供只读 Run、详情和节点证据", async () => {
	const host = new FlowObservabilityWebHost({
		runtime: new FakeWebRuntime(),
		host: "127.0.0.1",
		port: 0,
		token: "test-token",
		readPersistedEvidence: async () => [
			{ id: "message-1", role: "assistant", content: "analysis" },
		],
	});
	await host.start();
	try {
		const initial = await fetch(host.url ?? "");
		assert.equal(initial.status, 200);
		assert.match(
			initial.headers.get("content-security-policy") ?? "",
			/script-src 'self' 'wasm-unsafe-eval'/,
		);
		const baseUrl = new URL(host.url ?? "").origin;
		const session = await fetch(`${baseUrl}/api/session`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token: "test-token" }),
		});
		assert.equal(session.status, 204);
		const cookie = session.headers.get("set-cookie");
		assert.match(cookie ?? "", /flow_observability=test-token/);
		const headers = { Cookie: cookie ?? "" };
		const initialHtml = await initial.text();
		assert.match(initialHtml, /\/assets\/viz-js\/viz-global\.js/);
		assert.doesNotMatch(initialHtml, /cytoscape|elkjs/i);
		const vizAsset = await fetch(`${baseUrl}/assets/viz-js/viz-global.js`);
		assert.equal(vizAsset.status, 200);
		assert.match(
			vizAsset.headers.get("content-type") ?? "",
			/text\/javascript/,
		);
		for (const assetPath of [
			"/assets/elkjs/elk.bundled.js",
			"/assets/cytoscape/cytoscape.umd.js",
			"/assets/cytoscape-elk/cytoscape-elk.js",
			"/assets/viz-js/%2e%2e%2fpackage.json",
		]) {
			assert.equal(
				(await fetch(`${baseUrl}${assetPath}`)).status,
				404,
				assetPath,
			);
		}
		assert.equal(
			(await fetch(`${baseUrl}/assets/mermaid/mermaid.esm.min.mjs`)).status,
			404,
		);
		const app = await fetch(`${baseUrl}/assets/app.js`);
		assert.equal(app.status, 200);
		const appSource = await app.text();
		assert.doesNotMatch(appSource, /mermaid/i);
		assert.doesNotMatch(appSource, /cytoscape|window\.ELK/i);
		assert.match(appSource, /window\.Viz\.instance\(\)/);
		assert.match(appSource, /renderSVGElement\(dot, \{ engine: 'dot' \}\)/);
		assert.match(appSource, /buildFlowDot/);
		assert.match(appSource, /dotString/);
		assert.match(appSource, /rankdir=TB/);
		assert.match(appSource, /splines=polyline/);
		assert.match(appSource, /style="dashed"/);
		assert.match(appSource, /flowRenderRevision/);
		const syntaxDirectory = await mkdtemp(
			join(tmpdir(), "flow-observability-web-"),
		);
		try {
			const appPath = join(syntaxDirectory, "app.mjs");
			await writeFile(appPath, appSource);
			execFileSync(process.execPath, ["--check", appPath]);
		} finally {
			await rm(syntaxDirectory, { force: true, recursive: true });
		}

		const runs = await fetch(`${baseUrl}/api/runs`, {
			headers,
		});
		assert.equal(runs.status, 200);
		const runsPayload = (await runs.json()) as { runs: FlowRunSummary[] };
		assert.deepEqual(
			runsPayload.runs.map((run) => run.id),
			[runId],
		);

		const detail = await fetch(`${baseUrl}/api/runs/${runId}`, { headers });
		assert.equal(detail.status, 200);
		const detailPayload = (await detail.json()) as { history: FlowRunHistory };
		assert.equal(detailPayload.history.run.id, runId);
		assert.equal("task" in detailPayload.history.run, false);
		assert.equal("input" in detailPayload.history.nodeRuns[0], false);

		const flowSessions = await fetch(`${baseUrl}/api/flows/code-change`, {
			headers,
		});
		assert.equal(flowSessions.status, 200);
		const flowPayload = (await flowSessions.json()) as {
			flowDefinition?: { nodes: Array<{ ref: string }> };
			nodeSessions: Array<{
				runId: string;
				nodeRunId: string;
				nodeRef: string;
			}>;
		};
		assert.equal(flowPayload.flowDefinition?.nodes[0]?.ref, "analyze");
		assert.equal(flowPayload.nodeSessions[0]?.runId, runId);
		assert.equal(flowPayload.nodeSessions[0]?.nodeRunId, "node-1");
		assert.equal(flowPayload.nodeSessions[0]?.nodeRef, "analyze");

		const nodeEvidence = await fetch(
			`${baseUrl}/api/runs/${runId}/node-runs/node-1/evidence`,
			{ headers },
		);
		assert.equal(nodeEvidence.status, 200);
		const evidencePayload = (await nodeEvidence.json()) as {
			evidence: FlowNodeEvidence;
			messages?: FlowNodeEvidence["messages"];
		};
		assert.equal(evidencePayload.messages?.[0]?.content, "analysis");
		assert.equal("session" in evidencePayload.evidence, false);

		const forbidden = await fetch(`${baseUrl}/api/runs`);
		assert.equal(forbidden.status, 401);
	} finally {
		await host.close();
	}
});

test("非回环监听需要 TLS 证书和私钥", async () => {
	assert.throws(
		() =>
			new FlowObservabilityWebHost({
				runtime: new FakeWebRuntime(),
				host: "0.0.0.0",
				port: 0,
			}),
		/需要 TLS/,
	);
	const host = new FlowObservabilityWebHost({
		runtime: new FakeWebRuntime(),
		host: "0.0.0.0",
		publicHost: "10.144.144.2",
		port: 0,
		allowInsecureLan: true,
		token: "lan-token",
	});
	await host.start();
	try {
		assert.match(
			host.url ?? "",
			/^http:\/\/10\.144\.144\.2:\d+\/#token=lan-token$/,
		);
	} finally {
		await host.close();
	}
});
