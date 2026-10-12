import type { FlowValue, FlowVariables } from "./types.ts";

const VARIABLE_NAME = /^[\p{L}\p{N}_-]+$/u;
const RESERVED_NAMES = new Set(["__proto__", "prototype", "constructor"]);

export function validateVariableName(name: string): void {
	if (!VARIABLE_NAME.test(name) || RESERVED_NAMES.has(name)) {
		throw new Error(`非法 Flow 变量名: ${name}`);
	}
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	if (typeof value !== "object" || value === null || Array.isArray(value))
		return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

/** 校验可持久化的 JSON 值，同时拒绝 YAML 循环别名和非有限数字。 */
export function validateFlowValue(
	value: unknown,
	ancestors = new Set<object>(),
): asserts value is FlowValue {
	if (value === null || typeof value === "string" || typeof value === "boolean")
		return;
	if (typeof value === "number" && Number.isFinite(value)) return;
	if (!Array.isArray(value) && !isRecord(value))
		throw new Error("Flow 变量值必须是 JSON 值");
	if (ancestors.has(value)) throw new Error("Flow 变量值不能包含循环引用");
	ancestors.add(value);
	for (const child of Object.values(value)) validateFlowValue(child, ancestors);
	ancestors.delete(value);
}

export function validateVariables(
	value: unknown,
): asserts value is FlowVariables {
	if (!isRecord(value)) throw new Error("Flow variables 必须是 JSON 对象");
	for (const name of Object.keys(value)) validateVariableName(name);
	validateFlowValue(value);
}
