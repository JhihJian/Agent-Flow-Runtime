# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/cli-state.ts](../src/cli-state.ts)

依赖：`@earendil-works/pi-coding-agent`、`./pi.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSessionReplacement` | 接口 | 否 | [src/cli-state.ts:4-7](../src/cli-state.ts#L4) |
| `CliFlowState` | 接口 | 是 | [src/cli-state.ts:9-19](../src/cli-state.ts#L9) |
| `getCliFlowState` | 函数 | 是 | [src/cli-state.ts:25-32](../src/cli-state.ts#L25) |
| `rejectPendingSessionReplacement` | 函数 | 是 | [src/cli-state.ts:34-39](../src/cli-state.ts#L34) |

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

依赖：`node:fs/promises`、`node:path`、`@earendil-works/pi-coding-agent`、`./cli-state.ts`、`./parser.ts`、`./pi.ts`、`./runtime.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `flowExtension` | 函数 | 是 | [src/extension.ts:21-234](../src/extension.ts#L21) |
| `loadFlow` | 函数 | 否 | [src/extension.ts:236-238](../src/extension.ts#L236) |

## [src/index.ts](../src/index.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| 无 | - | - | - |

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

依赖：`@earendil-works/pi-coding-agent`、`typebox`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSdkNode` | 接口 | 否 | [src/pi.ts:19-25](../src/pi.ts#L19) |
| `SdkHandle` | 接口 | 否 | [src/pi.ts:27-32](../src/pi.ts#L27) |
| `PendingCliNode` | 接口 | 否 | [src/pi.ts:34-39](../src/pi.ts#L34) |
| `PiCliBridge` | 接口 | 是 | [src/pi.ts:41-50](../src/pi.ts#L41) |
| `PiAgentAdapterOptions` | 接口 | 是 | [src/pi.ts:52-56](../src/pi.ts#L52) |
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:59-321](../src/pi.ts#L59) |
| `PiAgentIntegrationAdapter.createAgent` | 方法 | 是 | [src/pi.ts:69-78](../src/pi.ts#L69) |
| `PiAgentIntegrationAdapter.takeOverAgent` | 方法 | 是 | [src/pi.ts:80-104](../src/pi.ts#L80) |
| `PiAgentIntegrationAdapter.executeNode` | 方法 | 是 | [src/pi.ts:106-139](../src/pi.ts#L106) |
| `PiAgentIntegrationAdapter.getNodeSession` | 方法 | 是 | [src/pi.ts:141-156](../src/pi.ts#L141) |
| `PiAgentIntegrationAdapter.releaseAgent` | 方法 | 是 | [src/pi.ts:158-166](../src/pi.ts#L158) |
| `PiAgentIntegrationAdapter.submitCliOutcome` | 方法 | 是 | [src/pi.ts:169-177](../src/pi.ts#L169) |
| `PiAgentIntegrationAdapter.finalizeCliTurn` | 方法 | 是 | [src/pi.ts:180-208](../src/pi.ts#L180) |
| `PiAgentIntegrationAdapter.createSdkConnection` | 方法 | 否 | [src/pi.ts:210-233](../src/pi.ts#L210) |
| `PiAgentIntegrationAdapter.createCliConnection` | 方法 | 否 | [src/pi.ts:235-244](../src/pi.ts#L235) |
| `PiAgentIntegrationAdapter.executeCliNode` | 方法 | 否 | [src/pi.ts:246-268](../src/pi.ts#L246) |
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:270-301](../src/pi.ts#L270) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:303-320](../src/pi.ts#L303) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:323-355](../src/pi.ts#L323) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:357-367](../src/pi.ts#L357) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:369-374](../src/pi.ts#L369) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:376-386](../src/pi.ts#L376) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:388-416](../src/pi.ts#L388) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:418-422](../src/pi.ts#L418) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:24-66](../src/runtime.ts#L24) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:28-31](../src/runtime.ts#L28) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:33-36](../src/runtime.ts#L33) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:38-41](../src/runtime.ts#L38) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:43-47](../src/runtime.ts#L43) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:49-53](../src/runtime.ts#L49) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:55-59](../src/runtime.ts#L55) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:61-65](../src/runtime.ts#L61) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:68-71](../src/runtime.ts#L68) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:73-143](../src/runtime.ts#L73) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:83-95](../src/runtime.ts#L83) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:97-104](../src/runtime.ts#L97) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:106-111](../src/runtime.ts#L106) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:113-115](../src/runtime.ts#L113) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:117-119](../src/runtime.ts#L117) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:121-124](../src/runtime.ts#L121) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:126-129](../src/runtime.ts#L126) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:131-133](../src/runtime.ts#L131) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:135-137](../src/runtime.ts#L135) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:139-142](../src/runtime.ts#L139) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:145-175](../src/runtime.ts#L145) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:146-174](../src/runtime.ts#L146) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:177-278](../src/runtime.ts#L177) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:185-209](../src/runtime.ts#L185) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:211-266](../src/runtime.ts#L211) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:268-270](../src/runtime.ts#L268) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:272-277](../src/runtime.ts#L272) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:280-481](../src/runtime.ts#L280) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:298-395](../src/runtime.ts#L298) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:397-421](../src/runtime.ts#L397) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:423-472](../src/runtime.ts#L423) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:474-480](../src/runtime.ts#L474) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:483-494](../src/runtime.ts#L483) |
| `clone` | 函数 | 否 | [src/runtime.ts:496-498](../src/runtime.ts#L496) |

## [src/types.ts](../src/types.ts)

依赖：无

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FlowValue` | 类型 | 是 | [src/types.ts:1-7](../src/types.ts#L1) |
| `AgentActionKind` | 类型 | 是 | [src/types.ts:9-9](../src/types.ts#L9) |
| `AgentAction` | 接口 | 是 | [src/types.ts:11-14](../src/types.ts#L11) |
| `CommandRequest` | 接口 | 是 | [src/types.ts:16-20](../src/types.ts#L16) |
| `CommandAction` | 接口 | 是 | [src/types.ts:22-26](../src/types.ts#L22) |
| `FlowAction` | 类型 | 是 | [src/types.ts:28-28](../src/types.ts#L28) |
| `FlowNode` | 接口 | 是 | [src/types.ts:30-36](../src/types.ts#L30) |
| `FlowDestination` | 类型 | 是 | [src/types.ts:38-41](../src/types.ts#L38) |
| `ParallelStart` | 接口 | 是 | [src/types.ts:43-47](../src/types.ts#L43) |
| `FlowDefinition` | 接口 | 是 | [src/types.ts:49-56](../src/types.ts#L49) |
| `OutcomeOption` | 接口 | 是 | [src/types.ts:58-61](../src/types.ts#L58) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:63-66](../src/types.ts#L63) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:68-72](../src/types.ts#L68) |
| `NodeSession` | 接口 | 是 | [src/types.ts:74-78](../src/types.ts#L74) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:80-84](../src/types.ts#L80) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:86-90](../src/types.ts#L86) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:92-111](../src/types.ts#L92) |
| `CommandResult` | 接口 | 是 | [src/types.ts:113-118](../src/types.ts#L113) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:120-122](../src/types.ts#L120) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:124-133](../src/types.ts#L124) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:135-140](../src/types.ts#L135) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:142-152](../src/types.ts#L142) |
| `RunStore` | 接口 | 是 | [src/types.ts:154-162](../src/types.ts#L154) |
