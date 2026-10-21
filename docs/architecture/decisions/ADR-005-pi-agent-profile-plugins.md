# ADR-005：Pi 宿主侧 Profile 插件装配

- 状态：已接受
- 日期：2026-10-21

## 背景

Flow 需要允许高级用户显式选择预设 Agent，同时继续保持 Runtime 与 Pi 实现解耦。Profile 需要提供工具、Skill、模型和提示装配，但不能成为第二套 Flow 控制器或权限系统。

## 决策

Profile 只作为 `新建Agent` 动作中的宿主侧引用和参数。Runtime 保存引用、参数和宿主返回的装配身份摘要，不加载插件，不创建会话，也不按 `flowId + nodeRef` 隐式选择 Profile。

Pi 适配器通过 `profilePlugins` 接收代码插件。插件返回受限的 `PiAgentProfileContribution`，由适配器统一校验并装配 Pi 会话。工具和 Skill 必须分别属于 Flow 的 `capabilities.tools` 和 `capabilities.skills`；`submit_flow_outcome` 始终由适配器提供。插件不能返回完整 `ExtensionAPI`、`ExtensionContext`、`AgentSession` 或 `ResourceLoader`。

`复用Agent` 不接受 Profile，沿用已绑定会话。恢复时使用持久化的 Profile 引用重新解析，并验证 `pluginId`、版本、摘要、Profile 标识、参数摘要和解析能力摘要。任何变化都必须明确拒绝接管。

## 结果

Flow 可以用结构化 JSON 表达 Profile 选择，普通文本 Agent 动作继续有效。Runtime 保持宿主中立，Pi Extension 的完整生命周期不进入 Profile 执行边界。插件包可以复用纯工具工厂或 Skill 描述，但必须通过独立的 Profile 导出入口提供装配贡献。

## 复核入口

- `src/definition/parser.ts#parseAgentAction`
- `src/execution/agent.ts#AgentRunModel`
- `src/execution/runtime.ts#renderAgentProfile`
- `src/pi/adapter.ts#PiAgentIntegrationAdapter`
- `src/pi/adapter.ts#PiAgentProfilePlugin`
- `src/contracts/types.ts#AgentAssemblyIdentity`
