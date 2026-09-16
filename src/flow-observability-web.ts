import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type Server } from "node:http";
import type { Socket } from "node:net";
import type { FlowRunVisualizationRuntime } from "./flow-run-visualization.ts";
import type {
	FlowNodeEvidence,
	FlowObservationEvent,
	FlowRunHistory,
	FlowRunSummary,
	NodeSession,
	UnifiedMessage,
} from "./types.ts";

export interface FlowObservabilityWebRequestContext {
	remoteAddress?: string;
}

export interface FlowObservabilityWebAuthorizer {
	canReadRun(
		context: FlowObservabilityWebRequestContext,
		run: FlowRunSummary,
	): boolean | Promise<boolean>;
	canReadEvidence(
		context: FlowObservabilityWebRequestContext,
		runId: string,
		nodeRunId: string,
	): boolean | Promise<boolean>;
}

export interface FlowObservabilityWebHostOptions {
	runtime?: FlowRunVisualizationRuntime;
	getRuntime?: () => FlowRunVisualizationRuntime;
	host?: string;
	port?: number;
	token?: string;
	authorizer?: FlowObservabilityWebAuthorizer;
	readPersistedEvidence?: (
		session: NodeSession,
	) => Promise<UnifiedMessage[] | undefined>;
}

export class FlowObservabilityWebHost {
	readonly token: string;
	private readonly runtimeProvider: () => FlowRunVisualizationRuntime;
	private readonly host: string;
	private readonly requestedPort: number;
	private readonly authorizer: FlowObservabilityWebAuthorizer;
	private readonly readPersistedEvidence?: (
		session: NodeSession,
	) => Promise<UnifiedMessage[] | undefined>;
	private readonly sockets = new Set<Socket>();
	private readonly backpressured = new WeakSet<
		import("node:http").ServerResponse
	>();
	private sseConnections = 0;
	private server?: Server;
	private actualPort?: number;

	constructor(options: FlowObservabilityWebHostOptions) {
		const runtime = options.runtime;
		if (options.getRuntime) {
			this.runtimeProvider = options.getRuntime;
		} else if (runtime) {
			this.runtimeProvider = () => runtime;
		} else {
			throw new Error("Web 观察站需要 FlowRuntime 提供器");
		}
		this.host = options.host ?? "127.0.0.1";
		this.requestedPort = options.port ?? 3818;
		this.token = options.token ?? randomUUID();
		this.authorizer = options.authorizer ?? allowLocalRunAccess;
		this.readPersistedEvidence = options.readPersistedEvidence;
	}

	get url(): string | undefined {
		return this.actualPort
			? `http://127.0.0.1:${this.actualPort}/?token=${encodeURIComponent(this.token)}`
			: undefined;
	}

	async start(): Promise<void> {
		if (this.server) return;
		const server = createServer((request, response) => {
			void this.handle(request, response);
		});
		server.on("connection", (socket) => {
			this.sockets.add(socket);
			socket.once("close", () => this.sockets.delete(socket));
		});
		await new Promise<void>((resolve, reject) => {
			server.once("error", reject);
			server.listen(this.requestedPort, this.host, () => {
				server.off("error", reject);
				resolve();
			});
		});
		const address = server.address();
		if (!address || typeof address === "string") {
			server.close();
			throw new Error("Web 观察站未获得 TCP 监听端口");
		}
		this.actualPort = address.port;
		this.server = server;
	}

	async close(): Promise<void> {
		const server = this.server;
		this.server = undefined;
		this.actualPort = undefined;
		if (!server) return;
		for (const socket of this.sockets) socket.destroy();
		this.sockets.clear();
		await new Promise<void>((resolve, reject) => {
			server.close((error) => (error ? reject(error) : resolve()));
		});
	}

	private async handle(
		request: IncomingMessage,
		response: import("node:http").ServerResponse,
	): Promise<void> {
		try {
			const url = new URL(
				request.url ?? "/",
				"http://flow-observability.local",
			);
			if (
				url.pathname === "/" &&
				url.searchParams.get("token") === this.token
			) {
				response.setHeader(
					"Set-Cookie",
					`flow_observability=${this.token}; HttpOnly; SameSite=Strict; Path=/`,
				);
				response.writeHead(302, { Location: "/" });
				response.end();
				return;
			}
			if (!this.isAuthenticated(request)) {
				this.writeText(
					response,
					401,
					"Flow observation authorization required",
				);
				return;
			}
			if (url.pathname === "/") {
				this.writeHtml(response, WEB_PAGE);
				return;
			}
			if (url.pathname === "/assets/app.js") {
				this.writeJavaScript(response, WEB_APP);
				return;
			}
			if (url.pathname === "/assets/app.css") {
				this.writeCss(response, WEB_CSS);
				return;
			}
			await this.handleApi(url, request, response);
		} catch {
			this.writeJson(response, 500, { error: "读取运行观察数据失败" });
		}
	}

