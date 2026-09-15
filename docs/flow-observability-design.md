# Flow 运行观测设计

## 1. 目标

本文是本次运行事实层开发的实现契约。文中的“必须”是实现和测试的约束，“当前实现”只描述现状，不代表契约已经落地。若源码与本文冲突，以本文的实体边界、状态语义和提交顺序为准。

运行观测要让用户在 Flow 执行过程中看清四件事：

```text
这项 Task 使用了哪条 Flow？
当前运行到了哪里？
为什么进入当前节点？
现在是在推进、等待、返工还是失败？
```

这里的观测对象是一次 Run 的执行过程。Flow 仍然只是可复用的工作路径，Task 才是本次具体问题。

## 2. 两个内部入口

```text
FlowCoordinator
    产生状态变化和执行事实
        |
        +--> RunStore
        |       保存 Run、NodeRun 和并行轮次快照
        |
        +--> FlowRunInspector
        |       查询一次 Run 的完整执行历史
        |
        +--> FlowObservationPublisher
                推送运行变化
```

Runtime 内部只需要提供两个与传输方式无关的能力：

- **FlowRunInspector**：按`runId`读取并组织一次 Run 的完整历史。
- **FlowObservationPublisher**：在运行事实变化后发布实时通知。

`FlowRunInspector`只读，`FlowObservationPublisher`只发布，两者都不参与路由。TUI、CLI、SDK、Agent、JSON 和 RPC 都通过这两个内部入口接入，而不是各自读取存储或实现一套历史分析逻辑。

```text
FlowRunInspector
    -> SDK 方法
    -> CLI /flow show
    -> RPC flow.inspect
    -> Agent 查询接口
    -> TUI 详情视图

FlowObservationPublisher
    -> TUI 实时状态
    -> CLI 状态行
    -> JSONL flow_event
    -> RPC flow_event
```

因此“Agent 能否查看历史”不是 Agent 工具设计问题，而是 Runtime 是否有统一的 Run 历史查询入口。

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
    -> FlowObservationPublisher 推送事件
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

## 5. Run 历史查询入口

### FlowRunInspector

`FlowRunInspector`是 Runtime 内部的应用能力，不绑定 Agent、CLI、Pi 或具体协议。它接收一个`runId`，返回一份可以直接分析的 Run 历史视图：

```text
inspectRun(runId)
  Run 摘要
    Task
    Flow 标识
    状态、阶段、当前节点
    开始时间、结束时间、错误
  执行路径
    按顺序排列的全部 NodeRun
    每次节点访问的输入摘要、结果、状态和耗时
    结果导致的下一去向
  并行信息
    每个并行轮次
    分支 NodeRun 和汇合结果
  执行依据
    Pi 交互引用
    命令执行摘要
```

它返回的是 Flow 运行历史，不是未经整理的数据库记录。它负责把 NodeRun、并行轮次和结果边组织成一条可读路径，但不负责替用户判断业务结论。

完整 Agent 会话和命令输出属于执行依据。`inspect`默认返回引用和摘要；需要深入查看时，通过同一应用层提供的节点依据查询读取：

```text
inspectNodeEvidence(runId, nodeRunId)
```

查询入口必须位于 Runtime 内部。外部形态只是薄适配器：

| 外部形态 | 调用方式 |
| --- | --- |
| SDK | `runtime.inspectRun(runId)` |
| CLI | `/flow show <runId>` |
| RPC | `flow.inspect` 请求 |
| Agent | 一个查询能力的工具或函数调用 |
| TUI | 当前 Run 详情视图 |

所有形态必须得到同一份历史模型，不能让 Agent、CLI 和 TUI 各自拼接`getRun`、`listNodeRuns`或读取 JSON 文件。

### FlowRunInspector 和实时通知的关系

历史查询和实时通知不能合并：

- `FlowRunInspector`回答“截至现在，这次 Run 的完整历史是什么”。
- `FlowObservationPublisher`回答“刚刚发生了什么变化”。

用户打开页面、Agent 开始分析或客户端重连时，先调用`inspect`获得完整快照，再订阅后续事件。这样事件丢失不会破坏历史视图，展示端也不需要维护第二套状态。

