# Pi 宿主

## 边界与能力

`src/pi.ts#PiAgentIntegrationAdapter` 适配 SDK session 创建、接管、释放、prompt、结构化结果工具和节点消息读取；CLI bridge 使用当前 Pi session。`src/extension.ts#flowExtension` 注册 flags、`/flow`、结果和 inspection tools、会话命令及 lifecycle handlers，再装配 Loader、Store、Coordinator、Inspector 与 Publisher。Pi 宿主是可替换的 Agent 执行适配层，不拥有 Flow 路由，也不负责定义可选能力模块。

Runtime 只依赖 `src/types.ts#AgentIntegrationAdapter` 和中性的 `src/types.ts#AgentExecutionContext`，不由 Pi adapter 解析 Flow 或选择路线。SDK/CLI 结果名和变量还由 Runtime 再次校验。可选 Agent 能力模块应在 Pi adapter 外部组合，不应把 Profile、工具和 Skill 配置写入 Runtime。CLI 结果在 `finalizeCliTurn` 后确认；有待确认结果时 Extension 阻止相应 compact。

## 状态、依赖与副作用

CLI 扩展状态通过 `src/cli-state.ts#getCliFlowState` 放在 `globalThis`，包含 session、callback 和 active run 状态。Extension 将 Run facts 指向 cwd 下 `.pi/flow-runs.json`，并发送 prompt、command、UI 通知和 JSON/RPC event。装配入口为 `src/extension.ts#startFlow`、`src/extension.ts#resumeFlow`。

自动恢复只筛选 status 为 running 且 cwd、sessionReference、flowPath 匹配的根 Run；重新装载 Flow 后还校验 Flow ID。interrupted 是否由 session_start 自动恢复不是源码已确定的产品策略。Evidence 可包含会话消息，其授权责任在 Inspector/宿主配置。

## 不实现范围与测试定位

不保证真实 provider/model 行为、鉴权质量、生产部署，也不将自然语言当成路由事实。会话路由和替换后的上下文断言见 `test/correctness.test.ts:225-231`、`test/extension-session-replacement.test.ts:81-90`、`test/extension-session-replacement.test.ts:115-127`；本轮未执行。
