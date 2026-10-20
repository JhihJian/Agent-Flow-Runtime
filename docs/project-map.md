# 项目地图

## 一眼看懂

这是一个 TypeScript/ESM Node.js 包，将目录化的 `FLOW.md` 解析为 `FlowDefinition`，由 `FlowCoordinator` 驱动 Agent、命令节点、结果路由、并行检查、子 Flow 和恢复。项目不是 Web 服务；宿主是 Pi CLI/SDK，并提供可嵌入 Node.js 程序的运行时 API。Agent 的业务工具和 Skill 由 Flow 顶层 `capabilities` 声明，未声明时为空，具体装配由宿主适配层完成。

宿主入口是 [`src/extension.ts`](../src/extension.ts) 的 `flowExtension`，库入口是 [`src/index.ts`](../src/index.ts) 的公共导出。Flow 的实际入口是 `<包目录>/FLOW.md`，由 [`src/flow-loader.ts`](../src/flow-loader.ts) 的 `loadFlow` 加载。主线经过解析、运行记录、节点执行、结果路由、JSON 快照和观测事件；外部边界包括 Pi SDK/会话文件、Node 文件系统、命令子进程、YAML/TypeBox 依赖和 npm 发布工作流。

推荐阅读顺序：[`README.md`](../README.md) 的安装运行说明，[`docs/flow-spec.md`](flow-spec.md) 的 Flow 格式，随后阅读 `src/parser.ts`、`src/flow-loader.ts`、`src/runtime.ts`、`src/agent.ts`、`src/pi.ts` 和 `src/extension.ts`。示例入口在 `examples/*/FLOW.md`，索引工具在 `tools/`。

## 系统入口

| 入口 | 来源与真实位置 |
| --- | --- |
| Node.js 库 | `package.json#main`、`exports["."]` 指向 Core 构建产物；源码为 [`src/index.ts`](../src/index.ts)，导出 `loadFlow`、`FlowCoordinator`、`FlowRuntime`、Agent 抽象和类型。Pi 适配器通过 `exports["./pi"]` 提供。 |
| Pi 扩展 | `package.json#pi.extensions` 和 `exports["./extension"]`；宿主加载 [`src/extension.ts`](../src/extension.ts) 的 `flowExtension(pi: ExtensionAPI)`。 |
| Pi 启动 | `src/extension.ts` 的 `registerFlag("flow")`、`on("input")`、`startFlow`；命令形态为 `pi --flow <包目录或 FLOW.md> [任务]`。 |
| Pi 命令 | `src/extension.ts` 的 `registerCommand("flow")`；支持 `/flow run`、`/flow list`、`/flow show`。 |
| Agent 工具 | `src/extension.ts` 注册 `createFlowOutcomeTool`、`createFlowInspectionTool`；实现位于 [`src/pi.ts`](../src/pi.ts)，分别提供 `submit_flow_outcome` 和 `inspect_flow_run`。 |
| Flow 文件 | [`src/flow-loader.ts`](../src/flow-loader.ts) 的 `loadFlowPackage` 接受目录或固定文件名 `FLOW.md`；目录名是 Flow 标识。 |
| SDK 执行 | [`src/runtime.ts`](../src/runtime.ts) 的 `FlowCoordinator.run`；宿主先用 `loadFlow`，再组装 Store、Agent model 和 Coordinator。 |
| Flow 发现 | [`src/directory.ts`](../src/directory.ts) 的 `FlowDirectory.list/load` 递归发现含 `FLOW.md` 的包，跳过资源目录。 |
| 开发/发布 | `package.json#scripts` 提供 `build`、`check`、`test`、源码索引命令；[`.github/workflows/publish.yml`](../.github/workflows/publish.yml) 的 `v*` 标签流程发布 npm。 |

未发现 HTTP 服务、常驻进程、Docker Compose、数据库迁移或其他服务宿主声明。`dist/`、`node_modules/`、`.pi/` 分别是生成物、依赖和运行状态目录。

## 核心运行路径

以下顺序来自入口函数调用和状态写入；模块之间仅由 import 得到的关系不作为运行时顺序。

