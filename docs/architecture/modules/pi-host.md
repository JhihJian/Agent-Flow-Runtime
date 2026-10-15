# Pi 宿主与 Agent 模块

## 定位与边界

本模块把通用 Runtime 接入 Pi SDK 和当前 Pi CLI。它负责入口注册、会话创建/接管/释放、提示注入、结构化结果工具、会话证据读取和宿主生命周期。流程图解析、结果路由和 Run 写入仍归 Runtime。

## PiAgentIntegrationAdapter

适配器通过 Pi SDK 的 `SessionManager`、`createAgentSession`、`AgentSession.prompt` 和自定义工具管理 SDK 会话。每个活动会话有一个绑定句柄，同一会话不能并行执行多个 Flow 节点。

`新建Agent`创建新的 SDK 会话或请求 CLI 创建新会话；`复用Agent`要求当前 Run 已有绑定；接管路径根据 session reference 恢复已有 SDK 会话。节点会话保存 session reference、interaction reference 和节点执行范围，便于按 NodeRun 读取消息。

## 结果提交

SDK 和 CLI 共用 `submit_flow_outcome` 的工具协议。工具提交当前节点声明的 outcome 和可选 variables。结果名由 AgentRunModel 和 Coordinator 再次校验，变量值经过 JSON、变量名和声明范围校验。

SDK 路径在当前 prompt 结束前接受结果；CLI 路径先保存候选结果，等 Pi `agent_settled` 后确认，避免 turn_end 后仍有 compact、重试或排队输入时提前推进流程。当前节点没有结果时最多追加一次重试提示。

## Extension 装配

`extension.ts` 注册 `--flow`、`--variables`、`--var`、`/flow`、`/flow-new-session`、结果提交工具和历史查询工具。启动时加载 Flow，创建 `.pi/flow-runs.json` Store、Publisher、Inspector、Runtime 和 Coordinator。

CLI 的 `新建Agent`通过 `ctx.newSession()`切换到新会话，并以 custom entry 保存父会话 lineage。扩展状态通过 `cli-state.ts` 放在 `globalThis`，用于会话替换、当前 Runtime、活动 Run 和回调重新绑定。session_start 会绑定当前上下文并在满足条件时触发运行恢复。

自动恢复只筛选 `running`、cwd、sessionReference 和 flowPath 匹配的根 Run。子 Run 不能直接恢复。`interrupted` 的显式恢复由 Coordinator 支持，但不会被该自动筛选入口发现。

## 会话和安全边界

Pi 适配器不选择 Flow 去向，不解析 Mermaid，不直接写 Store。Agent 交互消息和命令输出属于 evidence，能否读取由 Runtime Inspector 的 authorizer 决定。当前默认 authorizer 放行，宿主若有敏感数据要求必须注入权限策略。

## 不实现范围

本模块不提供真实 provider/model 的质量保证，不定义 Pi 外部部署策略，不保证跨进程会话并发，不把 Agent 自然语言当作结构化运行事实。

## 主要证据

- [pi.ts](../../src/pi.ts)
- [extension.ts](../../src/extension.ts)
- [cli-state.ts](../../src/cli-state.ts)
- [types.ts](../../src/types.ts)
- [Pi Flow 宿主设计](../../pi-flow-host-design.md)
- [Pi Agent 集成适配器设计](../../pi-agent-integration-adapter-design.md)
