# 源码伪代码阅读图

本文是给初次阅读本项目源码的人准备的压缩视图。它省略 TypeScript、Pi SDK 和 Node.js 的语法细节，只保留运行时的控制流、数据流和模块边界。伪代码不是另一份规范，判断细节时以对应源码和 [Flow 规范](flow-spec.md) 为准。

## 先记住四件事

```text
Flow Markdown  --解析-->  FlowDefinition（静态流程定义）
任务 + FlowDefinition --运行--> FlowRunRecord（一次运行状态）
节点动作 --执行--> NodeOutcome（结果名 + 传给下一节点的内容）
结果名 --查图--> 下一个节点、并行区或结束
```

- `parser.ts` 只将 Markdown 变成可信的静态定义。
- `runtime.ts` 是唯一会改变一次 Flow 运行状态的模块。
- `pi.ts` 只将“运行一个 Agent 节点”的通用接口接到 Pi 会话。
- `extension.ts` 只将 Pi CLI/TUI 的参数、命令和事件接到运行时。

## 一次运行

入口是 `extension.ts` 的 `startFlow`。它读取 Flow 文件，组装运行时依赖，然后把用户任务交给协调器。

```text
startFlow(Flow文件路径, 用户任务, Pi上下文):
    flow = parseFlow(读取文件)
    adapter = PiAgentIntegrationAdapter(当前 Pi CLI 桥接器)
    store = JsonFileRunStore(".pi/flow-runs.json")
    coordinator = FlowCoordinator(flow, store, AgentRunModel(adapter))

    如果首节点是“复用Agent”:
        coordinator.run(用户任务, 当前 Pi 会话引用)
    否则:
        coordinator.run(用户任务)
```

协调器的主循环位于 `runtime.ts` 的 `FlowCoordinator.run`：

```text
run(任务):
    run = 创建状态为 running 的运行记录
    保存 run
    如有已有 Agent，会话模型接管它

    当前节点 = Flow 首节点
    当前输入 = 任务

    循环:
        本次结果 = executeNode(run, 当前节点, 当前输入)
        去向 = 流程定义[当前节点][本次结果.result]

        如果去向是结束:
            将 run 标记为 completed，保存，解除 Agent 绑定，返回

        如果去向是普通节点:
            当前节点 = 去向节点
            当前输入 = 本次结果.content
            保存 run
            继续循环

        如果去向是并行开始点:
            分支结果 = executeParallel(当前输入)
            执行该并行区的汇合命令节点
            根据汇合结果继续普通路由，或结束

    任何异常:
        将 run 标记为 failed，保存，解除 Agent 绑定，再抛出异常
```

这里的关键是：每个节点的结果由 `result` 和 `content` 组成。`result` 决定走哪条 Mermaid 边，`content` 成为下一个节点的 `{outcome}` 输入。

## 一个节点

每次进入节点，无论是初次进入、循环重试还是并行分支，都会建立一条独立的节点运行记录。

```text
executeNode(run, 节点引用, 输入, 可选分支结果):
    node = Flow 定义中找到节点
    record = 创建节点运行记录（输入、开始时间）
    保存 record

    如果 node 是“执行自定义命令”:
        command = 将 {outcome} 和 {分支.outcome} 填入命令 JSON
        commandResult = 执行子进程，向 stdin 写 JSON
        outcome = { result: "已执行", content: commandResult }

    否则 node 是 Agent 节点:
        prompt = 将 {outcome} 填入节点提示，并附上允许的结果列表
        outcome, session = AgentRunModel.executeNode(...)
        record.session = session

    record.outcome = outcome
    record.completedAt = 当前时间
    保存 record
    返回 record 和 outcome
```

命令节点没有业务判断，固定产生 `已执行`。Agent 节点必须通过 `submit_flow_outcome` 恰好提交一次允许的结果。

## 并行与汇合

并行只用于命令节点，Agent 节点始终串行。并行开始前的输入会被冻结，同一份输入交给每个分支；所有分支结束后才执行汇合节点。

