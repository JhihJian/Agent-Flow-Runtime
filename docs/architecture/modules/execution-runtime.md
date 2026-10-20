# 执行与事实

## 边界

`FlowCoordinator` 是一次 Run 的应用内核，处理状态迁移、NodeRun、动作分派、结果验证、路由、并行、子 Flow、恢复和 Store facts。`AgentRunModel` 位于独立的 Agent 执行模块，负责 Run 级绑定、创建时能力固定和节点执行。两者通过 `AgentIntegrationAdapter`、`CommandExecutor`、`RunStore` 和 Publisher 接口接外部能力，不直接依赖 Pi SDK，也不理解工具或 Skill 的具体实现。入口：`src/runtime.ts#FlowCoordinator`、`src/agent.ts#AgentRunModel`、`src/types.ts#AgentIntegrationAdapter`、`src/types.ts#CommandExecutor`、`src/types.ts#RunStore`。

## 组成与状态

`src/runtime.ts#InMemoryRunStore` 持有内存 facts；`src/runtime.ts#JsonFileRunStore` 在每个实例内串行 mutation，并以临时文件加 rename 写完整快照，不提供跨实例或跨进程协调；`src/runtime.ts#ProcessCommandExecutor` 通过 spawn 执行外部命令；`src/agent.ts#AgentRunModel` 维持 Run 级 Agent binding。宿主会话能力和具体实现不属于核心 Store。

每次节点访问建立独立 NodeRun ID；NodeRun 和 ParallelRound 在同一生命周期内可更新。全局 patch 写 Run，当前结果变量形成下一跳 input。非零 exit code 保留为 CommandResult failure，但命令节点业务结果是“已执行”。并行以 ParallelRound 隔离分支；子 Flow 是带 parent IDs 的独立 Run。

## 失败、恢复与副作用

Agent、command、validation、route、persistence、reference 错误进入明确失败路径。Agent 中断创建带 retryOf 的新 NodeRun；命令中断不自动重放；父级管理子 Run 恢复。外部副作用包括 child process、Pi adapter 经接口调用、JSON 文件读写和通知。

`src/runtime.ts#FlowCoordinator.commit` 先提交 Store，成功后替换内存 Run 并发布 event。启动变量由 `src/runtime.ts#initializeVariables` 在 Run 创建前校验；结果变量由 `src/runtime.ts#validateOutcomeVariables` 和 `src/runtime.ts#FlowCoordinator.completeNode` 校验。

## 不实现范围与代码映射

不负责 Pi session 生命周期、事件补发、多进程数据库、命令超时/取消/输出限额或 Agent 自然语言判定路由。资源和执行入口为 `src/runtime.ts#FlowCoordinator.executePreparedNode`、`src/runtime.ts#FlowCoordinator.executeParallel`、`src/runtime.ts#FlowCoordinator.startChildRun`。直接断言见 `test/runtime.test.ts:129-157`、`test/correctness.test.ts:425-449`、`test/correctness.test.ts:536-542`、`test/release-flow-recovery.test.ts:184-192`；本轮未执行。
