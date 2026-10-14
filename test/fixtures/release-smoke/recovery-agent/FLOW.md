---
name: 发布级 Agent 恢复
description: 验证持久化 Agent 节点中断后的重试和路由。
variables:
  任务:
    description: 恢复测试任务
    default: 发布前恢复验收
---

```mermaid
flowchart TD
  start((开始)) --> inspect[恢复检查]
  inspect -->|已完成| finish((结束))
```

## 恢复检查

```新建Agent
请完成恢复检查。任务：{var.任务}
```

### 已完成

恢复检查已完成。
