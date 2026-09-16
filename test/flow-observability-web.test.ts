import assert from "node:assert/strict";
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
		const initial = await fetch(host.url ?? "", { redirect: "manual" });
		assert.equal(initial.status, 302);
		const cookie = initial.headers.get("set-cookie");
		assert.match(cookie ?? "", /flow_observability=test-token/);
		const headers = { Cookie: cookie ?? "" };
		const baseUrl = new URL(host.url ?? "").origin;

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

test("局域网监听需要显式确认并生成公开地址", async () => {
	assert.throws(
		() =>
			new FlowObservabilityWebHost({
				runtime: new FakeWebRuntime(),
				host: "0.0.0.0",
				port: 0,
			}),
		/需要显式确认/,
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
			/^http:\/\/10\.144\.144\.2:\d+\/\?token=lan-token$/,
		);
	} finally {
		await host.close();
	}
});
