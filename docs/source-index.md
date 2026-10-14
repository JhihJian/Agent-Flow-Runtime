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

依赖：`node:crypto`、`node:fs/promises`、`node:path`、`@earendil-works/pi-coding-agent`、`./cli-state.ts`、`./flow-loader.ts`、`./observability.ts`、`./pi.ts`、`./runtime.ts`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `flowExtension` | 函数 | 是 | [src/extension.ts:37-590](../src/extension.ts#L37) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:592-598](../src/extension.ts#L592) |
| `flowEventMessage` | 函数 | 否 | [src/extension.ts:600-607](../src/extension.ts#L600) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:609-611](../src/extension.ts#L609) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:613-618](../src/extension.ts#L613) |

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
| `FlowRunInspectorOptions` | 接口 | 是 | [src/observability.ts:20-23](../src/observability.ts#L20) |
| `FlowObservationPublisher` | 类 | 是 | [src/observability.ts:26-75](../src/observability.ts#L26) |
| `FlowObservationPublisher.publish` | 方法 | 是 | [src/observability.ts:40-53](../src/observability.ts#L40) |
| `FlowObservationPublisher.subscribe` | 方法 | 是 | [src/observability.ts:55-74](../src/observability.ts#L55) |
| `FlowRunInspector` | 类 | 是 | [src/observability.ts:82-175](../src/observability.ts#L82) |
| `FlowRunInspector.listRecentRuns` | 方法 | 是 | [src/observability.ts:101-107](../src/observability.ts#L101) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability.ts:109-138](../src/observability.ts#L109) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:140-174](../src/observability.ts#L140) |
| `FlowRunObservation` | 接口 | 是 | [src/observability.ts:177-180](../src/observability.ts#L177) |
| `FlowRuntime` | 类 | 是 | [src/observability.ts:184-247](../src/observability.ts#L184) |
| `FlowRuntime.listRecentRuns` | 方法 | 是 | [src/observability.ts:196-198](../src/observability.ts#L196) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability.ts:200-202](../src/observability.ts#L200) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability.ts:204-209](../src/observability.ts#L204) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability.ts:211-216](../src/observability.ts#L211) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability.ts:219-246](../src/observability.ts#L219) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability.ts:249-275](../src/observability.ts#L249) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability.ts:277-282](../src/observability.ts#L277) |
| `formatDestination` | 函数 | 否 | [src/observability.ts:284-289](../src/observability.ts#L284) |
| `isEvidenceReader` | 函数 | 否 | [src/observability.ts:291-295](../src/observability.ts#L291) |
| `bySequence` | 函数 | 否 | [src/observability.ts:297-299](../src/observability.ts#L297) |
| `toRunSummary` | 函数 | 否 | [src/observability.ts:301-315](../src/observability.ts#L301) |
| `toNodeRunView` | 函数 | 否 | [src/observability.ts:317-337](../src/observability.ts#L317) |
| `locateCurrent` | 函数 | 否 | [src/observability.ts:339-368](../src/observability.ts#L339) |
| `evidenceSummary` | 函数 | 否 | [src/observability.ts:370-378](../src/observability.ts#L370) |

## [src/parser.ts](../src/parser.ts)

依赖：`yaml`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/parser.ts:40-44](../src/parser.ts#L40) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:46-50](../src/parser.ts#L46) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:52-57](../src/parser.ts#L52) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:59-124](../src/parser.ts#L59) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:126-166](../src/parser.ts#L126) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:168-176](../src/parser.ts#L168) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:178-218](../src/parser.ts#L178) |
| `parseSections` | 函数 | 否 | [src/parser.ts:220-250](../src/parser.ts#L220) |
| `parseAction` | 函数 | 否 | [src/parser.ts:252-268](../src/parser.ts#L252) |
| `parseFlowReferenceAction` | 函数 | 否 | [src/parser.ts:270-307](../src/parser.ts#L270) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:309-361](../src/parser.ts#L309) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:363-376](../src/parser.ts#L363) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:378-397](../src/parser.ts#L378) |
| `parseResults` | 函数 | 否 | [src/parser.ts:399-421](../src/parser.ts#L399) |
| `parseResultVariables` | 函数 | 否 | [src/parser.ts:423-469](../src/parser.ts#L423) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:471-537](../src/parser.ts#L471) |
| `wireFlowReferenceNode` | 函数 | 否 | [src/parser.ts:540-594](../src/parser.ts#L540) |
| `destination` | 函数 | 否 | [src/parser.ts:596-605](../src/parser.ts#L596) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:607-682](../src/parser.ts#L607) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:684-706](../src/parser.ts#L684) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:708-719](../src/parser.ts#L708) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:721-725](../src/parser.ts#L721) |
| `isRecord` | 函数 | 否 | [src/parser.ts:727-729](../src/parser.ts#L727) |
| `TemplateContext` | 接口 | 否 | [src/parser.ts:731-735](../src/parser.ts#L731) |
| `templateReferences` | 函数 | 否 | [src/parser.ts:741-767](../src/parser.ts#L741) |
| `stringifyTemplateValue` | 函数 | 否 | [src/parser.ts:769-771](../src/parser.ts#L769) |
| `lookupVariable` | 函数 | 否 | [src/parser.ts:773-781](../src/parser.ts#L773) |
| `resolveReference` | 函数 | 否 | [src/parser.ts:783-798](../src/parser.ts#L783) |
| `renderString` | 函数 | 否 | [src/parser.ts:800-816](../src/parser.ts#L800) |
| `validateTemplates` | 函数 | 否 | [src/parser.ts:818-837](../src/parser.ts#L818) |
| `renderTemplate` | 函数 | 是 | [src/parser.ts:840-855](../src/parser.ts#L840) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:857-875](../src/parser.ts#L857) |
| `renderFlowReferenceTask` | 函数 | 是 | [src/parser.ts:878-884](../src/parser.ts#L878) |

## [src/pi.ts](../src/pi.ts)

依赖：`@earendil-works/pi-coding-agent`、`typebox`、`./observability.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:22-28](../src/pi.ts#L22) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:30-35](../src/pi.ts#L30) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:37-47](../src/pi.ts#L37) |
| `flowOutcomeParametersSchema` | 函数 | 否 | [src/pi.ts:61-71](../src/pi.ts#L61) |
| `validateVariableName` | 函数 | 否 | [src/pi.ts:73-80](../src/pi.ts#L73) |
| `validateJsonValue` | 函数 | 否 | [src/pi.ts:82-119](../src/pi.ts#L82) |
| `submissionVariables` | 函数 | 否 | [src/pi.ts:121-135](../src/pi.ts#L121) |
| `missingOutcomeRetryPrompt` | 函数 | 否 | [src/pi.ts:139-141](../src/pi.ts#L139) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:143-152](../src/pi.ts#L143) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:154-158](../src/pi.ts#L154) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:161-470](../src/pi.ts#L161) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:171-180](../src/pi.ts#L171) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:182-206](../src/pi.ts#L182) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:208-246](../src/pi.ts#L208) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:248-263](../src/pi.ts#L248) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:265-273](../src/pi.ts#L265) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:276-290](../src/pi.ts#L276) |
| `PiAgentIntegrationAdapter.hasPendingCliOutcome` | 方法 | 是 | [src/pi.ts:293-295](../src/pi.ts#L293) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:298-340](../src/pi.ts#L298) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:342-365](../src/pi.ts#L342) |
| `PiAgentIntegrationAdapter.createCliConnection` | 方法 | 否 | [src/pi.ts:367-376](../src/pi.ts#L367) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:378-402](../src/pi.ts#L378) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:404-435](../src/pi.ts#L404) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:437-452](../src/pi.ts#L437) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:455-469](../src/pi.ts#L455) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:472-503](../src/pi.ts#L472) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi.ts:506-532](../src/pi.ts#L506) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:534-544](../src/pi.ts#L534) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:546-551](../src/pi.ts#L546) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:553-563](../src/pi.ts#L553) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:565-593](../src/pi.ts#L565) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:595-599](../src/pi.ts#L595) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./flow-loader.ts`、`./parser.ts`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/runtime.ts:49-49](../src/runtime.ts#L49) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:51-62](../src/runtime.ts#L51) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:64-230](../src/runtime.ts#L64) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:71-85](../src/runtime.ts#L71) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:87-115](../src/runtime.ts#L87) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:117-134](../src/runtime.ts#L117) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:136-139](../src/runtime.ts#L136) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:141-144](../src/runtime.ts#L141) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:146-156](../src/runtime.ts#L146) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:158-166](../src/runtime.ts#L158) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:168-172](../src/runtime.ts#L168) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:174-176](../src/runtime.ts#L174) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:178-182](../src/runtime.ts#L178) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:184-188](../src/runtime.ts#L184) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:190-194](../src/runtime.ts#L190) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:196-201](../src/runtime.ts#L196) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:203-208](../src/runtime.ts#L203) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:210-215](../src/runtime.ts#L210) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:217-222](../src/runtime.ts#L217) |
| `InMemoryRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:224-229](../src/runtime.ts#L224) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:232-238](../src/runtime.ts#L232) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:241-400](../src/runtime.ts#L241) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:252-266](../src/runtime.ts#L252) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:268-288](../src/runtime.ts#L268) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:290-302](../src/runtime.ts#L290) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:304-316](../src/runtime.ts#L304) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:318-321](../src/runtime.ts#L318) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:323-325](../src/runtime.ts#L323) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:327-329](../src/runtime.ts#L327) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:331-333](../src/runtime.ts#L331) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:335-338](../src/runtime.ts#L335) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:340-345](../src/runtime.ts#L340) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:347-350](../src/runtime.ts#L347) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:352-355](../src/runtime.ts#L352) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:357-360](../src/runtime.ts#L357) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:362-364](../src/runtime.ts#L362) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:366-368](../src/runtime.ts#L366) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:370-373](../src/runtime.ts#L370) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:375-380](../src/runtime.ts#L375) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:382-387](../src/runtime.ts#L382) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:389-394](../src/runtime.ts#L389) |
| `JsonFileRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:396-399](../src/runtime.ts#L396) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:402-433](../src/runtime.ts#L402) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:403-432](../src/runtime.ts#L403) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:435-541](../src/runtime.ts#L435) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:443-467](../src/runtime.ts#L443) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:469-529](../src/runtime.ts#L469) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:531-533](../src/runtime.ts#L531) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:535-540](../src/runtime.ts#L535) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:543-1966](../src/runtime.ts#L543) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:581-636](../src/runtime.ts#L581) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:639-650](../src/runtime.ts#L639) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/runtime.ts:653-755](../src/runtime.ts#L653) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:757-885](../src/runtime.ts#L757) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:887-997](../src/runtime.ts#L887) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:999-1030](../src/runtime.ts#L999) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:1032-1132](../src/runtime.ts#L1032) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1134-1242](../src/runtime.ts#L1134) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/runtime.ts:1245-1265](../src/runtime.ts#L1245) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/runtime.ts:1267-1300](../src/runtime.ts#L1267) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/runtime.ts:1303-1323](../src/runtime.ts#L1303) |
| `FlowCoordinator.childResultVariables` | 方法 | 否 | [src/runtime.ts:1325-1341](../src/runtime.ts#L1325) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/runtime.ts:1343-1354](../src/runtime.ts#L1343) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/runtime.ts:1357-1429](../src/runtime.ts#L1357) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1431-1486](../src/runtime.ts#L1431) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1488-1526](../src/runtime.ts#L1488) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1528-1576](../src/runtime.ts#L1528) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1578-1598](../src/runtime.ts#L1578) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1600-1646](../src/runtime.ts#L1600) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/runtime.ts:1649-1685](../src/runtime.ts#L1649) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1687-1733](../src/runtime.ts#L1687) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1735-1760](../src/runtime.ts#L1735) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1762-1770](../src/runtime.ts#L1762) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1772-1794](../src/runtime.ts#L1772) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1796-1812](../src/runtime.ts#L1796) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1814-1823](../src/runtime.ts#L1814) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1825-1907](../src/runtime.ts#L1825) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1909-1938](../src/runtime.ts#L1909) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1940-1965](../src/runtime.ts#L1940) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1968-1975](../src/runtime.ts#L1968) |
| `now` | 函数 | 否 | [src/runtime.ts:1977-1979](../src/runtime.ts#L1977) |
| `initializeVariables` | 函数 | 否 | [src/runtime.ts:1981-2007](../src/runtime.ts#L1981) |
| `declaredResultVariables` | 函数 | 否 | [src/runtime.ts:2009-2014](../src/runtime.ts#L2009) |
| `validateOutcomeVariables` | 函数 | 否 | [src/runtime.ts:2016-2041](../src/runtime.ts#L2016) |
| `pickDeclaredGlobalVariables` | 函数 | 否 | [src/runtime.ts:2043-2052](../src/runtime.ts#L2043) |
| `extractNextInput` | 函数 | 否 | [src/runtime.ts:2054-2064](../src/runtime.ts#L2054) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:2066-2078](../src/runtime.ts#L2066) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:2080-2113](../src/runtime.ts#L2080) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:2115-2142](../src/runtime.ts#L2115) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:2144-2155](../src/runtime.ts#L2144) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:2157-2161](../src/runtime.ts#L2157) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:2163-2182](../src/runtime.ts#L2163) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:2184-2196](../src/runtime.ts#L2184) |
| `renderTemplateForAgent` | 函数 | 否 | [src/runtime.ts:2198-2209](../src/runtime.ts#L2198) |
| `parseCommandVariables` | 函数 | 否 | [src/runtime.ts:2211-2241](../src/runtime.ts#L2211) |
| `isFlowValue` | 函数 | 否 | [src/runtime.ts:2243-2253](../src/runtime.ts#L2243) |
| `isFlowValueRecord` | 函数 | 否 | [src/runtime.ts:2255-2262](../src/runtime.ts#L2255) |
| `mergeParallelVariables` | 函数 | 否 | [src/runtime.ts:2264-2283](../src/runtime.ts#L2264) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:2285-2290](../src/runtime.ts#L2285) |
| `clone` | 函数 | 否 | [src/runtime.ts:2292-2294](../src/runtime.ts#L2292) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `FlowVariableDeclaration` | 类型 | 是 | [src/types.ts:9-12](../src/types.ts#L9) |
| `FlowVariableDeclarations` | 类型 | 是 | [src/types.ts:14-14](../src/types.ts#L14) |
| `FlowVariables` | 类型 | 是 | [src/types.ts:16-16](../src/types.ts#L16) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:18-18](../src/types.ts#L18) |
| `AgentAction` | 接口 | 是 | [src/types.ts:20-23](../src/types.ts#L20) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:25-33](../src/types.ts#L25) |
| `CommandAction` | 接口 | 是 | [src/types.ts:35-39](../src/types.ts#L35) |
| `FlowReferenceAction` | 接口 | 是 | [src/types.ts:41-47](../src/types.ts#L41) |
| `FlowAction` | 类型 | 是 | [src/types.ts:49-49](../src/types.ts#L49) |
| `FlowNode` | 接口 | 是 | [src/types.ts:51-58](../src/types.ts#L51) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:60-63](../src/types.ts#L60) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:65-69](../src/types.ts#L65) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:71-80](../src/types.ts#L71) |
| `FlowResourceContext` | 接口 | 是 | [src/types.ts:83-86](../src/types.ts#L83) |
| `FlowPackage` | 接口 | 是 | [src/types.ts:89-93](../src/types.ts#L89) |
| `LoadedFlow` | 接口 | 是 | [src/types.ts:96-99](../src/types.ts#L96) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:101-104](../src/types.ts#L101) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:106-109](../src/types.ts#L106) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:111-115](../src/types.ts#L111) |
| `NodeSession` | 接口 | 是 | [src/types.ts:117-121](../src/types.ts#L117) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:123-127](../src/types.ts#L123) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:129-133](../src/types.ts#L129) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:135-154](../src/types.ts#L135) |
| `CommandResult` | 接口 | 是 | [src/types.ts:156-161](../src/types.ts#L156) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:163-165](../src/types.ts#L163) |
| `RunStatus` | 类型 | 是 | [src/types.ts:167-167](../src/types.ts#L167) |
| `RunPhase` | 类型 | 是 | [src/types.ts:169-176](../src/types.ts#L169) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:178-178](../src/types.ts#L178) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:180-185](../src/types.ts#L180) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:187-203](../src/types.ts#L187) |
| `FlowError` | 接口 | 是 | [src/types.ts:205-208](../src/types.ts#L205) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:210-222](../src/types.ts#L210) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:225-250](../src/types.ts#L225) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:253-263](../src/types.ts#L253) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:266-284](../src/types.ts#L266) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:286-294](../src/types.ts#L286) |
| `FlowRunInput` | 接口 | 是 | [src/types.ts:296-298](../src/types.ts#L296) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:304-333](../src/types.ts#L304) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:336-343](../src/types.ts#L336) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:346-352](../src/types.ts#L346) |
| `TemplateContext` | 接口 | 是 | [src/types.ts:354-358](../src/types.ts#L354) |
| `RunStore` | 接口 | 是 | [src/types.ts:360-378](../src/types.ts#L360) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:380-391](../src/types.ts#L380) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:393-405](../src/types.ts#L393) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:407-411](../src/types.ts#L407) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:413-431](../src/types.ts#L413) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:434-442](../src/types.ts#L434) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:444-461](../src/types.ts#L444) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:463-465](../src/types.ts#L463) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:467-470](../src/types.ts#L467) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:472-474](../src/types.ts#L472) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:476-483](../src/types.ts#L476) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:485-497](../src/types.ts#L485) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:499-518](../src/types.ts#L499) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:520-522](../src/types.ts#L520) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:524-530](../src/types.ts#L524) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:532-534](../src/types.ts#L532) |

## [src/variables.ts](../src/variables.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `validateVariableName` | 函数 | 是 | [src/variables.ts:10-14](../src/variables.ts#L10) |
| `isRecord` | 函数 | 是 | [src/variables.ts:16-21](../src/variables.ts#L16) |
| `validateFlowValue` | 函数 | 是 | [src/variables.ts:24-37](../src/variables.ts#L24) |
| `validateVariables` | 函数 | 是 | [src/variables.ts:39-45](../src/variables.ts#L39) |
| `validateVariableDeclarations` | 函数 | 是 | [src/variables.ts:48-67](../src/variables.ts#L48) |
