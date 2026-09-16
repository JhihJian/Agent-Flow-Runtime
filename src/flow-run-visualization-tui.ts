import type { Theme } from "@earendil-works/pi-coding-agent";
import {
	type Component,
	Key,
	matchesKey,
	type TUI,
	truncateToWidth,
	visibleWidth,
} from "@earendil-works/pi-tui";
import type {
	FlowFactSelection,
	FlowRunVisualizationController,
	FlowRunVisualizationState,
	FlowTimelineItem,
} from "./flow-run-visualization.ts";
import type { FlowRunLocation } from "./types.ts";

export class FlowRunVisualizationTui implements Component {
	private readonly tui: TUI;
	private readonly theme: Theme;
	private readonly controller: FlowRunVisualizationController;
	private readonly close: () => void;
	private readonly unsubscribe: () => void;
	private state: Readonly<FlowRunVisualizationState>;
	private selectedIndex = 0;
	private readonly expandedParallelRounds = new Set<string>();

	constructor(
		tui: TUI,
		theme: Theme,
		controller: FlowRunVisualizationController,
		close: () => void,
	) {
		this.tui = tui;
		this.theme = theme;
		this.controller = controller;
		this.close = close;
		this.state = controller.getState();
		this.syncSelectedIndex();
		this.unsubscribe = controller.subscribe((state) => {
			this.state = state;
			this.syncSelectedIndex();
			this.tui.requestRender();
		});
	}

	render(width: number): string[] {
		const detail = this.state.detail;
		if (!detail) return this.panel(["Flow 运行详情已关闭"], width);
		const history = detail.snapshot;
		if (!history) {
			return this.panel(
				[
					`Flow Run ${detail.runId}`,
					detail.error ?? "正在读取运行快照...",
					"Esc 关闭",
				],
				width,
			);
		}

		const current = describeCurrent(history.current);
		const lines = [
			`${history.run.status}/${history.run.phase}  ${history.run.flowId}  #${history.run.sequence}`,
			`Task: ${summarize(history.run.task)}`,
			`Current: ${current}  Connection: ${detail.connection}`,
			"Timeline  Up/Down select  Enter expand  e evidence  r refresh  Esc close",
		];

		const timeline = detail.timeline;
		const start = Math.max(0, this.selectedIndex - 5);
		const visible = timeline.slice(start, start + 11);
		for (const [offset, item] of visible.entries()) {
			const index = start + offset;
			lines.push(
				`${index === this.selectedIndex ? ">" : " "} ${describeItem(item)}`,
			);
			if (
				item.kind === "parallel" &&
				this.expandedParallelRounds.has(item.parallelRoundId)
			) {
				for (const branch of item.branches) {
					lines.push(
						`    ${branch.branchRef}: ${branch.nodeName ?? branch.nodeRunId ?? "未开始"} [${branch.status ?? "waiting"}]${branch.result ? ` -> ${branch.result}` : ""}`,
					);
				}
				if (item.joinNodeRunId) {
					lines.push(
						`    join: ${item.joinNodeName ?? item.joinNodeRunId}${item.joinResult ? ` -> ${item.joinResult}` : ""}`,
					);
				}
			}
		}

		lines.push(describeEvidence(detail));
		if (detail.error) lines.push(`Notice: ${detail.error}`);
		return this.panel(lines, width);
	}

	handleInput(data: string): void {
		if (matchesKey(data, Key.escape) || matchesKey(data, Key.ctrl("c"))) {
			this.close();
			return;
		}
		if (matchesKey(data, Key.up)) {
			this.selectIndex(this.selectedIndex - 1);
			return;
		}
		if (matchesKey(data, Key.down)) {
			this.selectIndex(this.selectedIndex + 1);
			return;
		}
		if (matchesKey(data, Key.enter)) {
			const item = this.timeline()[this.selectedIndex];
			if (item?.kind === "parallel") {
				if (this.expandedParallelRounds.has(item.parallelRoundId))
					this.expandedParallelRounds.delete(item.parallelRoundId);
				else this.expandedParallelRounds.add(item.parallelRoundId);
				this.tui.requestRender();
			}
			return;
		}
		if (matchesKey(data, "e")) {
			void this.controller.loadSelectedNodeEvidence();
			return;
		}
		if (matchesKey(data, "r")) {
			void this.controller.reconnect();
		}
	}

	invalidate(): void {
		this.tui.requestRender();
	}

	dispose(): void {
		this.unsubscribe();
	}

	private timeline(): readonly FlowTimelineItem[] {
		return this.state.detail?.timeline ?? [];
	}