1. **接收输入。** `src/extension.ts#parseFlowVariables` 合并 `--variables` JSON、`--var` 和自由文本，并由 [`src/variables.ts`](../src/variables.ts) 的 `validateVariables` 校验；SDK 直接提供 `FlowRunInput`。
2. **加载定义。** `startFlow` 调用 `loadFlow`；`loadFlowPackage` 找到 `FLOW.md`，调用 [`src/parser.ts`](../src/parser.ts) 的 `parseFlow`，校验 Mermaid 图、动作、结果、变量和资源；`loadReferenceClosure` 递归加载兄弟 Flow 并检测环。
3. **建立运行。** `startFlow` 创建 `PiAgentIntegrationAdapter`、`JsonFileRunStore`、`FlowObservationPublisher`、`FlowRuntime` 和 `FlowCoordinator`。`FlowCoordinator.run` 初始化变量，创建 `running` 的 `FlowRunRecord`，发布 `run.started`，从 `startNodeRef` 进入 `continueRun`。
4. **执行节点。** `continueRun` 调用 `executeNode`，由 `startNode` 创建 `NodeRunRecord`，再由 `executePreparedNode` 分派 Agent、`ProcessCommandExecutor` 命令或 `startChildRun` 子 Flow；执行前渲染 `var`、`input`、`branch` 模板。
5. **提交结果。** Agent 通过 `submit_flow_outcome` 或 SDK 回调提交结果；命令节点固定产生 `已执行`，只有 `output: "variables"` 才解析 stdout 的变量信封。`completeNode` 校验结果变量并写入会话/命令证据；CLI 结果在 `agent_settled` 后由 `finalizeCliTurn` 确认。
6. **路由和并行。** `destination`、`selectRoute` 写入路由事实；普通结果进入下一节点，`enterParallel`/`executeParallel` 执行受约束的命令分支和汇合节点，`finish` 由 `completeRun` 标记完成。子 Flow 是独立 Run，结果通过父节点映射。
7. **保存和恢复。** `FlowCoordinator.commit` 按 `sequence` 串行提交；`JsonFileRunStore` 将完整快照写入 `.pi/flow-runs.json`。观测由 Publisher/Inspector 提供；`resumeFlow` 匹配运行目录、会话引用和入口后调用 `FlowCoordinator.resume`。Agent 可重试，未完成命令会以 `command_interrupted` 失败。

## 模块关系

| 职责邻域 | 一句话职责、依赖和入口 |
| --- | --- |
| 数据契约 | [`src/types.ts`](../src/types.ts) 定义 `FlowDefinition`、动作、运行事实、`RunStore`、Agent 和观测接口，作为模块间契约。 |
| 解析与模板 | [`src/parser.ts`](../src/parser.ts) 的 `parseFlow`、`validateAndWireGraph`、`validateParallel`、`renderTemplate` 将 Markdown 变成校验后的图并渲染变量。 |
| 变量边界 | [`src/variables.ts`](../src/variables.ts) 校验 JSON 变量；`src/runtime.ts` 的 `initializeVariables`、`validateOutcomeVariables`、`extractNextInput` 管理作用域。 |
| 包加载 | [`src/flow-loader.ts`](../src/flow-loader.ts) 的 `loadFlow`、`loadFlowPackage`、`loadReferenceClosure` 加载 Flow、资源和兄弟包闭包，依赖 parser/types。 |
| Flow 发现 | [`src/directory.ts`](../src/directory.ts) 的 `FlowDirectory` 递归列举包，不持有运行状态。 |
| 执行内核 | [`src/runtime.ts`](../src/runtime.ts) 的 `FlowCoordinator` 推进节点、路由、并行、子 Run、失败和恢复；[`src/agent.ts`](../src/agent.ts) 的 `AgentRunModel` 管理绑定。 |
| 持久化与命令 | `runtime.ts` 的 `InMemoryRunStore`/`JsonFileRunStore` 保存事实，`ProcessCommandExecutor.execute` 通过子进程执行命令。 |
| Pi 适配 | [`src/pi.ts`](../src/pi.ts) 的 `PiAgentIntegrationAdapter` 接入新建/接管会话、结果工具、消息证据和缺失结果重试。 |
| Pi 宿主 | [`src/extension.ts`](../src/extension.ts) 绑定 Pi 生命周期、输入、命令、会话替换、恢复和 JSON/RPC 事件；[`src/cli-state.ts`](../src/cli-state.ts) 保存会话级状态。 |
| 观测读模型 | [`src/observability.ts`](../src/observability.ts) 的 `FlowObservationPublisher`、`FlowRunInspector`、`FlowRuntime` 提供事件、历史和证据读取。 |
| 文档与样例 | `docs/` 定义规范和设计，`examples/` 提供 Flow 包，`skills/flow-planning/SKILL.md` 提供规划 Skill，`tools/` 用 `ts-morph` 维护源码索引。 |
| 验证入口 | `test/parser.test.ts`、`runtime.test.ts`、`flow-reference.test.ts`、`release-flow-*.test.ts` 等覆盖解析、运行、引用、恢复和冒烟；本轮未执行。 |

