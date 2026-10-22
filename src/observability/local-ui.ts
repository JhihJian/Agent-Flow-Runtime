import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
	createServer,
	type IncomingMessage,
	type Server,
	type ServerResponse,
} from "node:http";
import { extname, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
	FlowNodeEvidenceReader,
	FlowRunHistory,
	FlowRunInspectorApi,
	FlowRunRecord,
	RunStore,
} from "../contracts/types.ts";
import { loadFlow } from "../definition/flow-loader.ts";
import { fingerprintFlow, JsonFileRunStore } from "../execution/runtime.ts";
import { FlowRunInspector } from "./index.ts";
import {
	type FlowRunView,
	type FlowSessionListItem,
	serializeFlowDefinition,
	toSessionListItem,
} from "./view.ts";

const UI_ROOT = resolve(fileURLToPath(new URL("../../ui/", import.meta.url)));

export interface LocalFlowUiOptions {
	storePath: string;
	host?: string;
	port?: number;
	limit?: number;
	evidenceReader?: FlowNodeEvidenceReader;
	getEvidenceReader?: () => FlowNodeEvidenceReader | undefined;
}

export interface LocalFlowUiServer {
	readonly host: string;
	readonly port: number;
	readonly url: string;
	start(): Promise<void>;
	stop(): Promise<void>;
}

export function createLocalFlowUiServer(
	options: LocalFlowUiOptions,
): LocalFlowUiServer {
	const host = options.host ?? "0.0.0.0";
	const preferredPort = options.port ?? 4387;
	const store: RunStore = new JsonFileRunStore(options.storePath);
	const getInspector = (): FlowRunInspectorApi =>
		new FlowRunInspector(store, {
			evidenceReader: options.getEvidenceReader?.() ?? options.evidenceReader,
		});
	let server: Server | undefined;
	let port = preferredPort;

	return {
		get host() {
			return host;
		},
		get port() {
			return port;
		},
		get url() {
			return `http://127.0.0.1:${port}`;
		},
		async start() {
			if (server) return;
			for (
				let candidate = preferredPort;
				candidate < preferredPort + 20;
				candidate++
			) {
				const candidateServer = createServer((request, response) => {
					void handleRequest(
						request,
						response,
						getInspector,
						store,
						options.limit ?? 50,
					);
				});
				try {
					await listen(candidateServer, host, candidate);
					server = candidateServer;
					const address = candidateServer.address();
					port =
						typeof address === "object" && address ? address.port : candidate;
					return;
				} catch (error) {
					candidateServer.close();
					if (!isAddressInUse(error) || candidate === preferredPort + 19)
						throw error;
				}
			}
		},
		async stop() {
			if (!server) return;
			const current = server;
			server = undefined;
			await new Promise<void>((resolveClose, reject) => {
				current.close((error) => (error ? reject(error) : resolveClose()));
			});
		},
	};
}

async function handleRequest(
	request: IncomingMessage,
	response: ServerResponse,
	getInspector: () => FlowRunInspectorApi,
	store: RunStore,
	limit: number,
): Promise<void> {
	try {
		const inspector = getInspector();
		const url = new URL(request.url ?? "/", "http://localhost");
		if (request.method !== "GET") {
			json(response, 405, { error: "Method Not Allowed" });
			return;
		}
		if (url.pathname === "/api/health") {
			json(response, 200, { ok: true });
			return;
		}
		if (url.pathname === "/api/runs") {
			json(response, 200, {
				runs: await listSessions(store, inspector, limit),
			});
			return;
		}
		const runMatch = /^\/api\/runs\/([^/]+)$/.exec(url.pathname);
		if (runMatch) {
			const view = await inspectView(
				decodeURIComponent(runMatch[1]),
				store,
				inspector,
			);
			if (!view) {
				json(response, 404, { error: "Flow 运行不存在" });
				return;
			}
			json(response, 200, view);
			return;
		}
		const evidenceMatch =
			/^\/api\/runs\/([^/]+)\/nodes\/([^/]+)\/evidence$/.exec(url.pathname);
		if (evidenceMatch) {
			const run = await store.getRun(decodeURIComponent(evidenceMatch[1]));
			if (!run || !(await loadMatchingFlow(run))) {
				json(response, 404, { error: "证据不存在或不可访问" });
				return;
			}
			const evidence = await inspector.inspectNodeEvidence(
				decodeURIComponent(evidenceMatch[1]),
				decodeURIComponent(evidenceMatch[2]),
			);
			if (!evidence) {
				json(response, 404, { error: "证据不存在或不可访问" });
				return;
			}
			json(response, 200, evidence);
			return;
		}
		await serveStatic(url.pathname, response);
	} catch (error) {
		json(response, 500, {
			error: error instanceof Error ? error.message : String(error),
		});
	}
}

