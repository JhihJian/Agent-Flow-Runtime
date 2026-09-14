# Flow 运行观测设计

## 1. 目标

运行观测要让用户在 Flow 执行过程中看清四件事：

```text
这项 Task 使用了哪条 Flow？
当前运行到了哪里？
为什么进入当前节点？
现在是在推进、等待、返工还是失败？
```

这里的观测对象是一次 Run 的执行过程。Flow 仍然只是可复用的工作路径，Task 才是本次具体问题。

## 2. 一条观测链路

```text
FlowCoordinator
    产生状态变化和执行事实
        |
        +--> RunStore
        |       保存 Run、NodeRun 和并行轮次快照
        |
        +--> FlowObservationSink
                推送运行变化
                    |
                    +--> TUI / CLI
                    +--> JSON / RPC
```

职责只有三层：

- **Coordinator** 决定流程怎么走，并产生事实。
- **RunStore** 保存事实，提供重连后的当前快照。
- **ObservationSink** 把变化通知给展示端。

TUI、CLI、JSON 和 RPC 都是展示端。它们不能自己推断流程状态，也不能修改 Run 或选择下一节点。

## 3. 当前状态

Run 需要同时表达生命周期和执行阶段：

```text
status
  running | completed | failed | interrupted

phase
  starting          正在建立运行环境
  executing_node    正在执行某个节点
  waiting_parallel  正在等待并行分支
  routing           正在根据结果选择去向
  completed         已到达结束边
  failed            执行失败
  interrupted       进程中断，等待恢复或人工处理
```

`status` 回答“Run 是否结束”，`phase` 回答“当前正在做什么”。两者不能用一个字段代替。

NodeRun 需要有明确状态：

```text
running | completed | failed | interrupted
```

当前实现通过是否存在`completedAt`和`outcome`判断节点是否完成，Run 只有`running`、`completed`和`failed`三种状态。后续应把上述状态显式加入记录，避免观测端依赖字段缺失来猜测。

## 4. 运行事实如何产生

事件只在`FlowCoordinator`改变并持久化运行状态的边界产生。一个事件表示已经发生的事实，不表示即将发生的动作。

```text
协调器计算状态变化
    -> RunStore 保存成功
    -> ObservationSink 推送事件
```

保存失败时不能推送“成功完成”的事件。推送失败时不能改变已经保存的 Run 状态，也不能让 Flow 停止执行。

### 最小事件集合

| 事件 | 产生时机 | 用户能知道什么 |
| --- | --- | --- |
| `run.started` | Run 创建成功 | 使用的 Flow、Run 和首节点 |
| `node.started` | NodeRun 创建并成为当前节点 | 正在执行哪个节点、什么动作 |
| `node.completed` | NodeRun 保存结果成功 | 节点提交了什么结果、耗时多久 |
| `route.selected` | 结果边校验完成并保存下一位置 | 为什么进入下一节点或结束 |
| `parallel.started` | 并行轮次保存成功 | 正在等待哪些分支 |
| `parallel.completed` | 分支结果齐全并准备汇合 | 哪些分支完成、将进入哪个汇合节点 |
| `run.resumed` | 恢复执行成功 | 从哪里恢复、采用什么策略 |
| `run.completed` | Run 保存完成状态 | Flow 已到达结束边 |
| `run.failed` | Run 保存失败状态 | 哪个位置失败、是否可恢复 |
| `run.interrupted` | 发现进程中断或无法继续 | 当前需要恢复还是人工处理 |

`node.failed`可以作为`node.completed`的失败变体，也可以单独定义。关键是失败必须关联具体 NodeRun，不能只保留 Run 级错误。

### 事件内容

每个事件至少包含：

```json
{
  "type": "node.completed",
  "runId": "run-id",
  "flowId": "code-change",
  "sequence": 7,
  "occurredAt": "2026-01-01T00:00:00.000Z",
  "nodeRunId": "node-run-id",
  "nodeRef": "verify",
  "status": "completed",
  "phase": "routing",
  "outcome": "通过"
}
```

事件只携带状态、引用和摘要。Task 正文、完整 Agent 对话、Prompt、stdout 和 stderr 仍通过受保护的运行记录或 Pi 会话查询，不默认进入实时通道。

## 5. 当前状态和事件的关系

