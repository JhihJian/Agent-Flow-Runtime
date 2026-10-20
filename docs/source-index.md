# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/agent.ts](../src/agent.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `AgentRunModel` | 类 | 是 | [src/agent.ts:17-128](../src/agent.ts#L17) |
| `AgentRunModel.start` | 方法 | 是 | [src/agent.ts:25-51](../src/agent.ts#L25) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/agent.ts:53-116](../src/agent.ts#L53) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/agent.ts:118-120](../src/agent.ts#L118) |
| `AgentRunModel.end` | 方法 | 是 | [src/agent.ts:122-127](../src/agent.ts#L122) |

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

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./agent.ts`、`./flow-loader.ts`、`./parser.ts`、`./types.ts`、`./variables.ts`

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
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:434-1865](../src/runtime.ts#L434) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:472-527](../src/runtime.ts#L472) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:530-541](../src/runtime.ts#L530) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/runtime.ts:544-650](../src/runtime.ts#L544) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:652-781](../src/runtime.ts#L652) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:783-893](../src/runtime.ts#L783) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:895-926](../src/runtime.ts#L895) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:928-1028](../src/runtime.ts#L928) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:1030-1139](../src/runtime.ts#L1030) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/runtime.ts:1142-1162](../src/runtime.ts#L1142) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/runtime.ts:1164-1197](../src/runtime.ts#L1164) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/runtime.ts:1200-1220](../src/runtime.ts#L1200) |
| `FlowCoordinator.childResultVariables` | 方法 | 否 | [src/runtime.ts:1222-1238](../src/runtime.ts#L1222) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/runtime.ts:1240-1251](../src/runtime.ts#L1240) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/runtime.ts:1254-1328](../src/runtime.ts#L1254) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:1330-1385](../src/runtime.ts#L1330) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1387-1425](../src/runtime.ts#L1387) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1427-1475](../src/runtime.ts#L1427) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1477-1497](../src/runtime.ts#L1477) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1499-1545](../src/runtime.ts#L1499) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/runtime.ts:1548-1584](../src/runtime.ts#L1548) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1586-1632](../src/runtime.ts#L1586) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1634-1659](../src/runtime.ts#L1634) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1661-1669](../src/runtime.ts#L1661) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1671-1693](../src/runtime.ts#L1671) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1695-1711](../src/runtime.ts#L1695) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1713-1722](../src/runtime.ts#L1713) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/runtime.ts:1724-1806](../src/runtime.ts#L1724) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/runtime.ts:1808-1837](../src/runtime.ts#L1808) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1839-1864](../src/runtime.ts#L1839) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1867-1874](../src/runtime.ts#L1867) |
| `now` | 函数 | 否 | [src/runtime.ts:1876-1878](../src/runtime.ts#L1876) |
| `initializeVariables` | 函数 | 否 | [src/runtime.ts:1880-1906](../src/runtime.ts#L1880) |
| `declaredResultVariables` | 函数 | 否 | [src/runtime.ts:1908-1913](../src/runtime.ts#L1908) |
| `validateOutcomeVariables` | 函数 | 否 | [src/runtime.ts:1915-1940](../src/runtime.ts#L1915) |
| `pickDeclaredGlobalVariables` | 函数 | 否 | [src/runtime.ts:1942-1951](../src/runtime.ts#L1942) |
| `extractNextInput` | 函数 | 否 | [src/runtime.ts:1953-1963](../src/runtime.ts#L1953) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1965-1977](../src/runtime.ts#L1965) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1979-2012](../src/runtime.ts#L1979) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:2014-2041](../src/runtime.ts#L2014) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:2043-2054](../src/runtime.ts#L2043) |
| `displayNodeName` | 函数 | 否 | [src/runtime.ts:2056-2060](../src/runtime.ts#L2056) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:2062-2081](../src/runtime.ts#L2062) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:2083-2095](../src/runtime.ts#L2083) |
| `renderTemplateForAgent` | 函数 | 否 | [src/runtime.ts:2097-2108](../src/runtime.ts#L2097) |
| `parseCommandVariables` | 函数 | 否 | [src/runtime.ts:2110-2140](../src/runtime.ts#L2110) |
| `isFlowValue` | 函数 | 否 | [src/runtime.ts:2142-2152](../src/runtime.ts#L2142) |
| `isFlowValueRecord` | 函数 | 否 | [src/runtime.ts:2154-2161](../src/runtime.ts#L2154) |
| `mergeParallelVariables` | 函数 | 否 | [src/runtime.ts:2163-2182](../src/runtime.ts#L2163) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:2184-2189](../src/runtime.ts#L2184) |
| `clone` | 函数 | 否 | [src/runtime.ts:2191-2193](../src/runtime.ts#L2191) |

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
| `AgentExecutionContext` | 接口 | 是 | [src/types.ts:136-139](../src/types.ts#L136) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:141-163](../src/types.ts#L141) |
| `CommandResult` | 接口 | 是 | [src/types.ts:165-170](../src/types.ts#L165) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:172-174](../src/types.ts#L172) |
| `RunStatus` | 类型 | 是 | [src/types.ts:176-176](../src/types.ts#L176) |
| `RunPhase` | 类型 | 是 | [src/types.ts:178-185](../src/types.ts#L178) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:187-187](../src/types.ts#L187) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:189-194](../src/types.ts#L189) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:196-212](../src/types.ts#L196) |
| `FlowError` | 接口 | 是 | [src/types.ts:214-217](../src/types.ts#L214) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:219-231](../src/types.ts#L219) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:234-259](../src/types.ts#L234) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:262-272](../src/types.ts#L262) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:275-293](../src/types.ts#L275) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:295-303](../src/types.ts#L295) |
| `FlowRunInput` | 接口 | 是 | [src/types.ts:305-307](../src/types.ts#L305) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:313-342](../src/types.ts#L313) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:345-352](../src/types.ts#L345) |
| `FlowRunSnapshot` | 接口 | 是 | [src/types.ts:355-361](../src/types.ts#L355) |
| `TemplateContext` | 接口 | 是 | [src/types.ts:363-367](../src/types.ts#L363) |
| `RunStore` | 接口 | 是 | [src/types.ts:369-387](../src/types.ts#L369) |
| `FlowRunSummary` | 接口 | 是 | [src/types.ts:389-400](../src/types.ts#L389) |
| `FlowRunLocation` | 类型 | 是 | [src/types.ts:402-414](../src/types.ts#L402) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/types.ts:416-420](../src/types.ts#L416) |
| `FlowNodeRunView` | 接口 | 是 | [src/types.ts:422-440](../src/types.ts#L422) |
| `FlowRunHistory` | 接口 | 是 | [src/types.ts:443-451](../src/types.ts#L443) |
| `FlowNodeEvidence` | 接口 | 是 | [src/types.ts:453-470](../src/types.ts#L453) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/types.ts:472-474](../src/types.ts#L472) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/types.ts:476-479](../src/types.ts#L476) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/types.ts:481-483](../src/types.ts#L481) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/types.ts:485-492](../src/types.ts#L485) |
| `FlowObservationEventType` | 类型 | 是 | [src/types.ts:494-506](../src/types.ts#L494) |
| `FlowObservationEvent` | 接口 | 是 | [src/types.ts:508-527](../src/types.ts#L508) |
| `FlowObservationSubscription` | 接口 | 是 | [src/types.ts:529-531](../src/types.ts#L529) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/types.ts:533-539](../src/types.ts#L533) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/types.ts:541-543](../src/types.ts#L541) |

## [src/variables.ts](../src/variables.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `validateVariableName` | 函数 | 是 | [src/variables.ts:10-14](../src/variables.ts#L10) |
| `isRecord` | 函数 | 是 | [src/variables.ts:16-21](../src/variables.ts#L16) |
| `validateFlowValue` | 函数 | 是 | [src/variables.ts:24-37](../src/variables.ts#L24) |
| `validateVariables` | 函数 | 是 | [src/variables.ts:39-45](../src/variables.ts#L39) |
| `validateVariableDeclarations` | 函数 | 是 | [src/variables.ts:48-67](../src/variables.ts#L48) |
