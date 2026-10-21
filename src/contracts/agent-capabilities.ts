import type { AgentCapabilityDeclaration } from "./types.ts";

const EMPTY_CAPABILITIES: AgentCapabilityDeclaration = {
	tools: [],
	skills: [],
};

/** Return a detached, canonical capability declaration for a Flow or host. */
export function normalizeAgentCapabilities(
	value?: AgentCapabilityDeclaration,
): AgentCapabilityDeclaration {
	return {
		tools: [...(value?.tools ?? EMPTY_CAPABILITIES.tools)],
		skills: [...(value?.skills ?? EMPTY_CAPABILITIES.skills)],
	};
}

/** Validate the YAML-facing capability declaration and return its canonical form. */
export function parseAgentCapabilities(
	value: unknown,
): AgentCapabilityDeclaration {
	if (value === undefined) return normalizeAgentCapabilities();
	if (!isRecord(value)) throw new Error("capabilities 必须是对象");
	const keys = Object.keys(value);
	if (keys.some((key) => key !== "tools" && key !== "skills"))
		throw new Error("capabilities 只能包含 tools 和 skills");
	return {
		tools: parseCapabilityNames(value.tools, "tools"),
		skills: parseCapabilityNames(value.skills, "skills"),
	};
}

function parseCapabilityNames(value: unknown, field: string): string[] {
	if (value === undefined) return [];
	if (!Array.isArray(value))
		throw new Error(`capabilities.${field} 必须是数组`);
	const names: string[] = [];
	for (const item of value) {
		if (typeof item !== "string" || !item.trim())
			throw new Error(`capabilities.${field} 必须只包含非空字符串`);
		const name = item.trim();
		if (field === "tools" && name === "submit_flow_outcome")
			throw new Error(
				"submit_flow_outcome 是 Runtime 协议工具，不能声明为业务工具",
			);
		if (names.includes(name))
			throw new Error(`capabilities.${field} 不能包含重复项: ${name}`);
		names.push(name);
	}
	return names;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
