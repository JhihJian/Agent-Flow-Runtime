import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import {
	collectTargetLocations,
	renderSourceGuide,
	renderSourceIndex,
} from "../tools/generate-source-index.ts";

const root = resolve(import.meta.dirname, "..");

test("为每个关键函数生成唯一的位置链接", async () => {
	const guide = await readFile(
		resolve(root, "docs/source-pseudocode-guide.md"),
		"utf8",
	);
	const index = await readFile(resolve(root, "docs/source-index.md"), "utf8");
	const locations = await collectTargetLocations(root);
	const rendered = renderSourceGuide(guide, locations);

	assert.equal(locations.length, 9);
	assert.equal(rendered, guide);
	assert.equal(renderSourceIndex(root), index);
	assert.match(rendered, /src\/runtime\.ts:/);
	assert.match(rendered, /src\/extension\.ts:/);
	assert.match(rendered, /\.\.\/src\/pi\.ts#L/);
});

test("拒绝缺少受控位置标记的阅读区块", async () => {
	const guide = await readFile(
		resolve(root, "docs/source-pseudocode-guide.md"),
		"utf8",
	);
	const locations = await collectTargetLocations(root);
	const malformed = guide.replace(
		"<!-- /source-guide:location:parse-flow -->",
		"<!-- /source-guide:missing-location -->",
	);

	assert.throws(
		() => renderSourceGuide(malformed, locations),
		/缺少或重复源码位置标记/,
	);
});

test("拒绝缺少 Mermaid 图的阅读区块", async () => {
	const guide = await readFile(
		resolve(root, "docs/source-pseudocode-guide.md"),
		"utf8",
	);
	const locations = await collectTargetLocations(root);
	const malformed = guide.replace(
		"```mermaid\nflowchart TD\n  A[Markdown]",
		"```text\nflowchart TD\n  A[Markdown]",
	);

	assert.throws(
		() => renderSourceGuide(malformed, locations),
		/缺少 Mermaid 图/,
	);
});

test("拒绝未登记的阅读图区块", async () => {
	const guide = await readFile(
		resolve(root, "docs/source-pseudocode-guide.md"),
		"utf8",
	);
	const locations = await collectTargetLocations(root);
	const malformed = guide.replace(
		"<!-- /source-guide:parse-flow -->",
		"<!-- /source-guide:parse-flow -->\n<!-- source-guide:unknown -->\n<!-- /source-guide:unknown -->",
	);

	assert.throws(
		() => renderSourceGuide(malformed, locations),
		/关键函数清单完全一致/,
	);
});

test("索引覆盖全部源码模块和关键运行时符号", () => {
	const index = renderSourceIndex(root);

	assert.match(index, /## \[src\/runtime\.ts\]/);
	assert.match(index, /`FlowCoordinator\.run`/);
	assert.match(
		index,
		/`PiAgentIntegrationAdapter\.createSdkConnection` \| 方法 \| 否 \|/,
	);
	assert.match(index, /## \[src\/parser\.ts\]/);
});
