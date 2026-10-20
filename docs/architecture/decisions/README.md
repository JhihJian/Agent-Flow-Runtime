# 决策索引

本页只保留输入文档集合中可直接导航且可由当前源码复核的决策摘要；未提供对应页面的独立决策记录不建立链接。

## 已记录且能由当前实现复核

- **显式结果和变量作用域**：结构化结果名选择路线；变量按全局、当前结果和 branch scope 传递。复核：`src/parser.ts#parseResultVariables`、`src/parser.ts#validateTemplates`、`src/runtime.ts#initializeVariables`、`src/runtime.ts#validateOutcomeVariables`、`src/runtime.ts#extractNextInput`、`src/pi.ts#createFlowOutcomeTool`。
- **单进程 JSON Store**：默认 JSON 快照由单个 Store 实例串行 mutation、临时文件和 rename 写入；未提供跨实例或跨进程协调。复核：`src/runtime.ts#JsonFileRunStore`。
- **尽力而为的运行观测**：Store 提交成功后发布当前进程事件；Publisher 不持久化、不补发。复核：`src/runtime.ts#FlowCoordinator.commit`、`src/observability.ts#FlowObservationPublisher`、`src/observability.ts#FlowRuntime.openRunObservation`。
- **Agent 能力作为可选组合模块**：Runtime 只提供通用 Agent 执行端口，工具、Skill、模型和权限由外部能力模块与宿主组合。复核：`src/agent.ts#AgentRunModel`、`src/types.ts#AgentExecutionContext`、`src/types.ts#AgentIntegrationAdapter`、`src/pi.ts#PiAgentIntegrationAdapter`。

这些摘要只说明当前实现可复核的边界，不扩张其批准范围。

## 待确认决策

| 主题 | 代码已确定的边界 | 尚需决定 |
| --- | --- | --- |
| 运行记录并发 | JsonFileRunStore 仅每实例串行化 | 同目录多 Pi 进程是否受支持、是否更换 Store |
| 命令执行预算 | 当前 executor 未提供超时、取消或输出上限 | 允许的运行时长、输出量和取消策略 |
| 中断恢复 | Coordinator 可恢复 interrupted；自动扫描只取 running | session_start 是否应自动恢复 interrupted |
| evidence 访问 | Inspector 默认 authorizer 放行，证据可包含输入/输出 | 主体授权、默认策略、脱敏和保留周期 |
| 发布验证 | tag workflow 运行 `npm test`，另有更广的 `test:release` | 权威发布门禁及真实 Pi/provider 证据要求 |
| 产品边界 | 源码提供通用 Flow 执行和 Pi 接入 | 目标用户、业务流程和长期产品目的 |

以上条目不是已批准决策；决策形成前，架构文档只记录当前实现和未决项。
