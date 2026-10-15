# 执行与事实模块

## 定位与边界

本模块是一次 Flow Run 的应用内核。`FlowCoordinator` 负责流程位置、状态迁移、动作调用、结果校验、路由、并行、子 Flow、恢复和事实提交。它不直接依赖 Pi SDK。

## 组成

- `InMemoryRunStore` 保存 Run、NodeRun、路由、并行轮次和恢复记录的内存快照。
- `JsonFileRunStore` 将同一 Store 实例内的变更排队，写入单个 JSON 快照。
- `ProcessCommandExecutor` 启动外部命令，收集退出状态和 stdout/stderr。
- `AgentRunModel` 维护每个 Run 的 Agent 绑定，校验一次节点只能接受一个合法结果。
- `FlowCoordinator` 串联所有动作并负责状态事实。

## 节点执行

Coordinator 为每次节点访问创建 NodeRun。Agent 节点经 AgentRunModel 执行，命令节点经过模板和资源渲染后执行，子 Flow 节点创建带父子关联的独立 Run。结果校验通过后，属于 Flow 全局声明的变量更新 Run；当前结果声明的其他变量仅形成下一节点的输入。

命令退出码非零仍返回 `CommandResult.failure`，但命令节点的业务结果仍为 `已执行`，因此可继续按 Flow 路由。只有执行器抛错、输出变量信封非法、结果或变量校验失败等异常才使节点和 Run 失败。

## 并行和变量合并

Parser 已把并行入口限制为多个命令分支和一个命令汇合点。Coordinator 为每次进入创建 ParallelRound，保存分支 NodeRun 映射和变量 patches。分支执行通过 `Promise.all` 启动，事实写入仍经过 Coordinator 的实例内提交队列。汇合后按分支名读取数据，全局变量合并检测同名写入冲突。

## 子 Flow

子 Flow 使用自己的 FlowDefinition、变量声明、Run 状态和 NodeRun 历史。父节点只传显式 inputs，成功结果只提取父节点结果声明的变量。子 Coordinator 复用当前 Store、AgentRunModel、CommandExecutor 和 Publisher。子 Run 失败时按父节点是否声明失败边处理。

## 恢复

Coordinator 通过 Flow 指纹拒绝当前定义与完整历史不匹配的恢复。Agent 中断产生新的 retry NodeRun，命令中断不重放并进入失败。已完成节点可以只恢复路由。父节点和子 Run 的崩溃窗口有单独的补全和递归恢复路径。

## 持久化边界

每次提交携带 expected sequence，Run 的 sequence 单调递增。JsonFileRunStore 使用实例内 Promise 队列、临时文件和 rename，源码注释将其限定为 single-process。当前实现没有跨进程文件锁、共享 CAS、输出大小上限或命令超时，因此这些不是已提供的运行时保证。

Store 的 `commit` 直接校验事实归属和序号关系，但没有为每种重复 ID、跨实例竞争或所有字段组合提供完整通用校验。新增 Store 实现时必须保留协调器依赖的 expected sequence 和原子可见性语义。

## 不实现范围

本模块不负责 Pi 会话生命周期、实时事件补发、生产级并发数据库、命令取消策略或外部告警。它也不从 Agent 自然语言决定结果，所有流程控制必须通过受校验的结构化结果进入。

## 主要证据

- [runtime.ts](../../src/runtime.ts)
- [types.ts](../../src/types.ts)
- [Flow 运行观测设计](../../flow-observability-design.md)
- [Flow 引用执行设计](../../flow-reference-design.md)