## 6. 当前状态和事件的关系

两者职责不同，但只能有一个事实来源：

```text
RunStore 快照 = 当前事实
FlowObservationPublisher 事件 = 当前事实发生变化的通知
```

事件不是第二套状态库。展示端收到事件后可以更新界面，但重新连接时必须重新读取 RunStore 快照。

这带来简单明确的失败语义：

- 事件丢失，不代表 Run 丢失。
- 展示端缓存错误，可以用快照纠正。
- 观测连接断开，不影响 Flow 继续运行。
- 不能通过事件反向驱动节点或提交结果。

如果未来需要严格补发所有事件，再为 RunStore 增加追加式事件日志。MVP 不把现有`.pi/flow-runs.json`当作事件日志，因为它保存的是整体快照。

## 7. 用户如何实时看到

### TUI

Pi 扩展维护一个当前 Run 的展示区域。启动或重连时通过`FlowRunInspector`取得快照，运行期间通过`FlowObservationPublisher`接收变化：

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

通知只展示状态变化和摘要。完整结果通过`FlowRunInspector`读取，避免把长文本和敏感输出塞进通知区域。

### CLI

CLI 使用同一个`FlowRunInspector`读取初始状态，并使用同一个事件转换器输出简短状态行：

```text
[8f31] 开始：代码修改与验证
[8f31] 节点开始：分析
[8f31] 节点完成：分析 -> 已分析
[8f31] 节点开始：验证
[8f31] 完成：耗时 42s
```

CLI 退出码只表示 Run 的执行终态。业务上的“通过”仍由 Flow 中的判断节点表达，不能从任意 Agent 文本中猜测。

### JSON 和 RPC

JSON/RPC 通过薄适配器输出正式的`flow_event`消息：

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

## 8. 断线和恢复

### 展示端断线

```text
展示端断开
    -> Run 继续执行
    -> RunStore 继续保存
    -> 展示端重连
    -> 调用 FlowRunInspector 读取当前 Run 快照
    -> 继续接收后续事件
```

MVP 不保证补发断线期间的全部事件。快照必须能够让用户重新看到当前节点、当前阶段、已完成路径和错误。

### 运行进程重启

- 已完成的 NodeRun 不重复执行。
- 未完成的 Agent NodeRun 以新的访问记录恢复。
- 未完成的命令 NodeRun 不自动重放，避免重复外部副作用。
- 无法恢复的 Run 进入`interrupted`或`failed`，并说明原因。

恢复本身也是可观测事实，应显示原位置、新访问记录和恢复结果。

## 9. MVP 落地顺序

1. 给 Run 增加`phase`和显式中断状态。
2. 给 NodeRun 增加显式状态和错误信息。
3. 定义`FlowRunInspector`，返回一次 Run 的完整执行历史。
4. 定义`FlowObservationPublisher`和最小事件类型。
5. 在协调器的状态提交边界发送事件。
6. 让 TUI、CLI、SDK、Agent、JSON 和 RPC 复用`FlowRunInspector`。
7. 实现 TUI 当前节点、路径展示和`/flow show`。
8. 为 JSON/RPC 输出`flow_event`。
9. 测试节点顺序、并行事件、恢复事件、断线快照和观测推送失败。

第一版不接入 Prometheus、OpenTelemetry 或外部告警平台，也不采集模型 token、内部推理和每一行工具输出。先保证用户能实时看懂一次 Run 的执行路径。

## 10. 必须保持的规则

- FlowCoordinator 是运行事实的产生者和流程状态的唯一所有者。
- RunStore 是当前状态的事实来源。
- FlowRunInspector 只查询和组织历史，不决策、不路由、不提交结果。
- FlowObservationPublisher 只通知，不决策、不路由、不提交结果。
- 展示端只展示，不维护第二套流程状态。
- 事件推送失败不能影响 Flow 执行。
- 断线后以快照恢复界面，不依赖事件缓存猜测状态。
- 所有事件都必须关联 Run；节点事件还必须关联 NodeRun。

## 11. 本次开发实现契约

本节把前述原则收敛为实现和测试必须共同遵守的边界。它只定义运行事实层，不提前实现展示协议或外部事件日志。

