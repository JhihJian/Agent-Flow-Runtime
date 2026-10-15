# 来源映射

## 口径

- **事实**：源码或配置直接表达的行为。
- **结构推断**：由调用方向和状态关系归纳。
- **测试断言**：测试源码包含直接断言，但不表示本轮执行或通过。
- **待确认**：依赖外部业务、安全、运行或发布决策。

源码版本 `26eb4e604e54472dd1938f92671c89d74d1554ab`，package `0.2.1`。本轮没有运行构建、测试、Vitest、集成或 docs 检查；配置入口见 `package.json#scripts`。

## 架构结论定位

| 结论 | 分类 | 主要源码/配置 | 直接测试断言定位 |
| --- | --- | --- | --- |
| Package 出口、Pi 扩展和工程入口 | 事实 | `package.json#exports`、`package.json#pi.extensions`、`package.json#pi.skills`、`tsconfig.build.json#include` | 配置项，无行为测试 |
| Flow 解析、图装配和动作验证 | 事实 | `src/parser.ts#parseFlow`、`src/parser.ts#validateAndWireGraph`、`src/parser.ts#wireFlowReferenceNode` | `test/parser.test.ts:266-278`、`test/parser.test.ts:368-394` |
| 全局/结果变量和模板作用域 | 事实 | `src/variables.ts#validateVariables`、`src/runtime.ts#initializeVariables`、`src/runtime.ts#validateOutcomeVariables`、`src/runtime.ts#extractNextInput`、`src/parser.ts#validateTemplates` | `test/parser.test.ts:210-215`、`test/parser.test.ts:254-259`、`test/parser.test.ts:282-294`、`test/variables.test.ts:91-96`、`test/variables.test.ts:104-119`、`test/variables.test.ts:126-136`、`test/variables.test.ts:149-153` |
| 动作实际资源和 sibling Flow closure | 事实 | `src/flow-loader.ts#loadFlow`、`src/flow-loader.ts#loadFlowPackage`、`src/flow-loader.ts#validatePackageResources`、`src/flow-loader.ts#loadReferenceClosure` | `test/flow-reference.test.ts:958-1058`；动作资源范围无直接测试 |
| Coordinator 记录访问和结果路由 | 事实 | `src/runtime.ts#FlowCoordinator.run`、`src/runtime.ts#continueRun`、`src/runtime.ts#FlowCoordinator.completeNode`、`src/runtime.ts#FlowCoordinator.selectRoute` | `test/runtime.test.ts:129-157` |
| 并行分支、round、join 和全局 patch | 事实 | `src/parser.ts#validateParallel`、`src/runtime.ts#FlowCoordinator.enterParallel`、`src/runtime.ts#FlowCoordinator.executeParallel`、`src/runtime.ts#mergeParallelVariables` | `test/parser.test.ts:340-358`、`test/parser.test.ts:368-413`、`test/runtime.test.ts:225-242`、`test/correctness.test.ts:425-449` |
| 子 Flow 独立 Run、显式输入和受限输出 | 事实 | `src/runtime.ts#FlowCoordinator.startChildRun`、`src/runtime.ts#FlowCoordinator.childOutcome`、`src/runtime.ts#FlowCoordinator.resumeFlowReferenceNode` | `test/flow-reference.test.ts:461-480`、`test/flow-reference.test.ts:496-515`、`test/flow-reference.test.ts:536-550`、`test/flow-reference.test.ts:571-585` |
| Agent、命令和子 Flow 恢复差异 | 事实 | `src/runtime.ts#FlowCoordinator.resume`、`src/runtime.ts#FlowCoordinator.resumeRun`、`src/runtime.ts#FlowCoordinator.failInterruptedCommand`、`src/extension.ts#resumeFlow`、`src/runtime.ts#fingerprintFlow` | `test/correctness.test.ts:536-542`、`test/release-flow-recovery.test.ts:184-192`、`test/flow-reference.test.ts:710-725`、`test/flow-reference.test.ts:809-820`、`test/flow-reference.test.ts:1097-1102` |
| 单进程 JSON snapshot 和提交后观测 | 事实 | `src/runtime.ts#JsonFileRunStore`、`src/runtime.ts#FlowCoordinator.commit` | `test/correctness.test.ts:566-573`、`test/correctness.test.ts:724-753`、`test/correctness.test.ts:863-866` |
| Pi CLI outcome 按 session 定位并在 settle 后确认 | 事实 | `src/pi.ts#PiAgentIntegrationAdapter`、`src/pi.ts#createFlowOutcomeTool`、`src/extension.ts#flowExtension` | `test/correctness.test.ts:225-231`、`test/extension-session-replacement.test.ts:81-90`、`test/extension-session-replacement.test.ts:115-127` |
| Inspector、Publisher 和订阅快照竞态 | 事实 | `src/observability.ts#FlowObservationPublisher`、`src/observability.ts#FlowRunInspector`、`src/observability.ts#FlowRuntime.openRunObservation` | `test/correctness.test.ts:724-753`、`test/correctness.test.ts:863-866`、`test/correctness.test.ts:919-927` |
| `extension -> runtime -> store` 是宿主到执行内核到 facts 的主依赖方向 | 结构推断 | `src/extension.ts#startFlow`、`src/runtime.ts#FlowCoordinator`、`src/runtime.ts#FlowCoordinator.commit` | 无直接测试；由源码 import 和注入关系复核 |

