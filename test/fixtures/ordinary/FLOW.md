---
name: 普通流转
description: 用于验证两个串行 Agent 节点。
variables:
  任务:
    description: 本次分析任务
    default: test
---

```mermaid
flowchart TD
  start((开始)) --> analyze[分析任务]
  analyze -->|已分析| finishNode[完成任务]
  finishNode -->|已完成| finish((结束))
```

## 分析任务

```新建Agent
分析任务：
{var.任务}
```

### 已分析

| 变量 | 含义 |
| --- | --- |
| 分析结论 | 下一节点完成任务所需的结论 |

已得到下一步所需结论。

## 完成任务

```复用Agent
根据分析结果完成任务：
{input.分析结论}
```

### 已完成

任务已结束。