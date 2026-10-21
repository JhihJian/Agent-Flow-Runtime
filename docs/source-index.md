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
| `assertAssembly` | 函数 | 否 | [src/agent.ts:20-28](../src/agent.ts#L20) |
| `AgentRunModel` | 类 | 是 | [src/agent.ts:30-156](../src/agent.ts#L30) |
| `AgentRunModel.start` | 方法 | 是 | [src/agent.ts:41-71](../src/agent.ts#L41) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/agent.ts:73-144](../src/agent.ts#L73) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/agent.ts:146-148](../src/agent.ts#L146) |
| `AgentRunModel.end` | 方法 | 是 | [src/agent.ts:150-155](../src/agent.ts#L150) |

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
| `GraphEdge` | 接口 | 否 | [src/parser.ts:42-46](../src/parser.ts#L42) |
| `ParsedSection` | 接口 | 否 | [src/parser.ts:48-52](../src/parser.ts#L48) |
| `FlowSyntaxError` | 类 | 是 | [src/parser.ts:54-59](../src/parser.ts#L54) |
| `parseFlow` | 函数 | 是 | [src/parser.ts:61-136](../src/parser.ts#L61) |
| `parseMetadata` | 函数 | 否 | [src/parser.ts:138-191](../src/parser.ts#L138) |
| `extractSingleMermaid` | 函数 | 否 | [src/parser.ts:193-201](../src/parser.ts#L193) |
| `parseGraph` | 函数 | 否 | [src/parser.ts:203-243](../src/parser.ts#L203) |
| `parseSections` | 函数 | 否 | [src/parser.ts:245-275](../src/parser.ts#L245) |
| `parseAction` | 函数 | 否 | [src/parser.ts:277-293](../src/parser.ts#L277) |
| `parseAgentAction` | 函数 | 否 | [src/parser.ts:295-352](../src/parser.ts#L295) |
| `parseFlowReferenceAction` | 函数 | 否 | [src/parser.ts:354-391](../src/parser.ts#L354) |
| `parseCommandAction` | 函数 | 否 | [src/parser.ts:393-445](../src/parser.ts#L393) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/parser.ts:447-460](../src/parser.ts#L447) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/parser.ts:462-481](../src/parser.ts#L462) |
| `parseResults` | 函数 | 否 | [src/parser.ts:483-505](../src/parser.ts#L483) |
| `parseResultVariables` | 函数 | 否 | [src/parser.ts:507-553](../src/parser.ts#L507) |
| `validateAndWireGraph` | 函数 | 否 | [src/parser.ts:555-621](../src/parser.ts#L555) |
| `wireFlowReferenceNode` | 函数 | 否 | [src/parser.ts:624-678](../src/parser.ts#L624) |
| `destination` | 函数 | 否 | [src/parser.ts:680-689](../src/parser.ts#L680) |
| `validateParallel` | 函数 | 否 | [src/parser.ts:691-766](../src/parser.ts#L691) |
| `validateReachability` | 函数 | 否 | [src/parser.ts:768-790](../src/parser.ts#L768) |
| `groupEdges` | 函数 | 否 | [src/parser.ts:792-803](../src/parser.ts#L792) |
| `matchIndex` | 函数 | 否 | [src/parser.ts:805-809](../src/parser.ts#L805) |
| `isRecord` | 函数 | 否 | [src/parser.ts:811-813](../src/parser.ts#L811) |
| `TemplateContext` | 接口 | 否 | [src/parser.ts:815-819](../src/parser.ts#L815) |
| `templateReferences` | 函数 | 否 | [src/parser.ts:825-851](../src/parser.ts#L825) |
| `stringifyTemplateValue` | 函数 | 否 | [src/parser.ts:853-855](../src/parser.ts#L853) |
| `lookupVariable` | 函数 | 否 | [src/parser.ts:857-865](../src/parser.ts#L857) |
| `resolveReference` | 函数 | 否 | [src/parser.ts:867-882](../src/parser.ts#L867) |
| `renderString` | 函数 | 否 | [src/parser.ts:884-900](../src/parser.ts#L884) |
| `validateTemplates` | 函数 | 否 | [src/parser.ts:902-921](../src/parser.ts#L902) |
| `renderTemplate` | 函数 | 是 | [src/parser.ts:924-939](../src/parser.ts#L924) |
| `renderCommandRequest` | 函数 | 是 | [src/parser.ts:941-959](../src/parser.ts#L941) |
| `renderFlowReferenceTask` | 函数 | 是 | [src/parser.ts:962-968](../src/parser.ts#L962) |

## [src/pi.ts](../src/pi.ts)

依赖：`node:crypto`、`@earendil-works/pi-coding-agent`、`typebox`、`./agent-capabilities.ts`、`./observability.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:30-36](../src/pi.ts#L30) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:38-44](../src/pi.ts#L38) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:46-56](../src/pi.ts#L46) |
| `flowOutcomeParametersSchema` | 函数 | 否 | [src/pi.ts:70-80](../src/pi.ts#L70) |
| `validateVariableName` | 函数 | 否 | [src/pi.ts:82-89](../src/pi.ts#L82) |
| `validateJsonValue` | 函数 | 否 | [src/pi.ts:91-128](../src/pi.ts#L91) |
| `submissionVariables` | 函数 | 否 | [src/pi.ts:130-144](../src/pi.ts#L130) |
| `missingOutcomeRetryPrompt` | 函数 | 否 | [src/pi.ts:148-150](../src/pi.ts#L148) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:152-161](../src/pi.ts#L152) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:163-168](../src/pi.ts#L163) |
| `PiAgentProfilePlugin` | 接口 | 是 | [src/pi.ts:170-175](../src/pi.ts#L170) |
| `PiAgentProfileDefinition` | 接口 | 是 | [src/pi.ts:177-183](../src/pi.ts#L177) |
| `PiAgentProfileContribution` | 接口 | 是 | [src/pi.ts:185-199](../src/pi.ts#L185) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:202-680](../src/pi.ts#L202) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:212-228](../src/pi.ts#L212) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:230-273](../src/pi.ts#L230) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:275-313](../src/pi.ts#L275) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:315-330](../src/pi.ts#L315) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:332-340](../src/pi.ts#L332) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:343-357](../src/pi.ts#L343) |
| `PiAgentIntegrationAdapter.hasPendingCliOutcome` | 方法 | 是 | [src/pi.ts:360-362](../src/pi.ts#L360) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:365-407](../src/pi.ts#L365) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:409-442](../src/pi.ts#L409) |
| `PiAgentIntegrationAdapter.createSdkSession` | 方法 | 否 | [src/pi.ts:444-528](../src/pi.ts#L444) |
| `PiAgentIntegrationAdapter.resolveProfile` | 方法 | 否 | [src/pi.ts:530-586](../src/pi.ts#L530) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:588-612](../src/pi.ts#L588) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:614-645](../src/pi.ts#L614) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:647-662](../src/pi.ts#L647) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:665-679](../src/pi.ts#L665) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:682-713](../src/pi.ts#L682) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi.ts:716-742](../src/pi.ts#L716) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:744-754](../src/pi.ts#L744) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:756-761](../src/pi.ts#L756) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:763-773](../src/pi.ts#L763) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:775-803](../src/pi.ts#L775) |
| `sameCapabilities` | 函数 | 否 | [src/pi.ts:805-815](../src/pi.ts#L805) |
| `assertAssemblyIdentity` | 函数 | 否 | [src/pi.ts:817-824](../src/pi.ts#L817) |
| `assertSubset` | 函数 | 否 | [src/pi.ts:826-837](../src/pi.ts#L826) |
| `assertUnique` | 函数 | 否 | [src/pi.ts:839-847](../src/pi.ts#L839) |
| `digest` | 函数 | 否 | [src/pi.ts:849-851](../src/pi.ts#L849) |
| `stableJson` | 函数 | 否 | [src/pi.ts:853-862](../src/pi.ts#L853) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:864-868](../src/pi.ts#L864) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./agent.ts`、`./agent-capabilities.ts`、`./flow-loader.ts`、`./parser.ts`、`./types.ts`、`./variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/runtime.ts:50-50](../src/runtime.ts#L50) |
| `ObservationSpec` | 类型 | 否 | [src/runtime.ts:52-63](../src/runtime.ts#L52) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:65-231](../src/runtime.ts#L65) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:72-86](../src/runtime.ts#L72) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:88-116](../src/runtime.ts#L88) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:118-135](../src/runtime.ts#L118) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:137-140](../src/runtime.ts#L137) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:142-145](../src/runtime.ts#L142) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:147-157](../src/runtime.ts#L147) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/runtime.ts:159-167](../src/runtime.ts#L159) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:169-173](../src/runtime.ts#L169) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:175-177](../src/runtime.ts#L175) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:179-183](../src/runtime.ts#L179) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:185-189](../src/runtime.ts#L185) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:191-195](../src/runtime.ts#L191) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:197-202](../src/runtime.ts#L197) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:204-209](../src/runtime.ts#L204) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:211-216](../src/runtime.ts#L211) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:218-223](../src/runtime.ts#L218) |
| `InMemoryRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:225-230](../src/runtime.ts#L225) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:233-239](../src/runtime.ts#L233) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:242-401](../src/runtime.ts#L242) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:253-267](../src/runtime.ts#L253) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/runtime.ts:269-289](../src/runtime.ts#L269) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:291-303](../src/runtime.ts#L291) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:305-317](../src/runtime.ts#L305) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:319-322](../src/runtime.ts#L319) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:324-326](../src/runtime.ts#L324) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:328-330](../src/runtime.ts#L328) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:332-334](../src/runtime.ts#L332) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:336-339](../src/runtime.ts#L336) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/runtime.ts:341-346](../src/runtime.ts#L341) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:348-351](../src/runtime.ts#L348) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/runtime.ts:353-356](../src/runtime.ts#L353) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:358-361](../src/runtime.ts#L358) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:363-365](../src/runtime.ts#L363) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:367-369](../src/runtime.ts#L367) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:371-374](../src/runtime.ts#L371) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:376-381](../src/runtime.ts#L376) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:383-388](../src/runtime.ts#L383) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:390-395](../src/runtime.ts#L390) |
| `JsonFileRunStore.listChildRuns` | 方法 | 是 | [src/runtime.ts:397-400](../src/runtime.ts#L397) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:403-434](../src/runtime.ts#L403) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:404-433](../src/runtime.ts#L404) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:436-1894](../src/runtime.ts#L436) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:474-529](../src/runtime.ts#L474) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:532-543](../src/runtime.ts#L532) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/runtime.ts:546-658](../src/runtime.ts#L546) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:660-791](../src/runtime.ts#L660) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:793-903](../src/runtime.ts#L793) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:905-936](../src/runtime.ts#L905) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:938-1038](../src/runtime.ts#L938) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1040-1164](../src/runtime.ts#L1040) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/runtime.ts:1167-1187](../src/runtime.ts#L1167) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/runtime.ts:1189-1222](../src/runtime.ts#L1189) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/runtime.ts:1225-1245](../src/runtime.ts#L1225) |
| `FlowCoordinator.childResultVariables` | 方法 | 否 | [src/runtime.ts:1247-1263](../src/runtime.ts#L1247) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/runtime.ts:1265-1276](../src/runtime.ts#L1265) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/runtime.ts:1279-1357](../src/runtime.ts#L1279) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1359-1414](../src/runtime.ts#L1359) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1416-1454](../src/runtime.ts#L1416) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1456-1504](../src/runtime.ts#L1456) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1506-1526](../src/runtime.ts#L1506) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1528-1574](../src/runtime.ts#L1528) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/runtime.ts:1577-1613](../src/runtime.ts#L1577) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1615-1661](../src/runtime.ts#L1615) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1663-1688](../src/runtime.ts#L1663) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1690-1698](../src/runtime.ts#L1690) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1700-1722](../src/runtime.ts#L1700) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1724-1740](../src/runtime.ts#L1724) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1742-1751](../src/runtime.ts#L1742) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1753-1835](../src/runtime.ts#L1753) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1837-1866](../src/runtime.ts#L1837) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1868-1893](../src/runtime.ts#L1868) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1896-1903](../src/runtime.ts#L1896) |
| `now` | 函数 | 否 | [src/runtime.ts:1905-1907](../src/runtime.ts#L1905) |
| `initializeVariables` | 函数 | 否 | [src/runtime.ts:1909-1935](../src/runtime.ts#L1909) |
| `declaredResultVariables` | 函数 | 否 | [src/runtime.ts:1937-1942](../src/runtime.ts#L1937) |
| `validateOutcomeVariables` | 函数 | 否 | [src/runtime.ts:1944-1969](../src/runtime.ts#L1944) |
| `pickDeclaredGlobalVariables` | 函数 | 否 | [src/runtime.ts:1971-1980](../src/runtime.ts#L1971) |
| `extractNextInput` | 函数 | 否 | [src/runtime.ts:1982-1992](../src/runtime.ts#L1982) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1994-2012](../src/runtime.ts#L1994) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:2014-2048](../src/runtime.ts#L2014) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:2050-2077](../src/runtime.ts#L2050) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:2079-2090](../src/runtime.ts#L2079) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:2092-2096](../src/runtime.ts#L2092) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:2098-2117](../src/runtime.ts#L2098) |
| `renderAgentProfile` | 函数 | 否 | [src/runtime.ts:2119-2136](../src/runtime.ts#L2119) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:2138-2150](../src/runtime.ts#L2138) |
| `renderTemplateForAgent` | 函数 | 否 | [src/runtime.ts:2152-2163](../src/runtime.ts#L2152) |
| `parseCommandVariables` | 函数 | 否 | [src/runtime.ts:2165-2195](../src/runtime.ts#L2165) |
| `isFlowValue` | 函数 | 否 | [src/runtime.ts:2197-2207](../src/runtime.ts#L2197) |
| `isFlowValueRecord` | 函数 | 否 | [src/runtime.ts:2209-2216](../src/runtime.ts#L2209) |
| `mergeParallelVariables` | 函数 | 否 | [src/runtime.ts:2218-2237](../src/runtime.ts#L2218) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:2239-2244](../src/runtime.ts#L2239) |
| `clone` | 函数 | 否 | [src/runtime.ts:2246-2248](../src/runtime.ts#L2246) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `FlowVariableDeclaration` | 类型 | 是 | [src/types.ts:9-12](../src/types.ts#L9) |
| `FlowVariableDeclarations` | 类型 | 是 | [src/types.ts:14-14](../src/types.ts#L14) |
| `FlowVariables` | 类型 | 是 | [src/types.ts:16-16](../src/types.ts#L16) |
| `AgentCapabilityDeclaration` | 接口 | 是 | [src/types.ts:19-22](../src/types.ts#L19) |
| `AgentAssemblyIdentity` | 接口 | 是 | [src/types.ts:25-33](../src/types.ts#L25) |
| `AgentProfileReference` | 接口 | 是 | [src/types.ts:36-39](../src/types.ts#L36) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:41-41](../src/types.ts#L41) |
| `AgentAction` | 接口 | 是 | [src/types.ts:43-47](../src/types.ts#L43) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:49-57](../src/types.ts#L49) |
| `CommandAction` | 接口 | 是 | [src/types.ts:59-63](../src/types.ts#L59) |
| `FlowReferenceAction` | 接口 | 是 | [src/types.ts:65-71](../src/types.ts#L65) |
| `FlowAction` | 类型 | 是 | [src/types.ts:73-73](../src/types.ts#L73) |
| `FlowNode` | 接口 | 是 | [src/types.ts:75-82](../src/types.ts#L75) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:84-87](../src/types.ts#L84) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:89-93](../src/types.ts#L89) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:95-106](../src/types.ts#L95) |
| `FlowResourceContext` | 接口 | 是 | [src/types.ts:109-112](../src/types.ts#L109) |
| `FlowPackage` | 接口 | 是 | [src/types.ts:115-119](../src/types.ts#L115) |
| `LoadedFlow` | 接口 | 是 | [src/types.ts:122-125](../src/types.ts#L122) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:127-130](../src/types.ts#L127) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:132-135](../src/types.ts#L132) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:137-142](../src/types.ts#L137) |
| `NodeSession` | 接口 | 是 | [src/types.ts:144-148](../src/types.ts#L144) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:150-154](../src/types.ts#L150) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:156-160](../src/types.ts#L156) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:162-186](../src/types.ts#L162) |
| `CommandResult` | 接口 | 是 | [src/types.ts:188-193](../src/types.ts#L188) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:195-197](../src/types.ts#L195) |
| `RunStatus` | 类型 | 是 | [src/types.ts:199-199](../src/types.ts#L199) |
| `RunPhase` | 类型 | 是 | [src/types.ts:201-208](../src/types.ts#L201) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:210-210](../src/types.ts#L210) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:212-217](../src/types.ts#L212) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:219-236](../src/types.ts#L219) |
| `FlowError` | 接口 | 是 | [src/types.ts:238-241](../src/types.ts#L238) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:243-255](../src/types.ts#L243) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:258-285](../src/types.ts#L258) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:288-298](../src/types.ts#L288) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:301-319](../src/types.ts#L301) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:321-329](../src/types.ts#L321) |
| `FlowRunInput` | 接口 | 是 | [src/types.ts:331-333](../src/types.ts#L331) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:339-372](../src/types.ts#L339) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:375-382](../src/types.ts#L375) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:385-391](../src/types.ts#L385) |
| `TemplateContext` | 接口 | 是 | [src/types.ts:393-397](../src/types.ts#L393) |
| `RunStore` | 接口 | 是 | [src/types.ts:399-417](../src/types.ts#L399) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:419-430](../src/types.ts#L419) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:432-444](../src/types.ts#L432) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:446-450](../src/types.ts#L446) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:452-470](../src/types.ts#L452) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:473-481](../src/types.ts#L473) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:483-500](../src/types.ts#L483) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:502-504](../src/types.ts#L502) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:506-509](../src/types.ts#L506) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:511-513](../src/types.ts#L511) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:515-522](../src/types.ts#L515) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:524-536](../src/types.ts#L524) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:538-557](../src/types.ts#L538) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:559-561](../src/types.ts#L559) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:563-569](../src/types.ts#L563) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:571-573](../src/types.ts#L571) |

## [src/variables.ts](../src/variables.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `validateVariableName` | 函数 | 是 | [src/variables.ts:10-14](../src/variables.ts#L10) |
| `isRecord` | 函数 | 是 | [src/variables.ts:16-21](../src/variables.ts#L16) |
| `validateFlowValue` | 函数 | 是 | [src/variables.ts:24-37](../src/variables.ts#L24) |
| `validateVariables` | 函数 | 是 | [src/variables.ts:39-45](../src/variables.ts#L39) |
| `validateVariableDeclarations` | 函数 | 是 | [src/variables.ts:48-67](../src/variables.ts#L48) |
