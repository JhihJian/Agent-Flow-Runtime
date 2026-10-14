---
name: 发布级命令恢复
description: 验证中断命令不会被自动重放。
variables:
  任务:
    description: 恢复测试任务
    default: 发布前恢复验收
---

```mermaid
flowchart TD
  start((开始)) --> execute[执行外部检查]
  execute -->|已执行| finish((结束))
```

## 执行外部检查

```执行自定义命令
{"command":"release-side-effect"}
```

### 已执行

外部检查已完成。
