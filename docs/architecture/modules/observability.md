# 观测读侧

## 边界与实体

`src/observability.ts#FlowRunInspector` 读取 Store facts，按 sequence 投影 Run history、NodeRun、route、parallel、recovery 和 evidence；`src/observability.ts#FlowObservationPublisher` 按 runId 向当前进程 subscribers 通知；`src/observability.ts#FlowRuntime` 组合查询、订阅并提供稳定快照入口。它不执行节点、不修改 Run、不选择 route。

## 状态、权限和失败

Coordinator 在 `src/runtime.ts#FlowCoordinator.commit` 的 Store commit 成功后发布 event；publisher/subscriber callback 异常被隔离。Publisher 不持久化、不缓存、不跨进程广播或补发。`FlowRuntime.openRunObservation` 先订阅并缓存竞态事件，再取 snapshot，最后只传递高于快照 sequence 的事件。

Evidence authorizer 当前默认放行；宿主应按数据责任配置权限。History summary 不等同于完整证据脱敏，权限、脱敏和保留周期仍待确认。

## 依赖与不实现范围

依赖 `src/types.ts#RunStore`、观测事件和 evidence contracts，可接入 Pi `flow_event`/inspection tools。没有事件日志、跨进程订阅、严格重放、指标平台或告警能力。

## 测试定位

保存成功后的事件和保存失败行为见 `test/correctness.test.ts:724-753`、`test/correctness.test.ts:863-866`；快照水位保护见 `test/correctness.test.ts:919-927`。本轮只核对源码断言，未执行测试。