	private async handleApi(
		url: URL,
		request: IncomingMessage,
		response: import("node:http").ServerResponse,
	): Promise<void> {
		const context = { remoteAddress: request.socket.remoteAddress };
		if (url.pathname === "/api/runs") {
			const requested = Number(url.searchParams.get("limit") ?? "50");
			const limit = Number.isFinite(requested)
				? Math.max(1, Math.min(Math.floor(requested), 100))
				: 50;
			const runs = await this.runtime().listRecentRuns(limit);
			const visible: WebRunSummary[] = [];
			for (const run of runs) {
				if (await this.authorizer.canReadRun(context, run))
					visible.push(toWebRunSummary(run));
			}
			this.writeJson(response, 200, { runs: visible });
			return;
		}

		const evidence =
			/^\/api\/runs\/([^/]+)\/node-runs\/([^/]+)\/evidence$/.exec(url.pathname);
		if (evidence) {
			const runId = decodeURIComponent(evidence[1] ?? "");
			const nodeRunId = decodeURIComponent(evidence[2] ?? "");
			if (!(await this.canReadRun(context, runId))) {
				this.writeJson(response, 404, { error: "运行记录不可用" });
				return;
			}
			if (!(await this.authorizer.canReadEvidence(context, runId, nodeRunId))) {
				this.writeJson(response, 404, { error: "完整依据不可用" });
				return;
			}
			const detail = await this.runtime().inspectNodeEvidence(runId, nodeRunId);
			if (!detail) {
				this.writeJson(response, 404, { error: "完整依据不可用" });
				return;
			}
			const messages = detail.session
				? this.readPersistedEvidence
					? await this.readPersistedEvidence(detail.session)
					: undefined
				: detail.messages;
			this.writeJson(response, 200, {
				evidence: toWebEvidence(detail),
				messageTranscriptAvailable: messages !== undefined,
				messages,
			});
			return;
		}

		const observe = /^\/api\/runs\/([^/]+)\/observe$/.exec(url.pathname);
		if (observe) {
			const runId = decodeURIComponent(observe[1] ?? "");
			if (!(await this.canReadRun(context, runId))) {
				this.writeJson(response, 404, { error: "运行记录不可用" });
				return;
			}
			await this.openObservation(response, runId);
			return;
		}

		const detail = /^\/api\/runs\/([^/]+)$/.exec(url.pathname);
		if (detail) {
			const runId = decodeURIComponent(detail[1] ?? "");
			const history = await this.runtime().inspectRun(runId);
			if (
				!history ||
				!(await this.authorizer.canReadRun(context, history.run))
			) {
				this.writeJson(response, 404, { error: "运行记录不可用" });
				return;
			}
			this.writeJson(response, 200, { history: toWebRunHistory(history) });
			return;
		}

		this.writeJson(response, 404, { error: "资源不存在" });
	}

	private async canReadRun(
		context: FlowObservabilityWebRequestContext,
		runId: string,
	): Promise<boolean> {
		const history = await this.runtime().inspectRun(runId);
		return history
			? await this.authorizer.canReadRun(context, history.run)
			: false;
	}

