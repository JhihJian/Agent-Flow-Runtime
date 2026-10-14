---
name: 门禁循环
description: 用于验证门禁和返工循环。
variables:
  任务:
    description: 本次检查任务
    default: test
---

```mermaid
flowchart TD
  start((开始)) --> review[检查条件]
  review -->|返工| review
  review -->|通过| finish((结束))
```

## 检查条件

```新建Agent
检查以下输入：
{var.任务}
```

### 返工

需要继续处理输入。

### 通过

已满足门禁条件。