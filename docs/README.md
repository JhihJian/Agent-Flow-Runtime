# 项目文档

Flow 将可复用的工作方法写成 Markdown，由运行时结合具体任务驱动执行。文档按使用、开发和架构三类组织，具体实现以源码和测试为准。

## 使用 Flow

| 文档 | 用途 |
| --- | --- |
| [Flow 概览](flow-overview.md) | 快速理解 Flow、运行、节点结果、并行和记录。 |
| [Flow 规范](flow-spec.md) | 编写、生成或检查可运行的 Flow 文件。 |
| [SDK 快速开始](sdk-quick-start.md) | 在 Node.js 程序中组装运行时，用 Pi 会话执行 Agent 节点。 |
| [Flow 运行台](flow-ui.md) | 在本机查看 Flow 会话列表、Run 详情、执行图和节点证据。 |

## 开发与维护

| 文档 | 用途 |
| --- | --- |
| [项目地图](project-map.md) | 定位入口、核心模块、修改位置和验证入口。 |
| [发布级冒烟门禁](release-smoke-design.md) | 说明发布前离线门禁覆盖的主链路、并行冲突和恢复流程。 |
| [源码逻辑阅读图](source-pseudocode-guide.md) | 按执行链阅读关键源码和伪代码。 |
| [源码符号索引](source-index.md) | 自动生成的模块、符号和源码位置索引。 |

## 架构基线

[架构基线](architecture/ARCHITECTURE.md)记录当前系统边界、核心流程、模块职责和关键不变量；模块、业务流、术语、决策和来源映射均从该入口继续阅读。

## 维护源码阅读资料

以下命令只面向源码仓库开发者。发布包不包含生成工具及其开发依赖。`source-pseudocode-guide.md`中的 Mermaid 图和伪代码由人工维护，关键函数的源码链接以及`source-index.md`由`ts-morph`生成。修改关键函数、移动源码或调整阅读图后，执行：

```bash
npm run docs:source-index
npm run check
```

`npm run check`会拒绝未更新的位置链接、缺少受控阅读区块或缺少 Mermaid 图、伪代码的文档变更。

## 实现

[Agent Flow Runtime 实现与安装说明](../README.md)提供运行时模块、Pi 扩展安装、CLI/TUI/JSON/RPC 启动方式和测试入口。实现不会向 Flow Markdown 增加 Pi 专用字段。
