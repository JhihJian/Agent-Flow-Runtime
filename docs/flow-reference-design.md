# Flow 引用执行设计

一条 Flow 的节点可以引用另一个 Flow 执行。父节点把输入交给子 Flow，子 Flow 作为一次独立 Run 走完自己的路径，父节点拿到子 Run 的终态后继续父路径的路由。

解决的问题：当一条路径的某个阶段本身已经是成熟 Flow（例如「上线」流程中的「发布检查」阶段）时，作者只能在父 Flow 里复述这些节点，或把整段工作交给一个 Agent 节点自由发挥。前者造成路径重复维护，后者丢失门禁和返工结构。

## 1. 语义决策

| 问题 | 决策 |
| --- | --- |
| 引用的含义 | 运行期嵌套执行一次独立子 Run；父图保持自身结构，加载期按需递归加载子定义 |
| 子 Flow 的结果 | 类比命令节点：父节点固定提交「已执行」，结果内容携带子 Run 终态 |
| 子 Flow 失败 | 父节点仍是「已执行」，失败信息在结果内容里，业务判断交给后续 Agent 节点 |
| Agent 归属 | 子 Run 独立绑定：子 Flow 首个 Agent 动作必须是「新建Agent」 |
| 恢复归属 | 子 Run 只随父 Run 恢复，无独立恢复入口 |

决策依据：

- 独立子 Run 保住四条现有不变量：nodeRef 只在 Flow 内唯一、事实提交按 Run 原子、观测事件按 runId 订阅、Agent 绑定按 Run 管理。宏展开或共享事实会同时破坏这四条。
- 固定结果沿用「执行与判断分离」：命令节点的非零退出是业务信息，子 Run 的 failed 同样是业务信息。父路径需要判断时，由后续 Agent 节点依据结果内容选择结果边。
- 独立 Agent 绑定源于 AgentRunModel 的绑定按 runId 管理：子 Flow 若复用父绑定，其「新建Agent」会释放父 Agent，返回父路径后「复用Agent」拿到的是子 Flow 的 Agent。
- 结构性错误（兄弟包缺失、环引用）在加载期报错；运行期只有子 Run 的业务终态，父节点因此总能在执行后推进路由。

## 2. 语法

动作标记为`执行Flow`，与`新建Agent`、`复用Agent`、`执行自定义命令`并列。代码块是一个 JSON 对象：

```json
{
  "flow": "release-check",
  "task": "为以下变更执行发布检查：{outcome}"
}
```

- `flow`：必填，目标 Flow 标识，即兄弟包目录名。
- `task`：可选 JSON 值。省略时子 Run 的任务取父节点输入原值；提供时字符串中的`{outcome}`按命令节点`stdin`的既有语义替换。

父 FLOW.md 中的节点示例：

````markdown
## 执行发布检查

```执行Flow
{
  "flow": "release-check",
  "task": "为以下变更执行发布检查：{outcome}"
}
```

### 已执行

子 Flow 已运行结束，结果内容携带其终态与最终结论。
````

目录结构要求被引用方与父包同处一级目录：

```text
.flows/
├── release/
│   └── FLOW.md        # 含「执行Flow release-check」节点
└── release-check/
    ├── FLOW.md
    ├── references/
    └── scripts/
```

## 3. 结果内容

父节点的结果内容固定为：

```json
{
  "status": "success",
  "runId": "子 Run 标识",
  "flowId": "release-check",
  "result": "子 Flow 最后一个已完成工作节点的结果内容",
  "error": { "category": "agent_execution", "summary": "……" }
}
```

- `status`：子 Run 状态为 completed 时取 success，failed 或 interrupted 时取 failure。
- `result`：子 Run 最后一个已完成工作节点的结果内容；没有任何已完成节点时为 null。
- `error`：仅失败时出现，取子 Run 的流程级错误。

子 Flow 的最终结论取自其最后一个工作节点，沿用「结果内容作为后续节点输入」的既有传递方式，出口即节点本身。

## 4. 引用解析与加载闭包

- 解析根是父包根的上一级目录，按标识直接定位`<上一级>/<flow>/FLOW.md`。查找一次完成、结果确定，引用只能指向兄弟包。
- 加载时机随父 Flow：`loadFlow`解析完父定义后，遍历全部「执行Flow」节点递归加载兄弟包，形成传递闭包注册表。子包的`references/`、`scripts/`资源校验在闭包构建时一并完成。
- 加载栈中出现重复标识（含自引用）即报错，环引用在加载期被拒绝。嵌套深度由无环性约束。
- 父 Run 的`flowVersion`是组合指纹，递归包含全部子 Flow 指纹。恢复运行重读父入口后重建闭包并校验组合指纹，子 Flow 文件漂移与父文件漂移同样会被发现。
- `task`文本按原值传递；`references/`链接解析仅适用于 Agent 动作的提示词。

