# 并行轮次

## 流程

- **触发者**：节点结果路由到静态 parallel entry。
- **前置条件**：Parser 已验证直接分支为命令节点，所有分支进入同一个命令 join，join 显式引用每个直接分支。
- **输入**：上一节点传入的 round input、分支命令和 join 模板。
- **正常路径**：`enterParallel` 创建 ParallelRound；每个分支建立 NodeRun；`executeParallel` 使用 `Promise.all` 执行命令并记录每个 branch 的输出；合并允许的全局 patch 后，join NodeRun 由普通 `completeNode` 完成，再由 `selectRoute` 继续普通路由。
- **分支**：重复进入创建新 round；branch 变量按 branch reference 隔离，不从其他轮次回退读取；同一 round 的分支和 join 记录可在生命周期内更新。
- **失败/恢复**：分支中断调用命令中断失败路径而不重放；变量写入冲突、join/模板/路由或存储失败可终结 round/run。
- **后置结果**：round 保存分支 NodeRun IDs、分支状态、变量 patches、join NodeRun 和 join outcome。
- **副作用**：并行 spawn 外部命令、写 Store facts、发布 round 事件。
- **证据**：`src/parser.ts#validateParallel`、`src/runtime.ts#FlowCoordinator.enterParallel`、`src/runtime.ts#FlowCoordinator.executeParallel`、`src/runtime.ts#FlowCoordinator.completeNode`、`src/runtime.ts#FlowCoordinator.selectRoute`、`src/runtime.ts#mergeParallelVariables`。
- **测试预言机**：分支隔离和非法 join 的直接断言见 `test/parser.test.ts:340-358`、`test/parser.test.ts:368-413`；join stdin 和本轮分支 NodeRun 的直接断言见 `test/runtime.test.ts:225-242`；命令非零仍完成 round 的直接断言见 `test/correctness.test.ts:425-449`。本轮未执行。
