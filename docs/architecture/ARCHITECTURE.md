# Agent Flow Runtime 架构

## 系统边界

本文描述源码版本 `26eb4e604e54472dd1938f92671c89d74d1554ab`（package `0.2.1`）可证的当前架构。本文区分事实、结构推断和待确认事项。本轮未执行构建、测试、检查或 source-index 命令；产品目的、生产部署和外部 provider 行为不由源码确定。

## 核心对象

`FlowDefinition` 是静态图；`FlowPackage` 加入入口和已校验资源；`LoadedFlow` 再包含可传递到达的 Flow 引用闭包。`FlowRunRecord` 保存一次运行的当前状态，`NodeRunRecord` 保存一次节点访问；同一记录在生命周期内可更新，每次新访问都有独立 ID。路由、并行轮次和恢复分别保存为 RouteDecision、ParallelRound、RunRecovery facts。父子 Run 通过 parent IDs 关联。类型来源：`src/types.ts#FlowDefinition`、`src/types.ts#FlowPackage`、`src/types.ts#LoadedFlow`、`src/types.ts#FlowRunRecord`、`src/types.ts#NodeRunRecord`。

全局变量属于 Run；结果变量必须符合当前结果声明，并且只有其中的下一跳变量进入后继节点 input。并行分支输出按 round 和 branch 隔离。运行时校验由 `src/runtime.ts#initializeVariables`、`src/runtime.ts#validateOutcomeVariables`、`src/runtime.ts#extractNextInput` 和 `src/variables.ts#validateVariables` 负责。

## 主要流程

1. Extension 或 SDK 提供路径和启动变量；Loader 读取并校验定义、动作实际引用的资源，然后加载引用闭包。入口：`src/flow-loader.ts#loadFlow`、`src/flow-loader.ts#loadFlowPackage`。
2. Coordinator 先校验启动变量，再创建 Run；输入错误在创建 Run 前结束，不留下 Run 或 NodeRun。运行入口：`src/runtime.ts#FlowCoordinator.run`、`src/runtime.ts#initializeVariables`。
3. 节点动作由 Agent、命令或子 Flow 适配器执行；结果校验后提交 NodeRun 和路由事实。命令非零退出仍保留 CommandResult failure，命令业务结果固定为“已执行”。执行入口：`src/runtime.ts#FlowCoordinator.executePreparedNode`。
4. 并行入口创建 ParallelRound，分支命令并行执行；join 完成后仍由普通的 `completeNode` 和 `selectRoute` 继续路由。入口：`src/runtime.ts#FlowCoordinator.executeParallel`、`src/runtime.ts#FlowCoordinator.completeNode`、`src/runtime.ts#FlowCoordinator.selectRoute`。
5. 恢复按动作分类：Agent 生成带 retryOf 的新访问，命令中断不重放，子 Run 随父 Run 恢复。恢复入口：`src/runtime.ts#FlowCoordinator.resume`、`src/runtime.ts#FlowCoordinator.resumeRun`。
6. Store 提交成功后才发布进程内通知；Inspector 提供只读历史和 evidence。入口：`src/runtime.ts#FlowCoordinator.commit`、`src/observability.ts#FlowRunInspector`、`src/observability.ts#FlowRuntime.openRunObservation`。

详情见[业务流](business-flows/README.md)。

## 模块边界

| 模块 | 责任 |
| --- | --- |
| [契约与值校验](modules/contracts.md) | 类型协议、状态事实、变量值校验 |
| [定义与装载](modules/definition-loading.md) | Flow 解析、模板、资源和引用闭包 |
| [执行与事实](modules/execution-runtime.md) | Run 协调、动作、存储、路由、恢复 |
| [Pi 宿主](modules/pi-host.md) | Pi session、结果工具、Extension 装配 |
| [观测读侧](modules/observability.md) | 历史/evidence 与进程内通知 |
| [工程入口](modules/engineering-entries.md) | 包出口、构建、测试、发布配置 |

## 关键不变量

- Flow 定义不保存单次运行状态；同一节点重复进入产生新的 NodeRun ID，但现有 NodeRun/ParallelRound 可在其生命周期内更新。
- 结构化结果名选择边；结果变量必须属于全局声明或当前结果声明。
- 启动变量校验先于 Run 创建；结果变量错误会记录节点和 Run 失败。
- 并行输出按 round/branch 隔离；join 只能读取当前轮的分支数据。
- 普通结果边必须与结果声明匹配；`执行Flow` 可以使用一条无结果直连边并映射固定成功结果。
- 子 Flow 只接收显式 inputs，成功回传受父节点结果声明约束，失败按父节点是否声明失败边处理。
- 恢复始终校验 Flow ID；只有 `historyCompleteness` 为 `complete` 时比较组合 Flow fingerprint，legacy 历史跳过该比较。
- Store 成功提交后才发布事件；Publisher 不是事实存储。
- JsonFileRunStore 只在每个实例内串行化写入，不提供跨实例或跨进程协调。

## 待确认边界

多进程并发、命令资源预算、interrupted 自动恢复、evidence 授权/脱敏、发布门禁和真实 provider 验证要求，均需外部决策。现状和证据见[来源映射](source-map.md)及[决策索引](decisions/README.md)。

## 阅读路径

从[术语表](glossary.md)开始，沿[业务流](business-flows/README.md)理解状态，再读[模块](modules/contracts.md)，通过[来源映射](source-map.md)复核证据，并查看[决策索引](decisions/README.md)。
