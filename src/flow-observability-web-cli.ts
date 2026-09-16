import { readFile } from "node:fs/promises";
import { hostname, networkInterfaces } from "node:os";
import { join, resolve } from "node:path";
import { FlowObservabilityWebHost } from "./flow-observability-web.ts";
import {
	FlowObservationPublisher,
	FlowRunInspector,
	FlowRuntime,
} from "./observability.ts";
import { parseFlow } from "./parser.ts";
import { readPersistedPiNodeEvidence } from "./pi-session-evidence.ts";
import { JsonFileRunStore, snapshotFlowDefinition } from "./runtime.ts";

interface CliOptions {
	workspace: string;
	port: number;
	lan: boolean;
	insecureLan: boolean;
	tlsKey?: string;
	tlsCert?: string;
}

async function main(): Promise<void> {
	const options = parseOptions(process.argv.slice(2));
	if (
		options.lan &&
		!options.insecureLan &&
		(!options.tlsKey || !options.tlsCert)
	) {
		throw new Error("LAN 模式需要 --tls-key 和 --tls-cert");
	}
	if (options.insecureLan && !options.lan) {
		throw new Error("--insecure-lan 必须与 --lan 一起使用");
	}
	const tls =
		options.tlsKey && options.tlsCert
			? {
					key: await readFile(resolve(options.tlsKey)),
					cert: await readFile(resolve(options.tlsCert)),
				}
			: undefined;
	const host = new FlowObservabilityWebHost({
		getRuntime: () => createRuntime(options.workspace),
		host: options.lan ? "0.0.0.0" : "127.0.0.1",
		publicHost: options.lan ? lanAddress() : "127.0.0.1",
		port: options.port,
		tls,
		allowInsecureLan: options.insecureLan,
		realtime: false,
		getFallbackFlowDefinition: (runId, history) =>
			readCurrentFlowDefinition(
				options.workspace,
				runId,
				history.run.flowVersion,
			),
	});
	await host.start();
	process.stdout.write(
		`Flow Web 观察站${options.insecureLan ? "（不安全 LAN 模式）" : ""}: ${host.url}\n`,
	);
	const close = async () => {
		await host.close();
		process.exit(0);
	};
	process.once("SIGINT", () => void close());
	process.once("SIGTERM", () => void close());
}

function createRuntime(workspace: string): FlowRuntime {
	const store = new JsonFileRunStore(join(workspace, ".pi", "flow-runs.json"));
	const inspector = new FlowRunInspector(store, {
		evidenceReader: {
			getNodeSession: async (session) =>
				(await readPersistedPiNodeEvidence(session)) ?? [],
		},
	});
	return new FlowRuntime(inspector, new FlowObservationPublisher());
}

async function readCurrentFlowDefinition(
	workspace: string,
	runId: string,
	flowVersion: string,
) {
	if (flowVersion !== "legacy:unknown") return undefined;
	const store = new JsonFileRunStore(join(workspace, ".pi", "flow-runs.json"));
	const run = await store.getRun(runId);
	if (!run?.flowPath) return undefined;
	try {
		return snapshotFlowDefinition(
			parseFlow(await readFile(run.flowPath, "utf8"), run.flowPath),
		);
	} catch {
		return undefined;
	}
}

function parseOptions(args: string[]): CliOptions {
	let workspace = process.cwd();
	let port = 3818;
	let lan = false;
	let insecureLan = false;
	let tlsKey: string | undefined;
	let tlsCert: string | undefined;
	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index];
		if (argument === "--workspace") {
			workspace = resolve(requireValue(args, ++index, argument));
			continue;
		}
		if (argument === "--port") {
			port = Number(requireValue(args, ++index, argument));
			continue;
		}
		if (argument === "--lan") {
			lan = true;
			continue;
		}
		if (argument === "--insecure-lan") {
			insecureLan = true;
			continue;
		}
		if (argument === "--tls-key") {
			tlsKey = requireValue(args, ++index, argument);
			continue;
		}
		if (argument === "--tls-cert") {
			tlsCert = requireValue(args, ++index, argument);
			continue;
		}
		if (argument === "--help") {
			process.stdout.write(
				"用法: flow-observability-web [--workspace <目录>] [--port <端口>] [--lan --tls-key <文件> --tls-cert <文件> | --lan --insecure-lan]\n",
			);
			process.exit(0);
		}
		throw new Error(`未知参数: ${argument}`);
	}
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error("端口必须在 1 到 65535 之间");
	}
	return { workspace, port, lan, insecureLan, tlsKey, tlsCert };
}

function requireValue(args: string[], index: number, option: string): string {
	const value = args[index];
	if (!value) throw new Error(`${option} 缺少值`);
	return value;
}

function lanAddress(): string {
	if (hostname() === "jhihjian-MACO") return "10.144.144.2";
	const addresses = Object.values(networkInterfaces()).flatMap(
		(interfaces) => interfaces ?? [],
	);
	return (
		addresses.find((address) => address.family === "IPv4" && !address.internal)
			?.address ?? "127.0.0.1"
	);
}

void main().catch((error) => {
	process.stderr.write(
		`${error instanceof Error ? error.message : String(error)}\n`,
	);
	process.exit(1);
});
