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
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:248-274](../src/types.ts#L248) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:277-284](../src/types.ts#L277) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:287-293](../src/types.ts#L287) |
| `RunStore` | 接口 | 是 | [src/types.ts:295-311](../src/types.ts#L295) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:313-325](../src/types.ts#L313) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:327-339](../src/types.ts#L327) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:341-345](../src/types.ts#L341) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:347-364](../src/types.ts#L347) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:367-375](../src/types.ts#L367) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:377-394](../src/types.ts#L377) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:396-398](../src/types.ts#L396) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:400-403](../src/types.ts#L400) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:405-407](../src/types.ts#L405) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:409-416](../src/types.ts#L409) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:418-430](../src/types.ts#L418) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:432-451](../src/types.ts#L432) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:453-455](../src/types.ts#L453) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:457-463](../src/types.ts#L457) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:465-467](../src/types.ts#L465) |
