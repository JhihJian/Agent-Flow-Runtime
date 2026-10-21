import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import type { FlowRunHistory, FlowRunRecord } from "../src/contracts/types.ts";
import { loadFlow } from "../src/definition/flow-loader.ts";
import { fingerprintFlow, JsonFileRunStore } from "../src/execution/runtime.ts";
import { createLocalFlowUiServer } from "../src/observability/local-ui.ts";
import {
	serializeFlowDefinition,
	toSessionListItem,
} from "../src/observability/view.ts";

const fixturePath = resolve(
	import.meta.dirname,
	"fixtures",
	"ordinary",
	"FLOW.md",
);

function runRecord(flowPath: string): FlowRunRecord {
	return {
		id: "ui-run",
		flowId: "ordinary",
		flowVersion: "sha256:test",
		status: "running",
		phase: "executing_node",
		sequence: 1,
		historyCompleteness: "complete",
		startedAt: "2025-01-01T00:00:00.000Z",
		flowPath,
		currentNodeRef: "analyze",
		currentInput: {},
	};
}

function history(run: FlowRunRecord): FlowRunHistory {
	return {
		run: {
			id: run.id,
			flowId: run.flowId,
			flowVersion: run.flowVersion,
			status: run.status,
			phase: run.phase,
			sequence: run.sequence,
			historyCompleteness: run.historyCompleteness,
			startedAt: run.startedAt,
		},
		nodeRuns: [],
		routeDecisions: [],
		parallelRounds: [],
		recoveries: [],
		current: { kind: "node", nodeRef: "analyze", nodeName: "分析任务" },
		evidence: {},
	};
}

test("serializes a Flow definition without duplicating parallel join edges", async () => {
	const loaded = await loadFlow(fixturePath);
	const definition = serializeFlowDefinition(loaded.flow, "sha256:test");
	assert.equal(definition.id, "ordinary");
	assert.equal(definition.startNodeRef, "analyze");
	assert.equal(
		definition.edges.filter((edge) => edge.from === "analyze").length,
		1,
	);
	assert.match(definition.mermaid, /analyze\[分析任务\]/);
});

test("builds a session list item from the persisted current location", async () => {
	const run = runRecord(fixturePath);
	const item = toSessionListItem(run, history(run), "普通流转");
	assert.equal(item.flowName, "普通流转");
	assert.equal(item.currentLabel, "分析任务");
	assert.equal(item.lastActivityAt, run.startedAt);
});

test("serves the local Flow UI and read-only run APIs", async () => {
	const directory = await mkdtemp(join(tmpdir(), "agent-flow-ui-"));
	const storePath = join(directory, "flow-runs.json");
	const store = new JsonFileRunStore(storePath);
	const run = runRecord(fixturePath);
	const loaded = await loadFlow(fixturePath);
	run.flowVersion = fingerprintFlow(loaded.flow, loaded.references);
	await store.createRun(run);

	const server = createLocalFlowUiServer({
		storePath,
		host: "127.0.0.1",
		port: 0,
	});
	await server.start();
	try {
		const page = await fetch(server.url);
		assert.equal(page.status, 200);
		assert.match(await page.text(), /Flow 运行台/);

		const list = await fetch(`${server.url}/api/runs`);
		assert.equal(list.status, 200);
		const listPayload = (await list.json()) as { runs: Array<{ id: string }> };
		assert.deepEqual(
			listPayload.runs.map((item) => item.id),
			[run.id],
		);

		const detail = await fetch(`${server.url}/api/runs/${run.id}`);
		assert.equal(detail.status, 200);
		const detailPayload = (await detail.json()) as {
			definition?: { id: string };
			history: { run: { id: string } };
		};
		assert.equal(detailPayload.history.run.id, run.id);
		assert.equal(detailPayload.definition?.id, "ordinary");
	} finally {
		await server.stop();
		await readFile(storePath, "utf8");
	}
});

test("keeps legacy run history readable when its Flow definition is missing", async () => {
	const directory = await mkdtemp(join(tmpdir(), "agent-flow-ui-legacy-"));
	const storePath = join(directory, "flow-runs.json");
	const store = new JsonFileRunStore(storePath);
	const run = runRecord(join(directory, "removed-flow", "FLOW.md"));
	await store.createRun(run);

	const server = createLocalFlowUiServer({
		storePath,
		host: "127.0.0.1",
		port: 0,
	});
	await server.start();
	try {
		const response = await fetch(`${server.url}/api/runs/${run.id}`);
		assert.equal(response.status, 200);
		const payload = (await response.json()) as {
			definition?: unknown;
			definitionSource?: string;
			history: { run: { id: string } };
		};
		assert.equal(payload.history.run.id, run.id);
		assert.equal(payload.definition, undefined);
		assert.equal(payload.definitionSource, "run-history");
	} finally {
		await server.stop();
	}
});
