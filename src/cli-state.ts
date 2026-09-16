import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { FlowObservabilityWebHost } from "./flow-observability-web.ts";
import type { FlowRuntime } from "./observability.ts";
import type { PiAgentIntegrationAdapter } from "./pi.ts";
import type {
	FlowObservationEvent,
	FlowObservationSubscription,
} from "./types.ts";

interface PendingSessionReplacement {
	resolve: () => void;
	reject: (error: Error) => void;
}

export interface CliFlowState {
	adapter?: PiAgentIntegrationAdapter;
	runtime?: FlowRuntime;
	webHost?: FlowObservabilityWebHost;
	observation?: FlowObservationSubscription;
	activeRunId?: string;
	active?: { path: string; promise: Promise<void> };
	resuming?: Promise<void>;
	configuredPath?: string;
	currentContext?: ExtensionContext;
	pendingModel?: NonNullable<ExtensionContext["model"]>;
	sessionReference: string;
	sendNodePrompt?: (prompt: string) => void;
	sendCommand?: (command: string) => void;
	publishObservation?: (event: FlowObservationEvent) => void;
	pendingSessionReplacement?: PendingSessionReplacement;
	notify?: (message: string, level: "info" | "warning" | "error") => void;
}

const globalState = globalThis as typeof globalThis & {
	__summAgentFlowCliState?: CliFlowState;
};

export function getCliFlowState(): CliFlowState {
	if (!globalState.__summAgentFlowCliState) {
		globalState.__summAgentFlowCliState = {
			sessionReference: "pi-current-session",
		};
	}
	return globalState.__summAgentFlowCliState;
}

export function rejectPendingSessionReplacement(error: Error): void {
	const state = getCliFlowState();
	const pending = state.pendingSessionReplacement;
	state.pendingSessionReplacement = undefined;
	pending?.reject(error);
}
