# Flow 运行记录可视化实现设计

## 1. 目标

本设计定义 Flow 运行记录可视化的最小实现边界。目标是在不改变 Flow 执行语义的前提下，提供近期运行列表、单次 Run 详情、事实时间线、实时状态和按需执行依据。

展示系统服务三个高频场景：

1. 从近期运行中找到需要查看的一次 Run。
2. 跟进正在执行的节点或并行轮次。
3. 追溯返工、失败、中断和恢复事实。

展示系统通过已有的 `FlowRuntime` 读取事实。它不参与节点执行、结果提交、路由选择、恢复决策或存储写入。

## 2. 设计结论

新增一个无框架、只读的展示状态模块：

```text
src/flow-run-visualization.ts
```

该模块输出稳定的视图模型和状态变化，TUI、Web、CLI 或其他宿主只负责渲染和用户输入转发。

当前实现已提供`FlowRunVisualizationController`、`buildFlowTimeline`和近期运行筛选函数，并从包公共入口导出。控制器的状态机、快照水位、订阅释放、冷启动快照一致性和证据隔离由独立单元测试覆盖。

```text
FlowCoordinator
  -> RunStore
  -> FlowObservationPublisher

FlowRuntime
  -> FlowRunInspector
  -> FlowObservationPublisher

FlowRunVisualizationController
  -> 近期运行投影
  -> Run 详情快照
  -> 时间线投影
  -> 订阅生命周期
  -> 按需证据状态

TUI / Web / CLI
  -> 渲染 Controller 状态
  -> 调用 Controller 的只读操作
```

`FlowCoordinator`继续是运行事实的唯一写入者。`FlowRunVisualizationController`只接收已构造好的`FlowRuntime`，不接收`FlowCoordinator`、`RunStore`或 JSON 文件路径。

## 3. 边界

### 3.1 可调用能力

展示控制器只依赖以下`FlowRuntime`能力：

```ts
interface FlowRunVisualizationRuntime {
  listRecentRuns(limit?: number): Promise<FlowRunSummary[]>;
  inspectRun(runId: string): Promise<FlowRunHistory | undefined>;
  inspectNodeEvidence(
    runId: string,
    nodeRunId: string,
  ): Promise<FlowNodeEvidence | undefined>;
  openRunObservation(
    runId: string,
    listener: (event: FlowObservationEvent) => void,
  ): Promise<FlowRunObservation | undefined>;
}
```

以上能力组成展示层的唯一数据入口。宿主不为了补充字段读取`.pi/flow-runs.json`、拼接`RunStore`查询或解析 Pi 自然语言消息。

### 3.2 禁止职责

展示模块不得承担以下职责：

- 创建、更新或删除 Run、NodeRun、RouteDecision、ParallelRound 或恢复记录。
- 调用`FlowCoordinator.run`、`resume`或任何节点提交接口。
- 选择 Flow 边、判断业务结果或推断未持久化的路径。
- 将实时事件保存为第二套运行状态库。
- 发起节点重试、停止、恢复或命令重放。
- 读取完整 Agent 消息、Prompt、stdout 或 stderr 后缓存到列表和详情快照。
- 将未授权的 Task、输入或执行依据交给不受信任的客户端。

恢复、停止和重试属于运行控制能力，需要独立的权限和命令契约；可视化页面在本设计中保持只读。

## 4. 状态模型

### 4.1 运行中心状态

```ts
interface FlowRunCenterState {
  runs: FlowRunSummary[];
  filter: "all" | "running" | "terminal" | "attention";
  selectedRunId?: string;
  loading: boolean;
  error?: string;
  refreshedAt?: string;
}
```

运行中心默认请求最近 50 条记录。筛选、排序和选中状态只存在于展示层内存，不写入 RunStore。

`attention`包含失败、中断、存在错误摘要或历史不完整的 Run。该分类只用于视觉筛选，不改变 Run 状态语义。

### 4.2 Run 详情状态

```ts
interface FlowRunDetailState {
  runId: string;
  snapshot?: FlowRunHistory;
  timeline: FlowTimelineItem[];
  selectedFact?: FlowFactSelection;
  evidence?: FlowNodeEvidence;
  evidenceState: "idle" | "loading" | "available" | "unavailable";
  connection: "connecting" | "connected" | "disconnected" | "refreshing";
  lastConfirmedSequence?: number;
  lastEvent?: FlowObservationEvent;
  error?: string;
}
```