	private async openObservation(
		response: import("node:http").ServerResponse,
		runId: string,
	): Promise<void> {
		let closed = false;
		let unsubscribe: (() => void) | undefined;
		response.once("close", () => {
			closed = true;
			unsubscribe?.();
		});
		let ready = false;
		const pending: FlowObservationEvent[] = [];
		const observation = await this.runtime().openRunObservation(
			runId,
			(event) => {
				if (ready) this.publishSse(response, "flow_event", toWebEvent(event));
				else pending.push(event);
			},
		);
		if (!observation) {
			this.writeJson(response, 404, { error: "运行记录不可用" });
			return;
		}
		if (closed) {
			observation.subscription.unsubscribe();
			return;
		}
		if (this.sseConnections >= 20) {
			observation.subscription.unsubscribe();
			this.writeJson(response, 429, { error: "实时连接数量已达上限" });
			return;
		}
		let released = false;
		unsubscribe = () => {
			if (released) return;
			released = true;
			this.sseConnections -= 1;
			observation.subscription.unsubscribe();
		};
		this.sseConnections += 1;
		response.writeHead(200, {
			"Content-Type": "text/event-stream; charset=utf-8",
			"Cache-Control": "no-store",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		});
		this.writeSse(response, "snapshot", toWebRunHistory(observation.snapshot));
		ready = true;
		for (const event of pending)
			this.publishSse(response, "flow_event", toWebEvent(event));
		const heartbeat = setInterval(
			() => response.write(": keepalive\n\n"),
			15_000,
		);
		response.once("close", () => {
			clearInterval(heartbeat);
			unsubscribe?.();
		});
	}

	private isAuthenticated(request: IncomingMessage): boolean {
		const cookie = request.headers.cookie ?? "";
		return cookie
			.split(";")
			.some((part) => part.trim() === `flow_observability=${this.token}`);
	}

	private runtime(): FlowRunVisualizationRuntime {
		return this.runtimeProvider();
	}

	private writeSse(
		response: import("node:http").ServerResponse,
		event: string,
		data: unknown,
	): boolean {
		return response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
	}

	private publishSse(
		response: import("node:http").ServerResponse,
		event: string,
		data: unknown,
	): void {
		if (this.backpressured.has(response)) return;
		if (this.writeSse(response, event, data)) return;
		this.backpressured.add(response);
		response.once("drain", () => this.backpressured.delete(response));
	}

	private writeHtml(
		response: import("node:http").ServerResponse,
		body: string,
	): void {
		response.writeHead(200, {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "no-store",
			"Referrer-Policy": "no-referrer",
			"X-Content-Type-Options": "nosniff",
			"Content-Security-Policy":
				"default-src 'self'; connect-src 'self'; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'",
		});
		response.end(body);
	}

	private writeJavaScript(
		response: import("node:http").ServerResponse,
		body: string,
	): void {
		response.writeHead(200, {
			"Content-Type": "text/javascript; charset=utf-8",
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
		});
		response.end(body);
	}

	private writeCss(
		response: import("node:http").ServerResponse,
		body: string,
	): void {
		response.writeHead(200, {
			"Content-Type": "text/css; charset=utf-8",
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
		});
		response.end(body);
	}

	private writeJson(
		response: import("node:http").ServerResponse,
		status: number,
		body: unknown,
	): void {
		response.writeHead(status, {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
		});
		response.end(JSON.stringify(body));
	}

	private writeText(
		response: import("node:http").ServerResponse,
		status: number,
		body: string,
	): void {
		response.writeHead(status, {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "no-store",
		});
		response.end(body);
	}
}

interface WebRunSummary {
	id: string;
	flowId: string;
	flowVersion: string;
	taskSummary: string;
	status: FlowRunSummary["status"];
	phase: FlowRunSummary["phase"];
	sequence: number;
	historyCompleteness: FlowRunSummary["historyCompleteness"];
	startedAt: string;
	completedAt?: string;
	errorCategory?: string;
}

function toWebRunSummary(run: FlowRunSummary): WebRunSummary {
	return {
		id: run.id,
		flowId: run.flowId,
		flowVersion: run.flowVersion.slice(0, 18),
		taskSummary: summarize(run.task),
		status: run.status,
		phase: run.phase,
		sequence: run.sequence,
		historyCompleteness: run.historyCompleteness,
		startedAt: run.startedAt,
		completedAt: run.completedAt,
		errorCategory: run.error?.category,
	};
}

