import { mount } from "./vendor/pele.js";

const STATUS_LABELS = {
	running: "运行中",
	completed: "已完成",
	failed: "失败",
	interrupted: "已中断",
	unvisited: "未访问",
};

const state = {
	view: "list",
	runs: [],
	detail: null,
	selectedRunId: null,
	selectedNodeRef: null,
	selectedNodeRunId: null,
	selectedEvidence: null,
	listLoading: false,
	detailLoading: false,
	detailError: "",
	pollTimer: null,
	pollBusy: false,
};

const $ = (id) => document.getElementById(id);
const listView = $("listView");
const detailView = $("detailView");

function createElement(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined && text !== null) node.textContent = String(text);
	return node;
}

function formatTime(value) {
	if (!value) return "未记录";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	return date.toLocaleString("zh-CN", { hour12: false });
}

function statusLabel(status) {
	return STATUS_LABELS[status] ?? String(status ?? "未知");
}

function statusPill(status) {
	return createElement(
		"span",
		`status-pill status-${status}`,
		statusLabel(status),
	);
}

function setMessage(element, text, kind = "") {
	element.textContent = text;
	element.className = `inline-message${kind ? ` ${kind}` : ""}`;
}

async function fetchJson(path) {
	const response = await fetch(path, {
		cache: "no-store",
		headers: { Accept: "application/json" },
	});
	let payload;
	try {
		payload = await response.json();
	} catch {
		throw new Error(`接口返回不是有效 JSON（${response.status}）`);
	}
	if (!response.ok)
		throw new Error(payload?.error ?? `请求失败（${response.status}）`);
	return payload;
}

function runName(run) {
	return run.flowName || run.flowId || "未命名 Flow";
}

