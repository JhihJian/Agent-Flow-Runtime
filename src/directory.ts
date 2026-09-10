import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { parseFlow } from "./parser.ts";
import type { FlowDefinition } from "./types.ts";

export interface FlowListing {
	id: string;
	name: string;
	description: string;
	path: string;
}

/** Discovers and loads portable Flow files without owning runtime state. */
export class FlowDirectory {
	private readonly directory: string;

	constructor(directory: string) {
		this.directory = directory;
	}

	async list(): Promise<FlowListing[]> {
		const entries = await readdir(this.directory, { withFileTypes: true });
		return await Promise.all(
			entries
				.filter((entry) => entry.isFile() && extname(entry.name) === ".md")
				.sort((left, right) => left.name.localeCompare(right.name))
				.map(async (entry) => {
					const path = join(this.directory, entry.name);
					const flow = await this.loadPath(path);
					return {
						id: flow.id,
						name: flow.name,
						description: flow.description,
						path,
					};
				}),
		);
	}

	async load(id: string): Promise<FlowDefinition> {
		if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id))
			throw new Error(`无效 Flow 标识: ${id}`);
		return this.loadPath(join(this.directory, `${id}.md`));
	}

	private async loadPath(path: string): Promise<FlowDefinition> {
		return parseFlow(await readFile(path, "utf8"), basename(path));
	}
}