async function listSessions(
	store: RunStore,
	inspector: FlowRunInspectorApi,
	limit: number,
): Promise<FlowSessionListItem[]> {
	const runs = (await store.listAllRuns())
		.filter((run) => !run.parentRunId)
		.sort((left, right) => right.startedAt.localeCompare(left.startedAt));
	const maxItems = Math.max(1, limit);
	const items: FlowSessionListItem[] = [];
	for (const run of runs) {
		if (items.length >= maxItems) break;
		const flow = await loadMatchingFlow(run);
		if (!flow) continue;
		const history = await inspector.inspectRun(run.id);
		if (!history) continue;
		items.push(toSessionListItem(run, history, flow.flow.name));
	}
	return items.sort((left, right) =>
		right.lastActivityAt.localeCompare(left.lastActivityAt),
	);
}

async function inspectView(
	runId: string,
	store: RunStore,
	inspector: FlowRunInspectorApi,
): Promise<FlowRunView | undefined> {
	const run = await store.getRun(runId);
	if (!run) return undefined;
	const flow = await loadMatchingFlow(run);
	if (!flow) return undefined;
	const history = await inspector.inspectRun(runId);
	if (!history) return undefined;
	const availableChildRunIds = await getReadableChildRunIds(
		runId,
		history,
		store,
	);
	const base = { history, availableChildRunIds };
	if (run.definition) {
		return {
			...base,
			definition: run.definition,
			definitionSource: "run-snapshot",
		};
	}
	return {
		...base,
		definition: serializeFlowDefinition(
			flow.flow,
			fingerprintFlow(flow.flow, flow.references),
		),
		definitionSource: "current-file",
	};
}

async function getReadableChildRunIds(
	parentRunId: string,
	history: FlowRunHistory,
	store: RunStore,
): Promise<string[]> {
	const referencedIds = new Set(
		history.nodeRuns
			.map((node) => node.childRunId)
			.filter((id): id is string => Boolean(id)),
	);
	const children = await store.listChildRuns(parentRunId);
	const readableIds: string[] = [];
	for (const child of children) {
		if (referencedIds.has(child.id) && (await loadMatchingFlow(child))) {
			readableIds.push(child.id);
		}
	}
	return readableIds;
}

async function loadMatchingFlow(
	run: FlowRunRecord,
): Promise<Awaited<ReturnType<typeof loadFlow>> | undefined> {
	if (!run.flowPath) return undefined;
	if (run.definition && run.definition.version !== run.flowVersion) {
		return undefined;
	}
	try {
		const flow = await loadFlow(run.flowPath);
		return fingerprintFlow(flow.flow, flow.references) === run.flowVersion
			? flow
			: undefined;
	} catch {
		return undefined;
	}
}

async function serveStatic(
	pathname: string,
	response: ServerResponse,
): Promise<void> {
	const requested = pathname === "/" ? "/index.html" : pathname;
	const file = resolve(UI_ROOT, `.${normalize(requested)}`);
	if (!file.startsWith(`${UI_ROOT}/`)) {
		json(response, 403, { error: "Forbidden" });
		return;
	}
	const info = await stat(file).catch(() => undefined);
	if (!info?.isFile()) {
		json(response, 404, { error: "Not Found" });
		return;
	}
	response.writeHead(200, { "Content-Type": contentType(extname(file)) });
	createReadStream(file).pipe(response);
}

function contentType(extension: string): string {
	return (
		{
			".html": "text/html; charset=utf-8",
			".css": "text/css; charset=utf-8",
			".js": "text/javascript; charset=utf-8",
			".json": "application/json; charset=utf-8",
		}[extension] ?? "application/octet-stream"
	);
}

function json(response: ServerResponse, status: number, value: unknown): void {
	const body = JSON.stringify(value);
	response.writeHead(status, {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store",
	});
	response.end(body);
}

function listen(server: Server, host: string, port: number): Promise<void> {
	return new Promise((resolveListen, reject) => {
		const onError = (error: Error) => {
			server.off("listening", onListening);
			reject(error);
		};
		const onListening = () => {
			server.off("error", onError);
			resolveListen();
		};
		server.once("error", onError);
		server.once("listening", onListening);
		server.listen(port, host);
	});
}

function isAddressInUse(error: unknown): boolean {
	return Boolean(
		error &&
			typeof error === "object" &&
			"code" in error &&
			(error as { code?: string }).code === "EADDRINUSE",
	);
}
