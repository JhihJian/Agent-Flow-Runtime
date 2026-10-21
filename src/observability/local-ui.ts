import { execFile } from "node:child_process";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
	createServer,
	type IncomingMessage,
	type Server,
	type ServerResponse,
} from "node:http";
import {
	basename,
	dirname,
	extname,
	isAbsolute,
	normalize,
	relative,
	resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import type {
	FlowNodeEvidenceReader,
	FlowPackage,
	FlowRunInspectorApi,
	FlowRunRecord,
	RunStore,
} from "../contracts/types.ts";
import { loadFlow } from "../definition/flow-loader.ts";
import { parseFlow } from "../definition/parser.ts";
import { fingerprintFlow, JsonFileRunStore } from "../execution/runtime.ts";
import { FlowRunInspector } from "./index.ts";
import {
	type FlowRunView,
	type FlowSessionListItem,
	serializeFlowDefinition,
	toSessionListItem,
} from "./view.ts";

const UI_ROOT = resolve(fileURLToPath(new URL("../../ui/", import.meta.url)));
const execFileAsync = promisify(execFile);

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
		.sort((left, right) => right.startedAt.localeCompare(left.startedAt))
		.slice(0, Math.max(1, limit));
	const items: FlowSessionListItem[] = [];
	for (const run of runs) {
		const history = await inspector.inspectRun(run.id);
		if (!history) continue;
		const flowName = await resolveFlowName(run);
		items.push(toSessionListItem(run, history, flowName));
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
	const history = await inspector.inspectRun(runId);
	if (!history) return undefined;
	const run = await store.getRun(runId);
	if (!run) return undefined;
	if (run.definition) {
		if (run.definition.version !== run.flowVersion) {
			return {
				history,
				definitionError: "运行记录中的 Flow 定义快照与 Flow 版本不匹配",
			};
		}
		return {
			history,
			definition: run.definition,
			definitionSource: "run-snapshot",
		};
	}
	if (!run.flowPath) {
		return { history, definitionError: "该运行没有保存 Flow 文件路径" };
	}
	try {
		const loaded = await loadFlow(run.flowPath);
		const definitionVersion = fingerprintFlow(loaded.flow, loaded.references);
		if (definitionVersion !== run.flowVersion) {
			return {
				history,
				definitionError: `Flow 定义版本不匹配：运行记录为 ${run.flowVersion}，当前文件为 ${definitionVersion}`,
			};
		}
		return {
			history,
			definition: serializeFlowDefinition(loaded.flow, definitionVersion),
			definitionSource: "current-file",
		};
	} catch {
		const recovered = await recoverDefinitionFromGit(run);
		if (recovered) {
			return {
				history,
				definition: serializeFlowDefinition(recovered.flow, recovered.version),
				definitionSource: "git-history",
			};
		}
		return {
			history,
			definitionSource: "run-history",
		};
	}
}

async function recoverDefinitionFromGit(
	run: FlowRunRecord,
): Promise<{ flow: FlowPackage["flow"]; version: string } | undefined> {
	if (!run.flowPath || !isAbsolute(run.flowPath)) return undefined;
	try {
		const { stdout: rootOutput } = await execFileAsync(
			"git",
			["-C", dirname(run.flowPath), "rev-parse", "--show-toplevel"],
			{ maxBuffer: 1024 * 1024 },
		);
		const repository = rootOutput.trim();
		const entry = relative(repository, run.flowPath);
		if (!entry || entry.startsWith("..")) return undefined;
		const { stdout: commitsOutput } = await execFileAsync(
			"git",
			["-C", repository, "log", "--all", "--format=%H", "--", entry],
			{ maxBuffer: 1024 * 1024 },
		);
		for (const commit of commitsOutput.trim().split(/\s+/).filter(Boolean)) {
			if (!/^[0-9a-f]{40,64}$/i.test(commit)) continue;
			try {
				const references = new Map<string, FlowPackage>();
				const root = await loadFlowPackageFromGit(repository, commit, entry);
				await loadGitReferences(
					repository,
					commit,
					root,
					references,
					new Set(),
				);
				const version = fingerprintFlow(root.flow, references);
				if (version === run.flowVersion) return { flow: root.flow, version };
			} catch {
				// Try the next historical definition revision.
			}
		}
	} catch {
		return undefined;
	}
	return undefined;
}

async function loadFlowPackageFromGit(
	repository: string,
	commit: string,
	entry: string,
): Promise<FlowPackage> {
	const { stdout } = await execFileAsync(
		"git",
		["-C", repository, "show", `${commit}:${entry}`],
		{ maxBuffer: 4 * 1024 * 1024 },
	);
	const packageRoot = dirname(entry);
	return {
		flow: parseFlow(stdout, basename(packageRoot)),
		path: resolve(repository, entry),
		resources: {
			packageRoot: resolve(repository, packageRoot),
			resourcePaths: new Map(),
		},
	};
}

async function loadGitReferences(
	repository: string,
	commit: string,
	root: FlowPackage,
	references: Map<string, FlowPackage>,
	chain: Set<string>,
): Promise<void> {
	for (const node of root.flow.nodes.values()) {
		if (node.action.kind !== "执行Flow") continue;
		const id = node.action.flow;
		if (chain.has(id)) throw new Error(`Flow 引用成环: ${id}`);
		if (references.has(id)) continue;
		const siblingRoot = resolve(dirname(root.resources.packageRoot), id);
		const entry = relative(repository, resolve(siblingRoot, "FLOW.md"));
		const child = await loadFlowPackageFromGit(repository, commit, entry);
		references.set(id, child);
		await loadGitReferences(
			repository,
			commit,
			child,
			references,
			new Set([...chain, id]),
		);
	}
}

async function resolveFlowName(
	run: FlowRunRecord,
): Promise<string | undefined> {
	if (!run.flowPath) return undefined;
	try {
		return (await loadFlow(run.flowPath)).flow.name;
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
