# 术语表

| 术语 | 源码命名与含义 |
| --- | --- |
| Flow | `FlowDefinition`：由 Markdown 解析出的静态图、动作、结果、变量声明和 Flow 级 Agent 能力声明。 |
| Flow package | `FlowPackage`：Flow 加入口和已校验资源。 |
| Loaded Flow | `LoadedFlow`：根 package 加可传递到达的 Flow references。 |
| Run | `FlowRunRecord`：一次 Flow 执行的当前状态快照和游标。 |
| NodeRun | `NodeRunRecord`：一个工作节点的一次独立访问记录；记录在生命周期内可更新，每次新访问有独立 ID。 |
| Outcome | `NodeOutcome`：结构化 result 名及可选变量；不是 Agent 自然语言。 |
| 全局变量 | `FlowRunRecord.variables`：由 Flow metadata 声明并属于 Run 的值。 |
| 下一跳变量 | `FlowNode.resultVariables`：按当前 outcome 声明，仅传入下一节点 input。 |
| 分支变量 | `branch.<ref>.*`：join 按当前 ParallelRound 的 direct branch reference 读取的输出。 |
| Route decision | `RouteDecisionRecord`：已提交的结果到 destination 选择。 |
| Parallel round | `ParallelRoundRecord`：一次并行入口执行及分支/join 事实；同一轮记录可更新。 |
| 子 Run | `FlowReferenceAction` 创建、带 parent IDs 的独立 FlowRunRecord。 |
| Recovery | `RunRecoveryRecord` 与新的 NodeRun：中断后的策略和续接事实。 |
| Evidence | `FlowNodeEvidence`：节点 input/outcome/error、session messages 或 command result 等读取视图。 |
| Inspector | `FlowRunInspector`：只读组织 Store facts 和按权限读取 evidence。 |
| Publisher | `FlowObservationPublisher`：当前进程内 best-effort 事件通知器。 |
| Adapter | `AgentIntegrationAdapter`：Runtime 与 Pi/其他 Agent host 之间的接口，接收创建会话时的能力声明。 |
| Agent capability declaration | `AgentCapabilityDeclaration`：Flow 级 `tools` 和 `skills` 逻辑名称；未声明时为空。 |
| Agent protocol tool | `submit_flow_outcome`：Runtime 始终提供的结果提交工具，不属于业务能力。 |
| Command executor | `CommandExecutor`：Runtime 注入的外部命令执行边界。 |

类型定位：`src/types.ts#FlowValue`、`src/types.ts#FlowRunRecord`、`src/types.ts#NodeRunRecord`、`src/types.ts#FlowNodeEvidence`；变量传递：`src/runtime.ts#initializeVariables`、`src/runtime.ts#extractNextInput`；观测实现：`src/observability.ts#FlowRunInspector`、`src/observability.ts#FlowRuntime.openRunObservation`。
