import { readFile, realpath, stat } from "node:fs/promises";
import {
	basename,
	dirname,
	extname,
	isAbsolute,
	join,
	relative,
	resolve,
} from "node:path";
import { parseFlow } from "./parser.ts";
import type {
	CommandRequest,
	FlowDefinition,
	FlowResourceContext,
	LoadedFlow,
} from "./types.ts";

const PACKAGE_ENTRY = "FLOW.md";
const REFERENCE_LINK = /(\[[^\]]*\]\()(references\/[^)\s]+)(\))/g;

/** Loads a Flow package directory or its fixed FLOW.md entry. */
export async function loadFlow(path: string): Promise<LoadedFlow> {
	const sourcePath = isAbsolute(path) ? path : resolve(path);
	const source = await stat(sourcePath).catch((error) => {
		throw new Error(
			`无法读取 Flow 包 ${sourcePath}: ${error instanceof Error ? error.message : String(error)}`,
		);
	});
	if (!source.isDirectory() && !source.isFile()) {
		throw new Error(`Flow 包路径必须是目录或 ${PACKAGE_ENTRY}: ${sourcePath}`);
	}
	if (source.isFile() && basename(sourcePath) !== PACKAGE_ENTRY) {
		throw new Error(`Flow 包入口必须命名为 ${PACKAGE_ENTRY}: ${sourcePath}`);
	}
	const entryPath = source.isDirectory()
		? join(sourcePath, PACKAGE_ENTRY)
		: sourcePath;
	const entry = await stat(entryPath).catch((error) => {
		throw new Error(
			`Flow 包缺少入口 ${PACKAGE_ENTRY}: ${entryPath} (${error instanceof Error ? error.message : String(error)})`,
		);
	});
	if (!entry.isFile()) throw new Error(`Flow 包入口必须是文件: ${entryPath}`);

	const packageRoot = await realpath(dirname(entryPath));
	const normalizedEntryPath = await realpath(entryPath);
	if (!isInside(packageRoot, normalizedEntryPath)) {
		throw new Error(`Flow 包入口不能位于包根之外: ${entryPath}`);
	}
	const flow = parseFlow(
		await readFile(normalizedEntryPath, "utf8"),
		basename(packageRoot),
	);
	const resourcePaths = await validatePackageResources(flow, packageRoot);
	return {
		flow,
		path: normalizedEntryPath,
		resources: { packageRoot, resourcePaths },
	};
}

/** Rewrites package-local reference links to paths an Agent can read. */
export function resolvePromptResources(
	prompt: string,
	resources?: FlowResourceContext,
): string {
	if (!resources) return prompt;
	return prompt.replace(
		REFERENCE_LINK,
		(_match, prefix: string, path: string, suffix: string) =>
			`${prefix}${resourcePath(resources, path, "references")}${suffix}`,
	);
}

/** Rewrites standalone package script arguments without changing command cwd. */
export function resolveCommandResources(
	request: CommandRequest,
	resources?: FlowResourceContext,
): CommandRequest {
	if (!resources || !request.args) return request;
	return {
		...request,
		args: request.args.map((arg) =>
			arg.startsWith("scripts/")
				? resourcePath(resources, arg, "scripts")
				: arg,
		),
	};
}

async function validatePackageResources(
	flow: FlowDefinition,
	packageRoot: string,
): Promise<Map<string, string>> {
	const resourcePaths = new Map<string, string>();
	for (const node of flow.nodes.values()) {
		if (node.action.kind === "执行自定义命令") {
			for (const arg of node.action.request.args ?? []) {
				if (arg.startsWith("scripts/")) {
					resourcePaths.set(
						arg,
						await validateResource(packageRoot, arg, "scripts", ".mjs"),
					);
				}
			}
			continue;
		}
		for (const match of node.action.prompt.matchAll(REFERENCE_LINK)) {
			const path = match[2];
			if (path) {
				resourcePaths.set(
					path,
					await validateResource(packageRoot, path, "references", ".md"),
				);
			}
		}
	}
	return resourcePaths;
}

async function validateResource(
	packageRoot: string,
	path: string,
	directory: "references" | "scripts",
	extension: string,
): Promise<string> {
	const resource = resolveResource(packageRoot, path, directory);
	if (extname(resource) !== extension) {
		throw new Error(`${directory} 资源必须使用 ${extension} 扩展名: ${path}`);
	}
	const entry = await stat(resource).catch((error) => {
		throw new Error(
			`Flow 包资源不存在: ${path} (${error instanceof Error ? error.message : String(error)})`,
		);
	});
	if (!entry.isFile()) throw new Error(`Flow 包资源必须是文件: ${path}`);
	const resolvedResource = await realpath(resource);
	if (!isInside(packageRoot, resolvedResource)) {
		throw new Error(`Flow 包资源不能位于包根之外: ${path}`);
	}
	return resolvedResource;
}

function resolveResource(
	packageRoot: string,
	path: string,
	directory: "references" | "scripts",
): string {
	if (!isResourcePath(path, directory))
		throw new Error(`无效的 ${directory} 资源路径: ${path}`);
	return resolve(packageRoot, ...path.split("/"));
}

function resourcePath(
	resources: FlowResourceContext,
	path: string,
	directory: "references" | "scripts",
): string {
	if (!isResourcePath(path, directory))
		throw new Error(`无效的 ${directory} 资源路径: ${path}`);
	const resource = resources.resourcePaths.get(path);
	if (!resource) throw new Error(`未加载的 ${directory} 资源: ${path}`);
	return resource;
}

function isResourcePath(
	path: string,
	directory: "references" | "scripts",
): boolean {
	if (!path.startsWith(`${directory}/`)) return false;
	const segments = path.split("/");
	return segments.every(
		(segment) => segment.length > 0 && segment !== "." && segment !== "..",
	);
}

function isInside(root: string, target: string): boolean {
	const path = relative(root, target);
	return Boolean(path) && !path.startsWith("..") && !isAbsolute(path);
}