`snapshot`和`lastConfirmedSequence`来自 Inspector。事件不直接修改`timeline`、节点状态或并行状态。

### 4.3 事实选择

```ts
type FlowFactSelection =
  | { kind: "node"; nodeRunId: string }
  | { kind: "route"; routeDecisionId: string }
  | { kind: "parallel"; parallelRoundId: string }
  | { kind: "recovery"; recoveryId: string };
```

选择状态只决定详情面板显示什么，不改变 Run 的当前位置。

## 5. 快照和事件

### 5.1 快照权威

`FlowRunHistory`是展示系统的唯一权威状态。它用于构建：

- Run 顶部状态与当前位置。
- NodeRun 访问路径。
- RouteDecision 原因。
- ParallelRound 分支和汇合关系。
- Recovery 前驱与策略。
- 证据可用性。

展示端打开详情时调用`openRunObservation`：

```text
注册订阅
  -> 缓冲订阅期间事件
  -> 读取 FlowRunHistory 快照
  -> 应用快照
  -> 处理水位高于快照的缓冲事件
```

这一顺序消除“先读快照、再订阅”导致的观察空窗。

### 5.2 事件用途

`FlowObservationEvent`是刷新提示，不是展示状态来源。

收到事件后，控制器执行以下判断：

1. 事件`runId`必须等于当前详情 Run。
2. 事件`sequence`小于或等于`lastConfirmedSequence`时忽略。
3. 高于当前水位的事件保存为`lastEvent`，并合并为一次快照刷新。
4. 刷新完成后，以新的`FlowRunHistory`替换旧快照和时间线。

事件密集到达时只保留一次待执行刷新，避免每个节点事件都触发一次查询。刷新请求需要携带观察代次，切换 Run、关闭详情或重连后返回的旧请求结果不得覆盖新状态。

### 5.3 当前事实限制

当前事实模型保存 NodeRun 访问、路由、并行轮次和恢复关系，但不能作为追加事件日志精确重放每一次节点状态变化。因此：

- 时间线以持久化访问、路由、并行和恢复事实为主。
- 实时区可以显示“刚刚发生的事件摘要”。
- 页面重连后使用快照校正，不尝试补造断线期间的逐条事件。
- 需要完整历史事件回放时，再增加持久化追加事件日志或 outbox。

## 6. 时间线投影

`buildFlowTimeline(history)`是纯函数，输入`FlowRunHistory`，输出可渲染的`FlowTimelineItem[]`。

```ts
type FlowTimelineItem =
  | FlowNodeTimelineItem
  | FlowRouteTimelineItem
  | FlowParallelTimelineItem
  | FlowRecoveryTimelineItem
  | FlowRunTerminalTimelineItem;
```

投影规则：

1. NodeRun 以`sequence`表达实际访问顺序。
2. RouteDecision 插入来源 NodeRun 与目标访问之间，展示结果名和目标。
3. ParallelRound 作为复合条目，展开后显示分支 NodeRun、分支状态、汇合 NodeRun 和轮次结果。
4. Recovery 连接旧 NodeRun 与带`retryOf`的新 NodeRun。
5. 终态以 Run 的状态、时间和错误摘要作为时间线末尾事实。
6. 同一`nodeRef`的不同 NodeRun 保留独立条目和访问编号。

当前模型缺少每次 NodeRun 状态切换的独立持久化序号。时间线将节点状态作为该访问的当前或终态快照显示，不能在断线后声称精确还原`node.started`与`node.completed`之间的所有瞬时事件。

## 7. 页面读取流程

### 7.1 运行中心

```text
加载运行中心
  -> listRecentRuns(50)
  -> 构建列表行
  -> 用户筛选或选择 Run
  -> 打开详情
```

运行列表显示 Task 摘要、Flow、状态、阶段、开始或结束时间、错误摘要、历史完整性和 Run ID。列表不预加载节点证据。

### 7.2 详情打开

```text
open(runId)
  -> openRunObservation(runId)
  -> 保存订阅句柄
  -> 保存快照和确认水位
  -> buildFlowTimeline(snapshot)
  -> 默认选中当前或最后相关事实
```

