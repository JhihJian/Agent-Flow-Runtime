# 源码符号索引

本文件由 `npm run docs:source-index` 使用 `ts-morph` 生成，请勿手动编辑。它列出顶层函数、类、类方法、接口和类型别名的静态位置，不替代运行时行为说明。函数级控制流、伪代码及其链接见[源码逻辑阅读图](source-pseudocode-guide.md)。

## [src/cli-state.ts](../src/cli-state.ts)

依赖：`@earendil-works/pi-coding-agent`、`./pi.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `PendingSessionReplacement` | 接口 | 否 | [src/cli-state.ts:4-7](../src/cli-state.ts#L4) |
| `CliFlowState` | 接口 | 是 | [src/cli-state.ts:9-21](../src/cli-state.ts#L9) |
| `getCliFlowState` | 函数 | 是 | [src/cli-state.ts:27-34](../src/cli-state.ts#L27) |
| `rejectPendingSessionReplacement` | 函数 | 是 | [src/cli-state.ts:36-41](../src/cli-state.ts#L36) |

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
| `flowExtension` | 函数 | 是 | [src/extension.ts:21-326](../src/extension.ts#L21) |
| `loadFlow` | 函数 | 否 | [src/extension.ts:328-330](../src/extension.ts#L328) |

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
| `PiAgentIntegrationAdapter` | 类 | 是 | [src/pi.ts:59-341](../src/pi.ts#L59) |
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
| `PiAgentIntegrationAdapter.flowOutcomeTool` | 方法 | 否 | [src/pi.ts:270-306](../src/pi.ts#L270) |
| `PiAgentIntegrationAdapter.submitSdkOutcome` | 方法 | 否 | [src/pi.ts:308-323](../src/pi.ts#L308) |
| `PiAgentIntegrationAdapter.resolvePending` | 方法 | 否 | [src/pi.ts:326-340](../src/pi.ts#L326) |
| `createFlowOutcomeTool` | 函数 | 是 | [src/pi.ts:343-375](../src/pi.ts#L343) |
| `nodeSession` | 函数 | 否 | [src/pi.ts:377-387](../src/pi.ts#L377) |
| `interactionReference` | 函数 | 否 | [src/pi.ts:389-394](../src/pi.ts#L389) |
| `parseInteractionReference` | 函数 | 否 | [src/pi.ts:396-406](../src/pi.ts#L396) |
| `messagesFromEntries` | 函数 | 否 | [src/pi.ts:408-436](../src/pi.ts#L408) |
| `normalizeRole` | 函数 | 否 | [src/pi.ts:438-442](../src/pi.ts#L438) |

## [src/runtime.ts](../src/runtime.ts)

依赖：`node:child_process`、`node:crypto`、`node:fs/promises`、`node:path`、`./parser.ts`、`./types.ts`

| 符号 | 类别 | 外部可见 | 位置 |
| --- | --- | --- | --- |
| `FactChanges` | 类型 | 否 | [src/runtime.ts:31-31](../src/runtime.ts#L31) |
| `InMemoryRunStore` | 类 | 是 | [src/runtime.ts:33-166](../src/runtime.ts#L33) |
| `InMemoryRunStore.createRun` | 方法 | 是 | [src/runtime.ts:40-54](../src/runtime.ts#L40) |
| `InMemoryRunStore.commit` | 方法 | 是 | [src/runtime.ts:56-84](../src/runtime.ts#L56) |
| `InMemoryRunStore.validateFactRecords` | 方法 | 否 | [src/runtime.ts:86-103](../src/runtime.ts#L86) |
| `InMemoryRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:105-108](../src/runtime.ts#L105) |
| `InMemoryRunStore.getRun` | 方法 | 是 | [src/runtime.ts:110-113](../src/runtime.ts#L110) |
| `InMemoryRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:115-119](../src/runtime.ts#L115) |
| `InMemoryRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:121-125](../src/runtime.ts#L121) |
| `InMemoryRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:127-131](../src/runtime.ts#L127) |
| `InMemoryRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:133-137](../src/runtime.ts#L133) |
| `InMemoryRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:139-144](../src/runtime.ts#L139) |
| `InMemoryRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:146-151](../src/runtime.ts#L146) |
| `InMemoryRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:153-158](../src/runtime.ts#L153) |
| `InMemoryRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:160-165](../src/runtime.ts#L160) |
| `PersistedRuns` | 接口 | 否 | [src/runtime.ts:168-174](../src/runtime.ts#L168) |
| `JsonFileRunStore` | 类 | 是 | [src/runtime.ts:177-304](../src/runtime.ts#L177) |
| `JsonFileRunStore.load` | 方法 | 否 | [src/runtime.ts:187-209](../src/runtime.ts#L187) |
| `JsonFileRunStore.persist` | 方法 | 否 | [src/runtime.ts:211-223](../src/runtime.ts#L211) |
| `JsonFileRunStore.mutate` | 方法 | 否 | [src/runtime.ts:225-237](../src/runtime.ts#L225) |
| `JsonFileRunStore.ready` | 方法 | 否 | [src/runtime.ts:239-242](../src/runtime.ts#L239) |
| `JsonFileRunStore.createRun` | 方法 | 是 | [src/runtime.ts:244-246](../src/runtime.ts#L244) |
| `JsonFileRunStore.commit` | 方法 | 是 | [src/runtime.ts:248-250](../src/runtime.ts#L248) |
| `JsonFileRunStore.updateRun` | 方法 | 是 | [src/runtime.ts:252-254](../src/runtime.ts#L252) |
| `JsonFileRunStore.getRun` | 方法 | 是 | [src/runtime.ts:256-259](../src/runtime.ts#L256) |
| `JsonFileRunStore.listRuns` | 方法 | 是 | [src/runtime.ts:261-264](../src/runtime.ts#L261) |
| `JsonFileRunStore.listRunningRuns` | 方法 | 是 | [src/runtime.ts:266-269](../src/runtime.ts#L266) |
| `JsonFileRunStore.createNodeRun` | 方法 | 是 | [src/runtime.ts:271-273](../src/runtime.ts#L271) |
| `JsonFileRunStore.updateNodeRun` | 方法 | 是 | [src/runtime.ts:275-277](../src/runtime.ts#L275) |
| `JsonFileRunStore.listNodeRuns` | 方法 | 是 | [src/runtime.ts:279-282](../src/runtime.ts#L279) |
| `JsonFileRunStore.listRouteDecisions` | 方法 | 是 | [src/runtime.ts:284-289](../src/runtime.ts#L284) |
| `JsonFileRunStore.listParallelRounds` | 方法 | 是 | [src/runtime.ts:291-296](../src/runtime.ts#L291) |
| `JsonFileRunStore.listRunRecoveries` | 方法 | 是 | [src/runtime.ts:298-303](../src/runtime.ts#L298) |
| `ProcessCommandExecutor` | 类 | 是 | [src/runtime.ts:306-337](../src/runtime.ts#L306) |
| `ProcessCommandExecutor.execute` | 方法 | 是 | [src/runtime.ts:307-336](../src/runtime.ts#L307) |
| `AgentRunModel` | 类 | 是 | [src/runtime.ts:339-442](../src/runtime.ts#L339) |
| `AgentRunModel.start` | 方法 | 是 | [src/runtime.ts:347-371](../src/runtime.ts#L347) |
| `AgentRunModel.executeNode` | 方法 | 是 | [src/runtime.ts:373-430](../src/runtime.ts#L373) |
| `AgentRunModel.getNodeSession` | 方法 | 是 | [src/runtime.ts:432-434](../src/runtime.ts#L432) |
| `AgentRunModel.end` | 方法 | 是 | [src/runtime.ts:436-441](../src/runtime.ts#L436) |
| `FlowCoordinator` | 类 | 是 | [src/runtime.ts:444-1268](../src/runtime.ts#L444) |
| `FlowCoordinator.run` | 方法 | 是 | [src/runtime.ts:463-493](../src/runtime.ts#L463) |
| `FlowCoordinator.resume` | 方法 | 是 | [src/runtime.ts:496-595](../src/runtime.ts#L496) |
| `FlowCoordinator.continueRun` | 方法 | 否 | [src/runtime.ts:597-717](../src/runtime.ts#L597) |
| `FlowCoordinator.executeParallel` | 方法 | 否 | [src/runtime.ts:719-799](../src/runtime.ts#L719) |
| `FlowCoordinator.executeNode` | 方法 | 否 | [src/runtime.ts:801-823](../src/runtime.ts#L801) |
| `FlowCoordinator.startNode` | 方法 | 否 | [src/runtime.ts:825-900](../src/runtime.ts#L825) |
| `FlowCoordinator.executePreparedNode` | 方法 | 否 | [src/runtime.ts:902-987](../src/runtime.ts#L902) |
| `FlowCoordinator.completeNode` | 方法 | 否 | [src/runtime.ts:989-1013](../src/runtime.ts#L989) |
| `FlowCoordinator.selectRoute` | 方法 | 否 | [src/runtime.ts:1015-1039](../src/runtime.ts#L1015) |
| `FlowCoordinator.enterParallel` | 方法 | 否 | [src/runtime.ts:1041-1077](../src/runtime.ts#L1041) |
| `FlowCoordinator.completeRun` | 方法 | 否 | [src/runtime.ts:1079-1090](../src/runtime.ts#L1079) |
| `FlowCoordinator.interruptNode` | 方法 | 否 | [src/runtime.ts:1092-1117](../src/runtime.ts#L1092) |
| `FlowCoordinator.failInterruptedCommand` | 方法 | 否 | [src/runtime.ts:1119-1153](../src/runtime.ts#L1119) |
| `FlowCoordinator.failNode` | 方法 | 否 | [src/runtime.ts:1155-1180](../src/runtime.ts#L1155) |
| `FlowCoordinator.failRun` | 方法 | 否 | [src/runtime.ts:1182-1190](../src/runtime.ts#L1182) |
| `FlowCoordinator.recordRecovery` | 方法 | 否 | [src/runtime.ts:1192-1214](../src/runtime.ts#L1192) |
| `FlowCoordinator.requireParallelRound` | 方法 | 否 | [src/runtime.ts:1216-1232](../src/runtime.ts#L1216) |
| `FlowCoordinator.destination` | 方法 | 否 | [src/runtime.ts:1234-1243](../src/runtime.ts#L1234) |
| `FlowCoordinator.commit` | 方法 | 否 | [src/runtime.ts:1245-1267](../src/runtime.ts#L1245) |
| `FlowRuntimeError` | 类 | 否 | [src/runtime.ts:1270-1277](../src/runtime.ts#L1270) |
| `now` | 函数 | 否 | [src/runtime.ts:1279-1281](../src/runtime.ts#L1279) |
| `toFlowError` | 函数 | 否 | [src/runtime.ts:1283-1295](../src/runtime.ts#L1283) |
| `fingerprintFlow` | 函数 | 否 | [src/runtime.ts:1297-1313](../src/runtime.ts#L1297) |
| `normalizeRun` | 函数 | 否 | [src/runtime.ts:1315-1341](../src/runtime.ts#L1315) |
| `normalizeNodeRun` | 函数 | 否 | [src/runtime.ts:1343-1354](../src/runtime.ts#L1343) |
| `normalizeParallelRound` | 函数 | 否 | [src/runtime.ts:1356-1374](../src/runtime.ts#L1356) |
| `renderAgentPrompt` | 函数 | 否 | [src/runtime.ts:1376-1387](../src/runtime.ts#L1376) |
| `replaceObject` | 函数 | 否 | [src/runtime.ts:1389-1394](../src/runtime.ts#L1389) |
| `clone` | 函数 | 否 | [src/runtime.ts:1396-1398](../src/runtime.ts#L1396) |

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
| `OutcomeOption` | 接口 | 是 | [src/types.ts:60-63](../src/types.ts#L60) |
| `NodeOutcome` | 接口 | 是 | [src/types.ts:65-68](../src/types.ts#L65) |
| `AgentConnection` | 接口 | 是 | [src/types.ts:70-74](../src/types.ts#L70) |
| `NodeSession` | 接口 | 是 | [src/types.ts:76-80](../src/types.ts#L76) |
| `UnifiedMessage` | 接口 | 是 | [src/types.ts:82-86](../src/types.ts#L82) |
| `AgentOutcomeSubmission` | 接口 | 是 | [src/types.ts:88-92](../src/types.ts#L88) |
| `AgentIntegrationAdapter` | 接口 | 是 | [src/types.ts:94-113](../src/types.ts#L94) |
| `CommandResult` | 接口 | 是 | [src/types.ts:115-120](../src/types.ts#L115) |
| `CommandExecutor` | 接口 | 是 | [src/types.ts:122-124](../src/types.ts#L122) |
| `RunStatus` | 类型 | 是 | [src/types.ts:126-126](../src/types.ts#L126) |
| `RunPhase` | 类型 | 是 | [src/types.ts:128-135](../src/types.ts#L128) |
| `NodeRunStatus` | 类型 | 是 | [src/types.ts:137-137](../src/types.ts#L137) |
| `ParallelRoundStatus` | 类型 | 是 | [src/types.ts:139-144](../src/types.ts#L139) |
| `FlowErrorCategory` | 类型 | 是 | [src/types.ts:146-156](../src/types.ts#L146) |
| `FlowError` | 接口 | 是 | [src/types.ts:158-161](../src/types.ts#L158) |
| `NodeRunSource` | 类型 | 是 | [src/types.ts:163-175](../src/types.ts#L163) |
| `NodeRunRecord` | 接口 | 是 | [src/types.ts:178-196](../src/types.ts#L178) |
| `RouteDecisionRecord` | 接口 | 是 | [src/types.ts:199-209](../src/types.ts#L199) |
| `ParallelRoundRecord` | 接口 | 是 | [src/types.ts:212-229](../src/types.ts#L212) |
| `RunRecoveryRecord` | 接口 | 是 | [src/types.ts:231-239](../src/types.ts#L231) |
| `FlowRunRecord` | 接口 | 是 | [src/types.ts:245-270](../src/types.ts#L245) |
| `RunFactCommit` | 接口 | 是 | [src/types.ts:273-280](../src/types.ts#L273) |
| `RunStore` | 接口 | 是 | [src/types.ts:282-296](../src/types.ts#L282) |
