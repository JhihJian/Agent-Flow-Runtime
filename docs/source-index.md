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
| `FlowRunRecord` | 接口 | 是 | [src/contracts/types.ts:339-372](../src/contracts/types.ts#L339) |
| `RunFactCommit` | 接口 | 是 | [src/contracts/types.ts:375-382](../src/contracts/types.ts#L375) |
| `FlowRunSnapshot` | 接口 | 是 | [src/contracts/types.ts:385-391](../src/contracts/types.ts#L385) |
| `TemplateContext` | 接口 | 是 | [src/contracts/types.ts:393-397](../src/contracts/types.ts#L393) |
| `RunStore` | 接口 | 是 | [src/contracts/types.ts:399-417](../src/contracts/types.ts#L399) |
| `FlowRunSummary` | 接口 | 是 | [src/contracts/types.ts:419-430](../src/contracts/types.ts#L419) |
| `FlowRunLocation` | 类型 | 是 | [src/contracts/types.ts:432-444](../src/contracts/types.ts#L432) |
| `FlowNodeEvidenceSummary` | 接口 | 是 | [src/contracts/types.ts:446-450](../src/contracts/types.ts#L446) |
| `FlowNodeRunView` | 接口 | 是 | [src/contracts/types.ts:452-470](../src/contracts/types.ts#L452) |
| `FlowRunHistory` | 接口 | 是 | [src/contracts/types.ts:473-481](../src/contracts/types.ts#L473) |
| `FlowNodeEvidence` | 接口 | 是 | [src/contracts/types.ts:483-500](../src/contracts/types.ts#L483) |
| `FlowNodeEvidenceReader` | 接口 | 是 | [src/contracts/types.ts:502-504](../src/contracts/types.ts#L502) |
| `FlowNodeEvidenceAccessRequest` | 接口 | 是 | [src/contracts/types.ts:506-509](../src/contracts/types.ts#L506) |
| `FlowNodeEvidenceAuthorizer` | 类型 | 是 | [src/contracts/types.ts:511-513](../src/contracts/types.ts#L511) |
| `FlowRunInspectorApi` | 接口 | 是 | [src/contracts/types.ts:515-522](../src/contracts/types.ts#L515) |
| `FlowObservationEventType` | 类型 | 是 | [src/contracts/types.ts:524-536](../src/contracts/types.ts#L524) |
| `FlowObservationEvent` | 接口 | 是 | [src/contracts/types.ts:538-557](../src/contracts/types.ts#L538) |
| `FlowObservationSubscription` | 接口 | 是 | [src/contracts/types.ts:559-561](../src/contracts/types.ts#L559) |
| `FlowObservationPublisherApi` | 接口 | 是 | [src/contracts/types.ts:563-569](../src/contracts/types.ts#L563) |
| `FlowObservationPublisherOptions` | 接口 | 是 | [src/contracts/types.ts:571-573](../src/contracts/types.ts#L571) |

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
| `loadFlow` | 函数 | 是 | [src/definition/flow-loader.ts:24-28](../src/definition/flow-loader.ts#L24) |
| `loadFlowPackage` | 函数 | 是 | [src/definition/flow-loader.ts:31-69](../src/definition/flow-loader.ts#L31) |
| `loadReferenceClosure` | 函数 | 否 | [src/definition/flow-loader.ts:75-99](../src/definition/flow-loader.ts#L75) |
| `collectReferenceIds` | 函数 | 否 | [src/definition/flow-loader.ts:101-107](../src/definition/flow-loader.ts#L101) |
| `resolvePromptResources` | 函数 | 是 | [src/definition/flow-loader.ts:110-120](../src/definition/flow-loader.ts#L110) |
| `resolveCommandResources` | 函数 | 是 | [src/definition/flow-loader.ts:123-136](../src/definition/flow-loader.ts#L123) |
| `validatePackageResources` | 函数 | 否 | [src/definition/flow-loader.ts:138-167](../src/definition/flow-loader.ts#L138) |
| `validateResource` | 函数 | 否 | [src/definition/flow-loader.ts:169-190](../src/definition/flow-loader.ts#L169) |
| `resolveResource` | 函数 | 否 | [src/definition/flow-loader.ts:192-200](../src/definition/flow-loader.ts#L192) |
| `resourcePath` | 函数 | 否 | [src/definition/flow-loader.ts:202-212](../src/definition/flow-loader.ts#L202) |
| `isResourcePath` | 函数 | 否 | [src/definition/flow-loader.ts:214-223](../src/definition/flow-loader.ts#L214) |
| `isInside` | 函数 | 否 | [src/definition/flow-loader.ts:225-228](../src/definition/flow-loader.ts#L225) |

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

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`../contracts/agent-capabilities.ts`、`../contracts/types.ts`、`../contracts/variables.ts`、`../definition/flow-loader.ts`、`../definition/parser.ts`、`./agent.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/execution/runtime.ts:53-53](../src/execution/runtime.ts#L53) |
| `ObservationSpec` | 类型 | 否 | [src/execution/runtime.ts:55-66](../src/execution/runtime.ts#L55) |
| `InMemoryRunStore` | 类 | 是 | [src/execution/runtime.ts:68-234](../src/execution/runtime.ts#L68) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/execution/runtime.ts:75-89](../src/execution/runtime.ts#L75) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/execution/runtime.ts:91-119](../src/execution/runtime.ts#L91) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/execution/runtime.ts:121-138](../src/execution/runtime.ts#L121) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/execution/runtime.ts:140-143](../src/execution/runtime.ts#L140) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/execution/runtime.ts:145-148](../src/execution/runtime.ts#L145) |
| `InMemoryRunStore.getRunSnapshot` | 方法 | 是 | [src/execution/runtime.ts:150-160](../src/execution/runtime.ts#L150) |
| `InMemoryRunStore.recordsFor` | 方法 | 否 | [src/execution/runtime.ts:162-170](../src/execution/runtime.ts#L162) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/execution/runtime.ts:172-176](../src/execution/runtime.ts#L172) |
| `InMemoryRunStore.listAllRuns` | 方法 | 是 | [src/execution/runtime.ts:178-180](../src/execution/runtime.ts#L178) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/execution/runtime.ts:182-186](../src/execution/runtime.ts#L182) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/execution/runtime.ts:188-192](../src/execution/runtime.ts#L188) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/execution/runtime.ts:194-198](../src/execution/runtime.ts#L194) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/execution/runtime.ts:200-205](../src/execution/runtime.ts#L200) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/execution/runtime.ts:207-212](../src/execution/runtime.ts#L207) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/execution/runtime.ts:214-219](../src/execution/runtime.ts#L214) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/execution/runtime.ts:221-226](../src/execution/runtime.ts#L221) |
| `InMemoryRunStore.listChildRuns` | 方法 | 是 | [src/execution/runtime.ts:228-233](../src/execution/runtime.ts#L228) |
| `PersistedRuns` | 接口 | 否 | [src/execution/runtime.ts:236-242](../src/execution/runtime.ts#L236) |
| `JsonFileRunStore` | 类 | 是 | [src/execution/runtime.ts:245-404](../src/execution/runtime.ts#L245) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/execution/runtime.ts:256-270](../src/execution/runtime.ts#L256) |
| `JsonFileRunStore.loadPersisted` | 方法 | 否 | [src/execution/runtime.ts:272-292](../src/execution/runtime.ts#L272) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/execution/runtime.ts:294-306](../src/execution/runtime.ts#L294) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/execution/runtime.ts:308-320](../src/execution/runtime.ts#L308) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/execution/runtime.ts:322-325](../src/execution/runtime.ts#L322) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/execution/runtime.ts:327-329](../src/execution/runtime.ts#L327) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/execution/runtime.ts:331-333](../src/execution/runtime.ts#L331) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/execution/runtime.ts:335-337](../src/execution/runtime.ts#L335) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/execution/runtime.ts:339-342](../src/execution/runtime.ts#L339) |
| `JsonFileRunStore.getRunSnapshot` | 方法 | 是 | [src/execution/runtime.ts:344-349](../src/execution/runtime.ts#L344) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/execution/runtime.ts:351-354](../src/execution/runtime.ts#L351) |
| `JsonFileRunStore.listAllRuns` | 方法 | 是 | [src/execution/runtime.ts:356-359](../src/execution/runtime.ts#L356) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/execution/runtime.ts:361-364](../src/execution/runtime.ts#L361) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/execution/runtime.ts:366-368](../src/execution/runtime.ts#L366) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/execution/runtime.ts:370-372](../src/execution/runtime.ts#L370) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/execution/runtime.ts:374-377](../src/execution/runtime.ts#L374) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/execution/runtime.ts:379-384](../src/execution/runtime.ts#L379) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/execution/runtime.ts:386-391](../src/execution/runtime.ts#L386) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/execution/runtime.ts:393-398](../src/execution/runtime.ts#L393) |
| `JsonFileRunStore.listChildRuns` | 方法 | 是 | [src/execution/runtime.ts:400-403](../src/execution/runtime.ts#L400) |
| `ProcessCommandExecutor` | 类 | 是 | [src/execution/runtime.ts:406-437](../src/execution/runtime.ts#L406) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/execution/runtime.ts:407-436](../src/execution/runtime.ts#L407) |
| `FlowCoordinator` | 类 | 是 | [src/execution/runtime.ts:439-1897](../src/execution/runtime.ts#L439) |
| `FlowCoordinator.run` | 方法 | 是 | [src/execution/runtime.ts:477-532](../src/execution/runtime.ts#L477) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/execution/runtime.ts:535-546](../src/execution/runtime.ts#L535) |
| `FlowCoordinator.resumeRun` | 方法 | 否 | [src/execution/runtime.ts:549-661](../src/execution/runtime.ts#L549) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/execution/runtime.ts:663-794](../src/execution/runtime.ts#L663) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/execution/runtime.ts:796-906](../src/execution/runtime.ts#L796) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/execution/runtime.ts:908-939](../src/execution/runtime.ts#L908) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/execution/runtime.ts:941-1041](../src/execution/runtime.ts#L941) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/execution/runtime.ts:1043-1167](../src/execution/runtime.ts#L1043) |
| `FlowCoordinator.executeFlowReference` | 方法 | 否 | [src/execution/runtime.ts:1170-1190](../src/execution/runtime.ts#L1170) |
| `FlowCoordinator.startChildRun` | 方法 | 否 | [src/execution/runtime.ts:1192-1225](../src/execution/runtime.ts#L1192) |
| `FlowCoordinator.childOutcome` | 方法 | 否 | [src/execution/runtime.ts:1228-1248](../src/execution/runtime.ts#L1228) |
| `FlowCoordinator.childResultVariables` | 方法 | 否 | [src/execution/runtime.ts:1250-1266](../src/execution/runtime.ts#L1250) |
| `FlowCoordinator.coordinatorFor` | 方法 | 否 | [src/execution/runtime.ts:1268-1279](../src/execution/runtime.ts#L1268) |
| `FlowCoordinator.resumeFlowReferenceNode` | 方法 | 否 | [src/execution/runtime.ts:1282-1360](../src/execution/runtime.ts#L1282) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/execution/runtime.ts:1362-1417](../src/execution/runtime.ts#L1362) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/execution/runtime.ts:1419-1457](../src/execution/runtime.ts#L1419) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/execution/runtime.ts:1459-1507](../src/execution/runtime.ts#L1459) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/execution/runtime.ts:1509-1529](../src/execution/runtime.ts#L1509) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/execution/runtime.ts:1531-1577](../src/execution/runtime.ts#L1531) |
| `FlowCoordinator.interruptActiveChildRuns` | 方法 | 否 | [src/execution/runtime.ts:1580-1616](../src/execution/runtime.ts#L1580) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/execution/runtime.ts:1618-1664](../src/execution/runtime.ts#L1618) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/execution/runtime.ts:1666-1691](../src/execution/runtime.ts#L1666) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/execution/runtime.ts:1693-1701](../src/execution/runtime.ts#L1693) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/execution/runtime.ts:1703-1725](../src/execution/runtime.ts#L1703) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/execution/runtime.ts:1727-1743](../src/execution/runtime.ts#L1727) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/execution/runtime.ts:1745-1754](../src/execution/runtime.ts#L1745) |
| `FlowCoordinator.publishObservationChanges` | 方法 | 否 | [src/execution/runtime.ts:1756-1838](../src/execution/runtime.ts#L1756) |
| `FlowCoordinator.publishObservation` | 方法 | 否 | [src/execution/runtime.ts:1840-1869](../src/execution/runtime.ts#L1840) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/execution/runtime.ts:1871-1896](../src/execution/runtime.ts#L1871) |
| `FlowRuntimeError` | 类 | 否 | [src/execution/runtime.ts:1899-1906](../src/execution/runtime.ts#L1899) |
| `now` | 函数 | 否 | [src/execution/runtime.ts:1908-1910](../src/execution/runtime.ts#L1908) |
| `initializeVariables` | 函数 | 否 | [src/execution/runtime.ts:1912-1938](../src/execution/runtime.ts#L1912) |
| `declaredResultVariables` | 函数 | 否 | [src/execution/runtime.ts:1940-1945](../src/execution/runtime.ts#L1940) |
| `validateOutcomeVariables` | 函数 | 否 | [src/execution/runtime.ts:1947-1972](../src/execution/runtime.ts#L1947) |
| `pickDeclaredGlobalVariables` | 函数 | 否 | [src/execution/runtime.ts:1974-1983](../src/execution/runtime.ts#L1974) |
| `extractNextInput` | 函数 | 否 | [src/execution/runtime.ts:1985-1995](../src/execution/runtime.ts#L1985) |
| `toFlowError` | 函数 | 否 | [src/execution/runtime.ts:1997-2015](../src/execution/runtime.ts#L1997) |
| `fingerprintFlow` | 函数 | 是 | [src/execution/runtime.ts:2017-2051](../src/execution/runtime.ts#L2017) |
| `normalizeRun` | 函数 | 否 | [src/execution/runtime.ts:2053-2080](../src/execution/runtime.ts#L2053) |
| `normalizeNodeRun` | 函数 | 否 | [src/execution/runtime.ts:2082-2093](../src/execution/runtime.ts#L2082) |
| `displayNodeName` | 函数 | 否 | [src/execution/runtime.ts:2095-2099](../src/execution/runtime.ts#L2095) |
| `normalizeParallelRound` | 函数 | 否 | [src/execution/runtime.ts:2101-2120](../src/execution/runtime.ts#L2101) |
| `renderAgentProfile` | 函数 | 否 | [src/execution/runtime.ts:2122-2139](../src/execution/runtime.ts#L2122) |
| `renderAgentPrompt` | 函数 | 否 | [src/execution/runtime.ts:2141-2153](../src/execution/runtime.ts#L2141) |
| `renderTemplateForAgent` | 函数 | 否 | [src/execution/runtime.ts:2155-2166](../src/execution/runtime.ts#L2155) |
| `parseCommandVariables` | 函数 | 否 | [src/execution/runtime.ts:2168-2198](../src/execution/runtime.ts#L2168) |
| `isFlowValue` | 函数 | 否 | [src/execution/runtime.ts:2200-2210](../src/execution/runtime.ts#L2200) |
| `isFlowValueRecord` | 函数 | 否 | [src/execution/runtime.ts:2212-2219](../src/execution/runtime.ts#L2212) |
| `mergeParallelVariables` | 函数 | 否 | [src/execution/runtime.ts:2221-2240](../src/execution/runtime.ts#L2221) |
| `replaceObject` | 函数 | 否 | [src/execution/runtime.ts:2242-2247](../src/execution/runtime.ts#L2242) |
| `clone` | 函数 | 否 | [src/execution/runtime.ts:2249-2251](../src/execution/runtime.ts#L2249) |

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
| `LocalFlowUiOptions` | 接口 | 是 | [src/observability/local-ui.ts:29-36](../src/observability/local-ui.ts#L29) |
| `LocalFlowUiServer` | 接口 | 是 | [src/observability/local-ui.ts:38-44](../src/observability/local-ui.ts#L38) |
| `createLocalFlowUiServer` | 函数 | 是 | [src/observability/local-ui.ts:46-108](../src/observability/local-ui.ts#L46) |
| `handleRequest` | 函数 | 否 | [src/observability/local-ui.ts:110-168](../src/observability/local-ui.ts#L110) |
| `listSessions` | 函数 | 否 | [src/observability/local-ui.ts:170-188](../src/observability/local-ui.ts#L170) |
| `inspectView` | 函数 | 否 | [src/observability/local-ui.ts:190-221](../src/observability/local-ui.ts#L190) |
| `resolveFlowName` | 函数 | 否 | [src/observability/local-ui.ts:223-232](../src/observability/local-ui.ts#L223) |
| `serveStatic` | 函数 | 否 | [src/observability/local-ui.ts:234-251](../src/observability/local-ui.ts#L234) |
| `contentType` | 函数 | 否 | [src/observability/local-ui.ts:253-262](../src/observability/local-ui.ts#L253) |
| `json` | 函数 | 否 | [src/observability/local-ui.ts:264-271](../src/observability/local-ui.ts#L264) |
| `listen` | 函数 | 否 | [src/observability/local-ui.ts:273-287](../src/observability/local-ui.ts#L273) |
| `isAddressInUse` | 函数 | 否 | [src/observability/local-ui.ts:289-296](../src/observability/local-ui.ts#L289) |

## [src/observability/view.ts](../src/observability/view.ts)

依赖：`../contracts/types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowDefinitionView` | 接口 | 是 | [src/observability/view.ts:14-39](../src/observability/view.ts#L14) |
| `FlowSessionListItem` | 接口 | 是 | [src/observability/view.ts:41-56](../src/observability/view.ts#L41) |
| `FlowRunView` | 接口 | 是 | [src/observability/view.ts:58-62](../src/observability/view.ts#L58) |
| `serializeFlowDefinition` | 函数 | 是 | [src/observability/view.ts:64-116](../src/observability/view.ts#L64) |
| `toSessionListItem` | 函数 | 是 | [src/observability/view.ts:118-151](../src/observability/view.ts#L118) |
| `currentLocationLabel` | 函数 | 是 | [src/observability/view.ts:153-159](../src/observability/view.ts#L153) |
| `nodeVisitSummary` | 函数 | 是 | [src/observability/view.ts:161-167](../src/observability/view.ts#L161) |
| `serializeParallel` | 函数 | 否 | [src/observability/view.ts:169-175](../src/observability/view.ts#L169) |
| `toMermaid` | 函数 | 否 | [src/observability/view.ts:177-198](../src/observability/view.ts#L177) |
| `mermaidText` | 函数 | 否 | [src/observability/view.ts:200-206](../src/observability/view.ts#L200) |

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
