# 历史与观测

## 流程

- **触发者**：CLI/SDK/Agent 查询 Run；Coordinator 提交事实后发布事件。
- **前置条件**：Run facts 可由 Store 读取；获取完整节点 evidence 还需 reader 和 authorizer。
- **输入**：runId、可选 nodeRunId、订阅 callback。
- **正常路径**：Inspector 读取 snapshot 并按 sequence 组织 history；Publisher 只通知当前进程 listeners。`openRunObservation` 先建立订阅并缓存快照读取期间的竞态事件，再读取 snapshot，最后只转发 sequence 高于快照水位的缓存事件。
- **分支**：run/node 不存在或 authorizer 拒绝则返回 undefined；listener 错误隔离。宿主可将事件包装成 JSON/RPC `flow_event`。
- **失败/恢复**：快照读取失败则撤销订阅并抛错；Publisher 不存储、补发或跨进程广播断线事件，客户端重连应重新读取 snapshot。
- **后置结果**：只读 history/evidence 和实时通知，不修改 Flow/Run，不选择路由。
- **副作用**：listener、可选 evidence reader 和宿主消息发送；默认 authorizer 当前为放行策略，权限策略仍属待确认事项。
- **证据**：`src/observability.ts#FlowObservationPublisher`、`src/observability.ts#FlowRunInspector`、`src/observability.ts#FlowRuntime.openRunObservation`、`src/extension.ts#flowEventMessage`。
- **测试预言机**：成功提交后的事件顺序和取消订阅见 `test/correctness.test.ts:724-753`；Store 提交失败不发布未保存成功事件见 `test/correctness.test.ts:863-866`；订阅竞态只转发水位之后事件见 `test/correctness.test.ts:919-927`。本轮未执行。
