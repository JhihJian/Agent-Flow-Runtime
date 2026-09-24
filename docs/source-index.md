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

依赖：`node:fs/promises`、`node:path`、`./flow-loader.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowListing` | 接口 | 是 | [src/directory.ts:6-11](../src/directory.ts#L6) |
| `FlowDirectory` | 类 | 是 | [src/directory.ts:14-68](../src/directory.ts#L14) |
| `FlowDirectory.list` | 方法 | 是 | [src/directory.ts:21-38](../src/directory.ts#L21) |
| `FlowDirectory.load` | 方法 | 是 | [src/directory.ts:40-46](../src/directory.ts#L40) |
| `FlowDirectory.discover` | 方法 | 否 | [src/directory.ts:48-67](../src/directory.ts#L48) |

## [src/extension.ts](../src/extension.ts)

依赖：`node:crypto`、`node:path`、`@earendil-works/pi-coding-agent`、`./cli-state.ts`、`./flow-loader.ts`、`./observability.ts`、`./pi.ts`、`./runtime.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `flowExtension` | 函数 | 是 | [src/extension.ts:35-474](../src/extension.ts#L35) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:476-482](../src/extension.ts#L476) |
| `flowEventMessage` | 函数 | 否 | [src/extension.ts:484-491](../src/extension.ts#L484) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:493-495](../src/extension.ts#L493) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:497-502](../src/extension.ts#L497) |

## [src/flow-loader.ts](../src/flow-loader.ts)

依赖：`node:fs/promises`、`node:path`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `loadFlow` | 函数 | 是 | [src/flow-loader.ts:23-61](../src/flow-loader.ts#L23) |
| `resolvePromptResources` | 函数 | 是 | [src/flow-loader.ts:64-74](../src/flow-loader.ts#L64) |
| `resolveCommandResources` | 函数 | 是 | [src/flow-loader.ts:77-90](../src/flow-loader.ts#L77) |
| `validatePackageResources` | 函数 | 否 | [src/flow-loader.ts:92-120](../src/flow-loader.ts#L92) |
| `validateResource` | 函数 | 否 | [src/flow-loader.ts:122-143](../src/flow-loader.ts#L122) |
| `resolveResource` | 函数 | 否 | [src/flow-loader.ts:145-153](../src/flow-loader.ts#L145) |
| `resourcePath` | 函数 | 否 | [src/flow-loader.ts:155-165](../src/flow-loader.ts#L155) |
| `isResourcePath` | 函数 | 否 | [src/flow-loader.ts:167-176](../src/flow-loader.ts#L167) |
| `isInside` | 函数 | 否 | [src/flow-loader.ts:178-181](../src/flow-loader.ts#L178) |

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

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/parser.ts:25-29](../src/parser.ts#L25) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:31-34](../src/parser.ts#L31) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:36-41](../src/parser.ts#L36) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:43-77](../src/parser.ts#L43) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:79-104](../src/parser.ts#L79) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:106-114](../src/parser.ts#L106) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:116-156](../src/parser.ts#L116) |
| `parseSections` | 函数 | 否 | [src/parser.ts:158-185](../src/parser.ts#L158) |
| `parseAction` | 函数 | 否 | [src/parser.ts:187-202](../src/parser.ts#L187) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:204-246](../src/parser.ts#L204) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:248-261](../src/parser.ts#L248) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:263-280](../src/parser.ts#L263) |
| `parseResults` | 函数 | 否 | [src/parser.ts:282-302](../src/parser.ts#L282) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:304-366](../src/parser.ts#L304) |
| `destination` | 函数 | 否 | [src/parser.ts:368-377](../src/parser.ts#L368) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:379-455](../src/parser.ts#L379) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:457-479](../src/parser.ts#L457) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:481-492](../src/parser.ts#L481) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:494-498](../src/parser.ts#L494) |
| `isRecord` | 函数 | 否 | [src/parser.ts:500-502](../src/parser.ts#L500) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:504-531](../src/parser.ts#L504) |

## [src/pi.ts](../src/pi.ts)

依赖：`@earendil-works/pi-coding-agent`、`typebox`、`./observability.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:20-26](../src/pi.ts#L20) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:28-33](../src/pi.ts#L28) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:35-40](../src/pi.ts#L35) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:42-51](../src/pi.ts#L42) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:53-57](../src/pi.ts#L53) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:60-347](../src/pi.ts#L60) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:70-79](../src/pi.ts#L70) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:81-105](../src/pi.ts#L81) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:107-140](../src/pi.ts#L107) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:142-157](../src/pi.ts#L142) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:159-167](../src/pi.ts#L159) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:170-178](../src/pi.ts#L170) |
| `PiAgentIntegrationAdapter.hasPendingCliOutcome` | 方法 | 是 | [src/pi.ts:181-183](../src/pi.ts#L181) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:186-214](../src/pi.ts#L186) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:216-239](../src/pi.ts#L216) |
| `PiAgentIntegrationAdapter.createCliConnection` | 方法 | 否 | [src/pi.ts:241-250](../src/pi.ts#L241) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:252-274](../src/pi.ts#L252) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:276-312](../src/pi.ts#L276) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:314-329](../src/pi.ts#L314) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:332-346](../src/pi.ts#L332) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:349-381](../src/pi.ts#L349) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi.ts:384-410](../src/pi.ts#L384) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:412-422](../src/pi.ts#L412) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:424-429](../src/pi.ts#L424) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:431-441](../src/pi.ts#L431) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:443-471](../src/pi.ts#L443) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:473-477](../src/pi.ts#L473) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./flow-loader.ts`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/runtime.ts:39-39](../src/runtime.ts#L39) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:41-52](../src/runtime.ts#L41) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:54-213](../src/runtime.ts#L54) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:61-75](../src/runtime.ts#L61) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:77-105](../src/runtime.ts#L77) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:107-124](../src/runtime.ts#L107) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:126-129](../src/runtime.ts#L126) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:131-134](../src/runtime.ts#L131) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:136-146](../src/runtime.ts#L136) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:148-156](../src/runtime.ts#L148) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:158-162](../src/runtime.ts#L158) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:164-166](../src/runtime.ts#L164) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:168-172](../src/runtime.ts#L168) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:174-178](../src/runtime.ts#L174) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:180-184](../src/runtime.ts#L180) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:186-191](../src/runtime.ts#L186) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:193-198](../src/runtime.ts#L193) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:200-205](../src/runtime.ts#L200) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:207-212](../src/runtime.ts#L207) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:215-221](../src/runtime.ts#L215) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:224-378](../src/runtime.ts#L224) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:235-249](../src/runtime.ts#L235) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:251-271](../src/runtime.ts#L251) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:273-285](../src/runtime.ts#L273) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:287-299](../src/runtime.ts#L287) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:301-304](../src/runtime.ts#L301) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:306-308](../src/runtime.ts#L306) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:310-312](../src/runtime.ts#L310) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:314-316](../src/runtime.ts#L314) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:318-321](../src/runtime.ts#L318) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:323-328](../src/runtime.ts#L323) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:330-333](../src/runtime.ts#L330) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:335-338](../src/runtime.ts#L335) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:340-343](../src/runtime.ts#L340) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:345-347](../src/runtime.ts#L345) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:349-351](../src/runtime.ts#L349) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:353-356](../src/runtime.ts#L353) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:358-363](../src/runtime.ts#L358) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:365-370](../src/runtime.ts#L365) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:372-377](../src/runtime.ts#L372) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:380-411](../src/runtime.ts#L380) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:381-410](../src/runtime.ts#L381) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:413-516](../src/runtime.ts#L413) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:421-445](../src/runtime.ts#L421) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:447-504](../src/runtime.ts#L447) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:506-508](../src/runtime.ts#L506) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:510-515](../src/runtime.ts#L510) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:518-1602](../src/runtime.ts#L518) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:552-591](../src/runtime.ts#L552) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:594-693](../src/runtime.ts#L594) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:695-815](../src/runtime.ts#L695) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:817-904](../src/runtime.ts#L817) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:906-928](../src/runtime.ts#L906) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:930-1029](../src/runtime.ts#L930) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1031-1124](../src/runtime.ts#L1031) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1126-1163](../src/runtime.ts#L1126) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1165-1203](../src/runtime.ts#L1165) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1205-1252](../src/runtime.ts#L1205) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1254-1274](../src/runtime.ts#L1254) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1276-1321](../src/runtime.ts#L1276) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1323-1369](../src/runtime.ts#L1323) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1371-1396](../src/runtime.ts#L1371) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1398-1406](../src/runtime.ts#L1398) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1408-1430](../src/runtime.ts#L1408) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1432-1448](../src/runtime.ts#L1432) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1450-1459](../src/runtime.ts#L1450) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1461-1543](../src/runtime.ts#L1461) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1545-1574](../src/runtime.ts#L1545) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1576-1601](../src/runtime.ts#L1576) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1604-1611](../src/runtime.ts#L1604) |
| `now` | 函数 | 否 | [src/runtime.ts:1613-1615](../src/runtime.ts#L1613) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1617-1629](../src/runtime.ts#L1617) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1631-1647](../src/runtime.ts#L1631) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1649-1675](../src/runtime.ts#L1649) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1677-1688](../src/runtime.ts#L1677) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:1690-1694](../src/runtime.ts#L1690) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1696-1714](../src/runtime.ts#L1696) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1716-1728](../src/runtime.ts#L1716) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1730-1735](../src/runtime.ts#L1730) |
| `clone` | 函数 | 否 | [src/runtime.ts:1737-1739](../src/runtime.ts#L1737) |

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
| `FlowResourceContext` | 接口 | 是 | [src/types.ts:61-64](../src/types.ts#L61) |
| `LoadedFlow` | 接口 | 是 | [src/types.ts:67-71](../src/types.ts#L67) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:73-76](../src/types.ts#L73) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:78-81](../src/types.ts#L78) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:83-87](../src/types.ts#L83) |
| `NodeSession` | 接口 | 是 | [src/types.ts:89-93](../src/types.ts#L89) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:95-99](../src/types.ts#L95) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:101-105](../src/types.ts#L101) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:107-126](../src/types.ts#L107) |
| `CommandResult` | 接口 | 是 | [src/types.ts:128-133](../src/types.ts#L128) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:135-137](../src/types.ts#L135) |
| `RunStatus` | 类型 | 是 | [src/types.ts:139-139](../src/types.ts#L139) |
| `RunPhase` | 类型 | 是 | [src/types.ts:141-148](../src/types.ts#L141) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:150-150](../src/types.ts#L150) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:152-157](../src/types.ts#L152) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:159-169](../src/types.ts#L159) |
| `FlowError` | 接口 | 是 | [src/types.ts:171-174](../src/types.ts#L171) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:176-188](../src/types.ts#L176) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:191-212](../src/types.ts#L191) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:215-225](../src/types.ts#L215) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:228-245](../src/types.ts#L228) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:247-255](../src/types.ts#L247) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:261-287](../src/types.ts#L261) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:290-297](../src/types.ts#L290) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:300-306](../src/types.ts#L300) |
| `RunStore` | 接口 | 是 | [src/types.ts:308-324](../src/types.ts#L308) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:326-338](../src/types.ts#L326) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:340-352](../src/types.ts#L340) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:354-358](../src/types.ts#L354) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:360-377](../src/types.ts#L360) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:380-388](../src/types.ts#L380) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:390-407](../src/types.ts#L390) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:409-411](../src/types.ts#L409) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:413-416](../src/types.ts#L413) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:418-420](../src/types.ts#L418) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:422-429](../src/types.ts#L422) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:431-443](../src/types.ts#L431) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:445-464](../src/types.ts#L445) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:466-468](../src/types.ts#L466) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:470-476](../src/types.ts#L470) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:478-480](../src/types.ts#L478) |
