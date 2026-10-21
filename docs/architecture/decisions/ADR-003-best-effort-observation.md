# ADR-003：尽力而为的运行观测

## 状态

已实现，边界明确。

## 决策

运行事件只在事实成功提交后由 FlowObservationPublisher 发布。Publisher 只在当前进程内通知订阅者，不缓存、不补发、不持久化，也不参与路由。查询历史以 RunStore 为事实来源，客户端断线后先取快照再订阅后续事件。

## 影响

事件丢失不代表运行事实丢失，订阅者不能把事件当作完整日志或第二状态库。需要严格回放、跨进程广播或审计日志时，应增加独立事件存储能力，而不是扩大当前 Publisher 的隐式职责。

## 证据

`src/observability/index.ts` 的 `FlowObservationPublisher`、`FlowRunInspector`、`FlowRuntime.openRunObservation`，以及 `src/execution/runtime.ts` 的 `commit` 和 `publishObservationChanges`。
