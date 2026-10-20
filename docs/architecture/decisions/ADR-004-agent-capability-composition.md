# ADR-004：Agent 能力作为可选组合模块

## 状态

已接受

## 背景

不同 Agent 可能需要不同的工具、Skill、模型和权限。将这些能力直接加入 Flow Runtime 核心，会使流程控制、宿主实现和权限配置相互耦合，也会让普通 Flow 依赖 Pi 或某个具体 Agent 平台。

当前 Runtime 已通过 `AgentIntegrationAdapter` 抽象 Agent 会话，但 Agent 运行模型曾与主要 Flow 执行代码放在同一模块中。后续能力扩展需要更清晰的组合边界。

## 决策

Agent 能力作为 Runtime 外部的可选组合模块实现。

- Runtime 核心只维护 Flow 执行、结果、变量、恢复和通用 Agent 执行协议。
- `AgentIntegrationAdapter` 是能力模块和宿主接入 Runtime 的端口。
- 能力模块负责逻辑能力解析、能力组合、版本验证和恢复前检查。
- Pi 或其他宿主负责将能力装配到实际 Agent 会话。
- Flow 可以声明逻辑能力需求，但不直接声明宿主工具、Skill 文件或权限实现。
- Agent 能力不建模为节点、子 Flow 或额外的 Run。
- Runtime 只向 Adapter 提供中性的执行上下文，不识别 Profile、工具和 Skill。

## 结果

普通 Flow 不安装能力模块也可以运行。能力模块可以独立演进、替换或移除，且不改变 Flow 的路由和结果语义。

同一个 Flow 可以组合不同的 Agent 能力。`复用Agent` 保持当前会话的能力上下文；能力切换需要建立新的 Agent 会话。能力模块拥有自己的配置版本和恢复校验责任。

## 拒绝的方案

- 将 Profile、工具和 Skill 字段加入 `FlowCoordinator` 或核心 Run 记录。
- 将能力配置建模为嵌套 Flow。
- 让 Flow 文件直接提供任意宿主工具路径、Skill 路径或权限开关。
- 建立一个由 Runtime 管理所有未来插件的通用插件总线。
- 用 Agent Prompt 注入替代宿主真正的工具和权限隔离。

## 证据

- `src/types.ts#AgentIntegrationAdapter` 定义了 Runtime 与宿主之间的既有边界。
- `src/agent.ts#AgentRunModel` 负责 Run 级 Agent 绑定，不依赖具体宿主。
- `src/runtime.ts#FlowCoordinator` 只通过 Agent 模型执行 Agent 节点。
- `src/pi.ts#PiAgentIntegrationAdapter` 承担 Pi 会话和结构化结果工具。