```text
executeParallel(run, 并行开始点, 输入):
    round = 创建并行轮次记录，保存原始输入
    run 的当前节点置空，当前并行轮次 = round
    保存 run

    同时执行每个分支节点:
        executeNode(run, 分支节点, 输入)
        将分支的节点记录 ID 写入 round

    返回 { input, 以分支节点引用为键的结果集合 }

执行汇合节点时:
    {outcome} 使用并行开始前被冻结的 input
    {分支.outcome} 使用本轮对应分支的完整结果
```

## Flow 如何被解析和校验

`parser.ts` 不负责运行任务。它把 Flow Markdown 转成 `FlowDefinition`，并在运行前拒绝结构不合法的文件。

```text
parseFlow(Markdown, 文件名):
    id = 文件名去掉扩展名
    metadata = 读取唯一的 name 和 description
    graph = 读取唯一的 Mermaid flowchart TD
    sections = 读取每个二级标题下的动作和三级结果说明

    为 Mermaid 中每个工作节点:
        找到同名二级标题
        将动作解析为 新建Agent / 复用Agent / 执行自定义命令
        建立节点和结果说明

    校验并连接图:
        start 只能无条件指向一个工作节点
        每条工作节点出边都必须有对应结果名
        命令节点只能有“已执行”结果
        并行分支必须是命令节点，且汇合到同一个命令节点
        所有工作节点必须可达，并至少有一条路径抵达 finish

    返回 FlowDefinition
```

`renderCommandRequest` 在真正执行命令前再替换 `{outcome}` 和并行分支结果。这样解析阶段保留的是模板，运行阶段才使用某一次任务的数据。

## Agent 与 Pi 的边界

运行时不直接调用 Pi SDK，而是依赖 `AgentIntegrationAdapter`。`AgentRunModel` 负责“本次 Flow 运行绑定哪个 Agent”，`PiAgentIntegrationAdapter` 负责“如何创建 Pi 会话、发送提示、接收工具调用”。

```text
AgentRunModel.executeNode(运行 ID, 节点动作, 提示, 允许结果):
    如果动作是“新建Agent”:
        释放旧绑定（如有）
        adapter.createAgent()
        保存新的运行级绑定

    如果动作是“复用Agent”且没有绑定:
        报错

    adapter.executeNode(连接, 节点执行 ID, 提示, 允许结果, 提交回调)

    提交回调只接受一次，并校验:
        节点执行 ID 一致
        结果名在允许列表内

    未提交结果就结束的节点视为失败
```

Pi 的两种执行路径如下：

```text
SDK 路径:
    创建或恢复 Pi AgentSession
    session.prompt(节点提示)
    Agent 调用 submit_flow_outcome
    工具回调把结果交给运行时

CLI 路径:
    extension 在当前可见会话发送后续提示
    工具调用先暂存为候选结果
    turn_end 后 Pi 已持久化消息，adapter 再正式提交结果
    返回这次交互的起止消息引用
```

CLI 路径延迟到 `turn_end` 提交，是为了让节点记录引用完整、已持久化的 Pi 会话交互。

## 源码阅读顺序

按下列顺序打开源码，并在每个文件中对照上面的同名伪代码：

| 顺序 | 源码 | 阅读目标 |
| --- | --- | --- |
| 1 | `src/types.ts` | 认识 `FlowDefinition`、`FlowRunRecord`、`NodeRunRecord`、`NodeOutcome` 和适配器接口。 |
| 2 | `src/parser.ts` | 看静态 Flow 如何被解析、校验和连线。 |
| 3 | `src/runtime.ts` | 看 `FlowCoordinator.run`、`executeNode`、`executeParallel` 如何驱动状态机。 |
| 4 | `src/pi.ts` | 看适配器如何把 Agent 节点翻译成 Pi 会话调用。 |
| 5 | `src/extension.ts` | 看 Pi CLI/TUI 如何启动运行时，并在事件中提交节点结果。 |
| 6 | `test/runtime.test.ts` 与 `test/parser.test.ts` | 对照正常路由、循环、并行和非法 Flow 的可执行例子。 |

`src/directory.ts` 仅负责按文件名发现和载入 Flow，`src/index.ts` 仅导出公共模块，可以最后阅读。