## 5. 运行时机制

执行流程：

1. 协调器进入「执行Flow」节点，按`task`规则求出子任务。
2. 用闭包注册表中的子定义创建子协调器，复用同一 RunStore、AgentRunModel、命令执行器和观测发布器，并继续传递闭包注册表供更深层引用使用。
3. 子 Run 启动并运行到终态；父节点映射终态为结果内容，随后按「已执行」结果边推进。

事实关联只保留链接字段：子 Run 记录`parentRunId`与`parentNodeRunId`，父 NodeRun 记录`childRunId`。子 Flow 的全部事实写入子 Run，父 Run 中没有子节点记录，nodeRef 与序号各自独立。

Agent 绑定：共享同一个 AgentRunModel 实例，绑定按 runId 隔离。父绑定在子 Flow 执行期间保持原状；子 Run 结束时按既有规则解除子绑定。

观测：子 Run 的事件携带自己的 runId 与子 flowId，按既有规则发布。订阅父 runId 的消费者看到的是父路径事实，父子聚合视图属于观测层的后续工作。

## 6. 恢复语义

父 Run 恢复时，「执行Flow」节点按三种情况处理：

1. 父 NodeRun 已完成：沿用现有「从已完成节点继续路由」。
2. 父 NodeRun 中断、子 Run 已终态：读取子 Run 终态，映射结果内容后补全父节点并继续路由。子 Run 完成与父节点完成是两次提交，崩溃落在这两次之间时由此路径闭合。
3. 父 NodeRun 中断、子 Run 仍在运行：先递归恢复子 Run 到终态，再按情况 2 续接。

子 Run 通过自身记录的`parentRunId`与`flowPath`定位，即使父 NodeRun 的`childRunId`尚未写回也能恢复。父节点被中断时，活跃子 Run 同步标记为 interrupted。

CLI 直接恢复子 Run 时报错，并提示改用父 Run 标识。

## 7. 解释器静态检查新增项

- 「执行Flow」代码块是 JSON 对象，`flow`为非空标识（字母开头，仅含字母、数字、连字符、下划线）。
- `task`存在时是任意 JSON 值，`{outcome}`只出现在字符串中，替换语义与命令节点一致。
- 「执行Flow」节点与命令节点同样只有「已执行」结果边。
- 「执行Flow」节点不得作为并行分支或汇合节点，沿用「并行分支和汇合必须是命令节点」的既有约束。
- 引用的兄弟包存在且可解析，引用图无环。

## 8. 边界

以下能力属于后续扩展，进入本设计前已逐项评估：

- 子 Flow 出口结果映射（子 Flow 声明出口、父边对齐）：跨文件结果契约，与「执行与判断分离」的节点分工冲突。
- 子 Flow 节点进入并行分支：同时破坏「并行分支只能是命令节点」与汇合结果结构。
- 运行期动态选择子 Flow：观测与指纹无法静态化。
- 子 Run 独立恢复与父子聚合视图：观测层工作。
- 远程引用、版本锁定语法、跨 Flow 的`{ref.outcome}`引用。

## 9. 模块改动要点

| 模块 | 改动 |
| --- | --- |
| types.ts | 新增`执行Flow`动作类型；NodeRunRecord 增加`childRunId`，FlowRunRecord 增加`parentRunId`、`parentNodeRunId`；FlowErrorCategory 增加`flow_reference`；LoadedFlow 携带引用闭包 |
| parser.ts | 解析`执行Flow`标记；结果边约束扩展到全部非 Agent 动作 |
| flow-loader.ts | 构建加载闭包：兄弟包解析、环检测、子包资源校验 |
| runtime.ts | 执行分支、子协调器组装、组合指纹、中断传播、恢复续接；RunStore 增加按父 Run 查询子 Run 的方法 |
| extension.ts / CLI | 恢复路径改用闭包注册表；子 Run 直接恢复时给出指引 |
| docs | flow-spec.md 动作类型与检查清单、flow-overview.md、架构文档同步 |

## 10. 测试清单

- 兄弟包缺失、自引用、互引环在加载期被拒绝。
- 子 Run 完成后父节点提交「已执行」，结果内容形状正确。
- 子 Run failed 映射为 failure，父路径继续推进。
- 子 Flow 内「新建Agent」保持父绑定原状；子 Run 结束后父「复用Agent」拿到原 Agent。
- 子 Flow 文件修改后，父 Run 恢复被组合指纹拒绝。
- 崩溃窗口：子 Run 已终态、父 NodeRun 中断，恢复幂等续接。
- 直接恢复子 Run 被拒绝并提示父 Run 标识。
- 「执行Flow」节点作为并行分支被解释器拒绝。
