# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/cli-state.ts](../src/cli-state.ts)

依赖：`@earendil-works/pi-coding-agent`、`./observability.ts`、`./pi.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSessionReplacement` | 接口 | 否 | [src/cli-state.ts:10-13](../src/cli-state.ts#L10) |
| `CliFlowState` | 接口 | 是 | [src/cli-state.ts:15-32](../src/cli-state.ts#L15) |
| `getCliFlowState` | 函数 | 是 | [src/cli-state.ts:38-45](../src/cli-state.ts#L38) |
| `rejectPendingSessionReplacement` | 函数 | 是 | [src/cli-state.ts:47-52](../src/cli-state.ts#L47) |

## [src/directory.ts](../src/directory.ts)

依赖：`node:fs/promises`、`node:path`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowListing` | 接口 | 是 | [src/directory.ts:6-11](../src/directory.ts#L6) |
| `FlowDirectory` | 类 | 是 | [src/directory.ts:14-49](../src/directory.ts#L14) |
| `FlowDirectory.list` | 方法 | 是 | [src/directory.ts:21-38](../src/directory.ts#L21) |
| `FlowDirectory.load` | 方法 | 是 | [src/directory.ts:40-44](../src/directory.ts#L40) |
| `FlowDirectory.loadPath` | 方法 | 否 | [src/directory.ts:46-48](../src/directory.ts#L46) |

## [src/extension.ts](../src/extension.ts)

依赖：`node:crypto`、`node:fs/promises`、`node:path`、`@earendil-works/pi-coding-agent`、`./cli-state.ts`、`./observability.ts`、`./parser.ts`、`./pi.ts`、`./runtime.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `flowExtension` | 函数 | 是 | [src/extension.ts:37-458](../src/extension.ts#L37) |
| `loadFlow` | 函数 | 否 | [src/extension.ts:460-462](../src/extension.ts#L460) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:464-470](../src/extension.ts#L464) |
| `flowEventMessage` | 函数 | 否 | [src/extension.ts:472-479](../src/extension.ts#L472) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:481-483](../src/extension.ts#L481) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:485-490](../src/extension.ts#L485) |

## [src/flow-observability-web-cli.ts](../src/flow-observability-web-cli.ts)

依赖：`node:fs/promises`、`node:os`、`node:path`、`./flow-observability-web.ts`、`./observability.ts`、`./parser.ts`、`./pi-session-evidence.ts`、`./runtime.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `CliOptions` | 接口 | 否 | [src/flow-observability-web-cli.ts:14-21](../src/flow-observability-web-cli.ts#L14) |
| `main` | 函数 | 否 | [src/flow-observability-web-cli.ts:23-67](../src/flow-observability-web-cli.ts#L23) |
| `createRuntime` | 函数 | 否 | [src/flow-observability-web-cli.ts:69-78](../src/flow-observability-web-cli.ts#L69) |
| `readCurrentFlowDefinition` | 函数 | 否 | [src/flow-observability-web-cli.ts:80-96](../src/flow-observability-web-cli.ts#L80) |
| `parseOptions` | 函数 | 否 | [src/flow-observability-web-cli.ts:98-143](../src/flow-observability-web-cli.ts#L98) |
| `requireValue` | 函数 | 否 | [src/flow-observability-web-cli.ts:145-149](../src/flow-observability-web-cli.ts#L145) |
| `lanAddress` | 函数 | 否 | [src/flow-observability-web-cli.ts:151-160](../src/flow-observability-web-cli.ts#L151) |

## [src/flow-observability-web.ts](../src/flow-observability-web.ts)

依赖：`node:crypto`、`node:fs/promises`、`node:http`、`node:https`、`node:net`、`node:path`、`node:url`、`./flow-run-visualization.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowObservabilityWebRequestContext` | 接口 | 是 | [src/flow-observability-web.ts:46-48](../src/flow-observability-web.ts#L46) |
| `FlowObservabilityWebAuthorizer` | 接口 | 是 | [src/flow-observability-web.ts:50-60](../src/flow-observability-web.ts#L50) |
| `FlowObservabilityWebHostOptions` | 接口 | 是 | [src/flow-observability-web.ts:62-80](../src/flow-observability-web.ts#L62) |
| `FlowObservabilityWebHost` | 类 | 是 | [src/flow-observability-web.ts:82-588](../src/flow-observability-web.ts#L82) |
| `FlowObservabilityWebHost.start` | 方法 | 是 | [src/flow-observability-web.ts:135-164](../src/flow-observability-web.ts#L135) |
| `FlowObservabilityWebHost.close` | 方法 | 是 | [src/flow-observability-web.ts:166-176](../src/flow-observability-web.ts#L166) |
| `FlowObservabilityWebHost.handle` | 方法 | 否 | [src/flow-observability-web.ts:178-219](../src/flow-observability-web.ts#L178) |
| `FlowObservabilityWebHost.establishSession` | 方法 | 否 | [src/flow-observability-web.ts:221-235](../src/flow-observability-web.ts#L221) |
| `FlowObservabilityWebHost.renderPage` | 方法 | 否 | [src/flow-observability-web.ts:237-239](../src/flow-observability-web.ts#L237) |
| `FlowObservabilityWebHost.handleApi` | 方法 | 否 | [src/flow-observability-web.ts:241-378](../src/flow-observability-web.ts#L241) |
| `FlowObservabilityWebHost.canReadRun` | 方法 | 否 | [src/flow-observability-web.ts:380-388](../src/flow-observability-web.ts#L380) |
| `FlowObservabilityWebHost.resolveFlowDefinition` | 方法 | 否 | [src/flow-observability-web.ts:390-409](../src/flow-observability-web.ts#L390) |
| `FlowObservabilityWebHost.openObservation` | 方法 | 否 | [src/flow-observability-web.ts:411-469](../src/flow-observability-web.ts#L411) |
| `FlowObservabilityWebHost.isAuthenticated` | 方法 | 否 | [src/flow-observability-web.ts:471-476](../src/flow-observability-web.ts#L471) |
| `FlowObservabilityWebHost.runtime` | 方法 | 否 | [src/flow-observability-web.ts:478-480](../src/flow-observability-web.ts#L478) |
| `FlowObservabilityWebHost.writeSse` | 方法 | 否 | [src/flow-observability-web.ts:482-488](../src/flow-observability-web.ts#L482) |
| `FlowObservabilityWebHost.publishSse` | 方法 | 否 | [src/flow-observability-web.ts:490-499](../src/flow-observability-web.ts#L490) |
| `FlowObservabilityWebHost.writeHtml` | 方法 | 否 | [src/flow-observability-web.ts:501-514](../src/flow-observability-web.ts#L501) |
| `FlowObservabilityWebHost.writeJavaScript` | 方法 | 否 | [src/flow-observability-web.ts:516-526](../src/flow-observability-web.ts#L516) |
| `FlowObservabilityWebHost.writeCss` | 方法 | 否 | [src/flow-observability-web.ts:528-538](../src/flow-observability-web.ts#L528) |
| `FlowObservabilityWebHost.writeLibraryAsset` | 方法 | 否 | [src/flow-observability-web.ts:540-562](../src/flow-observability-web.ts#L540) |
| `FlowObservabilityWebHost.writeJson` | 方法 | 否 | [src/flow-observability-web.ts:564-575](../src/flow-observability-web.ts#L564) |
| `FlowObservabilityWebHost.writeText` | 方法 | 否 | [src/flow-observability-web.ts:577-587](../src/flow-observability-web.ts#L577) |
| `WebRunSummary` | 接口 | 否 | [src/flow-observability-web.ts:590-602](../src/flow-observability-web.ts#L590) |
| `toWebRunSummary` | 函数 | 否 | [src/flow-observability-web.ts:604-618](../src/flow-observability-web.ts#L604) |
| `toWebRunHistory` | 函数 | 否 | [src/flow-observability-web.ts:620-673](../src/flow-observability-web.ts#L620) |
| `toWebFlowDefinition` | 函数 | 否 | [src/flow-observability-web.ts:675-685](../src/flow-observability-web.ts#L675) |
| `toWebEvidence` | 函数 | 否 | [src/flow-observability-web.ts:687-699](../src/flow-observability-web.ts#L687) |
| `toWebEvent` | 函数 | 否 | [src/flow-observability-web.ts:701-719](../src/flow-observability-web.ts#L701) |
| `summarize` | 函数 | 否 | [src/flow-observability-web.ts:721-724](../src/flow-observability-web.ts#L721) |
| `isLoopbackHost` | 函数 | 否 | [src/flow-observability-web.ts:726-728](../src/flow-observability-web.ts#L726) |
| `readJson` | 函数 | 否 | [src/flow-observability-web.ts:730-741](../src/flow-observability-web.ts#L730) |

## [src/flow-run-visualization.ts](../src/flow-run-visualization.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowRunVisualizationRuntime` | 接口 | 是 | [src/flow-run-visualization.ts:14-32](../src/flow-run-visualization.ts#L14) |
| `FlowRunCenterFilter` | 类型 | 是 | [src/flow-run-visualization.ts:34-34](../src/flow-run-visualization.ts#L34) |
| `FlowRunListItem` | 接口 | 是 | [src/flow-run-visualization.ts:36-47](../src/flow-run-visualization.ts#L36) |
| `FlowRunCenterState` | 接口 | 是 | [src/flow-run-visualization.ts:49-56](../src/flow-run-visualization.ts#L49) |
| `FlowFactSelection` | 类型 | 是 | [src/flow-run-visualization.ts:58-62](../src/flow-run-visualization.ts#L58) |
| `FlowTimelineBase` | 接口 | 否 | [src/flow-run-visualization.ts:64-68](../src/flow-run-visualization.ts#L64) |
| `FlowNodeTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:70-79](../src/flow-run-visualization.ts#L70) |
| `FlowRouteTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:81-87](../src/flow-run-visualization.ts#L81) |
| `FlowParallelBranchTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:89-95](../src/flow-run-visualization.ts#L89) |
| `FlowParallelTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:97-106](../src/flow-run-visualization.ts#L97) |
| `FlowRecoveryTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:108-115](../src/flow-run-visualization.ts#L108) |
| `FlowRunTerminalTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:117-124](../src/flow-run-visualization.ts#L117) |
| `FlowTimelineItem` | 类型 | 是 | [src/flow-run-visualization.ts:126-131](../src/flow-run-visualization.ts#L126) |
| `FlowRunDetailState` | 接口 | 是 | [src/flow-run-visualization.ts:133-144](../src/flow-run-visualization.ts#L133) |
| `FlowRunVisualizationState` | 接口 | 是 | [src/flow-run-visualization.ts:146-149](../src/flow-run-visualization.ts#L146) |
| `FlowRunVisualizationListener` | 类型 | 是 | [src/flow-run-visualization.ts:151-153](../src/flow-run-visualization.ts#L151) |
| `buildFlowTimeline` | 函数 | 是 | [src/flow-run-visualization.ts:159-186](../src/flow-run-visualization.ts#L159) |
| `filterFlowRuns` | 函数 | 是 | [src/flow-run-visualization.ts:188-208](../src/flow-run-visualization.ts#L188) |
| `FlowRunVisualizationController` | 类 | 是 | [src/flow-run-visualization.ts:214-606](../src/flow-run-visualization.ts#L214) |
| `FlowRunVisualizationController.getState` | 方法 | 是 | [src/flow-run-visualization.ts:236-238](../src/flow-run-visualization.ts#L236) |
| `FlowRunVisualizationController.subscribe` | 方法 | 是 | [src/flow-run-visualization.ts:240-244](../src/flow-run-visualization.ts#L240) |
| `FlowRunVisualizationController.loadRecentRuns` | 方法 | 是 | [src/flow-run-visualization.ts:246-264](../src/flow-run-visualization.ts#L246) |
| `FlowRunVisualizationController.setFilter` | 方法 | 是 | [src/flow-run-visualization.ts:266-268](../src/flow-run-visualization.ts#L266) |
| `FlowRunVisualizationController.getVisibleRuns` | 方法 | 是 | [src/flow-run-visualization.ts:270-274](../src/flow-run-visualization.ts#L270) |
| `FlowRunVisualizationController.openRun` | 方法 | 是 | [src/flow-run-visualization.ts:276-290](../src/flow-run-visualization.ts#L276) |
| `FlowRunVisualizationController.reconnect` | 方法 | 是 | [src/flow-run-visualization.ts:292-308](../src/flow-run-visualization.ts#L292) |
| `FlowRunVisualizationController.markDisconnected` | 方法 | 是 | [src/flow-run-visualization.ts:310-319](../src/flow-run-visualization.ts#L310) |
| `FlowRunVisualizationController.closeRun` | 方法 | 是 | [src/flow-run-visualization.ts:321-329](../src/flow-run-visualization.ts#L321) |
| `FlowRunVisualizationController.selectFact` | 方法 | 是 | [src/flow-run-visualization.ts:331-345](../src/flow-run-visualization.ts#L331) |
| `FlowRunVisualizationController.loadSelectedNodeEvidence` | 方法 | 是 | [src/flow-run-visualization.ts:347-383](../src/flow-run-visualization.ts#L347) |
| `FlowRunVisualizationController.dispose` | 方法 | 是 | [src/flow-run-visualization.ts:385-388](../src/flow-run-visualization.ts#L385) |
| `FlowRunVisualizationController.connectRun` | 方法 | 否 | [src/flow-run-visualization.ts:390-434](../src/flow-run-visualization.ts#L390) |
| `FlowRunVisualizationController.handleObservation` | 方法 | 否 | [src/flow-run-visualization.ts:436-458](../src/flow-run-visualization.ts#L436) |
| `FlowRunVisualizationController.scheduleRefresh` | 方法 | 否 | [src/flow-run-visualization.ts:460-522](../src/flow-run-visualization.ts#L460) |
| `FlowRunVisualizationController.applySnapshot` | 方法 | 否 | [src/flow-run-visualization.ts:524-560](../src/flow-run-visualization.ts#L524) |
| `FlowRunVisualizationController.disconnectDetail` | 方法 | 否 | [src/flow-run-visualization.ts:562-575](../src/flow-run-visualization.ts#L562) |
| `FlowRunVisualizationController.markDetailUnavailable` | 方法 | 否 | [src/flow-run-visualization.ts:577-582](../src/flow-run-visualization.ts#L577) |
| `FlowRunVisualizationController.updateCenter` | 方法 | 否 | [src/flow-run-visualization.ts:584-590](../src/flow-run-visualization.ts#L584) |
| `FlowRunVisualizationController.updateDetail` | 方法 | 否 | [src/flow-run-visualization.ts:592-600](../src/flow-run-visualization.ts#L592) |
| `FlowRunVisualizationController.emit` | 方法 | 否 | [src/flow-run-visualization.ts:602-605](../src/flow-run-visualization.ts#L602) |
| `toRunListItem` | 函数 | 否 | [src/flow-run-visualization.ts:608-621](../src/flow-run-visualization.ts#L608) |
| `toNodeTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:623-637](../src/flow-run-visualization.ts#L623) |
| `toRouteTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:639-652](../src/flow-run-visualization.ts#L639) |
| `toParallelTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:654-686](../src/flow-run-visualization.ts#L654) |
| `toRecoveryTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:688-706](../src/flow-run-visualization.ts#L688) |
| `resolveSelection` | 函数 | 否 | [src/flow-run-visualization.ts:708-742](../src/flow-run-visualization.ts#L708) |
| `defaultSelection` | 函数 | 否 | [src/flow-run-visualization.ts:744-762](../src/flow-run-visualization.ts#L744) |
| `sameSelection` | 函数 | 否 | [src/flow-run-visualization.ts:764-785](../src/flow-run-visualization.ts#L764) |
| `compareTimelineItems` | 函数 | 否 | [src/flow-run-visualization.ts:787-793](../src/flow-run-visualization.ts#L787) |
| `timelineKindOrder` | 函数 | 否 | [src/flow-run-visualization.ts:795-808](../src/flow-run-visualization.ts#L795) |
| `summarizeValue` | 函数 | 否 | [src/flow-run-visualization.ts:810-813](../src/flow-run-visualization.ts#L810) |
| `errorMessage` | 函数 | 否 | [src/flow-run-visualization.ts:815-817](../src/flow-run-visualization.ts#L815) |
| `clone` | 函数 | 否 | [src/flow-run-visualization.ts:819-821](../src/flow-run-visualization.ts#L819) |

## [src/index.ts](../src/index.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| 无 | - | - | - |

## [src/observability.ts](../src/observability.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowRunInspectorOptions` | 接口 | 是 | [src/observability.ts:21-24](../src/observability.ts#L21) |
| `FlowObservationPublisher` | 类 | 是 | [src/observability.ts:27-76](../src/observability.ts#L27) |
| `FlowObservationPublisher.publish` | 方法 | 是 | [src/observability.ts:41-54](../src/observability.ts#L41) |
| `FlowObservationPublisher.subscribe` | 方法 | 是 | [src/observability.ts:56-75](../src/observability.ts#L56) |
| `FlowRunInspector` | 类 | 是 | [src/observability.ts:83-192](../src/observability.ts#L83) |
| `FlowRunInspector.listRecentRuns` | 方法 | 是 | [src/observability.ts:102-108](../src/observability.ts#L102) |
| `FlowRunInspector.listFlowRuns` | 方法 | 是 | [src/observability.ts:110-121](../src/observability.ts#L110) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability.ts:123-153](../src/observability.ts#L123) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:155-191](../src/observability.ts#L155) |
| `FlowRunObservation` | 接口 | 是 | [src/observability.ts:194-197](../src/observability.ts#L194) |
| `FlowRuntime` | 类 | 是 | [src/observability.ts:201-268](../src/observability.ts#L201) |
| `FlowRuntime.listRecentRuns` | 方法 | 是 | [src/observability.ts:213-215](../src/observability.ts#L213) |
| `FlowRuntime.listFlowRuns` | 方法 | 是 | [src/observability.ts:217-219](../src/observability.ts#L217) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability.ts:221-223](../src/observability.ts#L221) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:225-230](../src/observability.ts#L225) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability.ts:232-237](../src/observability.ts#L232) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability.ts:240-267](../src/observability.ts#L240) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability.ts:270-296](../src/observability.ts#L270) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability.ts:298-303](../src/observability.ts#L298) |
| `formatDestination` | 函数 | 否 | [src/observability.ts:305-310](../src/observability.ts#L305) |
| `formatValue` | 函数 | 否 | [src/observability.ts:312-314](../src/observability.ts#L312) |
| `isEvidenceReader` | 函数 | 否 | [src/observability.ts:316-320](../src/observability.ts#L316) |
| `bySequence` | 函数 | 否 | [src/observability.ts:322-324](../src/observability.ts#L322) |
| `toRunSummary` | 函数 | 否 | [src/observability.ts:326-340](../src/observability.ts#L326) |
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:342-361](../src/observability.ts#L342) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:363-392](../src/observability.ts#L363) |
| `evidenceSummary` | 函数 | 否 | [src/observability.ts:394-402](../src/observability.ts#L394) |
| `toCommandResult` | 函数 | 否 | [src/observability.ts:404-422](../src/observability.ts#L404) |
| `isRecord` | 函数 | 否 | [src/observability.ts:424-428](../src/observability.ts#L424) |

## [src/parser.ts](../src/parser.ts)

依赖：`node:path`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/parser.ts:26-30](../src/parser.ts#L26) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:32-35](../src/parser.ts#L32) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:37-42](../src/parser.ts#L37) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:44-82](../src/parser.ts#L44) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:84-109](../src/parser.ts#L84) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:111-119](../src/parser.ts#L111) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:121-161](../src/parser.ts#L121) |
| `parseSections` | 函数 | 否 | [src/parser.ts:163-190](../src/parser.ts#L163) |
| `parseAction` | 函数 | 否 | [src/parser.ts:192-207](../src/parser.ts#L192) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:209-251](../src/parser.ts#L209) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:253-266](../src/parser.ts#L253) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:268-285](../src/parser.ts#L268) |
| `parseResults` | 函数 | 否 | [src/parser.ts:287-307](../src/parser.ts#L287) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:309-371](../src/parser.ts#L309) |
| `destination` | 函数 | 否 | [src/parser.ts:373-382](../src/parser.ts#L373) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:384-460](../src/parser.ts#L384) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:462-484](../src/parser.ts#L462) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:486-497](../src/parser.ts#L486) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:499-503](../src/parser.ts#L499) |
| `isRecord` | 函数 | 否 | [src/parser.ts:505-507](../src/parser.ts#L505) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:509-536](../src/parser.ts#L509) |

## [src/pi-session-evidence.ts](../src/pi-session-evidence.ts)

依赖：`@earendil-works/pi-coding-agent`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `readPersistedPiNodeEvidence` | 函数 | 是 | [src/pi-session-evidence.ts:8-22](../src/pi-session-evidence.ts#L8) |
| `parseInteractionReference` | 函数 | 否 | [src/pi-session-evidence.ts:24-34](../src/pi-session-evidence.ts#L24) |
| `messagesFromEntries` | 函数 | 否 | [src/pi-session-evidence.ts:36-62](../src/pi-session-evidence.ts#L36) |
| `normalizeRole` | 函数 | 否 | [src/pi-session-evidence.ts:64-68](../src/pi-session-evidence.ts#L64) |

## [src/pi.ts](../src/pi.ts)

依赖：`@earendil-works/pi-coding-agent`、`typebox`、`./observability.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:20-26](../src/pi.ts#L20) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:28-33](../src/pi.ts#L28) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:35-40](../src/pi.ts#L35) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:42-51](../src/pi.ts#L42) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:53-57](../src/pi.ts#L53) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:60-342](../src/pi.ts#L60) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:70-79](../src/pi.ts#L70) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:81-105](../src/pi.ts#L81) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:107-140](../src/pi.ts#L107) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:142-157](../src/pi.ts#L142) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:159-167](../src/pi.ts#L159) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:170-178](../src/pi.ts#L170) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:181-209](../src/pi.ts#L181) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:211-234](../src/pi.ts#L211) |
| `PiAgentIntegrationAdapter.createCliConnection` | 方法 | 否 | [src/pi.ts:236-245](../src/pi.ts#L236) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:247-269](../src/pi.ts#L247) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:271-307](../src/pi.ts#L271) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:309-324](../src/pi.ts#L309) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:327-341](../src/pi.ts#L327) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:344-376](../src/pi.ts#L344) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi.ts:379-405](../src/pi.ts#L379) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:407-417](../src/pi.ts#L407) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:419-424](../src/pi.ts#L419) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:426-436](../src/pi.ts#L426) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:438-466](../src/pi.ts#L438) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:468-472](../src/pi.ts#L468) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/runtime.ts:35-35](../src/runtime.ts#L35) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:37-48](../src/runtime.ts#L37) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:50-209](../src/runtime.ts#L50) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:57-71](../src/runtime.ts#L57) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:73-101](../src/runtime.ts#L73) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:103-120](../src/runtime.ts#L103) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:122-125](../src/runtime.ts#L122) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:127-130](../src/runtime.ts#L127) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:132-142](../src/runtime.ts#L132) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:144-152](../src/runtime.ts#L144) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:154-158](../src/runtime.ts#L154) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:160-162](../src/runtime.ts#L160) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:164-168](../src/runtime.ts#L164) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:170-174](../src/runtime.ts#L170) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:176-180](../src/runtime.ts#L176) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:182-187](../src/runtime.ts#L182) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:189-194](../src/runtime.ts#L189) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:196-201](../src/runtime.ts#L196) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:203-208](../src/runtime.ts#L203) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:211-217](../src/runtime.ts#L211) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:220-374](../src/runtime.ts#L220) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:231-245](../src/runtime.ts#L231) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:247-267](../src/runtime.ts#L247) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:269-281](../src/runtime.ts#L269) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:283-295](../src/runtime.ts#L283) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:297-300](../src/runtime.ts#L297) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:302-304](../src/runtime.ts#L302) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:306-308](../src/runtime.ts#L306) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:310-312](../src/runtime.ts#L310) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:314-317](../src/runtime.ts#L314) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:319-324](../src/runtime.ts#L319) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:326-329](../src/runtime.ts#L326) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:331-334](../src/runtime.ts#L331) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:336-339](../src/runtime.ts#L336) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:341-343](../src/runtime.ts#L341) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:345-347](../src/runtime.ts#L345) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:349-352](../src/runtime.ts#L349) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:354-359](../src/runtime.ts#L354) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:361-366](../src/runtime.ts#L361) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:368-373](../src/runtime.ts#L368) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:376-407](../src/runtime.ts#L376) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:377-406](../src/runtime.ts#L377) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:409-512](../src/runtime.ts#L409) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:417-441](../src/runtime.ts#L417) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:443-500](../src/runtime.ts#L443) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:502-504](../src/runtime.ts#L502) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:506-511](../src/runtime.ts#L506) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:514-1588](../src/runtime.ts#L514) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:545-585](../src/runtime.ts#L545) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:588-687](../src/runtime.ts#L588) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:689-809](../src/runtime.ts#L689) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:811-898](../src/runtime.ts#L811) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:900-922](../src/runtime.ts#L900) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:924-1023](../src/runtime.ts#L924) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1025-1110](../src/runtime.ts#L1025) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1112-1149](../src/runtime.ts#L1112) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1151-1189](../src/runtime.ts#L1151) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1191-1238](../src/runtime.ts#L1191) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1240-1260](../src/runtime.ts#L1240) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1262-1307](../src/runtime.ts#L1262) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1309-1355](../src/runtime.ts#L1309) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1357-1382](../src/runtime.ts#L1357) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1384-1392](../src/runtime.ts#L1384) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1394-1416](../src/runtime.ts#L1394) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1418-1434](../src/runtime.ts#L1418) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1436-1445](../src/runtime.ts#L1436) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1447-1529](../src/runtime.ts#L1447) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1531-1560](../src/runtime.ts#L1531) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1562-1587](../src/runtime.ts#L1562) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1590-1597](../src/runtime.ts#L1590) |
| `now` | 函数 | 否 | [src/runtime.ts:1599-1601](../src/runtime.ts#L1599) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1603-1615](../src/runtime.ts#L1603) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1617-1633](../src/runtime.ts#L1617) |
| `snapshotFlowDefinition` | 函数 | 是 | [src/runtime.ts:1635-1658](../src/runtime.ts#L1635) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1660-1686](../src/runtime.ts#L1660) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1688-1699](../src/runtime.ts#L1688) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:1701-1705](../src/runtime.ts#L1701) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1707-1725](../src/runtime.ts#L1707) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1727-1738](../src/runtime.ts#L1727) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1740-1745](../src/runtime.ts#L1740) |
| `clone` | 函数 | 否 | [src/runtime.ts:1747-1749](../src/runtime.ts#L1747) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:9-9](../src/types.ts#L9) |
| `AgentAction` | 接口 | 是 | [src/types.ts:11-14](../src/types.ts#L11) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:16-22](../src/types.ts#L16) |
| `CommandAction` | 接口 | 是 | [src/types.ts:24-28](../src/types.ts#L24) |
| `FlowAction` | 类型 | 是 | [src/types.ts:30-30](../src/types.ts#L30) |
| `FlowNode` | 接口 | 是 | [src/types.ts:32-38](../src/types.ts#L32) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:40-43](../src/types.ts#L40) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:45-49](../src/types.ts#L45) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:51-58](../src/types.ts#L51) |
| `FlowDefinitionSnapshot` | 接口 | 是 | [src/types.ts:61-78](../src/types.ts#L61) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:80-83](../src/types.ts#L80) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:85-88](../src/types.ts#L85) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:90-94](../src/types.ts#L90) |
| `NodeSession` | 接口 | 是 | [src/types.ts:96-100](../src/types.ts#L96) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:102-106](../src/types.ts#L102) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:108-112](../src/types.ts#L108) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:114-133](../src/types.ts#L114) |
| `CommandResult` | 接口 | 是 | [src/types.ts:135-140](../src/types.ts#L135) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:142-144](../src/types.ts#L142) |
| `RunStatus` | 类型 | 是 | [src/types.ts:146-146](../src/types.ts#L146) |
| `RunPhase` | 类型 | 是 | [src/types.ts:148-155](../src/types.ts#L148) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:157-157](../src/types.ts#L157) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:159-164](../src/types.ts#L159) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:166-176](../src/types.ts#L166) |
| `FlowError` | 接口 | 是 | [src/types.ts:178-181](../src/types.ts#L178) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:183-195](../src/types.ts#L183) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:198-219](../src/types.ts#L198) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:222-232](../src/types.ts#L222) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:235-252](../src/types.ts#L235) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:254-262](../src/types.ts#L254) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:268-295](../src/types.ts#L268) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:298-305](../src/types.ts#L298) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:308-314](../src/types.ts#L308) |
| `RunStore` | 接口 | 是 | [src/types.ts:316-332](../src/types.ts#L316) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:334-346](../src/types.ts#L334) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:348-360](../src/types.ts#L348) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:362-366](../src/types.ts#L362) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:368-385](../src/types.ts#L368) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:388-397](../src/types.ts#L388) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:399-416](../src/types.ts#L399) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:418-420](../src/types.ts#L418) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:422-425](../src/types.ts#L422) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:427-429](../src/types.ts#L427) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:431-439](../src/types.ts#L431) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:441-453](../src/types.ts#L441) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:455-474](../src/types.ts#L455) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:476-478](../src/types.ts#L476) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:480-486](../src/types.ts#L480) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:488-490](../src/types.ts#L488) |