## 外部边界

| 边界 | 代码位置和事实 |
| --- | --- |
| Pi SDK/会话 | [`src/extension.ts`](../src/extension.ts) 使用 flags、命令、工具和生命周期；[`src/pi.ts`](../src/pi.ts) 使用 `createAgentSession`、`SessionManager`、Pi 会话引用。 |
| 文件系统 | `flow-loader.ts`/`directory.ts` 读取 Flow 包和资源；`extension.ts#parseFlowVariables` 读取变量文件；`runtime.ts#JsonFileRunStore` 写 `.pi/flow-runs.json`。 |
| 自定义命令 | `runtime.ts#ProcessCommandExecutor.execute` 调用 `spawn(command,args)`，传 stdin，收集 stdout、stderr 和 exitCode；命令 cwd 由请求/宿主决定。 |
| Flow 资源与子 Flow | `references/*.md` 注入 Agent 可读链接，`scripts/*.mjs` 注入命令参数；`flow-loader.ts#loadReferenceClosure` 只解析兄弟包，`runtime.ts#startChildRun` 建立父子 Run。 |
| 解析和 schema 依赖 | `parser.ts` 使用 `yaml` 解析元信息；`runtime.ts` 使用 Node JSON；`pi.ts` 使用 `typebox` 生成工具 schema。 |
| JSON/RPC 观测 | `extension.ts#flowEventMessage` 将 Publisher 事件包装为 `flow_event`；`observability.ts#toFlowEventEnvelope` 提供信封。事件是 best-effort，历史仍来自 Store。 |
| 发布系统 | [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) 在 `v*` 标签上运行 `npm ci`、`npm test`，然后按版本向 npm 发布。 |

## 修改导航

| 改动问题 | 先看哪里 | 关联位置 |
| --- | --- | --- |
| Pi 启动、命令、恢复 | `src/extension.ts#flowExtension/startFlow/resumeFlow` | `src/cli-state.ts`、`src/pi.ts`、`package.json#pi` |
| Flow 格式和图校验 | `src/parser.ts#parseFlow/parseAction/validateAndWireGraph` | `docs/flow-spec.md`、`test/parser.test.ts` |
| 包资源和子 Flow | `src/flow-loader.ts#loadFlowPackage/loadReferenceClosure` | `src/runtime.ts#startChildRun/childOutcome`、`test/flow-reference.test.ts` |
| 普通执行和路由 | `src/runtime.ts#continueRun/executeNode/executePreparedNode/completeNode/selectRoute` | `src/types.ts`、`test/runtime.test.ts` |
| Agent 和结果提交 | `src/agent.ts#AgentRunModel`、`src/types.ts#AgentCapabilityDeclaration`、`src/pi.ts#PiAgentIntegrationAdapter` | `src/extension.ts#bridge/agent_settled`、适配器测试 |
| 命令、stdin、变量信封 | `src/runtime.ts#ProcessCommandExecutor/parseCommandVariables` | `src/parser.ts#parseCommandAction/renderCommandRequest`、并行 fixtures |
| 变量和模板 | `src/variables.ts`、`src/parser.ts#validateTemplates/renderTemplate` | `src/runtime.ts#initializeVariables/extractNextInput`、`docs/flow-spec.md` |
| 并行和汇合 | `src/parser.ts#validateParallel`、`src/runtime.ts#enterParallel/executeParallel` | `branch.*` 模板、命令 `output:variables` |
| 持久化、指纹、恢复 | `src/runtime.ts#JsonFileRunStore/commit/resume/fingerprintFlow` | `src/extension.ts#resumeFlow`、`.pi/flow-runs.json` 事实结构 |
| 事件、历史、证据 | `src/observability.ts#FlowRunInspector/FlowObservationPublisher/FlowRuntime` | `src/pi.ts#createFlowInspectionTool`、`src/extension.ts#flowEventMessage` |
| 公共 API、构建、发布 | `src/index.ts`、`package.json`、`tsconfig.build.json` | `.github/workflows/publish.yml`、`README.md`；不要直接改 `dist/` |
| 源码索引 | `tools/source-guide-targets.ts`、`tools/generate-source-index.ts` | `docs/source-pseudocode-guide.md`、`docs/source-index.md` |

