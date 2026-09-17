import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { loadFlow } from "./flow-loader.ts";
import type { FlowDefinition, LoadedFlow } from "./types.ts";

export interface FlowListing {
	id: string;
	name: string;
	description: string;
	path: string;
}

/** Discovers directory-based Flow packages without owning runtime state. */
export class FlowDirectory {
	private readonly directory: string;

	constructor(directory: string) {
		this.directory = directory;
	}

	async list(): Promise<FlowListing[]> {
		const flows = await this.discover(this.directory);
		const ids = new Set<string>();
		return flows
			.sort((left, right) => left.flow.id.localeCompare(right.flow.id))
			.map((loaded) => {
				if (ids.has(loaded.flow.id)) {
					throw new Error(`发现重复 Flow 标识: ${loaded.flow.id}`);
				}
				ids.add(loaded.flow.id);
				return {
					id: loaded.flow.id,
					name: loaded.flow.name,
					description: loaded.flow.description,
					path: loaded.path,
				};
			});
	}

	async load(id: string): Promise<FlowDefinition> {
		const listing = (await this.list()).find(
			(candidate) => candidate.id === id,
		);
		if (!listing) throw new Error(`Flow 不存在: ${id}`);
		return (await loadFlow(listing.path)).flow;
	}

	private async discover(directory: string): Promise<LoadedFlow[]> {
		const entries = await readdir(directory, { withFileTypes: true });
		const flows: LoadedFlow[] = [];
		for (const entry of entries.sort((left, right) =>
			left.name.localeCompare(right.name),
		)) {
			if (!entry.isDirectory()) continue;
			if (entry.name === "references" || entry.name === "scripts") continue;
			const path = join(directory, entry.name);
			const children = await readdir(path, { withFileTypes: true });
			if (
				children.some((child) => child.isFile() && child.name === "FLOW.md")
			) {
				flows.push(await loadFlow(path));
				continue;
			}
			flows.push(...(await this.discover(path)));
		}
		return flows;
	}
}