	private selectIndex(index: number): void {
		const timeline = this.timeline();
		if (!timeline.length) return;
		this.selectedIndex = Math.max(0, Math.min(index, timeline.length - 1));
		this.controller.selectFact(selectionFor(timeline[this.selectedIndex]));
		this.tui.requestRender();
	}

	private syncSelectedIndex(): void {
		const timeline = this.timeline();
		if (!timeline.length) {
			this.selectedIndex = 0;
			return;
		}
		const selection = this.state.detail?.selectedFact;
		const selected = timeline.findIndex((item) =>
			sameSelection(selectionFor(item), selection),
		);
		if (selected >= 0) this.selectedIndex = selected;
		else this.selectedIndex = Math.min(this.selectedIndex, timeline.length - 1);
	}

	private panel(lines: readonly string[], width: number): string[] {
		const innerWidth = Math.max(1, width - 2);
		const border = (value: string) => this.theme.fg("border", value);
		const fill = (value: string) => {
			const content = truncateToWidth(value, innerWidth, "...", true);
			const padded =
				content + " ".repeat(Math.max(0, innerWidth - visibleWidth(content)));
			return border("│") + this.theme.bg("selectedBg", padded) + border("│");
		};
		return [
			border(`╭${"─".repeat(innerWidth)}╮`),
			...lines.map(fill),
			border(`╰${"─".repeat(innerWidth)}╯`),
		];
	}
}

function selectionFor(
	item: FlowTimelineItem | undefined,
): FlowFactSelection | undefined {
	if (!item) return undefined;
	switch (item.kind) {
		case "node":
			return { kind: "node", nodeRunId: item.nodeRunId };
		case "route":
			return { kind: "route", routeDecisionId: item.routeDecisionId };
		case "parallel":
			return { kind: "parallel", parallelRoundId: item.parallelRoundId };
		case "recovery":
			return { kind: "recovery", recoveryId: item.recoveryId };
		case "terminal":
			return undefined;
	}
}

function sameSelection(
	left: FlowFactSelection | undefined,
	right: FlowFactSelection | undefined,
): boolean {
	if (!left || !right) return left === right;
	if (left.kind !== right.kind) return false;
	switch (left.kind) {
		case "node":
			return right.kind === "node" && left.nodeRunId === right.nodeRunId;
		case "route":
			return (
				right.kind === "route" && left.routeDecisionId === right.routeDecisionId
			);
		case "parallel":
			return (
				right.kind === "parallel" &&
				left.parallelRoundId === right.parallelRoundId
			);
		case "recovery":
			return right.kind === "recovery" && left.recoveryId === right.recoveryId;
	}
}

function describeItem(item: FlowTimelineItem): string {
	switch (item.kind) {
		case "node":
			return `${item.sequence} NODE ${item.nodeName ?? item.nodeRef} [${item.status}]${item.result ? ` -> ${item.result}` : ""}`;
		case "route":
			return `${item.sequence} ROUTE ${item.result} -> ${describeDestination(item.destination)}`;
		case "parallel":
			return `${item.sequence} PARALLEL ${item.parallelRef} [${item.status}] ${item.branches.length} branches`;
		case "recovery":
			return `${item.sequence} RECOVERY ${item.strategy}: ${item.summary}`;
		case "terminal":
			return `${item.sequence} RUN ${item.status}${item.errorSummary ? `: ${item.errorSummary}` : ""}`;
	}
}

function describeCurrent(current: FlowRunLocation): string {
	if (current.kind === "node") return current.nodeName ?? current.nodeRef;
	if (current.kind === "parallel") return `parallel:${current.parallelRef}`;
	return "none";
}

function describeDestination(destination: {
	kind: "node" | "parallel" | "finish";
	ref?: string;
}): string {
	return destination.kind === "finish"
		? "finish"
		: `${destination.kind}:${destination.ref}`;
}

function describeEvidence(
	detail: NonNullable<FlowRunVisualizationState["detail"]>,
): string {
	if (detail.evidenceState === "loading") return "Evidence: loading";
	if (detail.evidenceState === "unavailable") return "Evidence: unavailable";
	if (!detail.evidence) return "Evidence: select a node and press e";
	const messageCount = detail.evidence.messages?.length ?? 0;
	const command = detail.evidence.commandResult
		? ` command exit ${detail.evidence.commandResult.exitCode ?? "unknown"}`
		: "";
	return `Evidence: available${messageCount ? ` ${messageCount} messages` : ""}${command}`;
}

function summarize(value: unknown): string {
	const text = typeof value === "string" ? value : JSON.stringify(value);
	return text.length > 90 ? `${text.slice(0, 87)}...` : text;
}