## 待确认项

- `JsonFileRunStore` 只在单进程实例内串行化写入；多进程是否能同时写同一 `.pi/flow-runs.json`，源码未定义。
- `ProcessCommandExecutor` 未见超时、取消、输出上限或沙箱策略；命令治理需由宿主和安全策略确认。
- `FlowRunInspector` 的 `authorizeEvidence` 默认允许访问；输入、结果、命令输出和会话消息是否需要授权或脱敏，源码未决定。
- 项目未声明独立服务、数据库后端或跨实例调度；超出 Pi CLI/JSON/RPC/SDK 的生产宿主方案需外部确认。
- 本次未运行构建、测试、集成、发布或源码索引命令，配置中的门禁不能写成已通过。

## 证据索引

### 配置与入口

- [`package.json`](../package.json)：包类型、`exports`、Pi 声明、依赖、Node 版本和 scripts。
- [`tsconfig.json`](../tsconfig.json)、[`tsconfig.build.json`](../tsconfig.build.json)：NodeNext 编译设置和 `src` 构建边界。
- [`biome.json`](../biome.json)、[`vitest.config.ts`](../vitest.config.ts)：检查和测试配置。
- [`.github/workflows/publish.yml`](../.github/workflows/publish.yml)、[`.gitignore`](../.gitignore)：发布和生成/运行目录声明。

### 规范与项目材料

- [`README.md`](../README.md)、[`docs/flow-spec.md`](flow-spec.md)、[`docs/README.md`](README.md)：安装、Flow 格式和文档导航。
- [`docs/source-pseudocode-guide.md`](source-pseudocode-guide.md)、[`docs/architecture/source-map.md`](architecture/source-map.md)：源码阅读和符号定位资料。
- [`examples/code-change/FLOW.md`](../examples/code-change/FLOW.md)、[`examples/review-fix/FLOW.md`](../examples/review-fix/FLOW.md)、[`skills/flow-planning/SKILL.md`](../skills/flow-planning/SKILL.md)：实际包和 Skill 入口。

### 核心源码与验证入口

- [`src/extension.ts`](../src/extension.ts)、[`src/cli-state.ts`](../src/cli-state.ts)、[`src/index.ts`](../src/index.ts)：宿主状态、Pi 入口和公共导出。
- [`src/types.ts`](../src/types.ts)、[`src/parser.ts`](../src/parser.ts)、[`src/variables.ts`](../src/variables.ts)：契约、解析和变量。
- [`src/flow-loader.ts`](../src/flow-loader.ts)、[`src/directory.ts`](../src/directory.ts)：包和目录发现。
- [`src/runtime.ts`](../src/runtime.ts)、[`src/agent.ts`](../src/agent.ts)、[`src/pi.ts`](../src/pi.ts)、[`src/observability.ts`](../src/observability.ts)：执行、Agent 边界、Pi 边界和观测。
- [`test/parser.test.ts`](../test/parser.test.ts)、[`test/runtime.test.ts`](../test/runtime.test.ts)、[`test/flow-reference.test.ts`](../test/flow-reference.test.ts)、[`test/release-flow-smoke.test.ts`](../test/release-flow-smoke.test.ts)：验证入口；未执行不等于通过。
- [`tools/generate-source-index.ts`](../tools/generate-source-index.ts)、[`tools/source-guide-targets.ts`](../tools/source-guide-targets.ts)：源码索引维护入口。

扫描状态：已读取规则候选文件、Git 状态、项目清单、构建/运行配置、入口及直接依赖；未发现 `AGENTS.md` 或 `CLAUDE.md`；未运行构建、测试、发布、集成或索引命令；未修改其他项目文件。