两者职责不同，但只能有一个事实来源：

```text
RunStore 快照 = 当前事实
ObservationSink 事件 = 当前事实发生变化的通知
```

事件不是第二套状态库。展示端收到事件后可以更新界面，但重新连接时必须重新读取 RunStore 快照。

这带来简单明确的失败语义：

- 事件丢失，不代表 Run 丢失。
- 展示端缓存错误，可以用快照纠正。
- 观测连接断开，不影响 Flow 继续运行。
- 不能通过事件反向驱动节点或提交结果。

如果未来需要严格补发所有事件，再为 RunStore 增加追加式事件日志。MVP 不把现有`.pi/flow-runs.json`当作事件日志，因为它保存的是整体快照。

## 6. 用户如何实时看到

### TUI

Pi 扩展维护一个当前 Run 的展示区域，内容来自事件和 RunStore 快照：

```text
Flow: code-change    Run: 8f31
状态: 执行中         阶段: 执行节点
路径: 分析 -> 修改 -> 验证
当前: 验证
```

并行时展示分支状态：

```text
并行检查
  test  已完成
  lint  执行中
  等待  1 个分支
```

通知只展示状态变化和摘要。完整结果通过`/flow status`读取，避免把长文本和敏感输出塞进通知区域。

### CLI

CLI 使用同一套事件转换器输出简短状态行：

```text
[8f31] 开始：代码修改与验证
[8f31] 节点开始：分析
[8f31] 节点完成：分析 -> 已分析
[8f31] 节点开始：验证
[8f31] 完成：耗时 42s
```

CLI 退出码只表示 Run 的执行终态。业务上的“通过”仍由 Flow 中的判断节点表达，不能从任意 Agent 文本中猜测。

### JSON 和 RPC

JSON/RPC 输出正式的`flow_event`消息：

```json
{
  "type": "flow_event",
  "event": {
    "type": "node.started",
    "runId": "run-id",
    "sequence": 6,
    "nodeRef": "verify",
    "phase": "executing_node"
  }
}
```

自动化客户端按`runId`订阅，并在`run.completed`、`run.failed`或`run.interrupted`时结束订阅。不能要求客户端解析 Pi 的自然语言消息来判断 Flow 状态，也不能只依赖`submit_flow_outcome`，因为命令节点和节点开始事件不会经过该工具。

## 7. 断线和恢复

### 展示端断线

```text
展示端断开
    -> Run 继续执行
    -> RunStore 继续保存
    -> 展示端重连
    -> 读取当前 Run 快照
    -> 继续接收后续事件
```

MVP 不保证补发断线期间的全部事件。快照必须能够让用户重新看到当前节点、当前阶段、已完成路径和错误。

### 运行进程重启

- 已完成的 NodeRun 不重复执行。
- 未完成的 Agent NodeRun 以新的访问记录恢复。
- 未完成的命令 NodeRun 不自动重放，避免重复外部副作用。
- 无法恢复的 Run 进入`interrupted`或`failed`，并说明原因。

恢复本身也是可观测事实，应显示原位置、新访问记录和恢复结果。

## 8. MVP 落地顺序

1. 给 Run 增加`phase`和显式中断状态。
2. 给 NodeRun 增加显式状态和错误信息。
3. 定义`FlowObservationSink`和最小事件类型。
4. 在协调器的状态提交边界发送事件。
5. 实现 TUI 当前节点和路径展示。
6. 实现`/flow status`，始终从 RunStore 读取快照。
7. 为 JSON/RPC 输出`flow_event`。
8. 测试节点顺序、并行事件、恢复事件、断线快照和观测推送失败。

第一版不接入 Prometheus、OpenTelemetry 或外部告警平台，也不采集模型 token、内部推理和每一行工具输出。先保证用户能实时看懂一次 Run 的执行路径。

## 9. 必须保持的规则

- FlowCoordinator 是运行事实的产生者和流程状态的唯一所有者。
- RunStore 是当前状态的事实来源。
- ObservationSink 只通知，不决策、不路由、不提交结果。
- 展示端只展示，不维护第二套流程状态。
- 事件推送失败不能影响 Flow 执行。
- 断线后以快照恢复界面，不依赖事件缓存猜测状态。
- 所有事件都必须关联 Run；节点事件还必须关联 NodeRun。