function runMatches(run, query, filter) {
	if (filter !== "all" && run.status !== filter) return false;
	if (!query) return true;
	const haystack = [
		run.id,
		run.flowId,
		run.flowName,
		run.currentLabel,
		run.current?.nodeRef,
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
	return haystack.includes(query.toLowerCase());
}

function renderList() {
	const list = $("runList");
	list.replaceChildren();
	const query = $("runSearch").value.trim();
	const filter = $("statusFilter").value;
	const visibleRuns = [...state.runs]
		.filter((run) => runMatches(run, query, filter))
		.sort(
			(left, right) =>
				Number(right.status === "running") -
					Number(left.status === "running") ||
				String(right.lastActivityAt).localeCompare(String(left.lastActivityAt)),
		);

	if (state.listLoading && state.runs.length === 0) {
		list.append(
			createElement("li", "empty-state", "正在读取本机 Flow 会话..."),
		);
		return;
	}
	if (visibleRuns.length === 0) {
		const text =
			state.runs.length === 0 ? "暂无本机 Flow 会话" : "没有符合筛选条件的会话";
		list.append(createElement("li", "empty-state", text));
		return;
	}

	for (const run of visibleRuns) {
		const item = createElement("li", `run-item status-${run.status}`);
		const button = createElement("button", "run-button");
		button.type = "button";
		button.dataset.action = "open-run";
		button.dataset.runId = run.id;
		button.setAttribute("aria-label", `打开 ${runName(run)}，运行 ${run.id}`);

		const main = createElement("span", "run-main");
		main.append(createElement("span", "run-id", run.id));
		main.append(createElement("span", "run-flow", runName(run)));
		const status = createElement("span", "run-status");
		status.append(statusPill(run.status));
		const current = createElement("span", "run-current");
		current.append(createElement("span", "run-label", "当前位置"));
		current.append(
			createElement(
				"span",
				"run-value",
				run.currentLabel || formatLocation(run.current),
			),
		);
		const time = createElement("span", "run-time");
		time.append(createElement("span", "run-label", "最近活动"));
		time.append(
			createElement("span", "run-value", formatTime(run.lastActivityAt)),
		);
		const arrow = createElement("span", "run-arrow", "›");
		arrow.setAttribute("aria-hidden", "true");
		button.append(main, status, current, time, arrow);
		item.append(button);
		list.append(item);
	}
}

function formatLocation(location) {
	if (!location || location.kind === "none") return "无当前位置";
	if (location.kind === "parallel") return `并行 ${location.parallelRef}`;
	return location.nodeName || location.nodeRef || "节点";
}

async function loadRuns() {
	state.listLoading = true;
	renderList();
	try {
		const payload = await fetchJson("/api/runs");
		state.runs = Array.isArray(payload.runs) ? payload.runs : [];
		clearConnection();
		setMessage($("listMessage"), `已读取 ${state.runs.length} 个会话`, "info");
	} catch (error) {
		setMessage($("listMessage"), `会话列表读取失败：${error.message}`, "error");
		showConnection(`连接异常：${error.message}`);
	} finally {
		state.listLoading = false;
		renderList();
	}
}

function showConnection(text) {
	const notice = $("connectionNotice");
	notice.textContent = text;
	notice.hidden = !text;
}

function clearConnection() {
	$("connectionNotice").hidden = true;
	$("connectionNotice").textContent = "";
}

function openRun(runId) {
	state.selectedRunId = runId;
	state.detail = null;
	state.detailError = "";
	state.selectedNodeRef = null;
	state.selectedNodeRunId = null;
	state.selectedEvidence = null;
	history.pushState({}, "", `#run=${encodeURIComponent(runId)}`);
	handleRoute();
}

function goToList() {
	history.pushState({}, "", `${location.pathname}${location.search}`);
	handleRoute();
}

function handleRoute() {
	const match = /^#run=(.*)$/.exec(location.hash);
	if (!match) {
		stopPolling();
		state.view = "list";
		state.detail = null;
		state.selectedRunId = null;
		listView.hidden = false;
		detailView.hidden = true;
		if (state.runs.length === 0) void loadRuns();
		return;
	}
	const runId = decodeURIComponent(match[1]);
	state.view = "detail";
	state.selectedRunId = runId;
	listView.hidden = true;
	detailView.hidden = false;
	startPolling();
	void loadDetail(runId, true);
}

function startPolling() {
	stopPolling();
	state.pollTimer = setInterval(() => {
		if (state.view === "detail" && state.selectedRunId)
			void loadDetail(state.selectedRunId, false);
	}, 2000);
}

function stopPolling() {
	if (state.pollTimer) clearInterval(state.pollTimer);
	state.pollTimer = null;
}

async function loadDetail(runId, initial) {
	if (state.pollBusy) return;
	state.pollBusy = true;
	if (initial) {
		state.detailLoading = true;
		state.detailError = "";
		renderDetail();
	}
	try {
		const payload = await fetchJson(`/api/runs/${encodeURIComponent(runId)}`);
		const nextSequence = payload.history?.run?.sequence;
		const changed =
			!state.detail || state.detail.history?.run?.sequence !== nextSequence;
		clearConnection();
		if (changed || initial) {
			state.detail = payload;
			state.detailError = "";
			renderDetail();
		}
	} catch (error) {
		state.detailError = error.message;
		showConnection(`详情刷新失败，保留上次数据：${error.message}`);
		if (initial) renderDetail();
	} finally {
		state.detailLoading = false;
		state.pollBusy = false;
	}
}

function renderDetail() {
	const payload = state.detail;
	if (!payload?.history) {
		$("detailTitle").textContent = "运行详情";
		$("detailSubtitle").textContent = state.detailLoading
			? "正在读取运行历史..."
			: "尚未读取运行历史";
		$("detailStatus").replaceChildren();
		$("summaryFacts").replaceChildren();
		$("diagram").replaceChildren();
		$("nodeInspector").replaceChildren();
		$("routeInspector").replaceChildren();
		$("parallelInspector").replaceChildren();
		$("timeline").replaceChildren();
		setMessage(
			$("detailMessage"),
			state.detailError || "正在加载运行详情...",
			state.detailError ? "error" : "info",
		);
		return;
	}

	const runHistory = payload.history;
	const run = runHistory.run;
	const definition = payload.definition;
	$("detailTitle").textContent = definition?.name || run.flowId;
	$("detailSubtitle").textContent =
		`${run.id} · ${run.flowId} · v${run.flowVersion}`;
	$("detailStatus").replaceChildren(statusPill(run.status));
	renderSummaryFacts(runHistory);
	const notices = [
		payload.definitionError
			? `Flow 定义不可用：${payload.definitionError}`
			: "",
		run.error?.summary ? `运行错误：${run.error.summary}` : "",
		state.detailError,
	];
	setMessage(
		$("detailMessage"),
		notices.filter(Boolean).join(" | "),
		notices.some(Boolean) ? "error" : "",
	);
	renderDiagram(payload);
	renderInspector(payload);
	renderTimeline(payload);
}

function renderSummaryFacts(runHistory) {
	const run = runHistory.run;
	const facts = [
		["阶段", run.phase],
		["序号", run.sequence],
		[
			"历史完整性",
			run.historyCompleteness === "complete" ? "完整" : "兼容历史",
		],
		["开始时间", formatTime(run.startedAt)],
		["完成时间", formatTime(run.completedAt)],
		["当前位置", formatLocation(runHistory.current)],
	];
	const container = $("summaryFacts");
	container.replaceChildren();
	for (const [label, value] of facts) {
		const wrapper = createElement("div");
		wrapper.append(
			createElement("dt", "", label),
			createElement("dd", "", value),
		);
		container.append(wrapper);
	}
}

function nodeStatus(history, nodeRef) {
	const visits = history.nodeRuns.filter((visit) => visit.nodeRef === nodeRef);
	if (visits.length === 0) return "unvisited";
	return visits[visits.length - 1].status;
}

function parallelStatus(history, parallelRef) {
	const rounds = history.parallelRounds.filter(
		(round) => round.parallelRef === parallelRef,
	);
	if (rounds.length === 0) return "unvisited";
	const status = rounds[rounds.length - 1].status;
	return status === "joining" ? "running" : status;
}

function destinationMatches(route, edge) {
	const destination = route.destination;
	const expectedKind =
		edge.to === "finish"
			? "finish"
			: edge.kind === "branch"
				? "node"
				: edge.kind;
	if (
		destination.kind !== expectedKind &&
		!(edge.kind === "node" && destination.kind === "node")
	)
		return false;
	return destination.kind === "finish"
		? edge.to === "finish"
		: destination.ref === edge.to;
}

function routeRecorded(history, _definition, edge) {
	if (edge.kind === "branch" || edge.kind === "join") return false;
	return history.routeDecisions.some((route) => {
		const source = history.nodeRuns.find(
			(node) => node.id === route.sourceNodeRunId,
		);
		return (
			source?.nodeRef === edge.from &&
			route.result === edge.result &&
			destinationMatches(route, edge)
		);
	});
}

function parallelEdgeRecorded(history, edge) {
	if (edge.kind === "branch") {
		return history.parallelRounds.some(
			(round) =>
				round.parallelRef === edge.from &&
				Object.hasOwn(round.branchNodeRunIds, edge.to),
		);
	}
	if (edge.kind === "join") {
		return history.parallelRounds.some(
			(round) =>
				round.joinRef === edge.to &&
				Object.hasOwn(round.branchNodeRunIds, edge.from),
		);
	}
	return false;
}

function renderDiagram(payload) {
	const message = $("diagramMessage");
	const diagram = $("diagram");
	diagram.replaceChildren();
	if (!payload.definition) {
		message.textContent =
			payload.definitionError ||
			"没有可用的 Flow 定义，无法展示 Mermaid 执行图。";
		message.className = "diagram-message error";
		return;
	}
	message.textContent = "";
	message.className = "diagram-message";
	try {
		mount(diagram, payload.definition.mermaid);
		fitDiagramToViewport();
		applyDiagramState(payload.definition, payload.history);
	} catch (error) {
		message.textContent = `Mermaid 图渲染失败：${error.message}`;
		message.className = "diagram-message error";
	}
}

function fitDiagramToViewport() {
	if (!window.matchMedia("(max-width: 780px)").matches) return;
	const host = $("diagram").querySelector(".pele");
	const svg = $("diagram").querySelector("svg");
	if (!host || !svg) return;
	host.style.width = "100%";
	svg.style.width = "100%";
	svg.style.maxWidth = "100%";
	svg.style.height = "auto";
}

function applyDiagramState(definition, history) {
	const knownNodes = new Map(
		definition.nodes.map((node) => [node.ref, node.name]),
	);
	for (const parallel of definition.parallels)
		knownNodes.set(parallel.ref, `并行 ${parallel.ref}`);
	for (const node of $("diagram").querySelectorAll(".pele-node")) {
		const ref = node.dataset.id;
		const status = knownNodes.has(ref)
			? knownNodes.has(ref) && definition.nodes.some((item) => item.ref === ref)
				? nodeStatus(history, ref)
				: parallelStatus(history, ref)
			: "unvisited";
		node.classList.remove(
			"is-unvisited",
			"is-running",
			"is-completed",
			"is-failed",
			"is-interrupted",
			"is-selected",
		);
		node.classList.add(`is-${status}`);
		if (ref === state.selectedNodeRef) node.classList.add("is-selected");
		node.setAttribute("role", "button");
		node.setAttribute("tabindex", "0");
		node.setAttribute(
			"aria-label",
			`${knownNodes.get(ref) || ref}，${statusLabel(status)}`,
		);
	}
	for (const edgeElement of $("diagram").querySelectorAll(".pele-edge")) {
		const id = edgeElement.dataset.id || "";
		edgeElement.classList.remove("is-selected", "is-recorded");
		const edge = edgeForElement(definition, id);
		if (!edge) continue;
		if (routeRecorded(history, definition, edge))
			edgeElement.classList.add("is-selected");
		if (parallelEdgeRecorded(history, edge))
			edgeElement.classList.add("is-recorded");
	}
}

function edgeForElement(definition, id) {
	const separator = id.lastIndexOf("_");
	if (separator === -1) return undefined;
	const occurrence = Number(id.slice(separator + 1));
	const prefix = id.slice(0, separator);
	const candidates = definition.edges.filter(
		(edge) => prefix === `L_${edge.from}_${edge.to}`,
	);
	return candidates[occurrence] || candidates[0];
}

function nodeLabel(payload, nodeRef) {
	return (
		payload.definition?.nodes.find((node) => node.ref === nodeRef)?.name ||
		(payload.definition?.parallels.find(
			(parallel) => parallel.ref === nodeRef,
		) &&
			`并行 ${nodeRef}`) ||
		nodeRef
	);
}

function renderInspector(payload) {
	const history = payload.history;
	const nodeRefs = payload.definition?.nodes.map((node) => node.ref) || [];
	if (!state.selectedNodeRef || !nodeRefs.includes(state.selectedNodeRef)) {
		state.selectedNodeRef =
			history.current.kind === "node" &&
			nodeRefs.includes(history.current.nodeRef)
				? history.current.nodeRef
				: nodeRefs.find((ref) =>
						history.nodeRuns.some((run) => run.nodeRef === ref),
					) || nodeRefs[0];
	}
	const selectedRuns = history.nodeRuns.filter(
		(run) => run.nodeRef === state.selectedNodeRef,
	);
	if (
		state.selectedNodeRunId &&
		!selectedRuns.some((run) => run.id === state.selectedNodeRunId)
	)
		state.selectedNodeRunId = null;
	renderNodeInspector(payload, selectedRuns);
	renderRouteInspector(payload);
	renderParallelInspector(payload);
	renderEvidencePlaceholder(payload);
	if (payload.definition) applyDiagramState(payload.definition, history);
}

function renderNodeInspector(payload, selectedRuns) {
	const container = $("nodeInspector");
	container.replaceChildren();
	if (!state.selectedNodeRef) {
		container.append(createElement("p", "muted", "暂无节点访问记录。"));
		$("selectionHint").textContent = "暂无节点";
		return;
	}
	$("selectionHint").textContent = nodeLabel(payload, state.selectedNodeRef);
	const summary = createElement("div", "node-summary");
	const name = createElement("div");
	name.append(
		createElement(
			"div",
			"node-name",
			nodeLabel(payload, state.selectedNodeRef),
		),
		createElement("div", "node-ref", state.selectedNodeRef),
	);
	summary.append(
		name,
		createElement("span", "muted", `${selectedRuns.length} 次访问`),
	);
	container.append(summary);
	if (selectedRuns.length === 0) {
		container.append(createElement("p", "muted", "该节点尚未被实际访问。"));
		return;
	}
	const list = createElement("ol", "visit-list");
	for (const visit of selectedRuns) {
		const item = createElement("li", "visit-item");
		const row = createElement("div", "visit-row");
		row.append(
			createElement("strong", "", `#${visit.sequence}`),
			statusPill(visit.status),
		);
		const meta = createElement(
			"div",
			"visit-meta",
			`${formatTime(visit.startedAt)}${visit.completedAt ? ` 至 ${formatTime(visit.completedAt)}` : ""}`,
		);
		const result = createElement(
			"div",
			"visit-result",
			visit.result ? `结果：${visit.result}` : "尚无结果",
		);
		const evidenceButton = createElement("button", "button button-small");
		evidenceButton.type = "button";
		evidenceButton.dataset.action = "load-evidence";
		evidenceButton.dataset.nodeRunId = visit.id;
		evidenceButton.textContent = "查看证据";
		if (!payload.history.evidence?.[visit.id]) evidenceButton.disabled = true;
		item.append(row, meta, result, evidenceButton);
		list.append(item);
	}
	container.append(list);
}

function formatDestination(destination) {
	if (!destination) return "未知目标";
	return destination.kind === "finish"
		? "结束"
		: `${destination.kind}：${destination.ref}`;
}

function renderRouteInspector(payload) {
	const list = $("routeInspector");
	list.replaceChildren();
	for (const route of payload.history.routeDecisions) {
		const source = payload.history.nodeRuns.find(
			(node) => node.id === route.sourceNodeRunId,
		);
		const item = createElement("li", "fact-item");
		const row = createElement("div", "fact-row");
		row.append(
			createElement("strong", "", `#${route.sequence}`),
			createElement("span", "fact-meta", formatTime(route.selectedAt)),
		);
		item.append(
			row,
			createElement(
				"div",
				"fact-detail",
				`${nodeLabel(payload, source?.nodeRef || "未知节点")} · ${route.result} → ${formatDestination(route.destination)}`,
			),
		);
		list.append(item);
	}
	if (!list.children.length)
		list.append(createElement("li", "muted", "暂无路由事实。"));
}

function renderParallelInspector(payload) {
	const list = $("parallelInspector");
	list.replaceChildren();
	for (const round of payload.history.parallelRounds) {
		const item = createElement("li", "fact-item");
		const row = createElement("div", "fact-row");
		row.append(
			createElement("strong", "", `#${round.sequence} ${round.parallelRef}`),
			statusPill(round.status === "joining" ? "running" : round.status),
		);
		const branches =
			Object.keys(round.branchNodeRunIds).join("、") || "暂无分支";
		item.append(row, createElement("div", "fact-detail", `分支：${branches}`));
		list.append(item);
	}
	if (!list.children.length)
		list.append(createElement("li", "muted", "暂无并行轮次。"));
}

function renderEvidencePlaceholder(payload) {
	const hint = $("evidenceHint");
	const panel = $("evidencePanel");
	if (!state.selectedNodeRunId) {
		hint.textContent = "未选择访问";
		panel.textContent = "在节点访问列表中选择一条具体访问。";
		return;
	}
	hint.textContent = `访问 ${state.selectedNodeRunId}`;
	if (state.selectedEvidence?.nodeRunId === state.selectedNodeRunId) {
		renderEvidence(state.selectedEvidence);
		return;
	}
	panel.textContent = payload.history.evidence?.[state.selectedNodeRunId]
		? "点击“查看证据”读取节点的完整执行证据。"
		: "该访问没有可用证据。";
}

function renderEvidence(evidence) {
	const panel = $("evidencePanel");
	panel.replaceChildren();
	const label = createElement(
		"div",
		"evidence-label",
		`${evidence.nodeName || evidence.nodeRef} · ${statusLabel(evidence.status)}`,
	);
	const pre = createElement("pre");
	pre.textContent = JSON.stringify(evidence, null, 2) || "无证据内容";
	panel.append(label, pre);
}

async function loadEvidence(nodeRunId) {
	state.selectedNodeRunId = nodeRunId;
	state.selectedEvidence = null;
	renderInspector(state.detail);
	const panel = $("evidencePanel");
	panel.textContent = "正在读取证据...";
	try {
		const evidence = await fetchJson(
			`/api/runs/${encodeURIComponent(state.selectedRunId)}/nodes/${encodeURIComponent(nodeRunId)}/evidence`,
		);
		state.selectedEvidence = evidence;
		renderEvidence(evidence);
	} catch (error) {
		panel.textContent = `证据读取失败：${error.message}`;
		showConnection(`证据读取失败：${error.message}`);
	}
}

function renderTimeline(payload) {
	const history = payload.history;
	const events = [];
	for (const node of history.nodeRuns)
		events.push({
			sequence: node.sequence,
			status: node.status,
			title: `${node.nodeName || node.nodeRef} 节点访问`,
			detail: node.result ? `结果：${node.result}` : node.actionKind,
			time: node.completedAt || node.startedAt,
		});
	for (const route of history.routeDecisions) {
		const source = history.nodeRuns.find(
			(node) => node.id === route.sourceNodeRunId,
		);
		events.push({
			sequence: route.sequence,
			status: "completed",
			title: "选择路由",
			detail: `${nodeLabel(payload, source?.nodeRef || "未知节点")} · ${route.result} → ${formatDestination(route.destination)}`,
			time: route.selectedAt,
		});
	}
	for (const round of history.parallelRounds)
		events.push({
			sequence: round.sequence,
			status: round.status === "joining" ? "running" : round.status,
			title: `并行轮次 ${round.parallelRef}`,
			detail: `${Object.keys(round.branchNodeRunIds).length} 个分支 · ${statusLabel(round.status === "joining" ? "running" : round.status)}`,
			time: round.completedAt || round.startedAt,
		});
	for (const recovery of history.recoveries)
		events.push({
			sequence: recovery.sequence,
			status: "interrupted",
			title: "恢复记录",
			detail: `${recovery.strategy} · ${recovery.summary}`,
			time: recovery.resumedAt,
		});
	events.sort((left, right) => left.sequence - right.sequence);
	const list = $("timeline");
	list.replaceChildren();
	if (!events.length) {
		list.append(createElement("li", "empty-state", "暂无运行事实。"));
		return;
	}
	for (const event of events) {
		const item = createElement("li", `timeline-item event-${event.status}`);
		item.append(
			createElement("div", "timeline-sequence", `#${event.sequence}`),
		);
		const body = createElement("div");
		body.append(
			createElement("div", "timeline-title", event.title),
			createElement("div", "timeline-detail", event.detail),
		);
		item.append(
			body,
			createElement("time", "timeline-time", formatTime(event.time)),
		);
		list.append(item);
	}
}

document.addEventListener("click", (event) => {
	const target = event.target instanceof Element ? event.target : null;
	if (!target) return;
	const action = target.closest("[data-action]")?.dataset.action;
	if (action === "refresh-list") void loadRuns();
	if (action === "open-run")
		openRun(target.closest("[data-action]").dataset.runId);
	if (action === "back-to-list") goToList();
	if (action === "load-evidence")
		void loadEvidence(target.closest("[data-action]").dataset.nodeRunId);

	const node = target.closest(".pele-node");
	if (node && state.detail) {
		state.selectedNodeRef = node.dataset.id;
		state.selectedNodeRunId = null;
		state.selectedEvidence = null;
		renderInspector(state.detail);
	}
});

document.addEventListener("keydown", (event) => {
	const target = event.target instanceof Element ? event.target : null;
	if (
		target?.matches(".pele-node") &&
		(event.key === "Enter" || event.key === " ")
	) {
		event.preventDefault();
		state.selectedNodeRef = target.dataset.id;
		state.selectedNodeRunId = null;
		state.selectedEvidence = null;
		renderInspector(state.detail);
	}
	if (event.key === "Escape" && state.view === "detail") goToList();
});

$("runSearch").addEventListener("input", renderList);
$("statusFilter").addEventListener("change", renderList);
window.addEventListener("popstate", handleRoute);
window.addEventListener("hashchange", handleRoute);

handleRoute();
