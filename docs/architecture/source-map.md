# 来源映射与验证入口

## 证据口径

- **实现事实**：当前 `src/`、配置或 workflow 直接表达的行为。
- **测试断言**：测试源码中存在的断言。本次未执行测试，因此不表示本次通过。
- **文档声明**：README 和 `docs/*.md` 表达的意图或使用约定，不能覆盖源码事实。
- **风险推断**：从实现边界推得的可能后果，未包装成已证实缺陷。
- **待确认策略**：源码无法决定的产品、安全或部署选择。

## 架构结论到证据

| 结论 | 主要证据 | 证据类型 |
| --- | --- | --- |
| Flow 是解析后的静态图，Parser 不执行动作 | `src/parser.ts:59` `parseFlow`；`src/types.ts:71` `FlowDefinition` | 实现事实 |
| 包入口和引用闭包由 Loader 管理 | `src/flow-loader.ts:24` `loadFlow`、`loadFlowPackage`；`src/directory.ts:14` `FlowDirectory` | 实现事实 |
| 变量具有全局、下一跳、分支作用域 | `src/parser.ts:840` 模板渲染；`src/runtime.ts` 的 `initializeVariables`、`extractNextInput`、`mergeParallelVariables` | 实现事实 |
| Coordinator 是运行状态的主要写入者 | `src/runtime.ts:543` `FlowCoordinator`；`src/types.ts:360` `RunStore` | 实现事实 |
| 每次节点访问形成独立 NodeRun | `src/runtime.ts` 的 `startNode`、`completeNode`、恢复路径；`src/types.ts:225` | 实现事实 |
| 命令非零退出仍可作为业务节点完成 | `src/runtime.ts:918-1000` 命令执行和 `completeNode` | 实现事实 |
| 并行只接受命令分支并在显式汇合点合并 | `src/parser.ts` 的 `validateParallel`；`src/runtime.ts:758` `executeParallel` | 实现事实 |
| 子 Flow 是独立 Run，显式输入和受限输出 | `src/runtime.ts:1258` `executeFlowReference`、`startChildRun`、`childOutcome`；`src/types.ts:41` | 实现事实 |
| Agent 恢复创建新的 NodeRun，命令中断不重放 | `src/runtime.ts:639` `resume`、`interruptNode`、`failInterruptedCommand` | 实现事实 |
| Pi CLI 结果在 `agent_settled` 后确认 | `src/pi.ts:161` `PiAgentIntegrationAdapter`、`finalizeCliTurn`；`src/extension.ts:276` | 实现事实 |
| 自动恢复只扫描 running 根 Run | `src/extension.ts:504` `resumeFlow` | 实现事实 |
| JSON Store 是单进程实例内串行快照 | `src/runtime.ts:241` `JsonFileRunStore` 注释、`mutate`、`persist` | 实现事实 |
| 观测是进程内 best-effort，不是事件日志 | `src/observability.ts:26` `FlowObservationPublisher`；`src/types.ts:485` | 实现事实 |
| 观测快照使用订阅后取快照的水位保护 | `src/observability.ts:213` `openRunObservation` | 实现事实 |
| evidence 默认授权放行 | `src/observability.ts:95` `FlowRunInspector` 构造函数 | 实现事实 |
| 推荐检查、测试和发布入口范围不一致 | `package.json:45-55`；`.github/workflows/publish.yml:19-27` | 配置事实 |

## 风险和未决项

| 项目 | 已知事实 | 未决问题 |
| --- | --- | --- |
| JSON 并发 | Store 只在实例内排队，整体快照写回 | 是否需要同一工作目录的多进程并发写入 |
| 命令资源 | 无超时、取消和 stdout/stderr 大小上限 | 运行环境是否需要资源预算 |
| 中断恢复 | Coordinator 接受 interrupted，Pi 自动扫描只查 running | interrupted 是否应自动恢复 |
| evidence | 历史和证据可包含输入、变量、消息和命令输出，默认 authorizer 放行 | 哪些宿主和用户可以读取，是否需要默认拒绝或脱敏 |
| 发布门禁 | tag workflow 执行 npm test，推荐 release 入口更宽 | 发布是否应切换到统一完整门禁 |
| 外部集成 | 有 Pi SDK session smoke 源码入口 | 是否需要真实 provider/model 的发布证据 |

## 本次验证边界

本次只读取源码、配置、文档、测试入口和 Git 状态，没有执行：

- `npm run build`
- `npm run check`
- `npm test`
- `npm run test:vitest`
- `npm run test:smoke`
- `npm run test:release`
- `npm run test:integration`
- `npm run docs:source-index:check`

因此本目录不提供本次构建、测试、源码索引或发布验证通过证明。需要执行验证时，项目已有入口是 `package.json` 中的 scripts；架构文档链接完整性和结构检查入口尚未在项目中发现独立实现。正式架构治理入口 `node .agents/tools/architecture-governance.mjs check` 和 `node .agents/tools/docs-check.mjs` 因项目不存在 `.agents` 后端而不可用，本次未调用。

## 维护规则

源码模块职责、核心业务流、状态或边界发生变化时，必须同步检查 `ARCHITECTURE.md`、对应模块文档、术语表和本文件。任何从设计文档读取但无法由当前源码确认的内容，只能写入“文档声明”或“待确认策略”。
