# Agent Flow Runtime 架构基线

## 文档定位

本文档描述 `@jhihjian/agent-flow-runtime` 当前源码形成的架构事实。它回答系统是什么、如何执行一次 Flow、模块如何分工、哪些规则必须保持成立，以及从哪里可以重新核对结论。

本目录记录当前源码形成的架构知识，并保留可回链的源码和配置证据。当前内容来自静态源码审计，未执行构建、测试或集成验证；未知的业务和运维策略均标为待确认。

## 覆盖范围

覆盖当前工作树中的：

- Flow Markdown 的解析、校验、资源装载和兄弟 Flow 引用闭包。
- 变量声明、模板作用域、节点结果和并行分支数据。
- Run、NodeRun、路由、并行轮次、恢复记录及 JSON 文件持久化。
- Agent、命令、子 Flow 三类动作的执行和恢复语义。
- Pi SDK/CLI 适配、扩展入口、会话切换和结果提交工具。
- 运行历史查询、节点证据读取和进程内观测通知。
- 包装、构建、源码索引、测试入口和发布 workflow 对架构的约束。

不覆盖：

- Pi 或 provider 的实际模型行为、鉴权和生产部署拓扑。
- 未由源码实现的产品策略、业务组织流程或外部服务契约。
- 完整接口参数手册、配置字段全集、页面交互细节和测试工程说明。
- 跨进程 JSON Store 并发保证、事件补发和外部可观测性平台。

## 系统是什么

Agent Flow Runtime 是一个由 Markdown 定义工作路径、由运行时按节点结果推进的执行内核。Flow 是静态、可复用的路径；Run 是某个任务在一条 Flow 上的一次执行；NodeRun 是一次实际进入节点的访问记录。

运行时不替用户决定任务目标，也不从 Agent 自然语言推断流程状态。Agent 只能提交当前节点声明的结果和变量，协调器依据结果边选择下一去向。Pi 是当前实现中的宿主和 Agent 会话平台，但核心协调器通过适配器接口与 Pi 解耦。

## 核心对象与关系

| 对象 | 职责 | 关键关系 |
| --- | --- | --- |
| FlowDefinition | 解析后的静态图、动作、结果边、并行入口和全局变量声明 | 由 Parser 从 `FLOW.md` 生成 |
| FlowPackage | FlowDefinition 加入口路径和已校验资源 | Loader 负责装载 |
| LoadedFlow | 根 Flow 加传递引用闭包 | `执行Flow` 只能调用闭包内的兄弟包 |
| FlowRunRecord | 一次运行的当前状态、变量快照、游标、版本指纹和父子关系 | 一个父 Run 可拥有多个子 Run |
| NodeRunRecord | 一次节点访问的输入、结果、状态、错误和执行依据引用 | 循环、返工和 Agent 恢复都会产生新记录 |
| RouteDecisionRecord | 已提交的结果到去向的选择事实 | 来源于一个 NodeRun |
| ParallelRoundRecord | 一次并行入口的输入、分支、状态和汇合事实 | 绑定同一轮的分支 NodeRun |
| RunRecoveryRecord | 恢复策略和恢复关系 | 关联被中断的 NodeRun |
| FlowRunHistory | Inspector 组织出的只读历史投影 | 供 SDK、CLI、Agent 查询和宿主读取 |

## 业务流

### Flow 加载流

1. 宿主接收 Flow 目录或 `FLOW.md` 路径。
2. Loader 解析固定入口，取父目录名作为 Flow 标识。
3. Parser 读取 YAML 元信息、唯一 Mermaid `flowchart TD`、节点动作和结果说明。
4. Parser 校验起点、终点、可达性、结果边、命令格式、模板作用域、并行结构和 Flow 引用语法。
5. Loader 校验 `references/*.md` 和 `scripts/*.mjs` 资源不能逃出包根，并递归加载兄弟 Flow 引用，拒绝缺失和环。
6. 宿主得到 `LoadedFlow`，其中静态定义不再由协调器重新解释 Markdown。

### 一次普通运行

1. Pi 扩展或 SDK 宿主解析启动变量，创建 Store、Agent 模型、Publisher、Inspector 和 Coordinator。
2. Coordinator 校验启动变量，按声明填充默认值，计算包含子 Flow 的组合指纹，创建 `running` Run。
3. 每次进入工作节点都创建新的 NodeRun，并保存当前输入和进入来源。
4. Coordinator 按动作类型调用 Agent、命令或子 Flow。Agent 通过 `submit_flow_outcome` 提交结果，命令固定产生 `已执行` 结果。
5. Coordinator 校验结果名和变量声明。全局变量写回 Run，结果变量只进入实际下一节点的 `input`。
6. Coordinator 保存 NodeRun、路由选择和下一位置，然后继续普通节点、并行入口或结束边。
7. Store 成功提交后 Publisher 发布事件，Inspector 可从事实记录还原执行历史。

### 并行检查流

1. 结果边进入并行入口时创建新的 ParallelRound，并保存本轮输入。
2. 每个直接分支创建独立命令 NodeRun，分支读取同一轮输入。
3. 所有分支完成后，汇合命令通过 `{branch.<分支引用>.<变量>}`读取本轮分支输出。
4. 汇合结果按普通结果处理，成为下一节点输入或全局变量更新。
5. 多个分支写同一全局变量时，合并阶段确定性失败，保留分支事实。
6. 再次进入并行入口创建新轮次，不复用上一轮分支输出。

### 子 Flow 流

