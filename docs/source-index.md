# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/agent-capabilities.ts](../src/agent-capabilities.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `normalizeAgentCapabilities` | 函数 | 是 | [src/agent-capabilities.ts:9-16](../src/agent-capabilities.ts#L9) |
| `parseAgentCapabilities` | 函数 | 是 | [src/agent-capabilities.ts:19-31](../src/agent-capabilities.ts#L19) |
| `parseCapabilityNames` | 函数 | 否 | [src/agent-capabilities.ts:33-51](../src/agent-capabilities.ts#L33) |
| `isRecord` | 函数 | 否 | [src/agent-capabilities.ts:53-55](../src/agent-capabilities.ts#L53) |

## [src/agent.ts](../src/agent.ts)

依赖：`./agent-capabilities.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `AgentRunModel` | 类 | 是 | [src/agent.ts:18-133](../src/agent.ts#L18) |
| `AgentRunModel.start` | 方法 | 是 | [src/agent.ts:29-54](../src/agent.ts#L29) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/agent.ts:56-121](../src/agent.ts#L56) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/agent.ts:123-125](../src/agent.ts#L123) |
| `AgentRunModel.end` | 方法 | 是 | [src/agent.ts:127-132](../src/agent.ts#L127) |

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

依赖：`node:crypto`、`node:fs/promises`、`node:path`、`@earendil-works/pi-coding-agent`、`./agent.ts`、`./cli-state.ts`、`./flow-loader.ts`、`./observability.ts`、`./pi.ts`、`./runtime.ts`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `flowExtension` | 函数 | 是 | [src/extension.ts:38-591](../src/extension.ts#L38) |
| `createRuntimeForContext` | 函数 | 否 | [src/extension.ts:593-599](../src/extension.ts#L593) |
| `flowEventMessage` | 函数 | 否 | [src/extension.ts:601-608](../src/extension.ts#L601) |
| `formatRunSummaryOption` | 函数 | 否 | [src/extension.ts:610-612](../src/extension.ts#L610) |
| `formatRecentRuns` | 函数 | 否 | [src/extension.ts:614-619](../src/extension.ts#L614) |

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

依赖：`yaml`、`./agent-capabilities.ts`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/parser.ts:41-45](../src/parser.ts#L41) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:47-51](../src/parser.ts#L47) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:53-58](../src/parser.ts#L53) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:60-126](../src/parser.ts#L60) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:128-181](../src/parser.ts#L128) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:183-191](../src/parser.ts#L183) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:193-233](../src/parser.ts#L193) |
| `parseSections` | 函数 | 否 | [src/parser.ts:235-265](../src/parser.ts#L235) |
| `parseAction` | 函数 | 否 | [src/parser.ts:267-283](../src/parser.ts#L267) |
| `parseFlowReferenceAction` | 函数 | 否 | [src/parser.ts:285-322](../src/parser.ts#L285) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:324-376](../src/parser.ts#L324) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:378-391](../src/parser.ts#L378) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:393-412](../src/parser.ts#L393) |
| `parseResults` | 函数 | 否 | [src/parser.ts:414-436](../src/parser.ts#L414) |
| `parseResultVariables` | 函数 | 否 | [src/parser.ts:438-484](../src/parser.ts#L438) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:486-552](../src/parser.ts#L486) |
| `wireFlowReferenceNode` | 函数 | 否 | [src/parser.ts:555-609](../src/parser.ts#L555) |
| `destination` | 函数 | 否 | [src/parser.ts:611-620](../src/parser.ts#L611) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:622-697](../src/parser.ts#L622) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:699-721](../src/parser.ts#L699) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:723-734](../src/parser.ts#L723) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:736-740](../src/parser.ts#L736) |
| `isRecord` | 函数 | 否 | [src/parser.ts:742-744](../src/parser.ts#L742) |
| `TemplateContext` | 接口 | 否 | [src/parser.ts:746-750](../src/parser.ts#L746) |
| `templateReferences` | 函数 | 否 | [src/parser.ts:756-782](../src/parser.ts#L756) |
| `stringifyTemplateValue` | 函数 | 否 | [src/parser.ts:784-786](../src/parser.ts#L784) |
| `lookupVariable` | 函数 | 否 | [src/parser.ts:788-796](../src/parser.ts#L788) |
| `resolveReference` | 函数 | 否 | [src/parser.ts:798-813](../src/parser.ts#L798) |
| `renderString` | 函数 | 否 | [src/parser.ts:815-831](../src/parser.ts#L815) |
| `validateTemplates` | 函数 | 否 | [src/parser.ts:833-852](../src/parser.ts#L833) |
| `renderTemplate` | 函数 | 是 | [src/parser.ts:855-870](../src/parser.ts#L855) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:872-890](../src/parser.ts#L872) |
| `renderFlowReferenceTask` | 函数 | 是 | [src/parser.ts:893-899](../src/parser.ts#L893) |

## [src/pi.ts](../src/pi.ts)

依赖：`@earendil-works/pi-coding-agent`、`typebox`、`./agent-capabilities.ts`、`./observability.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:26-32](../src/pi.ts#L26) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:34-40](../src/pi.ts#L34) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:42-52](../src/pi.ts#L42) |
| `flowOutcomeParametersSchema` | 函数 | 否 | [src/pi.ts:66-76](../src/pi.ts#L66) |
| `validateVariableName` | 函数 | 否 | [src/pi.ts:78-85](../src/pi.ts#L78) |
| `validateJsonValue` | 函数 | 否 | [src/pi.ts:87-124](../src/pi.ts#L87) |
| `submissionVariables` | 函数 | 否 | [src/pi.ts:126-140](../src/pi.ts#L126) |
| `missingOutcomeRetryPrompt` | 函数 | 否 | [src/pi.ts:144-146](../src/pi.ts#L144) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:148-157](../src/pi.ts#L148) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:159-163](../src/pi.ts#L159) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:166-537](../src/pi.ts#L166) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:176-190](../src/pi.ts#L176) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:192-227](../src/pi.ts#L192) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:229-267](../src/pi.ts#L229) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:269-284](../src/pi.ts#L269) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:286-294](../src/pi.ts#L286) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:297-311](../src/pi.ts#L297) |
| `PiAgentIntegrationAdapter.hasPendingCliOutcome` | 方法 | 是 | [src/pi.ts:314-316](../src/pi.ts#L314) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:319-361](../src/pi.ts#L319) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:363-393](../src/pi.ts#L363) |
| `PiAgentIntegrationAdapter.createSdkSession` | 方法 | 否 | [src/pi.ts:395-443](../src/pi.ts#L395) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:445-469](../src/pi.ts#L445) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:471-502](../src/pi.ts#L471) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:504-519](../src/pi.ts#L504) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:522-536](../src/pi.ts#L522) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:539-570](../src/pi.ts#L539) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi.ts:573-599](../src/pi.ts#L573) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:601-611](../src/pi.ts#L601) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:613-618](../src/pi.ts#L613) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:620-630](../src/pi.ts#L620) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:632-660](../src/pi.ts#L632) |
| `sameCapabilities` | 函数 | 否 | [src/pi.ts:662-672](../src/pi.ts#L662) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:674-678](../src/pi.ts#L674) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./agent.ts`、`./agent-capabilities.ts`、`./flow-loader.ts`、`./parser.ts`、`./types.ts`、`./variables.ts`

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
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:435-1866](../src/runtime.ts#L435) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:473-528](../src/runtime.ts#L473) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:531-542](../src/runtime.ts#L531) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/runtime.ts:545-651](../src/runtime.ts#L545) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:653-782](../src/runtime.ts#L653) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:784-894](../src/runtime.ts#L784) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:896-927](../src/runtime.ts#L896) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:929-1029](../src/runtime.ts#L929) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1031-1140](../src/runtime.ts#L1031) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/runtime.ts:1143-1163](../src/runtime.ts#L1143) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/runtime.ts:1165-1198](../src/runtime.ts#L1165) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/runtime.ts:1201-1221](../src/runtime.ts#L1201) |
| `FlowCoordinator.childResultVariables` | 方法 | 否 | [src/runtime.ts:1223-1239](../src/runtime.ts#L1223) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/runtime.ts:1241-1252](../src/runtime.ts#L1241) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/runtime.ts:1255-1329](../src/runtime.ts#L1255) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1331-1386](../src/runtime.ts#L1331) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1388-1426](../src/runtime.ts#L1388) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1428-1476](../src/runtime.ts#L1428) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1478-1498](../src/runtime.ts#L1478) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1500-1546](../src/runtime.ts#L1500) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/runtime.ts:1549-1585](../src/runtime.ts#L1549) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1587-1633](../src/runtime.ts#L1587) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1635-1660](../src/runtime.ts#L1635) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1662-1670](../src/runtime.ts#L1662) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1672-1694](../src/runtime.ts#L1672) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1696-1712](../src/runtime.ts#L1696) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1714-1723](../src/runtime.ts#L1714) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1725-1807](../src/runtime.ts#L1725) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1809-1838](../src/runtime.ts#L1809) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1840-1865](../src/runtime.ts#L1840) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1868-1875](../src/runtime.ts#L1868) |
| `now` | 函数 | 否 | [src/runtime.ts:1877-1879](../src/runtime.ts#L1877) |
| `initializeVariables` | 函数 | 否 | [src/runtime.ts:1881-1907](../src/runtime.ts#L1881) |
| `declaredResultVariables` | 函数 | 否 | [src/runtime.ts:1909-1914](../src/runtime.ts#L1909) |
| `validateOutcomeVariables` | 函数 | 否 | [src/runtime.ts:1916-1941](../src/runtime.ts#L1916) |
| `pickDeclaredGlobalVariables` | 函数 | 否 | [src/runtime.ts:1943-1952](../src/runtime.ts#L1943) |
| `extractNextInput` | 函数 | 否 | [src/runtime.ts:1954-1964](../src/runtime.ts#L1954) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1966-1978](../src/runtime.ts#L1966) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1980-2014](../src/runtime.ts#L1980) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:2016-2043](../src/runtime.ts#L2016) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:2045-2056](../src/runtime.ts#L2045) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:2058-2062](../src/runtime.ts#L2058) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:2064-2083](../src/runtime.ts#L2064) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:2085-2097](../src/runtime.ts#L2085) |
| `renderTemplateForAgent` | 函数 | 否 | [src/runtime.ts:2099-2110](../src/runtime.ts#L2099) |
| `parseCommandVariables` | 函数 | 否 | [src/runtime.ts:2112-2142](../src/runtime.ts#L2112) |
| `isFlowValue` | 函数 | 否 | [src/runtime.ts:2144-2154](../src/runtime.ts#L2144) |
| `isFlowValueRecord` | 函数 | 否 | [src/runtime.ts:2156-2163](../src/runtime.ts#L2156) |
| `mergeParallelVariables` | 函数 | 否 | [src/runtime.ts:2165-2184](../src/runtime.ts#L2165) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:2186-2191](../src/runtime.ts#L2186) |
| `clone` | 函数 | 否 | [src/runtime.ts:2193-2195](../src/runtime.ts#L2193) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `FlowVariableDeclaration` | 类型 | 是 | [src/types.ts:9-12](../src/types.ts#L9) |
| `FlowVariableDeclarations` | 类型 | 是 | [src/types.ts:14-14](../src/types.ts#L14) |
| `FlowVariables` | 类型 | 是 | [src/types.ts:16-16](../src/types.ts#L16) |
| `AgentCapabilityDeclaration` | 接口 | 是 | [src/types.ts:19-22](../src/types.ts#L19) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:24-24](../src/types.ts#L24) |
| `AgentAction` | 接口 | 是 | [src/types.ts:26-29](../src/types.ts#L26) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:31-39](../src/types.ts#L31) |
| `CommandAction` | 接口 | 是 | [src/types.ts:41-45](../src/types.ts#L41) |
| `FlowReferenceAction` | 接口 | 是 | [src/types.ts:47-53](../src/types.ts#L47) |
| `FlowAction` | 类型 | 是 | [src/types.ts:55-55](../src/types.ts#L55) |
| `FlowNode` | 接口 | 是 | [src/types.ts:57-64](../src/types.ts#L57) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:66-69](../src/types.ts#L66) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:71-75](../src/types.ts#L71) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:77-88](../src/types.ts#L77) |
| `FlowResourceContext` | 接口 | 是 | [src/types.ts:91-94](../src/types.ts#L91) |
| `FlowPackage` | 接口 | 是 | [src/types.ts:97-101](../src/types.ts#L97) |
| `LoadedFlow` | 接口 | 是 | [src/types.ts:104-107](../src/types.ts#L104) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:109-112](../src/types.ts#L109) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:114-117](../src/types.ts#L114) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:119-123](../src/types.ts#L119) |
| `NodeSession` | 接口 | 是 | [src/types.ts:125-129](../src/types.ts#L125) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:131-135](../src/types.ts#L131) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:137-141](../src/types.ts#L137) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:143-164](../src/types.ts#L143) |
| `CommandResult` | 接口 | 是 | [src/types.ts:166-171](../src/types.ts#L166) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:173-175](../src/types.ts#L173) |
| `RunStatus` | 类型 | 是 | [src/types.ts:177-177](../src/types.ts#L177) |
| `RunPhase` | 类型 | 是 | [src/types.ts:179-186](../src/types.ts#L179) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:188-188](../src/types.ts#L188) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:190-195](../src/types.ts#L190) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:197-213](../src/types.ts#L197) |
| `FlowError` | 接口 | 是 | [src/types.ts:215-218](../src/types.ts#L215) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:220-232](../src/types.ts#L220) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:235-260](../src/types.ts#L235) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:263-273](../src/types.ts#L263) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:276-294](../src/types.ts#L276) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:296-304](../src/types.ts#L296) |
| `FlowRunInput` | 接口 | 是 | [src/types.ts:306-308](../src/types.ts#L306) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:314-343](../src/types.ts#L314) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:346-353](../src/types.ts#L346) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:356-362](../src/types.ts#L356) |
| `TemplateContext` | 接口 | 是 | [src/types.ts:364-368](../src/types.ts#L364) |
| `RunStore` | 接口 | 是 | [src/types.ts:370-388](../src/types.ts#L370) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:390-401](../src/types.ts#L390) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:403-415](../src/types.ts#L403) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:417-421](../src/types.ts#L417) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:423-441](../src/types.ts#L423) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:444-452](../src/types.ts#L444) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:454-471](../src/types.ts#L454) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:473-475](../src/types.ts#L473) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:477-480](../src/types.ts#L477) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:482-484](../src/types.ts#L482) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:486-493](../src/types.ts#L486) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:495-507](../src/types.ts#L495) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:509-528](../src/types.ts#L509) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:530-532](../src/types.ts#L530) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:534-540](../src/types.ts#L534) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:542-544](../src/types.ts#L542) |

## [src/variables.ts](../src/variables.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `validateVariableName` | 函数 | 是 | [src/variables.ts:10-14](../src/variables.ts#L10) |
| `isRecord` | 函数 | 是 | [src/variables.ts:16-21](../src/variables.ts#L16) |
| `validateFlowValue` | 函数 | 是 | [src/variables.ts:24-37](../src/variables.ts#L24) |
| `validateVariables` | 函数 | 是 | [src/variables.ts:39-45](../src/variables.ts#L39) |
| `validateVariableDeclarations` | 函数 | 是 | [src/variables.ts:48-67](../src/variables.ts#L48) |
