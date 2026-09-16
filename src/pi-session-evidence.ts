import {
	type SessionEntry,
	SessionManager,
} from "@earendil-works/pi-coding-agent";
import type { NodeSession, UnifiedMessage } from "./types.ts";

/** Read persisted Pi messages for a NodeRun without creating an Agent binding. */
export async function readPersistedPiNodeEvidence(
	session: NodeSession,
): Promise<UnifiedMessage[] | undefined> {
	if (!session.sessionReference || !session.interactionReference)
		return undefined;
	try {
		const manager = SessionManager.open(session.sessionReference);
		const [start, end] = parseInteractionReference(
			session.interactionReference,
		);
		return messagesFromEntries(manager.getEntries(), start, end);
	} catch {
		return undefined;
	}
}

function parseInteractionReference(
	reference: string | undefined,
): [string | undefined, string | undefined] {
	if (!reference) return [undefined, undefined];
	const separator = reference.indexOf(":");
	if (separator === -1) return [undefined, undefined];
	return [
		reference.slice(0, separator) || undefined,
		reference.slice(separator + 1) || undefined,
	];
}

function messagesFromEntries(
	entries: SessionEntry[],
	start?: string,
	end?: string,
): UnifiedMessage[] | undefined {
	if (!start || !end) return undefined;
	const startIndex = entries.findIndex((entry) => entry.id === start);
	const endIndex = entries.findIndex((entry) => entry.id === end);
	if (startIndex < 0 || endIndex < startIndex) return undefined;
	return entries.slice(startIndex + 1, endIndex + 1).flatMap((entry) => {
		if (entry.type !== "message") return [];
		const message = entry.message as unknown as {
			role?: unknown;
			content?: unknown;
		};
		const role = normalizeRole(message.role);
		return role
			? [
					{
						id: entry.id,
						role,
						content: message.content as UnifiedMessage["content"],
					},
				]
			: [];
	});
}

function normalizeRole(role: unknown): UnifiedMessage["role"] | undefined {
	if (role === "user" || role === "assistant") return role;
	if (role === "toolResult") return "tool";
	return undefined;
}
