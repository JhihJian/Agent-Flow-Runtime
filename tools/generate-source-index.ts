import { readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	type FunctionDeclaration,
	type MethodDeclaration,
	type Node,
	Project,
	type SourceFile,
	SyntaxKind,
} from "ts-morph";
import {
	type SourceGuideTarget,
	sourceGuideTargets,
} from "./source-guide-targets.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const guidePath = "docs/source-pseudocode-guide.md";
const indexPath = "docs/source-index.md";

export interface SourceLocation {
	target: SourceGuideTarget;
	startLine: number;
	endLine: number;
}

interface IndexedSymbol {
	name: string;
	kind: string;
	externallyVisible: boolean;
	startLine: number;
	endLine: number;
}

type IndexableNode = Node & { isExported?: () => boolean };

export async function collectTargetLocations(
	root = repositoryRoot,
): Promise<SourceLocation[]> {
	const project = new Project({
		tsConfigFilePath: resolve(root, "tsconfig.json"),
	});
	return sourceGuideTargets.map((target) => {
		const source = project.getSourceFileOrThrow(resolve(root, target.file));
		const node = findTarget(source, target);
		return {
			target,
			startLine: node.getStartLineNumber(),
			endLine: node.getEndLineNumber(),
		};
	});
}

export function renderSourceGuide(
	guide: string,
	locations: readonly SourceLocation[],
): string {
	const declaredTargetIds = [
		...guide.matchAll(/<!-- source-guide:([a-z0-9-]+) -->/g),
	].map((match) => match[1]);
	const expectedTargetIds = sourceGuideTargets.map((target) => target.id);
	if (
		declaredTargetIds.length !== expectedTargetIds.length ||
		declaredTargetIds.some((id) => !expectedTargetIds.includes(id))
	) {
		throw new Error("阅读图受控区块必须与关键函数清单完全一致");
	}
	let output = guide;
	for (const location of locations) {
		const { id, title, file } = location.target;
		const sectionPattern = new RegExp(
			`<!-- source-guide:${id} -->([\\s\\S]*?)<!-- /source-guide:${id} -->`,
			"g",
		);
		const sections = [...output.matchAll(sectionPattern)];
		if (sections.length !== 1)
			throw new Error(`阅读图必须恰有一个 ${id} 受控区块`);
		const section = sections[0][1];
		if (!section.includes("```mermaid"))
			throw new Error(`阅读图区块 ${id} 缺少 Mermaid 图`);
		if (!section.includes("```text"))
			throw new Error(`阅读图区块 ${id} 缺少 text 伪代码`);
		const locationPattern = new RegExp(
			`(<!-- source-guide:location:${id} -->\\n)([\\s\\S]*?)(\\n<!-- /source-guide:location:${id} -->)`,
			"g",
		);
		const markers = [...section.matchAll(locationPattern)];
		if (markers.length !== 1)
			throw new Error(`阅读图区块 ${id} 缺少或重复源码位置标记`);
		const replacement = `**源码：** [${file}:${location.startLine}-${location.endLine}](../${file}#L${location.startLine})，\`${title}\``;
		const updatedSection = section.replace(
			locationPattern,
			`$1${replacement}$3`,
		);
		output = output.replace(sectionPattern, (full, body: string) =>
			full.replace(body, updatedSection),
		);
	}
	return output;
}

export function renderSourceIndex(root = repositoryRoot): string {
	const project = new Project({
		tsConfigFilePath: resolve(root, "tsconfig.json"),
	});
	const sources = project
		.getSourceFiles("src/**/*.ts")
		.sort((left, right) =>
			left.getFilePath().localeCompare(right.getFilePath()),
		);
	const lines = [
		"# 源码符号索引",
		"",
		"本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。",
		"",
	];
	for (const source of sources) {
		const file = relative(root, source.getFilePath()).replaceAll("\\", "/");
		lines.push(`## [${file}](../${file})`, "");
		const imports = source
			.getImportDeclarations()
			.map((item) => `\`${item.getModuleSpecifierValue()}\``);
		lines.push(
			imports.length > 0 ? `依赖：${imports.join("、")}` : "依赖：无",
			"",
			"| 符号 | 类别 | 外部可见 | 位置 |",
			"| --- | --- | --- | --- |",
		);
		const symbols = collectSymbols(source);
		for (const symbol of symbols) {
			const location = `[${file}:${symbol.startLine}-${symbol.endLine}](../${file}#L${symbol.startLine})`;
			lines.push(
				`| \`${symbol.name}\` | ${symbol.kind} | ${symbol.externallyVisible ? "是" : "否"} | ${location} |`,
			);
		}
		if (symbols.length === 0) lines.push("| 无 | - | - | - |");
		lines.push("");
	}
	return `${lines.join("\n").trimEnd()}\n`;
}

