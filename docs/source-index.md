# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/contracts/agent-capabilities.ts](../src/contracts/agent-capabilities.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `normalizeAgentCapabilities` | 函数 | 是 | [src/contracts/agent-capabilities.ts:9-16](../src/contracts/agent-capabilities.ts#L9) |
| `parseAgentCapabilities` | 函数 | 是 | [src/contracts/agent-capabilities.ts:19-31](../src/contracts/agent-capabilities.ts#L19) |
| `parseCapabilityNames` | 函数 | 否 | [src/contracts/agent-capabilities.ts:33-51](../src/contracts/agent-capabilities.ts#L33) |
| `isRecord` | 函数 | 否 | [src/contracts/agent-capabilities.ts:53-55](../src/contracts/agent-capabilities.ts#L53) |

## [src/contracts/types.ts](../src/contracts/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/contracts/types.ts:1-7](../src/contracts/types.ts#L1) |
| `FlowVariableDeclaration` | 类型 | 是 | [src/contracts/types.ts:9-12](../src/contracts/types.ts#L9) |
| `FlowVariableDeclarations` | 类型 | 是 | [src/contracts/types.ts:14-14](../src/contracts/types.ts#L14) |
| `FlowVariables` | 类型 | 是 | [src/contracts/types.ts:16-16](../src/contracts/types.ts#L16) |
| `AgentCapabilityDeclaration` | 接口 | 是 | [src/contracts/types.ts:19-22](../src/contracts/types.ts#L19) |
| `AgentAssemblyIdentity` | 接口 | 是 | [src/contracts/types.ts:25-33](../src/contracts/types.ts#L25) |
| `AgentProfileReference` | 接口 | 是 | [src/contracts/types.ts:36-39](../src/contracts/types.ts#L36) |
| `AgentActionKind` | 类型 | 是 | [src/contracts/types.ts:41-41](../src/contracts/types.ts#L41) |
| `AgentAction` | 接口 | 是 | [src/contracts/types.ts:43-47](../src/contracts/types.ts#L43) |
| `CommandRequest` | 接口 | 是 | [src/contracts/types.ts:49-57](../src/contracts/types.ts#L49) |
| `CommandAction` | 接口 | 是 | [src/contracts/types.ts:59-63](../src/contracts/types.ts#L59) |
| `FlowReferenceAction` | 接口 | 是 | [src/contracts/types.ts:65-71](../src/contracts/types.ts#L65) |
| `FlowAction` | 类型 | 是 | [src/contracts/types.ts:73-73](../src/contracts/types.ts#L73) |
| `FlowNode` | 接口 | 是 | [src/contracts/types.ts:75-82](../src/contracts/types.ts#L75) |
| `FlowDestination` | 类型 | 是 | [src/contracts/types.ts:84-87](../src/contracts/types.ts#L84) |
| `ParallelStart` | 接口 | 是 | [src/contracts/types.ts:89-93](../src/contracts/types.ts#L89) |
| `FlowDefinition` | 接口 | 是 | [src/contracts/types.ts:95-106](../src/contracts/types.ts#L95) |
| `FlowResourceContext` | 接口 | 是 | [src/contracts/types.ts:109-112](../src/contracts/types.ts#L109) |
| `FlowPackage` | 接口 | 是 | [src/contracts/types.ts:115-119](../src/contracts/types.ts#L115) |
| `LoadedFlow` | 接口 | 是 | [src/contracts/types.ts:122-125](../src/contracts/types.ts#L122) |
| `OutcomeOption` | 接口 | 是 | [src/contracts/types.ts:127-130](../src/contracts/types.ts#L127) |
| `NodeOutcome` | 接口 | 是 | [src/contracts/types.ts:132-135](../src/contracts/types.ts#L132) |
| `AgentConnection` | 接口 | 是 | [src/contracts/types.ts:137-142](../src/contracts/types.ts#L137) |
| `NodeSession` | 接口 | 是 | [src/contracts/types.ts:144-148](../src/contracts/types.ts#L144) |
| `UnifiedMessage` | 接口 | 是 | [src/contracts/types.ts:150-154](../src/contracts/types.ts#L150) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/contracts/types.ts:156-160](../src/contracts/types.ts#L156) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/contracts/types.ts:162-186](../src/contracts/types.ts#L162) |
| `CommandResult` | 接口 | 是 | [src/contracts/types.ts:188-193](../src/contracts/types.ts#L188) |
| `CommandExecutor` | 接口 | 是 | [src/contracts/types.ts:195-197](../src/contracts/types.ts#L195) |
| `RunStatus` | 类型 | 是 | [src/contracts/types.ts:199-199](../src/contracts/types.ts#L199) |
| `RunPhase` | 类型 | 是 | [src/contracts/types.ts:201-208](../src/contracts/types.ts#L201) |
| `NodeRunStatus` | 类型 | 是 | [src/contracts/types.ts:210-210](../src/contracts/types.ts#L210) |
| `ParallelRoundStatus` | 类型 | 是 | [src/contracts/types.ts:212-217](../src/contracts/types.ts#L212) |
| `FlowErrorCategory` | 类型 | 是 | [src/contracts/types.ts:219-236](../src/contracts/types.ts#L219) |
| `FlowError` | 接口 | 是 | [src/contracts/types.ts:238-241](../src/contracts/types.ts#L238) |
| `NodeRunSource` | 类型 | 是 | [src/contracts/types.ts:243-255](../src/contracts/types.ts#L243) |
| `NodeRunRecord` | 接口 | 是 | [src/contracts/types.ts:258-285](../src/contracts/types.ts#L258) |
| `RouteDecisionRecord` | 接口 | 是 | [src/contracts/types.ts:288-298](../src/contracts/types.ts#L288) |
| `ParallelRoundRecord` | 接口 | 是 | [src/contracts/types.ts:301-319](../src/contracts/types.ts#L301) |
| `RunRecoveryRecord` | 接口 | 是 | [src/contracts/types.ts:321-329](../src/contracts/types.ts#L321) |
| `FlowRunInput` | 接口 | 是 | [src/contracts/types.ts:331-333](../src/contracts/types.ts#L331) |
| `FlowDefinitionSnapshot` | 接口 | 是 | [src/contracts/types.ts:336-361](../src/contracts/types.ts#L336) |
| `FlowRunRecord` | 接口 | 是 | [src/contracts/types.ts:367-402](../src/contracts/types.ts#L367) |
| `RunFactCommit` | 接口 | 是 | [src/contracts/types.ts:405-412](../src/contracts/types.ts#L405) |
| `FlowRunSnapshot` | 接口 | 是 | [src/contracts/types.ts:415-421](../src/contracts/types.ts#L415) |
| `TemplateContext` | 接口 | 是 | [src/contracts/types.ts:423-427](../src/contracts/types.ts#L423) |
| `RunStore` | 接口 | 是 | [src/contracts/types.ts:429-447](../src/contracts/types.ts#L429) |
| `FlowRunSummary` | 接口 | 是 | [src/contracts/types.ts:449-460](../src/contracts/types.ts#L449) |
| `FlowRunLocation` | 类型 | 是 | [src/contracts/types.ts:462-474](../src/contracts/types.ts#L462) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/contracts/types.ts:476-480](../src/contracts/types.ts#L476) |
| `FlowNodeRunView` | 接口 | 是 | [src/contracts/types.ts:482-500](../src/contracts/types.ts#L482) |
| `FlowRunHistory` | 接口 | 是 | [src/contracts/types.ts:503-511](../src/contracts/types.ts#L503) |
| `FlowNodeEvidence` | 接口 | 是 | [src/contracts/types.ts:513-530](../src/contracts/types.ts#L513) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/contracts/types.ts:532-534](../src/contracts/types.ts#L532) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/contracts/types.ts:536-539](../src/contracts/types.ts#L536) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/contracts/types.ts:541-543](../src/contracts/types.ts#L541) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/contracts/types.ts:545-552](../src/contracts/types.ts#L545) |
| `FlowObservationEventType` | 类型 | 是 | [src/contracts/types.ts:554-566](../src/contracts/types.ts#L554) |
| `FlowObservationEvent` | 接口 | 是 | [src/contracts/types.ts:568-587](../src/contracts/types.ts#L568) |
| `FlowObservationSubscription` | 接口 | 是 | [src/contracts/types.ts:589-591](../src/contracts/types.ts#L589) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/contracts/types.ts:593-599](../src/contracts/types.ts#L593) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/contracts/types.ts:601-603](../src/contracts/types.ts#L601) |

## [src/contracts/variables.ts](../src/contracts/variables.ts)

依赖：`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `validateVariableName` | 函数 | 是 | [src/contracts/variables.ts:10-14](../src/contracts/variables.ts#L10) |
| `isRecord` | 函数 | 是 | [src/contracts/variables.ts:16-21](../src/contracts/variables.ts#L16) |
| `validateFlowValue` | 函数 | 是 | [src/contracts/variables.ts:24-37](../src/contracts/variables.ts#L24) |
| `validateVariables` | 函数 | 是 | [src/contracts/variables.ts:39-45](../src/contracts/variables.ts#L39) |
| `validateVariableDeclarations` | 函数 | 是 | [src/contracts/variables.ts:48-67](../src/contracts/variables.ts#L48) |

## [src/definition/directory.ts](../src/definition/directory.ts)

依赖：`node:fs/promises`、`node:path`、`../contracts/types.ts`、`./flow-loader.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowListing` | 接口 | 是 | [src/definition/directory.ts:6-11](../src/definition/directory.ts#L6) |
| `FlowDirectory` | 类 | 是 | [src/definition/directory.ts:14-68](../src/definition/directory.ts#L14) |
| `FlowDirectory.list` | 方法 | 是 | [src/definition/directory.ts:21-38](../src/definition/directory.ts#L21) |
| `FlowDirectory.load` | 方法 | 是 | [src/definition/directory.ts:40-46](../src/definition/directory.ts#L40) |
| `FlowDirectory.discover` | 方法 | 否 | [src/definition/directory.ts:48-67](../src/definition/directory.ts#L48) |

## [src/definition/flow-loader.ts](../src/definition/flow-loader.ts)

依赖：`node:fs/promises`、`node:path`、`../contracts/types.ts`、`./parser.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `loadFlow` | 函数 | 是 | [src/definition/flow-loader.ts:26-30](../src/definition/flow-loader.ts#L26) |
| `loadFlowPackage` | 函数 | 是 | [src/definition/flow-loader.ts:33-71](../src/definition/flow-loader.ts#L33) |
| `loadReferenceClosure` | 函数 | 否 | [src/definition/flow-loader.ts:77-101](../src/definition/flow-loader.ts#L77) |
| `collectReferenceIds` | 函数 | 否 | [src/definition/flow-loader.ts:103-109](../src/definition/flow-loader.ts#L103) |
| `resolvePromptResources` | 函数 | 是 | [src/definition/flow-loader.ts:112-122](../src/definition/flow-loader.ts#L112) |
| `resolveCommandResources` | 函数 | 是 | [src/definition/flow-loader.ts:125-138](../src/definition/flow-loader.ts#L125) |
| `validatePackageResources` | 函数 | 否 | [src/definition/flow-loader.ts:140-169](../src/definition/flow-loader.ts#L140) |
| `validateResource` | 函数 | 否 | [src/definition/flow-loader.ts:171-192](../src/definition/flow-loader.ts#L171) |
| `resolveResource` | 函数 | 否 | [src/definition/flow-loader.ts:194-202](../src/definition/flow-loader.ts#L194) |
| `resourcePath` | 函数 | 否 | [src/definition/flow-loader.ts:204-214](../src/definition/flow-loader.ts#L204) |
| `isResourcePath` | 函数 | 否 | [src/definition/flow-loader.ts:216-225](../src/definition/flow-loader.ts#L216) |
| `isInside` | 函数 | 否 | [src/definition/flow-loader.ts:227-230](../src/definition/flow-loader.ts#L227) |

## [src/definition/parser.ts](../src/definition/parser.ts)

依赖：`yaml`、`../contracts/agent-capabilities.ts`、`../contracts/types.ts`、`../contracts/variables.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `GraphEdge` | 接口 | 否 | [src/definition/parser.ts:42-46](../src/definition/parser.ts#L42) |
| `ParsedSection` | 接口 | 否 | [src/definition/parser.ts:48-52](../src/definition/parser.ts#L48) |
| `FlowSyntaxError` | 类 | 是 | [src/definition/parser.ts:54-59](../src/definition/parser.ts#L54) |
| `parseFlow` | 函数 | 是 | [src/definition/parser.ts:61-136](../src/definition/parser.ts#L61) |
| `parseMetadata` | 函数 | 否 | [src/definition/parser.ts:138-191](../src/definition/parser.ts#L138) |
| `extractSingleMermaid` | 函数 | 否 | [src/definition/parser.ts:193-201](../src/definition/parser.ts#L193) |
| `parseGraph` | 函数 | 否 | [src/definition/parser.ts:203-243](../src/definition/parser.ts#L203) |
| `parseSections` | 函数 | 否 | [src/definition/parser.ts:245-275](../src/definition/parser.ts#L245) |
| `parseAction` | 函数 | 否 | [src/definition/parser.ts:277-293](../src/definition/parser.ts#L277) |
| `parseAgentAction` | 函数 | 否 | [src/definition/parser.ts:295-352](../src/definition/parser.ts#L295) |
| `parseFlowReferenceAction` | 函数 | 否 | [src/definition/parser.ts:354-391](../src/definition/parser.ts#L354) |
| `parseCommandAction` | 函数 | 否 | [src/definition/parser.ts:393-445](../src/definition/parser.ts#L393) |
| `branchReferencesAreStandalone` | 函数 | 否 | [src/definition/parser.ts:447-460](../src/definition/parser.ts#L447) |
| `referencesOnlyInStdin` | 函数 | 否 | [src/definition/parser.ts:462-481](../src/definition/parser.ts#L462) |
| `parseResults` | 函数 | 否 | [src/definition/parser.ts:483-505](../src/definition/parser.ts#L483) |
| `parseResultVariables` | 函数 | 否 | [src/definition/parser.ts:507-553](../src/definition/parser.ts#L507) |
| `validateAndWireGraph` | 函数 | 否 | [src/definition/parser.ts:555-621](../src/definition/parser.ts#L555) |
| `wireFlowReferenceNode` | 函数 | 否 | [src/definition/parser.ts:624-678](../src/definition/parser.ts#L624) |
| `destination` | 函数 | 否 | [src/definition/parser.ts:680-689](../src/definition/parser.ts#L680) |
| `validateParallel` | 函数 | 否 | [src/definition/parser.ts:691-766](../src/definition/parser.ts#L691) |
| `validateReachability` | 函数 | 否 | [src/definition/parser.ts:768-790](../src/definition/parser.ts#L768) |
| `groupEdges` | 函数 | 否 | [src/definition/parser.ts:792-803](../src/definition/parser.ts#L792) |
| `matchIndex` | 函数 | 否 | [src/definition/parser.ts:805-809](../src/definition/parser.ts#L805) |
| `isRecord` | 函数 | 否 | [src/definition/parser.ts:811-813](../src/definition/parser.ts#L811) |
| `TemplateContext` | 接口 | 否 | [src/definition/parser.ts:815-819](../src/definition/parser.ts#L815) |
| `templateReferences` | 函数 | 否 | [src/definition/parser.ts:825-851](../src/definition/parser.ts#L825) |
| `stringifyTemplateValue` | 函数 | 否 | [src/definition/parser.ts:853-855](../src/definition/parser.ts#L853) |
| `lookupVariable` | 函数 | 否 | [src/definition/parser.ts:857-865](../src/definition/parser.ts#L857) |
| `resolveReference` | 函数 | 否 | [src/definition/parser.ts:867-882](../src/definition/parser.ts#L867) |
| `renderString` | 函数 | 否 | [src/definition/parser.ts:884-900](../src/definition/parser.ts#L884) |
| `validateTemplates` | 函数 | 否 | [src/definition/parser.ts:902-921](../src/definition/parser.ts#L902) |
| `renderTemplate` | 函数 | 是 | [src/definition/parser.ts:924-939](../src/definition/parser.ts#L924) |
| `renderCommandRequest` | 函数 | 是 | [src/definition/parser.ts:941-959](../src/definition/parser.ts#L941) |
| `renderFlowReferenceTask` | 函数 | 是 | [src/definition/parser.ts:962-968](../src/definition/parser.ts#L962) |

## [src/definition/snapshot.ts](../src/definition/snapshot.ts)

依赖：`../contracts/types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `snapshotFlowDefinition` | 函数 | 是 | [src/definition/snapshot.ts:7-63](../src/definition/snapshot.ts#L7) |
| `toMermaid` | 函数 | 否 | [src/definition/snapshot.ts:65-86](../src/definition/snapshot.ts#L65) |
| `mermaidText` | 函数 | 否 | [src/definition/snapshot.ts:88-94](../src/definition/snapshot.ts#L88) |

## [src/execution/agent.ts](../src/execution/agent.ts)

依赖：`../contracts/agent-capabilities.ts`、`../contracts/types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `assertAssembly` | 函数 | 否 | [src/execution/agent.ts:20-28](../src/execution/agent.ts#L20) |
| `AgentRunModel` | 类 | 是 | [src/execution/agent.ts:30-156](../src/execution/agent.ts#L30) |
| `AgentRunModel.start` | 方法 | 是 | [src/execution/agent.ts:41-71](../src/execution/agent.ts#L41) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/execution/agent.ts:73-144](../src/execution/agent.ts#L73) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/execution/agent.ts:146-148](../src/execution/agent.ts#L146) |
| `AgentRunModel.end` | 方法 | 是 | [src/execution/agent.ts:150-155](../src/execution/agent.ts#L150) |

## [src/execution/runtime.ts](../src/execution/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`../contracts/agent-capabilities.ts`、`../contracts/types.ts`、`../contracts/variables.ts`、`../definition/flow-loader.ts`、`../definition/parser.ts`、`../definition/snapshot.ts`、`./agent.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/execution/runtime.ts:54-54](../src/execution/runtime.ts#L54) |
| `ObservationSpec` | 类型 | 否 | [src/execution/runtime.ts:56-67](../src/execution/runtime.ts#L56) |
| `InMemoryRunStore` | 类 | 是 | [src/execution/runtime.ts:69-235](../src/execution/runtime.ts#L69) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/execution/runtime.ts:76-90](../src/execution/runtime.ts#L76) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/execution/runtime.ts:92-120](../src/execution/runtime.ts#L92) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/execution/runtime.ts:122-139](../src/execution/runtime.ts#L122) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/execution/runtime.ts:141-144](../src/execution/runtime.ts#L141) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/execution/runtime.ts:146-149](../src/execution/runtime.ts#L146) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/execution/runtime.ts:151-161](../src/execution/runtime.ts#L151) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/execution/runtime.ts:163-171](../src/execution/runtime.ts#L163) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/execution/runtime.ts:173-177](../src/execution/runtime.ts#L173) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/execution/runtime.ts:179-181](../src/execution/runtime.ts#L179) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/execution/runtime.ts:183-187](../src/execution/runtime.ts#L183) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/execution/runtime.ts:189-193](../src/execution/runtime.ts#L189) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/execution/runtime.ts:195-199](../src/execution/runtime.ts#L195) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/execution/runtime.ts:201-206](../src/execution/runtime.ts#L201) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/execution/runtime.ts:208-213](../src/execution/runtime.ts#L208) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/execution/runtime.ts:215-220](../src/execution/runtime.ts#L215) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/execution/runtime.ts:222-227](../src/execution/runtime.ts#L222) |
| `InMemoryRunStore.listChildRuns` | 方法 | 是 | [src/execution/runtime.ts:229-234](../src/execution/runtime.ts#L229) |
| `PersistedRuns` | 接口 | 否 | [src/execution/runtime.ts:237-243](../src/execution/runtime.ts#L237) |
| `JsonFileRunStore` | 类 | 是 | [src/execution/runtime.ts:246-405](../src/execution/runtime.ts#L246) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/execution/runtime.ts:257-271](../src/execution/runtime.ts#L257) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/execution/runtime.ts:273-293](../src/execution/runtime.ts#L273) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/execution/runtime.ts:295-307](../src/execution/runtime.ts#L295) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/execution/runtime.ts:309-321](../src/execution/runtime.ts#L309) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/execution/runtime.ts:323-326](../src/execution/runtime.ts#L323) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/execution/runtime.ts:328-330](../src/execution/runtime.ts#L328) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/execution/runtime.ts:332-334](../src/execution/runtime.ts#L332) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/execution/runtime.ts:336-338](../src/execution/runtime.ts#L336) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/execution/runtime.ts:340-343](../src/execution/runtime.ts#L340) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/execution/runtime.ts:345-350](../src/execution/runtime.ts#L345) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/execution/runtime.ts:352-355](../src/execution/runtime.ts#L352) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/execution/runtime.ts:357-360](../src/execution/runtime.ts#L357) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/execution/runtime.ts:362-365](../src/execution/runtime.ts#L362) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/execution/runtime.ts:367-369](../src/execution/runtime.ts#L367) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/execution/runtime.ts:371-373](../src/execution/runtime.ts#L371) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/execution/runtime.ts:375-378](../src/execution/runtime.ts#L375) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/execution/runtime.ts:380-385](../src/execution/runtime.ts#L380) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/execution/runtime.ts:387-392](../src/execution/runtime.ts#L387) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/execution/runtime.ts:394-399](../src/execution/runtime.ts#L394) |
| `JsonFileRunStore.listChildRuns` | 方法 | 是 | [src/execution/runtime.ts:401-404](../src/execution/runtime.ts#L401) |
| `ProcessCommandExecutor` | 类 | 是 | [src/execution/runtime.ts:407-438](../src/execution/runtime.ts#L407) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/execution/runtime.ts:408-437](../src/execution/runtime.ts#L408) |
| `FlowCoordinator` | 类 | 是 | [src/execution/runtime.ts:440-1902](../src/execution/runtime.ts#L440) |
| `FlowCoordinator.run` | 方法 | 是 | [src/execution/runtime.ts:478-537](../src/execution/runtime.ts#L478) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/execution/runtime.ts:540-551](../src/execution/runtime.ts#L540) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/execution/runtime.ts:554-666](../src/execution/runtime.ts#L554) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/execution/runtime.ts:668-799](../src/execution/runtime.ts#L668) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/execution/runtime.ts:801-911](../src/execution/runtime.ts#L801) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/execution/runtime.ts:913-944](../src/execution/runtime.ts#L913) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/execution/runtime.ts:946-1046](../src/execution/runtime.ts#L946) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/execution/runtime.ts:1048-1172](../src/execution/runtime.ts#L1048) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/execution/runtime.ts:1175-1195](../src/execution/runtime.ts#L1175) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/execution/runtime.ts:1197-1230](../src/execution/runtime.ts#L1197) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/execution/runtime.ts:1233-1253](../src/execution/runtime.ts#L1233) |
| `FlowCoordinator.childResultVariables` | 方法 | 否 | [src/execution/runtime.ts:1255-1271](../src/execution/runtime.ts#L1255) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/execution/runtime.ts:1273-1284](../src/execution/runtime.ts#L1273) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/execution/runtime.ts:1287-1365](../src/execution/runtime.ts#L1287) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/execution/runtime.ts:1367-1422](../src/execution/runtime.ts#L1367) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/execution/runtime.ts:1424-1462](../src/execution/runtime.ts#L1424) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/execution/runtime.ts:1464-1512](../src/execution/runtime.ts#L1464) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/execution/runtime.ts:1514-1534](../src/execution/runtime.ts#L1514) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/execution/runtime.ts:1536-1582](../src/execution/runtime.ts#L1536) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/execution/runtime.ts:1585-1621](../src/execution/runtime.ts#L1585) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/execution/runtime.ts:1623-1669](../src/execution/runtime.ts#L1623) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/execution/runtime.ts:1671-1696](../src/execution/runtime.ts#L1671) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/execution/runtime.ts:1698-1706](../src/execution/runtime.ts#L1698) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/execution/runtime.ts:1708-1730](../src/execution/runtime.ts#L1708) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/execution/runtime.ts:1732-1748](../src/execution/runtime.ts#L1732) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/execution/runtime.ts:1750-1759](../src/execution/runtime.ts#L1750) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/execution/runtime.ts:1761-1843](../src/execution/runtime.ts#L1761) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/execution/runtime.ts:1845-1874](../src/execution/runtime.ts#L1845) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/execution/runtime.ts:1876-1901](../src/execution/runtime.ts#L1876) |
| `FlowRuntimeError` | 类 | 否 | [src/execution/runtime.ts:1904-1911](../src/execution/runtime.ts#L1904) |
| `now` | 函数 | 否 | [src/execution/runtime.ts:1913-1915](../src/execution/runtime.ts#L1913) |
| `initializeVariables` | 函数 | 否 | [src/execution/runtime.ts:1917-1943](../src/execution/runtime.ts#L1917) |
| `declaredResultVariables` | 函数 | 否 | [src/execution/runtime.ts:1945-1950](../src/execution/runtime.ts#L1945) |
| `validateOutcomeVariables` | 函数 | 否 | [src/execution/runtime.ts:1952-1977](../src/execution/runtime.ts#L1952) |
| `pickDeclaredGlobalVariables` | 函数 | 否 | [src/execution/runtime.ts:1979-1988](../src/execution/runtime.ts#L1979) |
| `extractNextInput` | 函数 | 否 | [src/execution/runtime.ts:1990-2000](../src/execution/runtime.ts#L1990) |
| `toFlowError` | 函数 | 否 | [src/execution/runtime.ts:2002-2020](../src/execution/runtime.ts#L2002) |
| `fingerprintFlow` | 函数 | 是 | [src/execution/runtime.ts:2022-2056](../src/execution/runtime.ts#L2022) |
| `normalizeRun` | 函数 | 否 | [src/execution/runtime.ts:2058-2085](../src/execution/runtime.ts#L2058) |
| `normalizeNodeRun` | 函数 | 否 | [src/execution/runtime.ts:2087-2098](../src/execution/runtime.ts#L2087) |
| `displayNodeName` | 函数 | 否 | [src/execution/runtime.ts:2100-2104](../src/execution/runtime.ts#L2100) |
| `normalizeParallelRound` | 函数 | 否 | [src/execution/runtime.ts:2106-2125](../src/execution/runtime.ts#L2106) |
| `renderAgentProfile` | 函数 | 否 | [src/execution/runtime.ts:2127-2144](../src/execution/runtime.ts#L2127) |
| `renderAgentPrompt` | 函数 | 否 | [src/execution/runtime.ts:2146-2158](../src/execution/runtime.ts#L2146) |
| `renderTemplateForAgent` | 函数 | 否 | [src/execution/runtime.ts:2160-2171](../src/execution/runtime.ts#L2160) |
| `parseCommandVariables` | 函数 | 否 | [src/execution/runtime.ts:2173-2203](../src/execution/runtime.ts#L2173) |
| `isFlowValue` | 函数 | 否 | [src/execution/runtime.ts:2205-2215](../src/execution/runtime.ts#L2205) |
| `isFlowValueRecord` | 函数 | 否 | [src/execution/runtime.ts:2217-2224](../src/execution/runtime.ts#L2217) |
| `mergeParallelVariables` | 函数 | 否 | [src/execution/runtime.ts:2226-2245](../src/execution/runtime.ts#L2226) |
| `replaceObject` | 函数 | 否 | [src/execution/runtime.ts:2247-2252](../src/execution/runtime.ts#L2247) |
| `clone` | 函数 | 否 | [src/execution/runtime.ts:2254-2256](../src/execution/runtime.ts#L2254) |

## [src/index.ts](../src/index.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| 无 | - | - | - |

## [src/observability/index.ts](../src/observability/index.ts)

依赖：`../contracts/types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowRunInspectorOptions` | 接口 | 是 | [src/observability/index.ts:20-23](../src/observability/index.ts#L20) |
| `FlowObservationPublisher` | 类 | 是 | [src/observability/index.ts:26-75](../src/observability/index.ts#L26) |
| `FlowObservationPublisher.publish` | 方法 | 是 | [src/observability/index.ts:40-53](../src/observability/index.ts#L40) |
| `FlowObservationPublisher.subscribe` | 方法 | 是 | [src/observability/index.ts:55-74](../src/observability/index.ts#L55) |
| `FlowRunInspector` | 类 | 是 | [src/observability/index.ts:82-175](../src/observability/index.ts#L82) |
| `FlowRunInspector.listRecentRuns` | 方法 | 是 | [src/observability/index.ts:101-107](../src/observability/index.ts#L101) |
| `FlowRunInspector.inspectRun` | 方法 | 是 | [src/observability/index.ts:109-138](../src/observability/index.ts#L109) |
| `FlowRunInspector.inspectNodeEvidence` | 方法 | 是 | [src/observability/index.ts:140-174](../src/observability/index.ts#L140) |
| `FlowRunObservation` | 接口 | 是 | [src/observability/index.ts:177-180](../src/observability/index.ts#L177) |
| `FlowRuntime` | 类 | 是 | [src/observability/index.ts:184-247](../src/observability/index.ts#L184) |
| `FlowRuntime.listRecentRuns` | 方法 | 是 | [src/observability/index.ts:196-198](../src/observability/index.ts#L196) |
| `FlowRuntime.inspectRun` | 方法 | 是 | [src/observability/index.ts:200-202](../src/observability/index.ts#L200) |
| `FlowRuntime.inspectNodeEvidence` | 方法 | 是 | [src/observability/index.ts:204-209](../src/observability/index.ts#L204) |
| `FlowRuntime.subscribe` | 方法 | 是 | [src/observability/index.ts:211-216](../src/observability/index.ts#L211) |
| `FlowRuntime.openRunObservation` | 方法 | 是 | [src/observability/index.ts:219-246](../src/observability/index.ts#L219) |
| `formatFlowRunHistory` | 函数 | 是 | [src/observability/index.ts:249-275](../src/observability/index.ts#L249) |
| `toFlowEventEnvelope` | 函数 | 是 | [src/observability/index.ts:277-282](../src/observability/index.ts#L277) |
| `formatDestination` | 函数 | 否 | [src/observability/index.ts:284-289](../src/observability/index.ts#L284) |
| `isEvidenceReader` | 函数 | 否 | [src/observability/index.ts:291-295](../src/observability/index.ts#L291) |
| `bySequence` | 函数 | 否 | [src/observability/index.ts:297-299](../src/observability/index.ts#L297) |
| `toRunSummary` | 函数 | 否 | [src/observability/index.ts:301-315](../src/observability/index.ts#L301) |
| `toNodeRunView` | 函数 | 否 | [src/observability/index.ts:317-337](../src/observability/index.ts#L317) |
| `locateCurrent` | 函数 | 否 | [src/observability/index.ts:339-368](../src/observability/index.ts#L339) |
| `evidenceSummary` | 函数 | 否 | [src/observability/index.ts:370-378](../src/observability/index.ts#L370) |

## [src/observability/local-ui.ts](../src/observability/local-ui.ts)

依赖：`node:fs`、`node:fs/promises`、`node:http`、`node:path`、`node:url`、`../contracts/types.ts`、`../definition/flow-loader.ts`、`../execution/runtime.ts`、`./index.ts`、`./view.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `LocalFlowUiOptions` | 接口 | 是 | [src/observability/local-ui.ts:30-37](../src/observability/local-ui.ts#L30) |
| `LocalFlowUiServer` | 接口 | 是 | [src/observability/local-ui.ts:39-45](../src/observability/local-ui.ts#L39) |
| `createLocalFlowUiServer` | 函数 | 是 | [src/observability/local-ui.ts:47-109](../src/observability/local-ui.ts#L47) |
| `handleRequest` | 函数 | 否 | [src/observability/local-ui.ts:111-174](../src/observability/local-ui.ts#L111) |
| `listSessions` | 函数 | 否 | [src/observability/local-ui.ts:176-197](../src/observability/local-ui.ts#L176) |
| `inspectView` | 函数 | 否 | [src/observability/local-ui.ts:199-231](../src/observability/local-ui.ts#L199) |
| `getReadableChildRunIds` | 函数 | 否 | [src/observability/local-ui.ts:233-251](../src/observability/local-ui.ts#L233) |
| `loadMatchingFlow` | 函数 | 否 | [src/observability/local-ui.ts:253-268](../src/observability/local-ui.ts#L253) |
| `serveStatic` | 函数 | 否 | [src/observability/local-ui.ts:270-287](../src/observability/local-ui.ts#L270) |
| `contentType` | 函数 | 否 | [src/observability/local-ui.ts:289-298](../src/observability/local-ui.ts#L289) |
| `json` | 函数 | 否 | [src/observability/local-ui.ts:300-307](../src/observability/local-ui.ts#L300) |
| `listen` | 函数 | 否 | [src/observability/local-ui.ts:309-323](../src/observability/local-ui.ts#L309) |
| `isAddressInUse` | 函数 | 否 | [src/observability/local-ui.ts:325-332](../src/observability/local-ui.ts#L325) |

## [src/observability/view.ts](../src/observability/view.ts)

依赖：`../contracts/types.ts`、`../definition/snapshot.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowDefinitionView` | 类型 | 是 | [src/observability/view.ts:13-13](../src/observability/view.ts#L13) |
| `FlowSessionListItem` | 接口 | 是 | [src/observability/view.ts:15-30](../src/observability/view.ts#L15) |
| `FlowRunView` | 接口 | 是 | [src/observability/view.ts:32-42](../src/observability/view.ts#L32) |
| `serializeFlowDefinition` | 函数 | 是 | [src/observability/view.ts:44-49](../src/observability/view.ts#L44) |
| `toSessionListItem` | 函数 | 是 | [src/observability/view.ts:51-84](../src/observability/view.ts#L51) |
| `currentLocationLabel` | 函数 | 是 | [src/observability/view.ts:86-92](../src/observability/view.ts#L86) |
| `nodeVisitSummary` | 函数 | 是 | [src/observability/view.ts:94-100](../src/observability/view.ts#L94) |

## [src/pi/adapter.ts](../src/pi/adapter.ts)

依赖：`node:crypto`、`@earendil-works/pi-coding-agent`、`typebox`、`../contracts/agent-capabilities.ts`、`../contracts/types.ts`、`../observability/index.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi/adapter.ts:30-36](../src/pi/adapter.ts#L30) |
| `SdkHandle` | 接口 | 否 | [src/pi/adapter.ts:38-44](../src/pi/adapter.ts#L38) |
| `PendingCliNode` | 接口 | 否 | [src/pi/adapter.ts:46-56](../src/pi/adapter.ts#L46) |
| `flowOutcomeParametersSchema` | 函数 | 否 | [src/pi/adapter.ts:70-80](../src/pi/adapter.ts#L70) |
| `validateVariableName` | 函数 | 否 | [src/pi/adapter.ts:82-89](../src/pi/adapter.ts#L82) |
| `validateJsonValue` | 函数 | 否 | [src/pi/adapter.ts:91-128](../src/pi/adapter.ts#L91) |
| `submissionVariables` | 函数 | 否 | [src/pi/adapter.ts:130-144](../src/pi/adapter.ts#L130) |
| `missingOutcomeRetryPrompt` | 函数 | 否 | [src/pi/adapter.ts:148-150](../src/pi/adapter.ts#L148) |
| `PiCliBridge` | 接口 | 是 | [src/pi/adapter.ts:152-161](../src/pi/adapter.ts#L152) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi/adapter.ts:163-168](../src/pi/adapter.ts#L163) |
| `PiAgentProfilePlugin` | 接口 | 是 | [src/pi/adapter.ts:170-175](../src/pi/adapter.ts#L170) |
| `PiAgentProfileDefinition` | 接口 | 是 | [src/pi/adapter.ts:177-183](../src/pi/adapter.ts#L177) |
| `PiAgentProfileContribution` | 接口 | 是 | [src/pi/adapter.ts:185-199](../src/pi/adapter.ts#L185) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi/adapter.ts:202-680](../src/pi/adapter.ts#L202) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi/adapter.ts:212-228](../src/pi/adapter.ts#L212) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi/adapter.ts:230-273](../src/pi/adapter.ts#L230) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi/adapter.ts:275-313](../src/pi/adapter.ts#L275) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi/adapter.ts:315-330](../src/pi/adapter.ts#L315) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi/adapter.ts:332-340](../src/pi/adapter.ts#L332) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi/adapter.ts:343-357](../src/pi/adapter.ts#L343) |
| `PiAgentIntegrationAdapter.hasPendingCliOutcome` | 方法 | 是 | [src/pi/adapter.ts:360-362](../src/pi/adapter.ts#L360) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi/adapter.ts:365-407](../src/pi/adapter.ts#L365) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi/adapter.ts:409-442](../src/pi/adapter.ts#L409) |
| `PiAgentIntegrationAdapter.createSdkSession` | 方法 | 否 | [src/pi/adapter.ts:444-528](../src/pi/adapter.ts#L444) |
| `PiAgentIntegrationAdapter.resolveProfile` | 方法 | 否 | [src/pi/adapter.ts:530-586](../src/pi/adapter.ts#L530) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi/adapter.ts:588-612](../src/pi/adapter.ts#L588) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi/adapter.ts:614-645](../src/pi/adapter.ts#L614) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi/adapter.ts:647-662](../src/pi/adapter.ts#L647) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi/adapter.ts:665-679](../src/pi/adapter.ts#L665) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi/adapter.ts:682-713](../src/pi/adapter.ts#L682) |
| `createFlowInspectionTool` | 函数 | 是 | [src/pi/adapter.ts:716-742](../src/pi/adapter.ts#L716) |
| `nodeSession` | 函数 | 否 | [src/pi/adapter.ts:744-754](../src/pi/adapter.ts#L744) |
| `interactionReference` | 函数 | 否 | [src/pi/adapter.ts:756-761](../src/pi/adapter.ts#L756) |
| `parseInteractionReference` | 函数 | 否 | [src/pi/adapter.ts:763-773](../src/pi/adapter.ts#L763) |
| `messagesFromEntries` | 函数 | 否 | [src/pi/adapter.ts:775-803](../src/pi/adapter.ts#L775) |
| `sameCapabilities` | 函数 | 否 | [src/pi/adapter.ts:805-815](../src/pi/adapter.ts#L805) |
| `assertAssemblyIdentity` | 函数 | 否 | [src/pi/adapter.ts:817-824](../src/pi/adapter.ts#L817) |
| `assertSubset` | 函数 | 否 | [src/pi/adapter.ts:826-837](../src/pi/adapter.ts#L826) |
| `assertUnique` | 函数 | 否 | [src/pi/adapter.ts:839-847](../src/pi/adapter.ts#L839) |
| `digest` | 函数 | 否 | [src/pi/adapter.ts:849-851](../src/pi/adapter.ts#L849) |
| `stableJson` | 函数 | 否 | [src/pi/adapter.ts:853-862](../src/pi/adapter.ts#L853) |
| `normalizeRole` | 函数 | 否 | [src/pi/adapter.ts:864-868](../src/pi/adapter.ts#L864) |

## [src/pi/cli-state.ts](../src/pi/cli-state.ts)

依赖：`@earendil-works/pi-coding-agent`、`../contracts/types.ts`、`../observability/index.ts`、`../observability/local-ui.ts`、`./adapter.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSessionReplacement` | 接口 | 否 | [src/pi/cli-state.ts:10-13](../src/pi/cli-state.ts#L10) |
| `CliFlowState` | 接口 | 是 | [src/pi/cli-state.ts:15-33](../src/pi/cli-state.ts#L15) |
| `getCliFlowState` | 函数 | 是 | [src/pi/cli-state.ts:39-46](../src/pi/cli-state.ts#L39) |
| `rejectPendingSessionReplacement` | 函数 | 是 | [src/pi/cli-state.ts:48-53](../src/pi/cli-state.ts#L48) |

## [src/pi/extension.ts](../src/pi/extension.ts)

依赖：`node:crypto`、`node:fs/promises`、`node:path`、`@earendil-works/pi-coding-agent`、`../contracts/types.ts`、`../contracts/variables.ts`、`../definition/flow-loader.ts`、`../execution/agent.ts`、`../execution/runtime.ts`、`../observability/index.ts`、`../observability/local-ui.ts`、`./adapter.ts`、`./cli-state.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `flowExtension` | 函数 | 是 | [src/pi/extension.ts:39-608](../src/pi/extension.ts#L39) |
| `createRuntimeForContext` | 函数 | 否 | [src/pi/extension.ts:610-616](../src/pi/extension.ts#L610) |
| `flowEventMessage` | 函数 | 否 | [src/pi/extension.ts:618-625](../src/pi/extension.ts#L618) |
| `formatRunSummaryOption` | 函数 | 否 | [src/pi/extension.ts:627-629](../src/pi/extension.ts#L627) |
| `formatRecentRuns` | 函数 | 否 | [src/pi/extension.ts:631-636](../src/pi/extension.ts#L631) |
