# Flow 包目录规范

Flow 包用于一条 Flow 除流程定义外，还需要携带参考 Markdown 或 Node.js 脚本的情况。目录约定参考 Skill：一个目录只有一个固定入口，其余文件按用途放在入口旁边。

这是后续 V2 的创作约定。当前运行时只支持 V1 单文件 Flow，目录包的加载和资源定位尚未实现；在实现前，`FLOW.md`不能直接传给`--flow`或`/flow run`。

## 何时使用

只有流程图和简短节点提示时，继续使用单个`.md`文件。出现以下任一情况时，使用 Flow 包：

- Agent 节点需要阅读较长的规则、检查表或领域资料。
- 命令节点需要运行应与 Flow 一同发布的 Node.js 程序。

包化只组织资源，不改变 Flow 图、节点、结果或并行语义。

## 目录

```text
.flows/
└── release-check/
    ├── FLOW.md
    ├── references/
    │   └── release-checklist.md
    └── scripts/
        └── verify-version.mjs
```

规则只有四条：

1. `FLOW.md`是唯一入口，包目录名是 Flow 标识。例如`release-check/FLOW.md`的标识为`release-check`。
2. `FLOW.md`继续使用既有的 Flow 图、节点和`name`、`description`元信息，不增加目录格式专用字段。
3. `references/`只放供 Agent 阅读的 Markdown。入口中用普通相对链接引用它，例如`[发布检查清单](references/release-checklist.md)`。
4. `scripts/`只放命令节点调用的 Node.js ESM 脚本。命令参数从包根写相对路径，例如`"args": ["scripts/verify-version.mjs"]`。

除上述约定外，包内其他文件暂不定义运行时含义。Flow 作者可以按维护需要增加测试或说明文件，但不应让它们参与流程执行。

## 脚本与工作目录

脚本文件属于 Flow 包，业务项目文件属于一次 Run 的工作目录。未来运行时加载包后负责把`references/...`和`scripts/...`定位到包内对应文件，命令进程的`cwd`仍保持业务项目目录。

因此脚本需要读取业务项目时使用进程`cwd`，需要读取同包模块时使用 ESM 相对导入或`import.meta.url`。Flow 文件中不写机器相关的绝对路径。

## 与单文件 Flow 共存

现有任意`.md`单文件 Flow 保持原有标识和运行方式。未来目录发现同时支持单文件与`目录/FLOW.md`，但同一发现根下不得出现相同标识，例如`release-check.md`和`release-check/FLOW.md`不能同时存在。

目录规范到此为止。资源路径的安全校验、内容指纹、递归发现、恢复行为和迁移工具属于运行时实现设计，应在开始实现 V2 加载器时单独定义和测试。