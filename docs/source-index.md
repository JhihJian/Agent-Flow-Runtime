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
| `FlowRunInspector` | 类 | 是 | [src/observability.ts:83-182](../src/observability.ts#L83) |
| `FlowRunInspector.listRecentRuns` | 方法 | 是 | [src/observability.ts:102-108](../src/observability.ts#L102) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability.ts:110-144](../src/observability.ts#L110) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:146-181](../src/observability.ts#L146) |
| `FlowRunObservation` | 接口 | 是 | [src/observability.ts:184-187](../src/observability.ts#L184) |
| `FlowRuntime` | 类 | 是 | [src/observability.ts:191-254](../src/observability.ts#L191) |
| `FlowRuntime.listRecentRuns` | 方法 | 是 | [src/observability.ts:203-205](../src/observability.ts#L203) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability.ts:207-209](../src/observability.ts#L207) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:211-216](../src/observability.ts#L211) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability.ts:218-223](../src/observability.ts#L218) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability.ts:226-253](../src/observability.ts#L226) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability.ts:256-280](../src/observability.ts#L256) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability.ts:282-287](../src/observability.ts#L282) |
| `formatDestination` | 函数 | 否 | [src/observability.ts:289-294](../src/observability.ts#L289) |
| `formatValue` | 函数 | 否 | [src/observability.ts:296-298](../src/observability.ts#L296) |
| `isEvidenceReader` | 函数 | 否 | [src/observability.ts:300-304](../src/observability.ts#L300) |
| `bySequence` | 函数 | 否 | [src/observability.ts:306-308](../src/observability.ts#L306) |
| `toRunSummary` | 函数 | 否 | [src/observability.ts:310-324](../src/observability.ts#L310) |
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:326-344](../src/observability.ts#L326) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:346-374](../src/observability.ts#L346) |
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
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:35-45](../src/runtime.ts#L35) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:47-184](../src/runtime.ts#L47) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:54-68](../src/runtime.ts#L54) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:70-98](../src/runtime.ts#L70) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:100-117](../src/runtime.ts#L100) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:119-122](../src/runtime.ts#L119) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:124-127](../src/runtime.ts#L124) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:129-133](../src/runtime.ts#L129) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:135-137](../src/runtime.ts#L135) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:139-143](../src/runtime.ts#L139) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:145-149](../src/runtime.ts#L145) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:151-155](../src/runtime.ts#L151) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:157-162](../src/runtime.ts#L157) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:164-169](../src/runtime.ts#L164) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:171-176](../src/runtime.ts#L171) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:178-183](../src/runtime.ts#L178) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:186-192](../src/runtime.ts#L186) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:195-327](../src/runtime.ts#L195) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:205-227](../src/runtime.ts#L205) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:229-241](../src/runtime.ts#L229) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:243-255](../src/runtime.ts#L243) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:257-260](../src/runtime.ts#L257) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:262-264](../src/runtime.ts#L262) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:266-268](../src/runtime.ts#L266) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:270-272](../src/runtime.ts#L270) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:274-277](../src/runtime.ts#L274) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:279-282](../src/runtime.ts#L279) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:284-287](../src/runtime.ts#L284) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:289-292](../src/runtime.ts#L289) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:294-296](../src/runtime.ts#L294) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:298-300](../src/runtime.ts#L298) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:302-305](../src/runtime.ts#L302) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:307-312](../src/runtime.ts#L307) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:314-319](../src/runtime.ts#L314) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:321-326](../src/runtime.ts#L321) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:329-360](../src/runtime.ts#L329) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:330-359](../src/runtime.ts#L330) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:362-465](../src/runtime.ts#L362) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:370-394](../src/runtime.ts#L370) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:396-453](../src/runtime.ts#L396) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:455-457](../src/runtime.ts#L455) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:459-464](../src/runtime.ts#L459) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:467-1504](../src/runtime.ts#L467) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:498-533](../src/runtime.ts#L498) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:536-635](../src/runtime.ts#L536) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:637-757](../src/runtime.ts#L637) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:759-846](../src/runtime.ts#L759) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:848-870](../src/runtime.ts#L848) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:872-968](../src/runtime.ts#L872) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:970-1055](../src/runtime.ts#L970) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1057-1093](../src/runtime.ts#L1057) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1095-1132](../src/runtime.ts#L1095) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1134-1181](../src/runtime.ts#L1134) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1183-1203](../src/runtime.ts#L1183) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1205-1246](../src/runtime.ts#L1205) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1248-1282](../src/runtime.ts#L1248) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1284-1309](../src/runtime.ts#L1284) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1311-1319](../src/runtime.ts#L1311) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1321-1343](../src/runtime.ts#L1321) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1345-1361](../src/runtime.ts#L1345) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1363-1372](../src/runtime.ts#L1363) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1374-1446](../src/runtime.ts#L1374) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1448-1476](../src/runtime.ts#L1448) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1478-1503](../src/runtime.ts#L1478) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1506-1513](../src/runtime.ts#L1506) |
| `now` | 函数 | 否 | [src/runtime.ts:1515-1517](../src/runtime.ts#L1515) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1519-1531](../src/runtime.ts#L1519) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1533-1549](../src/runtime.ts#L1533) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1551-1577](../src/runtime.ts#L1551) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1579-1590](../src/runtime.ts#L1579) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1592-1610](../src/runtime.ts#L1592) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1612-1623](../src/runtime.ts#L1612) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1625-1630](../src/runtime.ts#L1625) |
| `clone` | 函数 | 否 | [src/runtime.ts:1632-1634](../src/runtime.ts#L1632) |

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
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:178-196](../src/types.ts#L178) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:199-209](../src/types.ts#L199) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:212-229](../src/types.ts#L212) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:231-239](../src/types.ts#L231) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:245-270](../src/types.ts#L245) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:273-280](../src/types.ts#L273) |
| `RunStore` | 接口 | 是 | [src/types.ts:282-297](../src/types.ts#L282) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:299-311](../src/types.ts#L299) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:313-324](../src/types.ts#L313) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:326-330](../src/types.ts#L326) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:332-348](../src/types.ts#L332) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:351-359](../src/types.ts#L351) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:361-377](../src/types.ts#L361) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:379-381](../src/types.ts#L379) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:383-386](../src/types.ts#L383) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:388-390](../src/types.ts#L388) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:392-399](../src/types.ts#L392) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:401-413](../src/types.ts#L401) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:415-432](../src/types.ts#L415) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:434-436](../src/types.ts#L434) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:438-444](../src/types.ts#L438) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:446-448](../src/types.ts#L446) |
