# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/cli-state.ts](../src/cli-state.ts)

依赖：`@earendil-works/pi-coding-agent`、`./observability.ts`、`./pi.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSessionReplacement` | 接口 | 否 | [src/cli-state.ts:6-9](../src/cli-state.ts#L6) |
| `CliFlowState` | 接口 | 是 | [src/cli-state.ts:11-26](../src/cli-state.ts#L11) |
| `getCliFlowState` | 函数 | 是 | [src/cli-state.ts:32-39](../src/cli-state.ts#L32) |
| `rejectPendingSessionReplacement` | 函数 | 是 | [src/cli-state.ts:41-46](../src/cli-state.ts#L41) |

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
| `flowExtension` | 函数 | 是 | [src/extension.ts:35-445](../src/extension.ts#L35) |
| `loadFlow` | 函数 | 否 | [src/extension.ts:447-449](../src/extension.ts#L447) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:451-457](../src/extension.ts#L451) |
| `publishHostObservation` | 函数 | 否 | [src/extension.ts:459-485](../src/extension.ts#L459) |
| `renderRunSnapshot` | 函数 | 否 | [src/extension.ts:487-507](../src/extension.ts#L487) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:509-511](../src/extension.ts#L509) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:513-518](../src/extension.ts#L513) |

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
| `FlowRunInspector` | 类 | 是 | [src/observability.ts:83-183](../src/observability.ts#L83) |
| `FlowRunInspector.listRecentRuns` | 方法 | 是 | [src/observability.ts:102-108](../src/observability.ts#L102) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability.ts:110-144](../src/observability.ts#L110) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:146-182](../src/observability.ts#L146) |
| `FlowRunObservation` | 接口 | 是 | [src/observability.ts:185-188](../src/observability.ts#L185) |
| `FlowRuntime` | 类 | 是 | [src/observability.ts:192-255](../src/observability.ts#L192) |
| `FlowRuntime.listRecentRuns` | 方法 | 是 | [src/observability.ts:204-206](../src/observability.ts#L204) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability.ts:208-210](../src/observability.ts#L208) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:212-217](../src/observability.ts#L212) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability.ts:219-224](../src/observability.ts#L219) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability.ts:227-254](../src/observability.ts#L227) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability.ts:257-283](../src/observability.ts#L257) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability.ts:285-290](../src/observability.ts#L285) |
| `formatDestination` | 函数 | 否 | [src/observability.ts:292-297](../src/observability.ts#L292) |
| `formatValue` | 函数 | 否 | [src/observability.ts:299-301](../src/observability.ts#L299) |
| `isEvidenceReader` | 函数 | 否 | [src/observability.ts:303-307](../src/observability.ts#L303) |
| `bySequence` | 函数 | 否 | [src/observability.ts:309-311](../src/observability.ts#L309) |
| `toRunSummary` | 函数 | 否 | [src/observability.ts:313-327](../src/observability.ts#L313) |
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:329-348](../src/observability.ts#L329) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:350-379](../src/observability.ts#L350) |
| `evidenceSummary` | 函数 | 否 | [src/observability.ts:381-389](../src/observability.ts#L381) |
| `toCommandResult` | 函数 | 否 | [src/observability.ts:391-409](../src/observability.ts#L391) |
| `isRecord` | 函数 | 否 | [src/observability.ts:411-415](../src/observability.ts#L411) |

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
| `FactChanges` | 类型 | 否 | [src/runtime.ts:33-33](../src/runtime.ts#L33) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:35-46](../src/runtime.ts#L35) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:48-185](../src/runtime.ts#L48) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:55-69](../src/runtime.ts#L55) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:71-99](../src/runtime.ts#L71) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:101-118](../src/runtime.ts#L101) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:120-123](../src/runtime.ts#L120) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:125-128](../src/runtime.ts#L125) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:130-134](../src/runtime.ts#L130) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:136-138](../src/runtime.ts#L136) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:140-144](../src/runtime.ts#L140) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:146-150](../src/runtime.ts#L146) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:152-156](../src/runtime.ts#L152) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:158-163](../src/runtime.ts#L158) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:165-170](../src/runtime.ts#L165) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:172-177](../src/runtime.ts#L172) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:179-184](../src/runtime.ts#L179) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:187-193](../src/runtime.ts#L187) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:196-328](../src/runtime.ts#L196) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:206-228](../src/runtime.ts#L206) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:230-242](../src/runtime.ts#L230) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:244-256](../src/runtime.ts#L244) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:258-261](../src/runtime.ts#L258) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:263-265](../src/runtime.ts#L263) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:267-269](../src/runtime.ts#L267) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:271-273](../src/runtime.ts#L271) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:275-278](../src/runtime.ts#L275) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:280-283](../src/runtime.ts#L280) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:285-288](../src/runtime.ts#L285) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:290-293](../src/runtime.ts#L290) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:295-297](../src/runtime.ts#L295) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:299-301](../src/runtime.ts#L299) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:303-306](../src/runtime.ts#L303) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:308-313](../src/runtime.ts#L308) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:315-320](../src/runtime.ts#L315) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:322-327](../src/runtime.ts#L322) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:330-361](../src/runtime.ts#L330) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:331-360](../src/runtime.ts#L331) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:363-466](../src/runtime.ts#L363) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:371-395](../src/runtime.ts#L371) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:397-454](../src/runtime.ts#L397) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:456-458](../src/runtime.ts#L456) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:460-465](../src/runtime.ts#L460) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:468-1541](../src/runtime.ts#L468) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:499-538](../src/runtime.ts#L499) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:541-640](../src/runtime.ts#L541) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:642-762](../src/runtime.ts#L642) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:764-851](../src/runtime.ts#L764) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:853-875](../src/runtime.ts#L853) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:877-976](../src/runtime.ts#L877) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:978-1063](../src/runtime.ts#L978) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1065-1102](../src/runtime.ts#L1065) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1104-1142](../src/runtime.ts#L1104) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1144-1191](../src/runtime.ts#L1144) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1193-1213](../src/runtime.ts#L1193) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1215-1260](../src/runtime.ts#L1215) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1262-1308](../src/runtime.ts#L1262) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1310-1335](../src/runtime.ts#L1310) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1337-1345](../src/runtime.ts#L1337) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1347-1369](../src/runtime.ts#L1347) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1371-1387](../src/runtime.ts#L1371) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1389-1398](../src/runtime.ts#L1389) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1400-1482](../src/runtime.ts#L1400) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1484-1513](../src/runtime.ts#L1484) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1515-1540](../src/runtime.ts#L1515) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1543-1550](../src/runtime.ts#L1543) |
| `now` | 函数 | 否 | [src/runtime.ts:1552-1554](../src/runtime.ts#L1552) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1556-1568](../src/runtime.ts#L1556) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1570-1586](../src/runtime.ts#L1570) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1588-1614](../src/runtime.ts#L1588) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1616-1627](../src/runtime.ts#L1616) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:1629-1633](../src/runtime.ts#L1629) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1635-1653](../src/runtime.ts#L1635) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1655-1666](../src/runtime.ts#L1655) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1668-1673](../src/runtime.ts#L1668) |
| `clone` | 函数 | 否 | [src/runtime.ts:1675-1677](../src/runtime.ts#L1675) |

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
| `RunStore` | 接口 | 是 | [src/types.ts:285-300](../src/types.ts#L285) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:302-314](../src/types.ts#L302) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:316-328](../src/types.ts#L316) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:330-334](../src/types.ts#L330) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:336-353](../src/types.ts#L336) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:356-364](../src/types.ts#L356) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:366-383](../src/types.ts#L366) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:385-387](../src/types.ts#L385) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:389-392](../src/types.ts#L389) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:394-396](../src/types.ts#L394) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:398-405](../src/types.ts#L398) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:407-419](../src/types.ts#L407) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:421-440](../src/types.ts#L421) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:442-444](../src/types.ts#L442) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:446-452](../src/types.ts#L446) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:454-456](../src/types.ts#L454) |