终态 Run 的`current`可能为`none`。详情页从最后一个 NodeRun、失败 NodeRun 或恢复记录派生视觉定位，但不写回 Run。

### 7.3 证据展开

```text
用户选择 NodeRun
  -> 显示已在快照中的摘要与引用
  -> 用户请求完整依据
  -> inspectNodeEvidence(runId, nodeRunId)
  -> 显示已授权的消息或命令结果
```

`undefined`表示无权或不可用。界面统一显示“完整依据不可用”，不区分对象不存在和权限拒绝，防止产生侧信道。

### 7.4 切换和释放

```text
切换 Run 或关闭详情
  -> 递增观察代次
  -> 取消旧订阅
  -> 清理证据状态
  -> 保留运行中心列表
```

控制器释放后不持有 Publisher、订阅回调或完整执行依据。

## 8. 断线和重连

`FlowObservationPublisher`是进程内尽力而为通知。展示模块不从 Publisher 推断网络连接状态，由宿主显式调用：

```ts
controller.reconnect(runId)
```

重连流程：

```text
标记 disconnected
  -> 取消旧订阅
  -> openRunObservation(runId)
  -> 用新快照替换旧快照
  -> 标记 connected
```

重连前保留最后确认快照和水位，页面显示“实时连接已断开”。该状态不改变 Run 的`status`和`phase`。

## 9. 宿主适配

不同宿主只绑定控制器状态与用户输入：

| 宿主 | 输入 | 输出 |
| --- | --- | --- |
| Pi TUI | 选择 Run、展开事实、重连 | 状态栏、小组件、详情面板 |
| Web | 筛选、选择、展开证据、重连 | 运行中心和详情页 |
| CLI | Run ID、列表数量 | 格式化列表与详情文本 |
| SDK | 直接调用控制器操作 | 视图模型订阅或轮询 |

宿主不实现路径投影、事件水位判断、证据延迟加载或订阅释放。这些规则集中在展示状态模块，保证 TUI 和 Web 对同一 Run 得到相同解释。

## 10. 权限和脱敏

当前本地可信宿主可以使用`FlowRuntime`读取 Run 历史。多用户 Web 场景需要由服务端构造按身份授权、脱敏后的 Runtime 适配器。

展示控制器默认处理以下信息：

- Run 摘要与状态。
- NodeRun 输入和结果名。
- 路由、并行和恢复关系。
- 错误摘要与证据可用性。

完整 Task、完整 Prompt、Agent 对话、stdout、stderr 和会话路径通过`inspectNodeEvidence`按需读取。浏览器端截断内容不能替代服务端授权。

## 11. 测试边界

展示模块使用 fake `FlowRuntime` 测试，不启动 Coordinator，不写入 JSON 文件。

必须覆盖：

1. 近期 Run 排序、筛选和选择。
2. 普通路径、循环、并行、失败和恢复的时间线投影。
3. 切换 Run 时释放旧订阅。
4. 快照与订阅竞态。
5. 重复、低水位或乱序事件不会覆盖快照。
6. 高水位事件合并成一次快照刷新。
7. 断线保留最后快照，重连以新快照校正。
8. 证据仅在选择 NodeRun 后按需读取。
9. 无权或不可用依据不会泄露原始内容。

Coordinator、RunStore 和 Publisher 的执行行为继续由现有运行事实测试覆盖。展示测试只验证读模型、状态机和订阅生命周期。

## 12. 后续扩展条件

以下能力需要额外契约后再加入：

| 能力 | 前置条件 |
| --- | --- |
| 静态 Flow 结构图 | `FlowDefinitionProvider(flowId, flowVersion)`，保证图与历史版本一致 |
| 跨 Run 路径对比 | Flow 版本对齐规则和列表聚合投影 |
| 多用户 Web | 服务端授权、Task/输入脱敏和证据访问审计 |
| 完整事件回放 | RunStore 追加事件日志或 outbox |
| 重试、恢复、停止操作 | 运行控制命令、权限模型和审计规则 |

展示模块保持只读，以上能力以独立模块扩展，不向`FlowCoordinator`加入 UI 状态或宿主逻辑。
