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
| `flowExtension` | 函数 | 是 | [src/extension.ts:35-486](../src/extension.ts#L35) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:488-494](../src/extension.ts#L488) |
| `flowEventMessage` | 函数 | 否 | [src/extension.ts:496-503](../src/extension.ts#L496) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:505-507](../src/extension.ts#L505) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:509-514](../src/extension.ts#L509) |

## [src/flow-loader.ts](../src/flow-loader.ts)

依赖：`node:fs/promises`、`node:path`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `loadFlow` | 函数 | 是 | [src/flow-loader.ts:24-28](../src/flow-loader.ts#L24) |
| `loadFlowPackage` | 函数 | 是 | [src/flow-loader.ts:31-69](../src/flow-loader.ts#L31) |
| `loadReferenceClosure` | 函数 | 否 | [src/flow-loader.ts:75-99](../src/flow-loader.ts#L75) |
| `collectReferenceIds` | 函数 | 否 | [src/flow-loader.ts:101-107](../src/flow-loader.ts#L101) |
| `resolvePromptResources` | 函数 | 是 | [src/flow-loader.ts:110-120](../src/flow-loader.ts#L110) |
| `resolveCommandResources` | 函数 | 是 | [src/flow-loader.ts:123-136](../src/flow-loader.ts#L123) |
| `validatePackageResources` | 函数 | 否 | [src/flow-loader.ts:138-167](../src/flow-loader.ts#L138) |
| `validateResource` | 函数 | 否 | [src/flow-loader.ts:169-190](../src/flow-loader.ts#L169) |
| `resolveResource` | 函数 | 否 | [src/flow-loader.ts:192-200](../src/flow-loader.ts#L192) |
| `resourcePath` | 函数 | 否 | [src/flow-loader.ts:202-212](../src/flow-loader.ts#L202) |
| `isResourcePath` | 函数 | 否 | [src/flow-loader.ts:214-223](../src/flow-loader.ts#L214) |
| `isInside` | 函数 | 否 | [src/flow-loader.ts:225-228](../src/flow-loader.ts#L225) |

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
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:324-344](../src/observability.ts#L324) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:346-375](../src/observability.ts#L346) |
| `evidenceSummary` | 函数 | 否 | [src/observability.ts:377-385](../src/observability.ts#L377) |
| `toCommandResult` | 函数 | 否 | [src/observability.ts:387-405](../src/observability.ts#L387) |
| `isRecord` | 函数 | 否 | [src/observability.ts:407-411](../src/observability.ts#L407) |

## [src/parser.ts](../src/parser.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/parser.ts:32-36](../src/parser.ts#L32) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:38-41](../src/parser.ts#L38) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:43-48](../src/parser.ts#L43) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:50-84](../src/parser.ts#L50) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:86-111](../src/parser.ts#L86) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:113-121](../src/parser.ts#L113) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:123-163](../src/parser.ts#L123) |
| `parseSections` | 函数 | 否 | [src/parser.ts:165-192](../src/parser.ts#L165) |
| `parseAction` | 函数 | 否 | [src/parser.ts:194-210](../src/parser.ts#L194) |
| `parseFlowReferenceAction` | 函数 | 否 | [src/parser.ts:212-240](../src/parser.ts#L212) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:242-284](../src/parser.ts#L242) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:286-299](../src/parser.ts#L286) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:301-318](../src/parser.ts#L301) |
| `parseResults` | 函数 | 否 | [src/parser.ts:320-340](../src/parser.ts#L320) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:342-408](../src/parser.ts#L342) |
| `wireFlowReferenceNode` | 函数 | 否 | [src/parser.ts:411-465](../src/parser.ts#L411) |
| `destination` | 函数 | 否 | [src/parser.ts:467-476](../src/parser.ts#L467) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:478-554](../src/parser.ts#L478) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:556-578](../src/parser.ts#L556) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:580-591](../src/parser.ts#L580) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:593-597](../src/parser.ts#L593) |
| `isRecord` | 函数 | 否 | [src/parser.ts:599-601](../src/parser.ts#L599) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:603-630](../src/parser.ts#L603) |
| `renderFlowReferenceTask` | 函数 | 是 | [src/parser.ts:633-651](../src/parser.ts#L633) |

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
| `FactChanges` | 类型 | 否 | [src/runtime.ts:46-46](../src/runtime.ts#L46) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:48-59](../src/runtime.ts#L48) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:61-227](../src/runtime.ts#L61) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:68-82](../src/runtime.ts#L68) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:84-112](../src/runtime.ts#L84) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:114-131](../src/runtime.ts#L114) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:133-136](../src/runtime.ts#L133) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:138-141](../src/runtime.ts#L138) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:143-153](../src/runtime.ts#L143) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:155-163](../src/runtime.ts#L155) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:165-169](../src/runtime.ts#L165) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:171-173](../src/runtime.ts#L171) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:175-179](../src/runtime.ts#L175) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:181-185](../src/runtime.ts#L181) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:187-191](../src/runtime.ts#L187) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:193-198](../src/runtime.ts#L193) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:200-205](../src/runtime.ts#L200) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:207-212](../src/runtime.ts#L207) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:214-219](../src/runtime.ts#L214) |
| `InMemoryRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:221-226](../src/runtime.ts#L221) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:229-235](../src/runtime.ts#L229) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:238-397](../src/runtime.ts#L238) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:249-263](../src/runtime.ts#L249) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:265-285](../src/runtime.ts#L265) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:287-299](../src/runtime.ts#L287) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:301-313](../src/runtime.ts#L301) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:315-318](../src/runtime.ts#L315) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:320-322](../src/runtime.ts#L320) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:324-326](../src/runtime.ts#L324) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:328-330](../src/runtime.ts#L328) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:332-335](../src/runtime.ts#L332) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:337-342](../src/runtime.ts#L337) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:344-347](../src/runtime.ts#L344) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:349-352](../src/runtime.ts#L349) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:354-357](../src/runtime.ts#L354) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:359-361](../src/runtime.ts#L359) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:363-365](../src/runtime.ts#L363) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:367-370](../src/runtime.ts#L367) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:372-377](../src/runtime.ts#L372) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:379-384](../src/runtime.ts#L379) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:386-391](../src/runtime.ts#L386) |
| `JsonFileRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:393-396](../src/runtime.ts#L393) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:399-430](../src/runtime.ts#L399) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:400-429](../src/runtime.ts#L400) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:432-535](../src/runtime.ts#L432) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:440-464](../src/runtime.ts#L440) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:466-523](../src/runtime.ts#L466) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:525-527](../src/runtime.ts#L525) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:529-534](../src/runtime.ts#L529) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:537-1864](../src/runtime.ts#L537) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:575-618](../src/runtime.ts#L575) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:621-632](../src/runtime.ts#L621) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/runtime.ts:635-737](../src/runtime.ts#L635) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:739-859](../src/runtime.ts#L739) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:861-948](../src/runtime.ts#L861) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:950-972](../src/runtime.ts#L950) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:974-1074](../src/runtime.ts#L974) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1076-1173](../src/runtime.ts#L1076) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/runtime.ts:1176-1189](../src/runtime.ts#L1176) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/runtime.ts:1191-1221](../src/runtime.ts#L1191) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/runtime.ts:1224-1251](../src/runtime.ts#L1224) |
| `FlowCoordinator.childConclusion` | 方法 | 否 | [src/runtime.ts:1254-1259](../src/runtime.ts#L1254) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/runtime.ts:1261-1272](../src/runtime.ts#L1261) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/runtime.ts:1275-1347](../src/runtime.ts#L1275) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1349-1386](../src/runtime.ts#L1349) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1388-1426](../src/runtime.ts#L1388) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1428-1475](../src/runtime.ts#L1428) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1477-1497](../src/runtime.ts#L1477) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1499-1545](../src/runtime.ts#L1499) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/runtime.ts:1548-1583](../src/runtime.ts#L1548) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1585-1631](../src/runtime.ts#L1585) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1633-1658](../src/runtime.ts#L1633) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1660-1668](../src/runtime.ts#L1660) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1670-1692](../src/runtime.ts#L1670) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1694-1710](../src/runtime.ts#L1694) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1712-1721](../src/runtime.ts#L1712) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1723-1805](../src/runtime.ts#L1723) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1807-1836](../src/runtime.ts#L1807) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1838-1863](../src/runtime.ts#L1838) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1866-1873](../src/runtime.ts#L1866) |
| `now` | 函数 | 否 | [src/runtime.ts:1875-1877](../src/runtime.ts#L1875) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1879-1891](../src/runtime.ts#L1879) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1893-1925](../src/runtime.ts#L1893) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1927-1953](../src/runtime.ts#L1927) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1955-1966](../src/runtime.ts#L1955) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:1968-1972](../src/runtime.ts#L1968) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1974-1992](../src/runtime.ts#L1974) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1994-2006](../src/runtime.ts#L1994) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:2008-2013](../src/runtime.ts#L2008) |
| `clone` | 函数 | 否 | [src/runtime.ts:2015-2017](../src/runtime.ts#L2015) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:9-9](../src/types.ts#L9) |
| `AgentAction` | 接口 | 是 | [src/types.ts:11-14](../src/types.ts#L11) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:16-22](../src/types.ts#L16) |
| `CommandAction` | 接口 | 是 | [src/types.ts:24-28](../src/types.ts#L24) |
| `FlowReferenceAction` | 接口 | 是 | [src/types.ts:30-36](../src/types.ts#L30) |
| `FlowAction` | 类型 | 是 | [src/types.ts:38-38](../src/types.ts#L38) |
| `FlowNode` | 接口 | 是 | [src/types.ts:40-46](../src/types.ts#L40) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:48-51](../src/types.ts#L48) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:53-57](../src/types.ts#L53) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:59-66](../src/types.ts#L59) |
| `FlowResourceContext` | 接口 | 是 | [src/types.ts:69-72](../src/types.ts#L69) |
| `FlowPackage` | 接口 | 是 | [src/types.ts:75-79](../src/types.ts#L75) |
| `LoadedFlow` | 接口 | 是 | [src/types.ts:82-85](../src/types.ts#L82) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:87-90](../src/types.ts#L87) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:92-95](../src/types.ts#L92) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:97-101](../src/types.ts#L97) |
| `NodeSession` | 接口 | 是 | [src/types.ts:103-107](../src/types.ts#L103) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:109-113](../src/types.ts#L109) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:115-119](../src/types.ts#L115) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:121-140](../src/types.ts#L121) |
| `CommandResult` | 接口 | 是 | [src/types.ts:142-147](../src/types.ts#L142) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:149-151](../src/types.ts#L149) |
| `RunStatus` | 类型 | 是 | [src/types.ts:153-153](../src/types.ts#L153) |
| `RunPhase` | 类型 | 是 | [src/types.ts:155-162](../src/types.ts#L155) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:164-164](../src/types.ts#L164) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:166-171](../src/types.ts#L166) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:173-184](../src/types.ts#L173) |
| `FlowError` | 接口 | 是 | [src/types.ts:186-189](../src/types.ts#L186) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:191-203](../src/types.ts#L191) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:206-229](../src/types.ts#L206) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:232-242](../src/types.ts#L232) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:245-262](../src/types.ts#L245) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:264-272](../src/types.ts#L264) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:278-307](../src/types.ts#L278) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:310-317](../src/types.ts#L310) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:320-326](../src/types.ts#L320) |
| `RunStore` | 接口 | 是 | [src/types.ts:328-346](../src/types.ts#L328) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:348-360](../src/types.ts#L348) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:362-374](../src/types.ts#L362) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:376-380](../src/types.ts#L376) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:382-400](../src/types.ts#L382) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:403-411](../src/types.ts#L403) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:413-430](../src/types.ts#L413) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:432-434](../src/types.ts#L432) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:436-439](../src/types.ts#L436) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:441-443](../src/types.ts#L441) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:445-452](../src/types.ts#L445) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:454-466](../src/types.ts#L454) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:468-487](../src/types.ts#L468) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:489-491](../src/types.ts#L489) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:493-499](../src/types.ts#L493) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:501-503](../src/types.ts#L501) |
