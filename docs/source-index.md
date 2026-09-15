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
| `flowExtension` | 函数 | 是 | [src/extension.ts:34-419](../src/extension.ts#L34) |
| `loadFlow` | 函数 | 否 | [src/extension.ts:421-423](../src/extension.ts#L421) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:425-431](../src/extension.ts#L425) |
| `publishHostObservation` | 函数 | 否 | [src/extension.ts:433-459](../src/extension.ts#L433) |
| `renderRunSnapshot` | 函数 | 否 | [src/extension.ts:461-481](../src/extension.ts#L461) |

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
| `FlowRunInspector` | 类 | 是 | [src/observability.ts:83-174](../src/observability.ts#L83) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability.ts:102-136](../src/observability.ts#L102) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:138-173](../src/observability.ts#L138) |
| `FlowRunObservation` | 接口 | 是 | [src/observability.ts:176-179](../src/observability.ts#L176) |
| `FlowRuntime` | 类 | 是 | [src/observability.ts:183-242](../src/observability.ts#L183) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability.ts:195-197](../src/observability.ts#L195) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:199-204](../src/observability.ts#L199) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability.ts:206-211](../src/observability.ts#L206) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability.ts:214-241](../src/observability.ts#L214) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability.ts:244-268](../src/observability.ts#L244) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability.ts:270-275](../src/observability.ts#L270) |
| `formatDestination` | 函数 | 否 | [src/observability.ts:277-282](../src/observability.ts#L277) |
| `formatValue` | 函数 | 否 | [src/observability.ts:284-286](../src/observability.ts#L284) |
| `isEvidenceReader` | 函数 | 否 | [src/observability.ts:288-292](../src/observability.ts#L288) |
| `bySequence` | 函数 | 否 | [src/observability.ts:294-296](../src/observability.ts#L294) |
| `toRunSummary` | 函数 | 否 | [src/observability.ts:298-312](../src/observability.ts#L298) |
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:314-332](../src/observability.ts#L314) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:334-362](../src/observability.ts#L334) |
| `evidenceSummary` | 函数 | 否 | [src/observability.ts:364-372](../src/observability.ts#L364) |
| `toCommandResult` | 函数 | 否 | [src/observability.ts:374-392](../src/observability.ts#L374) |
| `isRecord` | 函数 | 否 | [src/observability.ts:394-398](../src/observability.ts#L394) |

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
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:47-180](../src/runtime.ts#L47) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:54-68](../src/runtime.ts#L54) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:70-98](../src/runtime.ts#L70) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:100-117](../src/runtime.ts#L100) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:119-122](../src/runtime.ts#L119) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:124-127](../src/runtime.ts#L124) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:129-133](../src/runtime.ts#L129) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:135-139](../src/runtime.ts#L135) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:141-145](../src/runtime.ts#L141) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:147-151](../src/runtime.ts#L147) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:153-158](../src/runtime.ts#L153) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:160-165](../src/runtime.ts#L160) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:167-172](../src/runtime.ts#L167) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:174-179](../src/runtime.ts#L174) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:182-188](../src/runtime.ts#L182) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:191-318](../src/runtime.ts#L191) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:201-223](../src/runtime.ts#L201) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:225-237](../src/runtime.ts#L225) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:239-251](../src/runtime.ts#L239) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:253-256](../src/runtime.ts#L253) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:258-260](../src/runtime.ts#L258) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:262-264](../src/runtime.ts#L262) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:266-268](../src/runtime.ts#L266) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:270-273](../src/runtime.ts#L270) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:275-278](../src/runtime.ts#L275) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:280-283](../src/runtime.ts#L280) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:285-287](../src/runtime.ts#L285) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:289-291](../src/runtime.ts#L289) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:293-296](../src/runtime.ts#L293) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:298-303](../src/runtime.ts#L298) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:305-310](../src/runtime.ts#L305) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:312-317](../src/runtime.ts#L312) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:320-351](../src/runtime.ts#L320) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:321-350](../src/runtime.ts#L321) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:353-456](../src/runtime.ts#L353) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:361-385](../src/runtime.ts#L361) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:387-444](../src/runtime.ts#L387) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:446-448](../src/runtime.ts#L446) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:450-455](../src/runtime.ts#L450) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:458-1495](../src/runtime.ts#L458) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:489-524](../src/runtime.ts#L489) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:527-626](../src/runtime.ts#L527) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:628-748](../src/runtime.ts#L628) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:750-837](../src/runtime.ts#L750) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:839-861](../src/runtime.ts#L839) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:863-959](../src/runtime.ts#L863) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:961-1046](../src/runtime.ts#L961) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1048-1084](../src/runtime.ts#L1048) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1086-1123](../src/runtime.ts#L1086) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1125-1172](../src/runtime.ts#L1125) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1174-1194](../src/runtime.ts#L1174) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1196-1237](../src/runtime.ts#L1196) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1239-1273](../src/runtime.ts#L1239) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1275-1300](../src/runtime.ts#L1275) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1302-1310](../src/runtime.ts#L1302) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1312-1334](../src/runtime.ts#L1312) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1336-1352](../src/runtime.ts#L1336) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1354-1363](../src/runtime.ts#L1354) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1365-1437](../src/runtime.ts#L1365) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1439-1467](../src/runtime.ts#L1439) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1469-1494](../src/runtime.ts#L1469) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1497-1504](../src/runtime.ts#L1497) |
| `now` | 函数 | 否 | [src/runtime.ts:1506-1508](../src/runtime.ts#L1506) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1510-1522](../src/runtime.ts#L1510) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1524-1540](../src/runtime.ts#L1524) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1542-1568](../src/runtime.ts#L1542) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1570-1581](../src/runtime.ts#L1570) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1583-1601](../src/runtime.ts#L1583) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1603-1614](../src/runtime.ts#L1603) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1616-1621](../src/runtime.ts#L1616) |
| `clone` | 函数 | 否 | [src/runtime.ts:1623-1625](../src/runtime.ts#L1623) |

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
| `RunStore` | 接口 | 是 | [src/types.ts:282-296](../src/types.ts#L282) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:298-310](../src/types.ts#L298) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:312-323](../src/types.ts#L312) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:325-329](../src/types.ts#L325) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:331-347](../src/types.ts#L331) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:350-358](../src/types.ts#L350) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:360-376](../src/types.ts#L360) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:378-380](../src/types.ts#L378) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:382-385](../src/types.ts#L382) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:387-389](../src/types.ts#L387) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:391-397](../src/types.ts#L391) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:399-411](../src/types.ts#L399) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:413-430](../src/types.ts#L413) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:432-434](../src/types.ts#L432) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:436-442](../src/types.ts#L436) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:444-446](../src/types.ts#L444) |
