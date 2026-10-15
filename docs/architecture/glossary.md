# 术语表

| 术语 | 定义 | 代码/文档入口 |
| --- | --- | --- |
| Flow | 用 Markdown 描述的可复用工作路径，包含图、动作、结果和变量声明 | `src/parser.ts`、`docs/flow-spec.md` |
| FlowDefinition | Parser 产出的结构化静态定义，不含运行状态 | `src/types.ts:71` |
| FlowPackage | 一个 Flow 的定义、入口路径和资源上下文 | `src/types.ts:89` |
| LoadedFlow | 根 Flow 加完整引用闭包 | `src/types.ts:96`、`src/flow-loader.ts` |
| Run | 某个任务在一条 Flow 上的一次执行实例 | `src/types.ts:304` |
| NodeRun | 一次实际进入节点的访问事实，循环、返工和恢复各自产生新记录 | `src/types.ts:225` |
| RouteDecision | 结果边的已提交选择记录 | `src/types.ts:253` |
| ParallelRound | 一次并行入口的具体执行轮次，不是静态图中的并行定义 | `src/types.ts:266` |
| 子 Flow | 由 `执行Flow` 节点创建的独立 Run，拥有自己的变量和状态 | `src/runtime.ts`、`docs/flow-reference-design.md` |
| 全局变量 | 在 Flow 元信息中声明，属于当前 Run，可用 `{var.xxx}` 读取 | `src/parser.ts`、`src/runtime.ts` |
| 下一跳变量 | 在某个结果说明中声明，只传给实际进入的下一节点，可用 `{input.xxx}` 读取 | `src/parser.ts`、`src/runtime.ts` |
| 分支变量 | 并行分支的结果变量，在汇合节点以 `{branch.<ref>.<name>}` 读取 | `src/parser.ts`、`src/runtime.ts` |
| Flow 指纹 | 从当前解析定义和引用子 Flow 递归计算的内容指纹，用于恢复漂移检查 | `src/runtime.ts` 的 `fingerprintFlow` |
| AgentRunModel | 运行时中的 Agent 绑定和节点结果接收模型 | `src/runtime.ts`、`src/types.ts` |
| AgentIntegrationAdapter | 具体 Agent 平台的创建、接管、执行、证据读取和释放边界 | `src/types.ts:135` |
| `submit_flow_outcome` | Agent 提交当前节点结果的唯一结构化控制入口 | `src/pi.ts` |
| RunStore | 保存和查询 Run 及其历史事实的接口 | `src/types.ts:360` |
| FlowRunInspector | 将持久事实投影为可查询历史，不参与路由 | `src/observability.ts` |
| FlowObservationPublisher | 进程内尽力发布运行事件，不是事件日志 | `src/observability.ts` |
| Evidence | 节点输入、Agent 消息、命令输出等执行依据 | `src/types.ts:444`、`src/observability.ts` |
| Flow Host | 负责把 Pi/SDK 输入装配到 Runtime 的宿主层 | `src/extension.ts` |
| legacy 快照 | 缺少新运行事实字段的历史 JSON 记录，可读但完整性受限 | `src/runtime.ts` 的 `normalizeRun` |
