# Flow 文档

Flow 将可复用的工作方法写成 Markdown，由运行时结合具体任务驱动执行。它用节点结果控制门禁、返工、循环和必要的并行检查，同时保留 Agent 在节点内的自主工作能力。

## 从这里开始

| 文档 | 用途 |
| --- | --- |
| [Flow 概览](flow-overview.md) | 理解 Flow 文件、一次运行、节点结果、并行和记录。 |
| [Flow 规范](flow-spec.md) | 编写、生成或检查可运行的 Flow 文件。 |
| [源码伪代码阅读图](source-pseudocode-guide.md) | 用压缩伪代码建立从 Flow 文件到 Pi 会话的源码主线。 |
| [Agent Flow Runtime 总体设计](agent-flow-runtime-design.md) | 理解 Flow 如何与一次具体任务、Agent 和命令结合。 |
| [Agent Flow Runtime 架构设计](agent-flow-runtime-architecture.md) | 了解解释器、协调器、统一 Agent 运行模型和记录存储的职责边界。 |

## Pi 接入

| 文档 | 用途 |
| --- | --- |
| [Pi Agent 集成适配器实现设计](pi-agent-integration-adapter-design.md) | 了解 Pi 会话、节点提示、结果提交和节点交互记录如何接入运行时。 |
| [Pi Flow 启动入口设计](pi-flow-host-design.md) | 了解如何在 Pi TUI、无头命令和 RPC 中启动指定 Flow。 |

Flow 文件保持通用，Pi 文档只描述 Pi 的会话和启动实现。

## 实现

[Agent Flow Runtime 实现与安装说明](../README.md)提供运行时模块、Pi 扩展安装、CLI/TUI/JSON/RPC 启动方式和测试入口。实现不会向 Flow Markdown 增加 Pi 专用字段。
