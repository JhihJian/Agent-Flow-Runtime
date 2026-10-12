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
| `flowExtension` | 函数 | 是 | [src/extension.ts:37-581](../src/extension.ts#L37) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:583-589](../src/extension.ts#L583) |
| `flowEventMessage` | 函数 | 否 | [src/extension.ts:591-598](../src/extension.ts#L591) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:600-602](../src/extension.ts#L600) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:604-609](../src/extension.ts#L604) |

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

依赖：`yaml`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/parser.ts:34-38](../src/parser.ts#L34) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:40-43](../src/parser.ts#L40) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:45-50](../src/parser.ts#L45) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:52-119](../src/parser.ts#L52) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:121-161](../src/parser.ts#L121) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:163-171](../src/parser.ts#L163) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:173-213](../src/parser.ts#L173) |
| `parseSections` | 函数 | 否 | [src/parser.ts:215-242](../src/parser.ts#L215) |
| `parseAction` | 函数 | 否 | [src/parser.ts:244-260](../src/parser.ts#L244) |
| `parseFlowReferenceAction` | 函数 | 否 | [src/parser.ts:262-301](../src/parser.ts#L262) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:303-356](../src/parser.ts#L303) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:358-371](../src/parser.ts#L358) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:373-390](../src/parser.ts#L373) |
| `parseResults` | 函数 | 否 | [src/parser.ts:392-412](../src/parser.ts#L392) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:414-480](../src/parser.ts#L414) |
| `wireFlowReferenceNode` | 函数 | 否 | [src/parser.ts:483-537](../src/parser.ts#L483) |
| `destination` | 函数 | 否 | [src/parser.ts:539-548](../src/parser.ts#L539) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:550-626](../src/parser.ts#L550) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:628-650](../src/parser.ts#L628) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:652-663](../src/parser.ts#L652) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:665-669](../src/parser.ts#L665) |
| `isRecord` | 函数 | 否 | [src/parser.ts:671-673](../src/parser.ts#L671) |
| `TemplateContext` | 接口 | 是 | [src/parser.ts:675-679](../src/parser.ts#L675) |
| `expandSinglePlaceholders` | 函数 | 否 | [src/parser.ts:684-689](../src/parser.ts#L684) |
| `stringifyTemplateValue` | 函数 | 否 | [src/parser.ts:691-693](../src/parser.ts#L691) |
| `lookupVariable` | 函数 | 否 | [src/parser.ts:695-703](../src/parser.ts#L695) |
| `renderString` | 函数 | 否 | [src/parser.ts:705-770](../src/parser.ts#L705) |
| `validateTemplates` | 函数 | 否 | [src/parser.ts:772-795](../src/parser.ts#L772) |
| `renderTemplate` | 函数 | 是 | [src/parser.ts:797-812](../src/parser.ts#L797) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:814-849](../src/parser.ts#L814) |
| `renderFlowReferenceTask` | 函数 | 是 | [src/parser.ts:852-858](../src/parser.ts#L852) |

## [src/pi.ts](../src/pi.ts)

依赖：`@earendil-works/pi-coding-agent`、`typebox`、`./observability.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:23-29](../src/pi.ts#L23) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:31-36](../src/pi.ts#L31) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:38-49](../src/pi.ts#L38) |
| `validateVariableName` | 函数 | 否 | [src/pi.ts:65-72](../src/pi.ts#L65) |
| `validateJsonValue` | 函数 | 否 | [src/pi.ts:74-111](../src/pi.ts#L74) |
| `variablePatch` | 函数 | 否 | [src/pi.ts:113-139](../src/pi.ts#L113) |
| `missingOutcomeRetryPrompt` | 函数 | 否 | [src/pi.ts:143-145](../src/pi.ts#L143) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:147-156](../src/pi.ts#L147) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:158-162](../src/pi.ts#L158) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:165-498](../src/pi.ts#L165) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:175-184](../src/pi.ts#L175) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:186-210](../src/pi.ts#L186) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:212-250](../src/pi.ts#L212) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:252-267](../src/pi.ts#L252) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:269-277](../src/pi.ts#L269) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:280-297](../src/pi.ts#L280) |
| `PiAgentIntegrationAdapter.hasPendingCliOutcome` | 方法 | 是 | [src/pi.ts:300-302](../src/pi.ts#L300) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:305-351](../src/pi.ts#L305) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:353-376](../src/pi.ts#L353) |
| `PiAgentIntegrationAdapter.createCliConnection` | 方法 | 否 | [src/pi.ts:378-387](../src/pi.ts#L378) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:389-413](../src/pi.ts#L389) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:415-460](../src/pi.ts#L415) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:462-480](../src/pi.ts#L462) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:483-497](../src/pi.ts#L483) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:500-544](../src/pi.ts#L500) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi.ts:547-573](../src/pi.ts#L547) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:575-585](../src/pi.ts#L575) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:587-592](../src/pi.ts#L587) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:594-604](../src/pi.ts#L594) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:606-634](../src/pi.ts#L606) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:636-640](../src/pi.ts#L636) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./flow-loader.ts`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/runtime.ts:48-48](../src/runtime.ts#L48) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:50-61](../src/runtime.ts#L50) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:63-229](../src/runtime.ts#L63) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:70-84](../src/runtime.ts#L70) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:86-114](../src/runtime.ts#L86) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:116-133](../src/runtime.ts#L116) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:135-138](../src/runtime.ts#L135) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:140-143](../src/runtime.ts#L140) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:145-155](../src/runtime.ts#L145) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:157-165](../src/runtime.ts#L157) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:167-171](../src/runtime.ts#L167) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:173-175](../src/runtime.ts#L173) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:177-181](../src/runtime.ts#L177) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:183-187](../src/runtime.ts#L183) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:189-193](../src/runtime.ts#L189) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:195-200](../src/runtime.ts#L195) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:202-207](../src/runtime.ts#L202) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:209-214](../src/runtime.ts#L209) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:216-221](../src/runtime.ts#L216) |
| `InMemoryRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:223-228](../src/runtime.ts#L223) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:231-237](../src/runtime.ts#L231) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:240-399](../src/runtime.ts#L240) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:251-265](../src/runtime.ts#L251) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:267-287](../src/runtime.ts#L267) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:289-301](../src/runtime.ts#L289) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:303-315](../src/runtime.ts#L303) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:317-320](../src/runtime.ts#L317) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:322-324](../src/runtime.ts#L322) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:326-328](../src/runtime.ts#L326) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:330-332](../src/runtime.ts#L330) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:334-337](../src/runtime.ts#L334) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:339-344](../src/runtime.ts#L339) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:346-349](../src/runtime.ts#L346) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:351-354](../src/runtime.ts#L351) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:356-359](../src/runtime.ts#L356) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:361-363](../src/runtime.ts#L361) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:365-367](../src/runtime.ts#L365) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:369-372](../src/runtime.ts#L369) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:374-379](../src/runtime.ts#L374) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:381-386](../src/runtime.ts#L381) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:388-393](../src/runtime.ts#L388) |
| `JsonFileRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:395-398](../src/runtime.ts#L395) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:401-432](../src/runtime.ts#L401) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:402-431](../src/runtime.ts#L402) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:434-537](../src/runtime.ts#L434) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:442-466](../src/runtime.ts#L442) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:468-525](../src/runtime.ts#L468) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:527-529](../src/runtime.ts#L527) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:531-536](../src/runtime.ts#L531) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:539-1956](../src/runtime.ts#L539) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:577-640](../src/runtime.ts#L577) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:643-654](../src/runtime.ts#L643) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/runtime.ts:657-759](../src/runtime.ts#L657) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:761-883](../src/runtime.ts#L761) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:885-983](../src/runtime.ts#L885) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:985-1016](../src/runtime.ts#L985) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:1018-1118](../src/runtime.ts#L1018) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1120-1237](../src/runtime.ts#L1120) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/runtime.ts:1240-1260](../src/runtime.ts#L1240) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/runtime.ts:1262-1298](../src/runtime.ts#L1262) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/runtime.ts:1301-1332](../src/runtime.ts#L1301) |
| `FlowCoordinator.childConclusion` | 方法 | 否 | [src/runtime.ts:1335-1340](../src/runtime.ts#L1335) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/runtime.ts:1342-1353](../src/runtime.ts#L1342) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/runtime.ts:1356-1428](../src/runtime.ts#L1356) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1430-1476](../src/runtime.ts#L1430) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1478-1516](../src/runtime.ts#L1478) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1518-1566](../src/runtime.ts#L1518) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1568-1588](../src/runtime.ts#L1568) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1590-1636](../src/runtime.ts#L1590) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/runtime.ts:1639-1675](../src/runtime.ts#L1639) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1677-1723](../src/runtime.ts#L1677) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1725-1750](../src/runtime.ts#L1725) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1752-1760](../src/runtime.ts#L1752) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1762-1784](../src/runtime.ts#L1762) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1786-1802](../src/runtime.ts#L1786) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1804-1813](../src/runtime.ts#L1804) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1815-1897](../src/runtime.ts#L1815) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1899-1928](../src/runtime.ts#L1899) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1930-1955](../src/runtime.ts#L1930) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1958-1965](../src/runtime.ts#L1958) |
| `now` | 函数 | 否 | [src/runtime.ts:1967-1969](../src/runtime.ts#L1967) |
| `isRunInput` | 函数 | 否 | [src/runtime.ts:1971-1978](../src/runtime.ts#L1971) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1980-1992](../src/runtime.ts#L1980) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1994-2027](../src/runtime.ts#L1994) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:2029-2056](../src/runtime.ts#L2029) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:2058-2069](../src/runtime.ts#L2058) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:2071-2075](../src/runtime.ts#L2071) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:2077-2096](../src/runtime.ts#L2077) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:2098-2110](../src/runtime.ts#L2098) |
| `renderTemplateForAgent` | 函数 | 否 | [src/runtime.ts:2112-2118](../src/runtime.ts#L2112) |
| `parseCommandVariables` | 函数 | 否 | [src/runtime.ts:2120-2142](../src/runtime.ts#L2120) |
| `isFlowValue` | 函数 | 否 | [src/runtime.ts:2144-2154](../src/runtime.ts#L2144) |
| `isFlowValueRecord` | 函数 | 否 | [src/runtime.ts:2156-2163](../src/runtime.ts#L2156) |
| `mergeParallelVariables` | 函数 | 否 | [src/runtime.ts:2165-2198](../src/runtime.ts#L2165) |
| `applyVariablePatch` | 函数 | 否 | [src/runtime.ts:2200-2215](../src/runtime.ts#L2200) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:2217-2222](../src/runtime.ts#L2217) |
| `clone` | 函数 | 否 | [src/runtime.ts:2224-2226](../src/runtime.ts#L2224) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `FlowVariables` | 类型 | 是 | [src/types.ts:9-9](../src/types.ts#L9) |
| `FlowVariablePatch` | 类型 | 是 | [src/types.ts:11-14](../src/types.ts#L11) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:16-16](../src/types.ts#L16) |
| `AgentAction` | 接口 | 是 | [src/types.ts:18-21](../src/types.ts#L18) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:23-31](../src/types.ts#L23) |
| `CommandAction` | 接口 | 是 | [src/types.ts:33-37](../src/types.ts#L33) |
| `FlowReferenceAction` | 接口 | 是 | [src/types.ts:39-47](../src/types.ts#L39) |
| `FlowAction` | 类型 | 是 | [src/types.ts:49-49](../src/types.ts#L49) |
| `FlowNode` | 接口 | 是 | [src/types.ts:51-57](../src/types.ts#L51) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:59-62](../src/types.ts#L59) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:64-68](../src/types.ts#L64) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:70-79](../src/types.ts#L70) |
| `FlowResourceContext` | 接口 | 是 | [src/types.ts:82-85](../src/types.ts#L82) |
| `FlowPackage` | 接口 | 是 | [src/types.ts:88-92](../src/types.ts#L88) |
| `LoadedFlow` | 接口 | 是 | [src/types.ts:95-98](../src/types.ts#L95) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:100-103](../src/types.ts#L100) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:105-109](../src/types.ts#L105) |
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
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:225-248](../src/types.ts#L225) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:251-261](../src/types.ts#L251) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:264-282](../src/types.ts#L264) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:284-292](../src/types.ts#L284) |
| `FlowRunInput` | 接口 | 是 | [src/types.ts:294-297](../src/types.ts#L294) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:303-333](../src/types.ts#L303) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:336-343](../src/types.ts#L336) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:346-352](../src/types.ts#L346) |
| `RunStore` | 接口 | 是 | [src/types.ts:354-372](../src/types.ts#L354) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:374-386](../src/types.ts#L374) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:388-400](../src/types.ts#L388) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:402-406](../src/types.ts#L402) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:408-426](../src/types.ts#L408) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:429-437](../src/types.ts#L429) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:439-456](../src/types.ts#L439) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:458-460](../src/types.ts#L458) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:462-465](../src/types.ts#L462) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:467-469](../src/types.ts#L467) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:471-478](../src/types.ts#L471) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:480-492](../src/types.ts#L480) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:494-513](../src/types.ts#L494) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:515-517](../src/types.ts#L515) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:519-525](../src/types.ts#L519) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:527-529](../src/types.ts#L527) |

## [src/variables.ts](../src/variables.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `validateVariableName` | 函数 | 是 | [src/variables.ts:6-10](../src/variables.ts#L6) |
| `isRecord` | 函数 | 是 | [src/variables.ts:12-17](../src/variables.ts#L12) |
| `validateFlowValue` | 函数 | 是 | [src/variables.ts:20-33](../src/variables.ts#L20) |
| `validateVariables` | 函数 | 是 | [src/variables.ts:35-41](../src/variables.ts#L35) |