1. `执行Flow`节点只按动作中的 `flow` 和显式 `inputs` 启动子 Run。
2. 子 Flow 使用自己的全局变量声明、状态和 Agent 绑定，不继承父变量，也不自动回传内部变量。
3. 子 Run 与父 Run 共用当前 Store、命令执行器、Agent 模型和 Publisher，并记录 `parentRunId`、`parentNodeRunId`。
4. 子 Run 完成后，父节点只从其成功结果的声明变量中提取输出。
5. 无结果边的引用节点在子 Run 失败时使父 Run 失败；双结果边则选择 `已完成` 或 `已失败`。
6. 父节点中断时，活跃子 Run 同步中断。恢复父 Run 时，子 Run 只能随父 Run 递归恢复，不能直接恢复。

### 恢复流

1. Coordinator 从 Store 读取 Run、当前节点和历史 NodeRun，并校验 Flow 组合指纹。
2. 已完成节点可记录恢复事实后继续路由，不重复执行。
3. 未完成 Agent 节点先保留原 `interrupted` 访问，再创建带 `retryOf` 的新 NodeRun。
4. 未完成命令节点不自动重放，恢复时进入 `failed`，错误分类为 `command_interrupted`。
5. 子 Flow 节点根据子 Run 状态补全父节点，或先递归恢复子 Run。
6. Pi 扩展的自动恢复入口只扫描 `running`、当前工作目录和当前 session 匹配的根 Run；`interrupted` Run 仍可由 Coordinator 显式恢复，但不会被该自动扫描选中。

## 模块边界与依赖方向

依赖从宿主向内核流动：

`extension -> loader / pi / runtime / observability`

`runtime -> parser / loader / types / variables`

`pi -> Pi SDK / runtime adapter types / observability facade`

`observability -> store contracts / runtime types`

`index -> public modules`

- Parser、Loader 和 Directory 只负责定义和资源，不执行节点。
- Coordinator 是 Run 状态、流程位置和 NodeRun 的主要写入者，不直接依赖 Pi SDK。
- AgentRunModel 负责 Run 级 Agent 绑定和结果回调，不选择路由。
- AgentIntegrationAdapter 负责平台会话和交互范围，不解释 Flow 图。
- CommandExecutor 只执行外部命令并返回执行证据。
- RunStore 保存当前快照和历史事实，不解析 Flow，不选择去向。
- Inspector 只读组织历史，Publisher 只做进程内尽力通知。
- Extension 负责 Pi 入口和运行时装配，CLI 状态保存在扩展进程的 `globalThis` 上。

详见[模块设计](modules/README.md)。

## 状态和持久化

Run 状态为 `running`、`completed`、`failed`、`interrupted`。阶段为 `starting`、`executing_node`、`waiting_parallel`、`routing`、`completed`、`failed`、`interrupted`。NodeRun 和 ParallelRound 也使用显式状态。

每次协调器提交都带有 Run 的 `expectedSequence`，成功后递增 sequence，并在同一次 Store 提交中写入相关事实。JsonFileRunStore 在单个实例内串行 mutation，将全部事实写入完整 JSON 快照，通过临时文件和 rename 替换目标文件。源码注释明确其边界为 single-process，未实现跨进程锁、CAS 或事件日志。

Flow 指纹用于恢复时拒绝定义漂移。父 Flow 指纹递归包含引用闭包中的子 Flow 指纹。旧快照可被兼容读取并标记为 `legacy`，但不能据此宣称拥有完整的路由、版本或并行历史。

## 观测与证据

FlowRunInspector 从 Store 投影 Run 摘要、NodeRun、路由、并行轮次、恢复和当前位置。FlowRuntime 提供统一的查询、订阅和“先订阅再取快照”的竞态保护入口。FlowObservationPublisher 是进程内 best-effort 发布器，不缓存、不补发，也不是事件日志。

节点证据可能包含输入、结果、错误、Agent 消息和命令 stdout/stderr。`FlowRunHistory` 默认只给出会话引用和命令证据可用性；完整证据通过 `inspectNodeEvidence` 按授权器读取。源码默认授权器为放行策略，宿主需要显式提供安全边界。

Pi JSON/RPC 宿主将事件包装为 `flow_event`，断线后应先重新读取历史快照，再订阅后续事件。事件丢失不应被解释为运行事实丢失。

## 必须保持的不变量

1. Flow 定义不保存某次运行状态，Run 不修改 Flow，NodeRun 不覆盖历史访问。
2. Parser 只解析和校验，不执行 Agent、命令或子 Flow。
3. 结果名只负责选边，变量必须通过已声明的作用域传递，未声明变量拒绝提交。
4. 每次进入节点都创建新的 NodeRun，恢复 Agent 也不能覆盖原中断记录。
5. 并行分支和汇合节点必须属于同一个 ParallelRound，分支数据不能按完成时间猜测。
6. 子 Flow 只接收显式输入，只通过父节点声明的输出回传。
7. RunStore 保存成功后才能发布对应成功观测事件，观测失败不能反向改变运行。
8. 单进程 JSON Store 不得被描述为跨进程并发协调器或事件日志。
9. 恢复必须使用匹配的 Flow 组合指纹，历史完整性不足的 legacy 快照不能伪装成完整历史。

## 子文档

- [术语表](glossary.md)
- [模块索引](modules/README.md)
- [来源映射与验证入口](source-map.md)
- [独立审计记录](audit.md)
- [架构决策](decisions/README.md)

## 相关资料

- [Flow 规范](../flow-spec.md)
- [运行观测设计](../flow-observability-design.md)
- [Pi Flow 宿主设计](../pi-flow-host-design.md)
- [源码符号索引](../source-index.md)
