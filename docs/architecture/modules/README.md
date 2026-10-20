# 模块设计

| 模块 | 责任 | 详细文档 |
| --- | --- | --- |
| 定义与装载 | 解析 Flow、校验图和变量、验证资源、构建引用闭包 | [definition-loading.md](definition-loading.md) |
| 执行与事实 | 驱动节点、结果、并行、子 Flow、恢复和持久化 | [execution-runtime.md](execution-runtime.md) |
| Agent 能力组合 | 在 Agent 端口外部组合可选的工具、Skill、模型和权限策略 | [../agent-capability-composition.md](../agent-capability-composition.md) |
| Pi 宿主与 Agent | 接入 Pi SDK/CLI、结果工具、会话和扩展生命周期 | [pi-host.md](pi-host.md) |
| 观测 | 组织历史、读取证据、发布实时通知 | [observability.md](observability.md) |
| 工程入口 | 公共出口、源码阅读索引、构建和发布边界 | [engineering-entries.md](engineering-entries.md) |
