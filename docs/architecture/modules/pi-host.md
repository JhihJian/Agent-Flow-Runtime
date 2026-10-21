# Pi 宿主

## 边界与能力

`src/pi/adapter.ts#PiAgentIntegrationAdapter` 适配 SDK session 创建、接管、释放、prompt、结构化结果工具和节点消息读取；CLI bridge 仍保留结果提交实现，但当前无法满足能力隔离契约，创建或接管 Flow Agent 时会明确失败。`src/pi/extension.ts#flowExtension` 注册 flags、`/flow`、结果和 inspection tools、会话命令及 lifecycle handlers，再装配 Loader、Store、Coordinator、Inspector 与 Publisher。Pi 宿主是可替换的 Agent 执行适配层，不拥有 Flow 路由。

Runtime 只依赖 `src/contracts/types.ts#AgentIntegrationAdapter` 和 `AgentCapabilityDeclaration`。SDK 适配器使用 Flow 的工具 allowlist、只保留声明 Skill 的 ResourceLoader，并关闭扩展、上下文文件、提示模板和主题的默认发现。`submit_flow_outcome` 始终作为 Runtime 协议工具启用，不属于业务能力声明。SDK/CLI 结果名和变量还由 Runtime 再次校验。

## 状态、依赖与副作用

CLI 扩展状态通过 `src/pi/cli-state.ts#getCliFlowState` 放在 `globalThis`，包含 session、callback 和 active run 状态。Extension 将 Run facts 指向 cwd 下 `.pi/flow-runs.json`，并发送 prompt、command、UI 通知和 JSON/RPC event。装配入口为 `src/pi/extension.ts#startFlow`、`src/pi/extension.ts#resumeFlow`。

自动恢复只筛选 status 为 running 且 cwd、sessionReference、flowPath 匹配的根 Run；重新装载 Flow 后还校验 Flow ID。interrupted 是否由 session_start 自动恢复不是源码已确定的产品策略。Evidence 可包含会话消息，其授权责任在 Inspector/宿主配置。

## 不实现范围与测试定位

当前 CLI 结果和会话替换测试仍覆盖宿主原生机制；Flow Agent 的 CLI 启动测试应断言能力隔离失败。
