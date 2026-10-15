# 观测模块

## 定位与边界

观测模块把 RunStore 的事实组织成统一只读历史，并向当前进程订阅者发布变化。它不执行节点、不写入 Run、不选择路由。

## FlowRunInspector

`inspectRun`读取一个 Run 的快照，按 sequence 排序 NodeRun、RouteDecision、ParallelRound 和 recovery，并计算当前节点或当前并行轮次。`listRecentRuns`按开始时间返回运行摘要。

`inspectNodeEvidence`先确认 Run 和 NodeRun 属于同一运行，再调用授权器。允许时返回节点输入、结果、错误、session、Agent 消息和命令结果。没有 evidence reader 时仍可返回已持久化字段。历史摘要只暴露会话引用和命令输出可用性，不等于完整证据脱敏。

## FlowObservationPublisher

Publisher 是进程内 best-effort 通知器。它按 runId 维护监听器，向每个监听器发送结构化事件；监听器和错误回调异常被隔离。它不缓存事件、不持久化事件、不跨进程广播，也不承诺断线补发。

事件由 Coordinator 在 Store 成功提交后产生，包含 runId、flowId、sequence、状态、阶段、节点/并行引用和摘要。发布失败不能改变已保存事实或阻断执行。

## FlowRuntime

FlowRuntime 组合 Inspector 和 Publisher，提供查询、证据读取、订阅和 `openRunObservation`。后者先订阅并缓存竞态窗口事件，再取快照，最后只转发 sequence 高于快照水位的缓存事件，避免读取和订阅之间漏事件。

Pi 宿主把事件转换为 `flow_event` custom message，Agent 使用 `inspect_flow_run`读取同一个 Runtime 历史。客户端重连应以 Inspector 快照为准，不应依赖断线期间的事件缓存。

## 不实现范围

本模块不提供追加式事件日志、严格事件回放、跨进程订阅、指标平台、告警和自动业务判断。证据授权也不由模块自动推断，默认策略必须视为宿主配置责任。

## 主要证据

- [observability.ts](../../src/observability.ts)
- [types.ts](../../src/types.ts)
- [runtime.ts](../../src/runtime.ts)
- [Flow 运行观测设计](../../flow-observability-design.md)