### 11.1 实体和完整历史

- **Flow** 是可复用的静态路径。Run 创建时必须保存 `flowId` 和 Flow 版本或内容指纹；恢复和查询不得用当前文件反推历史。
- **Task** 是本次问题的输入快照，或一个稳定的外部引用加摘要。它属于 Run，不属于 Flow。历史必须能得到快照，或者明确知道如何按权限取得引用指向的内容。
- **Run** 是一次 Task 按一个 Flow 版本执行的实例。它保存当前快照和终态，但当前游标只是定位缓存，不能代替历史实体。
- **NodeRun** 是一次实际进入节点的访问。每次首次进入、返工、循环和 Agent 恢复都创建新 ID，历史记录不可覆盖。必须保存：节点引用、动作类型、输入、显式状态、开始/结束时间、结果、错误分类与摘要、执行依据引用、恢复前驱（`retryOf` 或等价字段）、所属并行轮次（如有）以及 Run 内执行序号。
- **RouteDecision** 是独立历史实体。必须保存来源 NodeRun、结果名、目标节点/并行轮次/结束、选择时间和 Run 内序号。Inspector 不得通过当前 Flow 的边临时推断路由原因。
- **ParallelRound** 是独立历史实体。必须保存轮次输入、并行入口、分支引用到 NodeRun 的映射、各分支状态、汇合 NodeRun、汇合输入和结果、轮次状态及时间。轮次完成后仍可查询；重新进入入口必须产生新轮次。

`FlowRunHistory` 是 Inspector 组装的统一只读投影，至少包含 Run 摘要、Task、Flow 版本、按事实提交顺序排列的全部 NodeRun、全部 RouteDecision、全部 ParallelRound、当前定位、错误摘要、版本水位和依据引用。它不是任意单表记录的别名。完整 Agent 对话、Prompt、stdout 和 stderr 通过依据引用按权限查询，不默认放入实时事件。

### 11.2 状态机和失败分类

Run `status` 只能是 `running | completed | failed | interrupted`，Run `phase` 只能是 `starting | executing_node | waiting_parallel | routing | completed | failed | interrupted`。NodeRun `status` 只能是 `running | completed | failed | interrupted`，不得再由 `completedAt` 或 `outcome` 是否存在推断。

- 终态 Run 不能回退。正常完成、运行时失败和进程中断分别进入 `completed`、`failed` 和 `interrupted`。
- 执行器异常、结果校验失败、路径不存在和无法提交事实，必须使关联 NodeRun 与 Run 显式失败，并保存稳定的错误分类和面向用户的摘要。
- 命令进程正常退出但退出码非零，是已完成命令节点的业务结果，仍允许按 Flow 路由；它不是执行器异常，也不能直接把 NodeRun 或 Run 标为运行失败。
- 进程中断必须先保留中断事实。Agent 恢复创建新的 NodeRun，并通过 `retryOf`/恢复引用关联旧记录，同时产生 `run.resumed`。已完成节点不得重复执行。未完成命令不得自动重放，恢复时必须将原 NodeRun 保持 `interrupted`，并把 Run 转为有明确原因的 `failed` 或等待人工处理的 `interrupted`。
- 每个 Run 的 `sequence`/版本水位严格单调递增。NodeRun、RouteDecision、ParallelRound 和事件引用同一 Run 水位，按事实提交顺序排序；并行完成顺序不能改写已提交的事实顺序。

### 11.3 RunStore、提交和事件

RunStore 是 Run 当前状态和可查询历史的唯一持久事实来源，负责保存 Run、NodeRun、RouteDecision、ParallelRound、执行序号/版本和依据引用；它不解析 Flow、不选择路径。协调器是唯一写入者。

一次状态变化必须作为一个原子事实提交：协调器计算变化，RunStore 在同一提交中保存所有关联记录、当前游标和递增水位，保存成功后才交给 Publisher。至少要能表达带 `expectedVersion` 的提交或等价的并发保护；保存失败不得发布对应成功事件，也不得让内存对象假装已提交。MVP 的 JSON Store 限定为单进程单实例，并采用串行写入和临时文件原子替换；不承诺跨进程并发。