function toWebRunHistory(history: FlowRunHistory) {
	return {
		run: toWebRunSummary(history.run),
		nodeRuns: history.nodeRuns.map((node) => ({
			id: node.id,
			sequence: node.sequence,
			nodeRef: node.nodeRef,
			nodeName: node.nodeName,
			actionKind: node.actionKind,
			status: node.status,
			startedAt: node.startedAt,
			completedAt: node.completedAt,
			result: node.result,
			errorCategory: node.error?.category,
			retryOf: node.retryOf,
			enteredFrom: node.enteredFrom.kind,
			parallelRoundId: node.parallelRoundId,
		})),
		routeDecisions: history.routeDecisions,
		parallelRounds: history.parallelRounds.map((round) => ({
			id: round.id,
			sequence: round.sequence,
			parallelRef: round.parallelRef,
			status: round.status,
			startedAt: round.startedAt,
			completedAt: round.completedAt,
			branchNodeRunIds: round.branchNodeRunIds,
			branchStatuses: round.branchStatuses,
			joinNodeRunId: round.joinNodeRunId,
			joinResult: round.joinOutcome?.result,
			errorCategory: round.error?.category,
		})),
		recoveries: history.recoveries.map((recovery) => ({
			id: recovery.id,
			sequence: recovery.sequence,
			interruptedNodeRunId: recovery.interruptedNodeRunId,
			strategy: recovery.strategy,
			resumedAt: recovery.resumedAt,
		})),
		current: history.current,
		evidence: Object.fromEntries(
			history.nodeRuns.map((node) => [
				node.id,
				Boolean(history.evidence[node.id]),
			]),
		),
	};
}

function toWebEvidence(evidence: FlowNodeEvidence) {
	return {
		runId: evidence.runId,
		nodeRunId: evidence.nodeRunId,
		nodeName: evidence.nodeName,
		nodeRef: evidence.nodeRef,
		status: evidence.status,
		input: evidence.input,
		outcome: evidence.outcome,
		error: evidence.error,
		commandResult: evidence.commandResult,
	};
}

function toWebEvent(event: FlowObservationEvent) {
	return {
		type: event.type,
		runId: event.runId,
		flowId: event.flowId,
		sequence: event.sequence,
		occurredAt: event.occurredAt,
		status: event.status,
		phase: event.phase,
		nodeRunId: event.nodeRunId,
		nodeName: event.nodeName,
		nodeRef: event.nodeRef,
		parallelRoundId: event.parallelRoundId,
		result: event.result,
		destination: event.destination,
		nodeStatus: event.nodeStatus,
		parallelStatus: event.parallelStatus,
	};
}