所有测试定位均指向已核对的直接断言连续范围；测试本轮未执行。

## 运行时边界和待确认问题

| 问题 | 已知现状 | 未决来源 |
| --- | --- | --- |
| 启动输入失败是否留下事实 | `src/runtime.ts#FlowCoordinator.run` 先调用 `src/runtime.ts#initializeVariables`，再调用 Store 创建 Run；源码路径不创建 Run/NodeRun | `test/variables.test.ts:91-96` 只断言拒绝启动，未直接断言 Store 为空 |
| NodeRun/ParallelRound 更新语义 | `src/runtime.ts#FlowCoordinator.completeNode`、`src/runtime.ts#FlowCoordinator.enterParallel`、`src/runtime.ts#JsonFileRunStore` 在同一记录 ID 上提交更新；每次新访问另建 ID | 直接测试只覆盖结果和历史投影，未单独断言更新语义 |
| 普通结果边与 Flow 无结果直连 | `src/parser.ts#validateAndWireGraph`、`src/parser.ts#wireFlowReferenceNode` 分别校验普通结果边和固定成功映射 | `test/parser.test.ts:266-278` 覆盖命令固定结果；Flow 直连规则无本次核对的专门直接断言 |
| 多进程写同一运行文件 | `src/runtime.ts#JsonFileRunStore` 每个实例内串行化并写完整快照，无跨实例协调 | 部署并发约束 |
| 命令资源控制 | `src/runtime.ts#ProcessCommandExecutor` spawn 并累积 stdout/stderr，未见 timeout、cancel 或输出上限 | 安全和运行环境要求 |
| interrupted 自动恢复 | `src/runtime.ts#FlowCoordinator.resume` 接受 running/interrupted；`src/extension.ts#resumeFlow` 自动扫描只取 running，并匹配 cwd、sessionReference、flowPath 后重新加载并校验 Flow ID | 产品恢复策略 |
| evidence 权限/脱敏 | `src/observability.ts#FlowRunInspector` 缺省 authorizer 放行，证据可包含输入/输出 | 数据分类和访问政策 |
| 发布门禁范围 | `package.json#scripts` 与 `.github/workflows/publish.yml#jobs.publish.steps` 声明入口；本轮未执行 | 维护者发布标准 |
| 结果变量指纹专门测试 | `src/runtime.ts#fingerprintFlow` 序列化 `node.results` 描述但不单列 `resultVariables`；Parser 从结果描述表格提取变量 | 是否增加专门直接断言 |