`FlowObservationPublisher` 只接受已持久化事实的瞬时通知，不保存第二套状态，不路由、不提交结果、不反向控制 Flow。最小事件为：`run.started`、`run.resumed`、`run.completed`、`run.failed`、`run.interrupted`、`node.started`、`node.completed`、`node.failed`、`node.interrupted`、`route.selected`、`parallel.started`、`parallel.completed`。每个事件必须包含 `runId`、`flowId`、事件类型、Run 内单调 `sequence`、`occurredAt`、相关 NodeRun/ParallelRound 引用、提交后的 status/phase 和摘要。

Publisher 发布失败或订阅者抛错，只进入宿主诊断，不回滚、不阻断执行、不改变已保存终态。MVP 事件是实时通知，不承诺断线期间补发全部事件，事件也不是事件日志；客户端应按 `(runId, sequence)` 去重。

### 11.4 Inspector、统一入口和快照水位

应用能力的最小边界为：

```ts
interface FlowRunInspector {
  inspectRun(runId: string): Promise<FlowRunHistory | undefined>;
  inspectNodeEvidence(
    runId: string,
    nodeRunId: string,
  ): Promise<FlowNodeEvidence | undefined>;
}

interface FlowObservationPublisher {
  subscribe(
    runId: string,
    listener: (event: FlowObservationEvent) => void,
  ): FlowObservationSubscription;
}
```

`inspectNodeEvidence` 必须校验 `nodeRunId` 属于指定 Run，并按宿主权限返回完整依据或 `undefined`。Inspector 只读、只组织历史，不路由、不决策、不提交结果。

Runtime 对外只暴露一个组装好的入口，至少提供上述 Inspector 和 Publisher；TUI、CLI、SDK、JSON、RPC 和 Agent 均通过这个入口调用，适配器只负责格式、传输和权限。适配器不得读取 RunStore、解析 `.pi/flow-runs.json`、拼接 `getRun`/`listNodeRuns`，也不得从 Agent 自然语言判断状态。CLI 退出码只表达 Run 终态，业务“通过”来自 Flow 结果。

启动或重连必须先取得历史快照，再接收后续通知。为消除“快照读取和订阅注册之间”的空窗，统一入口必须定义订阅水位协议：推荐先注册订阅并缓冲事件，再读取带 `sequence` 的快照，应用快照后只处理水位更高的缓冲事件；或采用等价的订阅后重新检查快照协议。事件丢失时以最新快照纠正，不能靠事件缓存永久推断状态。

### 11.5 六类契约验收

1. **普通路径**：Inspector 能还原 Task、Flow 版本、NodeRun 顺序、输入、结果和最终 Run；历史中存在 `node.completed -> route.selected -> node.started` 的事实关系及最终 `run.completed`。
2. **返工**：同一 `nodeRef` 的每次访问都有不同 NodeRun ID 和序号；前次结果明确指向返工目标，第二次输入和恢复/返工原因可查询，旧记录不被覆盖。
3. **并行**：每次入口都有独立 ParallelRound；全部分支、分支状态、完成顺序、汇合 NodeRun、汇合输入和结果可还原；再次返工或再次进入并行不会混用上一轮记录。
4. **失败**：分别验证执行器异常、路由错误、结果校验错误、命令中断和命令非零退出。前四类定位到 NodeRun/Run 并保存错误，非零退出作为已完成业务结果并可路由；Publisher 故障不影响执行和终态。
5. **恢复**：恢复前 Agent NodeRun 为 `interrupted`，恢复创建带关联的新 NodeRun 并发布 `run.resumed`；未完成命令不重放，明确进入 `failed` 或人工处理的 `interrupted`；已完成节点不重复执行。
6. **断线**：订阅断开不影响 Run 和持久化；重连通过统一入口先取得正确快照，再接收水位之后的通知；不要求 MVP 补发断线期间的全部事件。

本节点只完成上述契约审查和文档修正。契约通过后，下一节点才实现类型、持久化事实模型、状态转换、Inspector/Publisher、快照水位协议和六类测试；不在本节点实现展示适配器、事件日志、数据库并发或外部可观测性平台。