function summarize(value: unknown): string {
	const text = typeof value === "string" ? value : JSON.stringify(value);
	return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

const allowLocalRunAccess: FlowObservabilityWebAuthorizer = {
	canReadRun: () => true,
	canReadEvidence: () => true,
};

const WEB_PAGE = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Flow 运行观察站</title>
  <link rel="stylesheet" href="/assets/app.css">
</head>
<body>
  <header class="topbar"><strong>Flow 运行观察站</strong><span id="connection">正在连接</span></header>
  <main class="layout">
    <aside class="runs-panel"><div class="panel-title">近期运行</div><div id="filters" class="filters"></div><div id="runs" class="runs"></div></aside>
    <section class="timeline-panel"><div id="run-summary" class="summary"></div><div id="timeline" class="timeline"></div></section>
    <aside class="inspector-panel"><div class="panel-title">事实检查器</div><div id="inspector" class="inspector"></div></aside>
  </main>
  <script type="module" src="/assets/app.js"></script>
</body>
</html>`;

const WEB_CSS = `
:root { color-scheme: dark; font-family: ui-sans-serif, system-ui, sans-serif; background: #111827; color: #e5e7eb; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100dvh; background: #111827; }
.topbar { height: 52px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #374151; background: #182235; }
.topbar strong { font-size: 14px; }
#connection { color: #93c5fd; font-size: 12px; }
.layout { display: grid; grid-template-columns: minmax(220px, 280px) minmax(360px, 1fr) minmax(280px, 360px); min-height: calc(100dvh - 52px); }
.runs-panel, .timeline-panel, .inspector-panel { min-width: 0; border-right: 1px solid #374151; }
.inspector-panel { border-right: 0; background: #0f172a; }
.panel-title { padding: 14px 16px 10px; color: #9ca3af; font-size: 12px; }
.filters { display: flex; gap: 6px; padding: 0 12px 12px; flex-wrap: wrap; }
button { border: 1px solid #4b5563; background: #1f2937; color: #e5e7eb; border-radius: 4px; padding: 6px 9px; cursor: pointer; font: inherit; font-size: 12px; }
button:hover { border-color: #60a5fa; background: #26364f; }
button.active { border-color: #60a5fa; color: #bfdbfe; background: #1e3a5f; }
.runs { border-top: 1px solid #374151; }
.run-row { width: 100%; text-align: left; border: 0; border-bottom: 1px solid #273244; border-radius: 0; padding: 12px 14px; background: transparent; }
.run-row.selected { background: #1d3557; box-shadow: inset 3px 0 #60a5fa; }
.run-task { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.run-meta, .muted { color: #9ca3af; font-size: 11px; margin-top: 4px; }
.summary { padding: 18px 22px; border-bottom: 1px solid #374151; background: #162033; }
.summary h1 { margin: 0 0 8px; font-size: 18px; font-weight: 600; }
.summary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px 16px; font-size: 12px; }
.summary-grid span { color: #9ca3af; display: block; }
.timeline { padding: 14px 22px 32px; }
.fact { display: grid; grid-template-columns: 44px 1fr; gap: 10px; width: 100%; text-align: left; border: 0; border-radius: 0; border-left: 2px solid #334155; padding: 10px 12px; background: transparent; }
.fact:hover, .fact.selected { border-left-color: #60a5fa; background: #1b2b42; }
.sequence { color: #93c5fd; font-family: ui-monospace, monospace; font-size: 12px; padding-top: 2px; }
.fact-title { font-size: 13px; }
.fact-meta { color: #9ca3af; font-size: 11px; margin-top: 4px; }
.inspector { padding: 8px 16px 24px; font-size: 13px; }
.inspector h2 { font-size: 15px; margin: 10px 0; }
.inspector h3 { font-size: 12px; color: #9ca3af; margin: 18px 0 6px; }
.kv { display: grid; grid-template-columns: 90px 1fr; gap: 6px; padding: 6px 0; border-bottom: 1px solid #273244; }
.kv b { color: #9ca3af; font-weight: 500; }
pre { margin: 8px 0; padding: 10px; max-height: 280px; overflow: auto; white-space: pre-wrap; word-break: break-word; border: 1px solid #334155; border-radius: 4px; background: #020617; color: #d1d5db; font: 12px/1.5 ui-monospace, monospace; }
.message { border-left: 2px solid #64748b; padding: 8px 10px; margin: 8px 0; background: #172033; }
.message-role { color: #93c5fd; font-size: 11px; margin-bottom: 5px; }
.error { color: #fca5a5; }
@media (max-width: 900px) { .layout { display: block; } .runs-panel { max-height: 34dvh; overflow: auto; border-right: 0; border-bottom: 1px solid #374151; } .timeline-panel, .inspector-panel { border-right: 0; border-bottom: 1px solid #374151; } .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;

const WEB_APP = `
const state = { runs: [], filter: 'all', runId: null, history: null, selected: null, stream: null, poll: null };
const runsNode = document.querySelector('#runs');
const filtersNode = document.querySelector('#filters');
const summaryNode = document.querySelector('#run-summary');
const timelineNode = document.querySelector('#timeline');
const inspectorNode = document.querySelector('#inspector');
const connectionNode = document.querySelector('#connection');
const filters = [['all','全部'], ['running','执行中'], ['attention','需关注'], ['terminal','已结束']];

function text(value) { return value == null ? '' : String(value); }
function el(tag, textValue, className) { const node = document.createElement(tag); if (textValue != null) node.textContent = text(textValue); if (className) node.className = className; return node; }
function clear(node) { node.replaceChildren(); }
function factKey(item) { return item.kind + ':' + (item.nodeRunId || item.routeDecisionId || item.parallelRoundId || item.recoveryId || item.id); }
function taskSummary(value) { const raw = typeof value === 'string' ? value : JSON.stringify(value); return raw.length > 100 ? raw.slice(0, 97) + '...' : raw; }
function visibleRuns() { return state.runs.filter((run) => state.filter === 'all' || (state.filter === 'running' && run.status === 'running') || (state.filter === 'terminal' && run.status !== 'running') || (state.filter === 'attention' && (run.status === 'failed' || run.status === 'interrupted' || run.errorCategory || run.historyCompleteness === 'legacy'))); }

async function request(path) { const response = await fetch(path, { credentials: 'same-origin' }); if (!response.ok) throw new Error('读取运行观察数据失败'); return response.json(); }
async function loadRuns() { const payload = await request('/api/runs?limit=50'); state.runs = payload.runs; renderRuns(); if (!state.runId && state.runs[0]) openRun(state.runs[0].id); }
function renderFilters() { clear(filtersNode); for (const [value,label] of filters) { const button = el('button', label); if (state.filter === value) button.classList.add('active'); button.onclick = () => { state.filter = value; renderFilters(); renderRuns(); }; filtersNode.append(button); } }
function renderRuns() { clear(runsNode); renderFilters(); for (const run of visibleRuns()) { const button = el('button', null, 'run-row'); if (run.id === state.runId) button.classList.add('selected'); button.onclick = () => openRun(run.id); button.append(el('span', run.taskSummary, 'run-task')); button.append(el('span', run.flowId + ' | ' + run.status + '/' + run.phase, 'run-meta')); button.append(el('span', run.errorCategory || run.startedAt, 'run-meta')); runsNode.append(button); } }
async function openRun(runId) { state.runId = runId; closeStream(); renderRuns(); await loadRun(); openStream(); }
async function loadRun() { if (!state.runId) return; try { const payload = await request('/api/runs/' + encodeURIComponent(state.runId)); state.history = payload.history; connectionNode.textContent = '快照已同步 #' + state.history.run.sequence; renderDetail(); } catch (error) { connectionNode.textContent = '读取失败'; clear(summaryNode); summaryNode.append(el('div', '运行详情不可用', 'error')); } }
function openStream() { if (!state.runId) return; closeStream(); const source = new EventSource('/api/runs/' + encodeURIComponent(state.runId) + '/observe'); state.stream = source; source.addEventListener('snapshot', (event) => { state.history = JSON.parse(event.data); connectionNode.textContent = '实时已连接 #' + state.history.run.sequence; renderDetail(); }); source.addEventListener('flow_event', () => { connectionNode.textContent = '正在同步'; loadRun(); }); source.onerror = () => { connectionNode.textContent = '实时连接断开，正在以快照校正'; }; state.poll = setInterval(loadRun, 4000); }
function closeStream() { if (state.stream) state.stream.close(); if (state.poll) clearInterval(state.poll); state.stream = null; state.poll = null; }
function addKv(parent, label, value) { const row = el('div', null, 'kv'); row.append(el('b', label)); row.append(el('span', value)); parent.append(row); }
function renderDetail() { const history = state.history; if (!history) return; clear(summaryNode); summaryNode.append(el('h1', history.run.taskSummary)); const grid = el('div', null, 'summary-grid'); [['Flow', history.run.flowId], ['状态', history.run.status + '/' + history.run.phase], ['位置', describeCurrent(history.current)], ['版本', history.run.flowVersion], ['水位', '#' + history.run.sequence], ['连接', connectionNode.textContent]].forEach(([label,value]) => { const cell = el('div'); cell.append(el('span', label)); cell.append(el('div', value)); grid.append(cell); }); summaryNode.append(grid); renderTimeline(history); if (!state.selected) { const first = history.nodeRuns[0]; if (first) selectFact({ kind: 'node', id: first.id }); } else renderInspector(); }
function timelineItems(history) { const items = []; history.nodeRuns.forEach((node) => items.push({ kind:'node', id:node.id, sequence:node.sequence, title:(node.nodeName || node.nodeRef) + ' [' + node.status + ']', meta: node.result || '' })); history.routeDecisions.forEach((route) => items.push({ kind:'route', id:route.id, sequence:route.sequence, title:'路由 ' + route.result + ' -> ' + destination(route.destination), meta:'' })); history.parallelRounds.forEach((round) => items.push({ kind:'parallel', id:round.id, sequence:round.sequence, title:'并行 ' + round.parallelRef + ' [' + round.status + ']', meta:Object.keys(round.branchNodeRunIds).length + ' 个分支' })); history.recoveries.forEach((recovery) => items.push({ kind:'recovery', id:recovery.id, sequence:recovery.sequence, title:'恢复 ' + recovery.strategy, meta:'恢复记录' })); if (history.run.status !== 'running') items.push({ kind:'terminal', id:'terminal', sequence:history.run.sequence, title:'Run ' + history.run.status, meta:history.run.errorCategory || '' }); return items.sort((a,b) => a.sequence - b.sequence); }
function renderTimeline(history) { clear(timelineNode); for (const item of timelineItems(history)) { const button = el('button', null, 'fact'); if (state.selected && state.selected.kind === item.kind && state.selected.id === item.id) button.classList.add('selected'); button.onclick = () => selectFact(item); button.append(el('span', '#' + item.sequence, 'sequence')); const body = el('span'); body.append(el('div', item.title, 'fact-title')); body.append(el('div', item.meta, 'fact-meta')); button.append(body); timelineNode.append(button); } }
function selectFact(item) { state.selected = item; renderTimeline(state.history); renderInspector(); }
function findNode(id) { return state.history.nodeRuns.find((node) => node.id === id); }
function renderInspector() { clear(inspectorNode); const selected = state.selected; if (!selected) { inspectorNode.append(el('div', '选择时间线事实查看详情', 'muted')); return; } if (selected.kind === 'node') { const node = findNode(selected.id); if (!node) return; inspectorNode.append(el('h2', node.nodeName || node.nodeRef)); addKv(inspectorNode, '状态', node.status); addKv(inspectorNode, '结果', node.result || '无'); addKv(inspectorNode, '动作', node.actionKind); addKv(inspectorNode, '来源', node.enteredFrom); addKv(inspectorNode, '开始', node.startedAt); if (node.completedAt) addKv(inspectorNode, '结束', node.completedAt); if (node.errorCategory) addKv(inspectorNode, '错误类别', node.errorCategory); const evidence = state.history.evidence[node.id]; inspectorNode.append(el('h3', '节点依据')); inspectorNode.append(el('div', evidence ? '完整依据可用' : '完整依据不可用', 'muted')); const button = el('button', '查看完整依据'); button.onclick = () => loadEvidence(node.id); inspectorNode.append(button); return; } if (selected.kind === 'route') { const route = state.history.routeDecisions.find((value) => value.id === selected.id); if (route) { inspectorNode.append(el('h2', '路由选择')); addKv(inspectorNode, '结果', route.result); addKv(inspectorNode, '目标', destination(route.destination)); addKv(inspectorNode, '来源 NodeRun', route.sourceNodeRunId); } return; } if (selected.kind === 'parallel') { const round = state.history.parallelRounds.find((value) => value.id === selected.id); if (round) { inspectorNode.append(el('h2', '并行轮次 ' + round.parallelRef)); addKv(inspectorNode, '状态', round.status); Object.entries(round.branchNodeRunIds).forEach(([branch,nodeRunId]) => addKv(inspectorNode, branch, nodeRunId + ' [' + (round.branchStatuses[branch] || 'unknown') + ']')); if (round.joinNodeRunId) addKv(inspectorNode, '汇合', round.joinNodeRunId); } return; } if (selected.kind === 'recovery') { const recovery = state.history.recoveries.find((value) => value.id === selected.id); if (recovery) { inspectorNode.append(el('h2', '恢复')); addKv(inspectorNode, '策略', recovery.strategy); addKv(inspectorNode, '来源', recovery.interruptedNodeRunId || '无'); } return; } inspectorNode.append(el('h2', selected.title)); }
async function loadEvidence(nodeRunId) { try { const payload = await request('/api/runs/' + encodeURIComponent(state.runId) + '/node-runs/' + encodeURIComponent(nodeRunId) + '/evidence'); const evidence = payload.evidence; inspectorNode.append(el('h3', '完整依据')); if (payload.messageTranscriptAvailable && payload.messages) payload.messages.forEach((message) => { const block = el('div', null, 'message'); block.append(el('div', message.role, 'message-role')); block.append(el('pre', typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2))); inspectorNode.append(block); }); else inspectorNode.append(el('div', 'Agent 消息不可用', 'muted')); if (evidence.commandResult) { inspectorNode.append(el('h3', '命令结果')); addKv(inspectorNode, '退出码', text(evidence.commandResult.exitCode)); const stdout = el('pre', evidence.commandResult.stdout); const stderr = el('pre', evidence.commandResult.stderr); inspectorNode.append(el('h3', 'stdout')); inspectorNode.append(stdout); inspectorNode.append(el('h3', 'stderr')); inspectorNode.append(stderr); } } catch (_) { inspectorNode.append(el('div', '完整依据不可用', 'error')); } }
function destination(value) { return value.kind === 'finish' ? '结束' : value.kind + ':' + value.ref; }
function describeCurrent(current) { return current.kind === 'node' ? (current.nodeName || current.nodeRef) : current.kind === 'parallel' ? '并行:' + current.parallelRef : '无'; }
loadRuns();
`;
