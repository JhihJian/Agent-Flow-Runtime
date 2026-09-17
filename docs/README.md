# Flow 文档

Flow 将可复用的工作方法写成 Markdown，由运行时结合具体任务驱动执行。它用节点结果控制门禁、返工、循环和必要的并行检查，同时保留 Agent 在节点内的自主工作能力。

## 从这里开始

| 文档 | 用途 |
| --- | --- |
| [Flow 概览](flow-overview.md) | 理解 Flow 文件、一次运行、节点结果、并行和记录。 |
| [Flow 规范](flow-spec.md) | 编写、生成或检查可运行的 Flow 文件。 |
| [源码逻辑阅读图](source-pseudocode-guide.md) | 用函数级流程图、伪代码和源码链接建立从 Flow 文件到 Pi 会话的源码主线。 |
| [源码符号索引](source-index.md) | 自动生成的模块、符号和源码位置索引。 |
| [Agent Flow Runtime 总体设计](agent-flow-runtime-design.md) | 理解 Flow 如何与一次具体任务、Agent 和命令结合。 |
| [Agent Flow Runtime 架构设计](agent-flow-runtime-architecture.md) | 了解解释器、协调器、统一 Agent 运行模型和记录存储的职责边界。 |
| [Flow 运行观测设计](flow-observability-design.md) | 了解运行事实如何产生，以及 CLI、JSON 和 RPC 如何读取和传递状态。 |

## SDK 接入

| 文档 | 用途 |
| --- | --- |
| [SDK 快速开始](sdk-quick-start.md) | 在自己的 Node.js 程序中安装并组装运行时，用 Pi 会话执行 Agent 节点。 |

## Pi 接入

| 文档 | 用途 |
| --- | --- |
| [Pi Agent 集成适配器实现设计](pi-agent-integration-adapter-design.md) | 了解 Pi 会话、节点提示、结果提交和节点交互记录如何接入运行时。 |
| [Pi Flow 启动入口设计](pi-flow-host-design.md) | 了解如何在 Pi TUI、无头命令和 RPC 中启动指定 Flow。 |

Flow 文件保持通用，Pi 文档只描述 Pi 的会话和启动实现。

## 维护源码阅读资料

以下命令只面向源码仓库开发者。发布包不包含生成工具及其开发依赖。`source-pseudocode-guide.md`中的 Mermaid 图和伪代码由人工维护，关键函数的源码链接以及`source-index.md`由`ts-morph`生成。修改关键函数、移动源码或调整阅读图后，执行：

```bash
npm run docs:source-index
npm run check
```

`npm run check`会拒绝未更新的位置链接、缺少受控阅读区块或缺少 Mermaid 图、伪代码的文档变更。

## 实现

[Agent Flow Runtime 实现与安装说明](../README.md)提供运行时模块、Pi 扩展安装、CLI/TUI/JSON/RPC 启动方式和测试入口。实现不会向 Flow Markdown 增加 Pi 专用字段。
