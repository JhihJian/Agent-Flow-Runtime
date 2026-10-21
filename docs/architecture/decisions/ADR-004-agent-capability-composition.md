# ADR-004：Flow 级 Agent 能力声明与默认空能力

## 状态

已接受

## 背景

Runtime 需要让 Flow 明确控制 Agent 可用的业务工具和 Skill，同时保持 Flow 控制流与宿主会话实现解耦。Pi SDK 可以创建隔离会话，Pi CLI 当前只能使用宿主已经创建的会话，无法可靠移除环境中的默认能力。

## 决策

首版采用 Flow 级能力声明和最小 Agent 会话：

- `FlowDefinition.capabilities` 只包含逻辑名称数组 `tools` 和 `skills`。
- 未声明能力时，两组数组都归一为空。
- Runtime 只解析、校验、纳入 Flow fingerprint，并在创建或接管 Agent 时转发声明。
- `submit_flow_outcome` 是 Runtime 协议工具，由宿主始终注入，不计入业务能力声明。
- `新建Agent` 按当前 Flow 声明建立新会话并固定能力；`复用Agent` 只使用已有绑定，不重新解析能力。
- 子 Flow 使用子 Flow 自己的能力声明，不继承父 Flow Agent。
- 宿主无法提供声明的工具或 Skill，或者无法隔离默认能力时，必须明确失败。
- Pi SDK 使用显式工具 allowlist 和只保留声明 Skill 的 ResourceLoader；同时关闭扩展、上下文文件、提示模板和主题的默认发现。
- Pi CLI 目前不支持该隔离契约，因此创建或接管 Flow Agent 时拒绝执行。

## 结果

普通 Flow 不声明能力也能获得确定的最小 Agent 会话。能力变化会改变 Flow fingerprint，完整历史恢复不会静默接管不同能力配置。Runtime 不需要理解 Pi 工具或 Skill 文件；Profile 插件的宿主边界另见 [ADR-005](ADR-005-pi-agent-profile-plugins.md)。

本 ADR 不引入 Runtime 级 Profile 注册表、能力 Provider、通用插件总线、宿主按 `flowId + nodeRef` 的映射或节点级能力配置。Pi 宿主侧的受限 Profile 装配由 ADR-005 单独定义。

## 拒绝的方案

- 继承 Pi 宿主默认工具、Skill、上下文文件或扩展。
- 用 Prompt 文本伪造工具和权限隔离。
- 让 `复用Agent` 根据后续节点重新扩大能力。
- 让子 Flow 继承父 Flow Agent。
- 将能力配置建模为嵌套 Flow、节点映射或通用插件总线。

## 证据

- `src/types.ts#AgentCapabilityDeclaration` 定义 Flow 与宿主之间的最小声明。
- `src/agent-capabilities.ts` 负责声明校验和默认空能力。
- `src/agent.ts#AgentRunModel` 保存 Run 级会话绑定。
- `src/runtime.ts#fingerprintFlow` 把能力变化纳入恢复校验。
- `src/pi.ts#PiAgentIntegrationAdapter` 实现 Pi SDK 装配并拒绝无法隔离的 CLI 路径。
