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

依赖：`node:fs/promises`、`node:os`、`node:path`、`./flow-observability-web.ts`、`./observability.ts`、`./pi-session-evidence.ts`、`./runtime.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `CliOptions` | 接口 | 否 | [src/flow-observability-web-cli.ts:13-19](../src/flow-observability-web-cli.ts#L13) |
| `main` | 函数 | 否 | [src/flow-observability-web-cli.ts:21-49](../src/flow-observability-web-cli.ts#L21) |
| `createRuntime` | 函数 | 否 | [src/flow-observability-web-cli.ts:51-60](../src/flow-observability-web-cli.ts#L51) |
| `parseOptions` | 函数 | 否 | [src/flow-observability-web-cli.ts:62-102](../src/flow-observability-web-cli.ts#L62) |
| `requireValue` | 函数 | 否 | [src/flow-observability-web-cli.ts:104-108](../src/flow-observability-web-cli.ts#L104) |
| `lanAddress` | 函数 | 否 | [src/flow-observability-web-cli.ts:110-119](../src/flow-observability-web-cli.ts#L110) |

## [src/flow-observability-web.ts](../src/flow-observability-web.ts)

依赖：`node:crypto`、`node:http`、`node:https`、`node:net`、`./flow-run-visualization.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowObservabilityWebRequestContext` | 接口 | 是 | [src/flow-observability-web.ts:22-24](../src/flow-observability-web.ts#L22) |
| `FlowObservabilityWebAuthorizer` | 接口 | 是 | [src/flow-observability-web.ts:26-36](../src/flow-observability-web.ts#L26) |
| `FlowObservabilityWebHostOptions` | 接口 | 是 | [src/flow-observability-web.ts:38-51](../src/flow-observability-web.ts#L38) |
| `FlowObservabilityWebHost` | 类 | 是 | [src/flow-observability-web.ts:53-447](../src/flow-observability-web.ts#L53) |
| `FlowObservabilityWebHost.start` | 方法 | 是 | [src/flow-observability-web.ts:101-130](../src/flow-observability-web.ts#L101) |
| `FlowObservabilityWebHost.close` | 方法 | 是 | [src/flow-observability-web.ts:132-142](../src/flow-observability-web.ts#L132) |
| `FlowObservabilityWebHost.handle` | 方法 | 否 | [src/flow-observability-web.ts:144-181](../src/flow-observability-web.ts#L144) |
| `FlowObservabilityWebHost.establishSession` | 方法 | 否 | [src/flow-observability-web.ts:183-197](../src/flow-observability-web.ts#L183) |
| `FlowObservabilityWebHost.renderPage` | 方法 | 否 | [src/flow-observability-web.ts:199-201](../src/flow-observability-web.ts#L199) |
| `FlowObservabilityWebHost.handleApi` | 方法 | 否 | [src/flow-observability-web.ts:203-282](../src/flow-observability-web.ts#L203) |
| `FlowObservabilityWebHost.canReadRun` | 方法 | 否 | [src/flow-observability-web.ts:284-292](../src/flow-observability-web.ts#L284) |
| `FlowObservabilityWebHost.openObservation` | 方法 | 否 | [src/flow-observability-web.ts:294-352](../src/flow-observability-web.ts#L294) |
| `FlowObservabilityWebHost.isAuthenticated` | 方法 | 否 | [src/flow-observability-web.ts:354-359](../src/flow-observability-web.ts#L354) |
| `FlowObservabilityWebHost.runtime` | 方法 | 否 | [src/flow-observability-web.ts:361-363](../src/flow-observability-web.ts#L361) |
| `FlowObservabilityWebHost.writeSse` | 方法 | 否 | [src/flow-observability-web.ts:365-371](../src/flow-observability-web.ts#L365) |
| `FlowObservabilityWebHost.publishSse` | 方法 | 否 | [src/flow-observability-web.ts:373-382](../src/flow-observability-web.ts#L373) |
| `FlowObservabilityWebHost.writeHtml` | 方法 | 否 | [src/flow-observability-web.ts:384-397](../src/flow-observability-web.ts#L384) |
| `FlowObservabilityWebHost.writeJavaScript` | 方法 | 否 | [src/flow-observability-web.ts:399-409](../src/flow-observability-web.ts#L399) |
| `FlowObservabilityWebHost.writeCss` | 方法 | 否 | [src/flow-observability-web.ts:411-421](../src/flow-observability-web.ts#L411) |
| `FlowObservabilityWebHost.writeJson` | 方法 | 否 | [src/flow-observability-web.ts:423-434](../src/flow-observability-web.ts#L423) |
| `FlowObservabilityWebHost.writeText` | 方法 | 否 | [src/flow-observability-web.ts:436-446](../src/flow-observability-web.ts#L436) |
| `WebRunSummary` | 接口 | 否 | [src/flow-observability-web.ts:449-461](../src/flow-observability-web.ts#L449) |
| `toWebRunSummary` | 函数 | 否 | [src/flow-observability-web.ts:463-477](../src/flow-observability-web.ts#L463) |
| `toWebRunHistory` | 函数 | 否 | [src/flow-observability-web.ts:479-526](../src/flow-observability-web.ts#L479) |
| `toWebEvidence` | 函数 | 否 | [src/flow-observability-web.ts:528-540](../src/flow-observability-web.ts#L528) |
| `toWebEvent` | 函数 | 否 | [src/flow-observability-web.ts:542-560](../src/flow-observability-web.ts#L542) |
| `summarize` | 函数 | 否 | [src/flow-observability-web.ts:562-565](../src/flow-observability-web.ts#L562) |
| `isLoopbackHost` | 函数 | 否 | [src/flow-observability-web.ts:567-569](../src/flow-observability-web.ts#L567) |
| `readJson` | 函数 | 否 | [src/flow-observability-web.ts:571-582](../src/flow-observability-web.ts#L571) |

## [src/flow-run-visualization.ts](../src/flow-run-visualization.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowRunVisualizationRuntime` | 接口 | 是 | [src/flow-run-visualization.ts:14-31](../src/flow-run-visualization.ts#L14) |
| `FlowRunCenterFilter` | 类型 | 是 | [src/flow-run-visualization.ts:33-33](../src/flow-run-visualization.ts#L33) |
| `FlowRunListItem` | 接口 | 是 | [src/flow-run-visualization.ts:35-46](../src/flow-run-visualization.ts#L35) |
| `FlowRunCenterState` | 接口 | 是 | [src/flow-run-visualization.ts:48-55](../src/flow-run-visualization.ts#L48) |
| `FlowFactSelection` | 类型 | 是 | [src/flow-run-visualization.ts:57-61](../src/flow-run-visualization.ts#L57) |
| `FlowTimelineBase` | 接口 | 否 | [src/flow-run-visualization.ts:63-67](../src/flow-run-visualization.ts#L63) |
| `FlowNodeTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:69-78](../src/flow-run-visualization.ts#L69) |
| `FlowRouteTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:80-86](../src/flow-run-visualization.ts#L80) |
| `FlowParallelBranchTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:88-94](../src/flow-run-visualization.ts#L88) |
| `FlowParallelTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:96-105](../src/flow-run-visualization.ts#L96) |
| `FlowRecoveryTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:107-114](../src/flow-run-visualization.ts#L107) |
| `FlowRunTerminalTimelineItem` | 接口 | 是 | [src/flow-run-visualization.ts:116-123](../src/flow-run-visualization.ts#L116) |
| `FlowTimelineItem` | 类型 | 是 | [src/flow-run-visualization.ts:125-130](../src/flow-run-visualization.ts#L125) |
| `FlowRunDetailState` | 接口 | 是 | [src/flow-run-visualization.ts:132-143](../src/flow-run-visualization.ts#L132) |
| `FlowRunVisualizationState` | 接口 | 是 | [src/flow-run-visualization.ts:145-148](../src/flow-run-visualization.ts#L145) |
| `FlowRunVisualizationListener` | 类型 | 是 | [src/flow-run-visualization.ts:150-152](../src/flow-run-visualization.ts#L150) |
| `buildFlowTimeline` | 函数 | 是 | [src/flow-run-visualization.ts:158-185](../src/flow-run-visualization.ts#L158) |
| `filterFlowRuns` | 函数 | 是 | [src/flow-run-visualization.ts:187-207](../src/flow-run-visualization.ts#L187) |
| `FlowRunVisualizationController` | 类 | 是 | [src/flow-run-visualization.ts:213-605](../src/flow-run-visualization.ts#L213) |
| `FlowRunVisualizationController.getState` | 方法 | 是 | [src/flow-run-visualization.ts:235-237](../src/flow-run-visualization.ts#L235) |
| `FlowRunVisualizationController.subscribe` | 方法 | 是 | [src/flow-run-visualization.ts:239-243](../src/flow-run-visualization.ts#L239) |
| `FlowRunVisualizationController.loadRecentRuns` | 方法 | 是 | [src/flow-run-visualization.ts:245-263](../src/flow-run-visualization.ts#L245) |
| `FlowRunVisualizationController.setFilter` | 方法 | 是 | [src/flow-run-visualization.ts:265-267](../src/flow-run-visualization.ts#L265) |
| `FlowRunVisualizationController.getVisibleRuns` | 方法 | 是 | [src/flow-run-visualization.ts:269-273](../src/flow-run-visualization.ts#L269) |
| `FlowRunVisualizationController.openRun` | 方法 | 是 | [src/flow-run-visualization.ts:275-289](../src/flow-run-visualization.ts#L275) |
| `FlowRunVisualizationController.reconnect` | 方法 | 是 | [src/flow-run-visualization.ts:291-307](../src/flow-run-visualization.ts#L291) |
| `FlowRunVisualizationController.markDisconnected` | 方法 | 是 | [src/flow-run-visualization.ts:309-318](../src/flow-run-visualization.ts#L309) |
| `FlowRunVisualizationController.closeRun` | 方法 | 是 | [src/flow-run-visualization.ts:320-328](../src/flow-run-visualization.ts#L320) |
| `FlowRunVisualizationController.selectFact` | 方法 | 是 | [src/flow-run-visualization.ts:330-344](../src/flow-run-visualization.ts#L330) |
| `FlowRunVisualizationController.loadSelectedNodeEvidence` | 方法 | 是 | [src/flow-run-visualization.ts:346-382](../src/flow-run-visualization.ts#L346) |
| `FlowRunVisualizationController.dispose` | 方法 | 是 | [src/flow-run-visualization.ts:384-387](../src/flow-run-visualization.ts#L384) |
| `FlowRunVisualizationController.connectRun` | 方法 | 否 | [src/flow-run-visualization.ts:389-433](../src/flow-run-visualization.ts#L389) |
| `FlowRunVisualizationController.handleObservation` | 方法 | 否 | [src/flow-run-visualization.ts:435-457](../src/flow-run-visualization.ts#L435) |
| `FlowRunVisualizationController.scheduleRefresh` | 方法 | 否 | [src/flow-run-visualization.ts:459-521](../src/flow-run-visualization.ts#L459) |
| `FlowRunVisualizationController.applySnapshot` | 方法 | 否 | [src/flow-run-visualization.ts:523-559](../src/flow-run-visualization.ts#L523) |
| `FlowRunVisualizationController.disconnectDetail` | 方法 | 否 | [src/flow-run-visualization.ts:561-574](../src/flow-run-visualization.ts#L561) |
| `FlowRunVisualizationController.markDetailUnavailable` | 方法 | 否 | [src/flow-run-visualization.ts:576-581](../src/flow-run-visualization.ts#L576) |
| `FlowRunVisualizationController.updateCenter` | 方法 | 否 | [src/flow-run-visualization.ts:583-589](../src/flow-run-visualization.ts#L583) |
| `FlowRunVisualizationController.updateDetail` | 方法 | 否 | [src/flow-run-visualization.ts:591-599](../src/flow-run-visualization.ts#L591) |
| `FlowRunVisualizationController.emit` | 方法 | 否 | [src/flow-run-visualization.ts:601-604](../src/flow-run-visualization.ts#L601) |
| `toRunListItem` | 函数 | 否 | [src/flow-run-visualization.ts:607-620](../src/flow-run-visualization.ts#L607) |
| `toNodeTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:622-636](../src/flow-run-visualization.ts#L622) |
| `toRouteTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:638-651](../src/flow-run-visualization.ts#L638) |
| `toParallelTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:653-685](../src/flow-run-visualization.ts#L653) |
| `toRecoveryTimelineItem` | 函数 | 否 | [src/flow-run-visualization.ts:687-705](../src/flow-run-visualization.ts#L687) |
| `resolveSelection` | 函数 | 否 | [src/flow-run-visualization.ts:707-741](../src/flow-run-visualization.ts#L707) |
| `defaultSelection` | 函数 | 否 | [src/flow-run-visualization.ts:743-761](../src/flow-run-visualization.ts#L743) |
| `sameSelection` | 函数 | 否 | [src/flow-run-visualization.ts:763-784](../src/flow-run-visualization.ts#L763) |
| `compareTimelineItems` | 函数 | 否 | [src/flow-run-visualization.ts:786-792](../src/flow-run-visualization.ts#L786) |
| `timelineKindOrder` | 函数 | 否 | [src/flow-run-visualization.ts:794-807](../src/flow-run-visualization.ts#L794) |
| `summarizeValue` | 函数 | 否 | [src/flow-run-visualization.ts:809-812](../src/flow-run-visualization.ts#L809) |
| `errorMessage` | 函数 | 否 | [src/flow-run-visualization.ts:814-816](../src/flow-run-visualization.ts#L814) |
| `clone` | 函数 | 否 | [src/flow-run-visualization.ts:818-820](../src/flow-run-visualization.ts#L818) |

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
| `FlowRunInspector` | 类 | 是 | [src/observability.ts:83-178](../src/observability.ts#L83) |
| `FlowRunInspector.listRecentRuns` | 方法 | 是 | [src/observability.ts:102-108](../src/observability.ts#L102) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability.ts:110-139](../src/observability.ts#L110) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:141-177](../src/observability.ts#L141) |
| `FlowRunObservation` | 接口 | 是 | [src/observability.ts:180-183](../src/observability.ts#L180) |
| `FlowRuntime` | 类 | 是 | [src/observability.ts:187-250](../src/observability.ts#L187) |
| `FlowRuntime.listRecentRuns` | 方法 | 是 | [src/observability.ts:199-201](../src/observability.ts#L199) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability.ts:203-205](../src/observability.ts#L203) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:207-212](../src/observability.ts#L207) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability.ts:214-219](../src/observability.ts#L214) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability.ts:222-249](../src/observability.ts#L222) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability.ts:252-278](../src/observability.ts#L252) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability.ts:280-285](../src/observability.ts#L280) |
| `formatDestination` | 函数 | 否 | [src/observability.ts:287-292](../src/observability.ts#L287) |
| `formatValue` | 函数 | 否 | [src/observability.ts:294-296](../src/observability.ts#L294) |
| `isEvidenceReader` | 函数 | 否 | [src/observability.ts:298-302](../src/observability.ts#L298) |
| `bySequence` | 函数 | 否 | [src/observability.ts:304-306](../src/observability.ts#L304) |
| `toRunSummary` | 函数 | 否 | [src/observability.ts:308-322](../src/observability.ts#L308) |
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:324-343](../src/observability.ts#L324) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:345-374](../src/observability.ts#L345) |
| `evidenceSummary` | 函数 | 否 | [src/observability.ts:376-384](../src/observability.ts#L376) |
| `toCommandResult` | 函数 | 否 | [src/observability.ts:386-404](../src/observability.ts#L386) |
| `isRecord` | 函数 | 否 | [src/observability.ts:406-410](../src/observability.ts#L406) |

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
| `FactChanges` | 类型 | 否 | [src/runtime.ts:34-34](../src/runtime.ts#L34) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:36-47](../src/runtime.ts#L36) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:49-208](../src/runtime.ts#L49) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:56-70](../src/runtime.ts#L56) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:72-100](../src/runtime.ts#L72) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:102-119](../src/runtime.ts#L102) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:121-124](../src/runtime.ts#L121) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:126-129](../src/runtime.ts#L126) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:131-141](../src/runtime.ts#L131) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:143-151](../src/runtime.ts#L143) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:153-157](../src/runtime.ts#L153) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:159-161](../src/runtime.ts#L159) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:163-167](../src/runtime.ts#L163) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:169-173](../src/runtime.ts#L169) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:175-179](../src/runtime.ts#L175) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:181-186](../src/runtime.ts#L181) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:188-193](../src/runtime.ts#L188) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:195-200](../src/runtime.ts#L195) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:202-207](../src/runtime.ts#L202) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:210-216](../src/runtime.ts#L210) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:219-373](../src/runtime.ts#L219) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:230-244](../src/runtime.ts#L230) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:246-266](../src/runtime.ts#L246) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:268-280](../src/runtime.ts#L268) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:282-294](../src/runtime.ts#L282) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:296-299](../src/runtime.ts#L296) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:301-303](../src/runtime.ts#L301) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:305-307](../src/runtime.ts#L305) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:309-311](../src/runtime.ts#L309) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:313-316](../src/runtime.ts#L313) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:318-323](../src/runtime.ts#L318) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:325-328](../src/runtime.ts#L325) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:330-333](../src/runtime.ts#L330) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:335-338](../src/runtime.ts#L335) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:340-342](../src/runtime.ts#L340) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:344-346](../src/runtime.ts#L344) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:348-351](../src/runtime.ts#L348) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:353-358](../src/runtime.ts#L353) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:360-365](../src/runtime.ts#L360) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:367-372](../src/runtime.ts#L367) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:375-406](../src/runtime.ts#L375) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:376-405](../src/runtime.ts#L376) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:408-511](../src/runtime.ts#L408) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:416-440](../src/runtime.ts#L416) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:442-499](../src/runtime.ts#L442) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:501-503](../src/runtime.ts#L501) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:505-510](../src/runtime.ts#L505) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:513-1586](../src/runtime.ts#L513) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:544-583](../src/runtime.ts#L544) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:586-685](../src/runtime.ts#L586) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:687-807](../src/runtime.ts#L687) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:809-896](../src/runtime.ts#L809) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:898-920](../src/runtime.ts#L898) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:922-1021](../src/runtime.ts#L922) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1023-1108](../src/runtime.ts#L1023) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1110-1147](../src/runtime.ts#L1110) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1149-1187](../src/runtime.ts#L1149) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1189-1236](../src/runtime.ts#L1189) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1238-1258](../src/runtime.ts#L1238) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1260-1305](../src/runtime.ts#L1260) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1307-1353](../src/runtime.ts#L1307) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1355-1380](../src/runtime.ts#L1355) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1382-1390](../src/runtime.ts#L1382) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1392-1414](../src/runtime.ts#L1392) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1416-1432](../src/runtime.ts#L1416) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1434-1443](../src/runtime.ts#L1434) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1445-1527](../src/runtime.ts#L1445) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1529-1558](../src/runtime.ts#L1529) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1560-1585](../src/runtime.ts#L1560) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1588-1595](../src/runtime.ts#L1588) |
| `now` | 函数 | 否 | [src/runtime.ts:1597-1599](../src/runtime.ts#L1597) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1601-1613](../src/runtime.ts#L1601) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1615-1631](../src/runtime.ts#L1615) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1633-1659](../src/runtime.ts#L1633) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1661-1672](../src/runtime.ts#L1661) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:1674-1678](../src/runtime.ts#L1674) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1680-1698](../src/runtime.ts#L1680) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1700-1711](../src/runtime.ts#L1700) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1713-1718](../src/runtime.ts#L1713) |
| `clone` | 函数 | 否 | [src/runtime.ts:1720-1722](../src/runtime.ts#L1720) |

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
| `OutcomeOption` | 接口 | 是 | [src/types.ts:60-63](../src/types.ts#L60) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:65-68](../src/types.ts#L65) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:70-74](../src/types.ts#L70) |
| `NodeSession` | 接口 | 是 | [src/types.ts:76-80](../src/types.ts#L76) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:82-86](../src/types.ts#L82) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:88-92](../src/types.ts#L88) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:94-113](../src/types.ts#L94) |
| `CommandResult` | 接口 | 是 | [src/types.ts:115-120](../src/types.ts#L115) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:122-124](../src/types.ts#L122) |
| `RunStatus` | 类型 | 是 | [src/types.ts:126-126](../src/types.ts#L126) |
| `RunPhase` | 类型 | 是 | [src/types.ts:128-135](../src/types.ts#L128) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:137-137](../src/types.ts#L137) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:139-144](../src/types.ts#L139) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:146-156](../src/types.ts#L146) |
| `FlowError` | 接口 | 是 | [src/types.ts:158-161](../src/types.ts#L158) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:163-175](../src/types.ts#L163) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:178-199](../src/types.ts#L178) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:202-212](../src/types.ts#L202) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:215-232](../src/types.ts#L215) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:234-242](../src/types.ts#L234) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:248-273](../src/types.ts#L248) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:276-283](../src/types.ts#L276) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:286-292](../src/types.ts#L286) |
| `RunStore` | 接口 | 是 | [src/types.ts:294-310](../src/types.ts#L294) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:312-324](../src/types.ts#L312) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:326-338](../src/types.ts#L326) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:340-344](../src/types.ts#L340) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:346-363](../src/types.ts#L346) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:366-374](../src/types.ts#L366) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:376-393](../src/types.ts#L376) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:395-397](../src/types.ts#L395) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:399-402](../src/types.ts#L399) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:404-406](../src/types.ts#L404) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:408-415](../src/types.ts#L408) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:417-429](../src/types.ts#L417) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:431-450](../src/types.ts#L431) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:452-454](../src/types.ts#L452) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:456-462](../src/types.ts#L456) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:464-466](../src/types.ts#L464) |