async function main(): Promise<void> {
	const mode = process.argv[2];
	if (mode !== "--write" && mode !== "--check") {
		throw new Error(
			"用法: tsx tools/generate-source-index.ts --write | --check",
		);
	}
	const [guide, locations] = await Promise.all([
		readFile(resolve(repositoryRoot, guidePath), "utf8"),
		collectTargetLocations(),
	]);
	const generatedGuide = renderSourceGuide(guide, locations);
	const generatedIndex = renderSourceIndex();
	const currentIndex = await readFile(
		resolve(repositoryRoot, indexPath),
		"utf8",
	).catch((error: NodeJS.ErrnoException) => {
		if (error.code === "ENOENT") return "";
		throw error;
	});
	if (mode === "--check") {
		if (guide !== generatedGuide || currentIndex !== generatedIndex) {
			throw new Error(
				"源码阅读资料已过期，请执行 npm run docs:source-index 并提交结果",
			);
		}
		return;
	}
	await Promise.all([
		writeFile(resolve(repositoryRoot, guidePath), generatedGuide, "utf8"),
		writeFile(resolve(repositoryRoot, indexPath), generatedIndex, "utf8"),
	]);
}

function findTarget(
	source: SourceFile,
	target: SourceGuideTarget,
): FunctionDeclaration | MethodDeclaration {
	if (target.kind === "function") {
		const matches = source
			.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
			.filter((node) => node.getName() === target.name);
		if (matches.length === 1) return matches[0];
		throw new Error(`目标 ${target.id} 必须唯一匹配函数 ${target.name}`);
	}
	const declaration = source.getClass(target.className ?? "");
	if (!declaration)
		throw new Error(`目标 ${target.id} 缺少类 ${target.className}`);
	const matches = declaration
		.getMethods()
		.filter((method) => method.getName() === target.name);
	if (matches.length === 1) return matches[0];
	throw new Error(`目标 ${target.id} 必须唯一匹配方法 ${target.name}`);
}

function collectSymbols(source: SourceFile): IndexedSymbol[] {
	const symbols: IndexedSymbol[] = [];
	for (const declaration of source.getFunctions()) {
		const name = declaration.getName();
		if (name) symbols.push(indexSymbol(name, "函数", declaration));
	}
	for (const declaration of source.getClasses()) {
		const name = declaration.getName();
		if (!name) continue;
		symbols.push(indexSymbol(name, "类", declaration));
		for (const method of declaration.getMethods()) {
			symbols.push(
				indexSymbol(
					`${name}.${method.getName()}`,
					"方法",
					method,
					declaration.isExported() &&
						!method.hasModifier(SyntaxKind.PrivateKeyword),
				),
			);
		}
	}
	for (const declaration of source.getInterfaces()) {
		const name = declaration.getName();
		if (name) symbols.push(indexSymbol(name, "接口", declaration));
	}
	for (const declaration of source.getTypeAliases()) {
		symbols.push(indexSymbol(declaration.getName(), "类型", declaration));
	}
	return symbols.sort(
		(left, right) =>
			left.startLine - right.startLine || left.name.localeCompare(right.name),
	);
}

function indexSymbol(
	name: string,
	kind: string,
	node: IndexableNode,
	externallyVisible = node.isExported?.() ?? false,
): IndexedSymbol {
	return {
		name,
		kind,
		externallyVisible,
		startLine: node.getStartLineNumber(),
		endLine: node.getEndLineNumber(),
	};
}

if (
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	await main();
}
