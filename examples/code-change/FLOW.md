---
name: 代码修改与验证
description: 适用于目标明确、需要完成代码修改并运行验证的任务。
variables:
  任务:
    description: 本次代码修改目标
  修改记录:
    description: 最新修改与返工记录
    default: 尚未修改
---

```mermaid
flowchart TD
  start((开始)) --> change[完成修改]
  change -->|已修改| verify[验证修改]
  verify -->|通过| finish((结束))
  verify -->|返工| change
```

## 完成修改

```新建Agent
完成以下代码修改：
{var.任务}
最新修改与返工记录：{var.修改记录}
完成后在 variables.修改记录 中提交修改范围和验证所需信息。
```

### 已修改

修改已完成，已更新全局变量 `修改记录`。

## 验证修改

```复用Agent
验证以下修改结果：
{var.修改记录}
```

### 通过

验证已通过。

### 返工

验证发现需要回到修改节点的问题，更新全局变量 `修改记录`，列出返工原因。