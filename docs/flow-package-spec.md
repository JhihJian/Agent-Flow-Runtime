# Flow 包目录规范

本规范为需要随 Flow 交付参考资料、模板或 Node.js 辅助程序的场景定义 Flow 包。它借鉴 Pi Skill 的目录约定：一个目录有一个固定入口，`references/`、`scripts/`和`assets/`按职责存放随包资源，其他文件不参与发现。

这是 Flow 格式的 V2 目标规范。当前运行时只支持 V1 单文件 Flow，尚未实现本规范的目录发现、资源 URI 解析和恢复校验。实现完成前，不能把目录或`FLOW.md`直接传给`--flow`或`/flow run`。

## 1. 适用范围

选择 Flow 包的条件：

- 节点需要引用较长的 Markdown 规则、检查表或领域资料。
- 命令节点需要运行应随 Flow 一同发布的 Node.js 程序。
- Flow 需要模板、JSON 配置或其他静态输入。

只有流程图和简短节点提示的 Flow 继续使用 V1 单文件即可。包化解决资源组织和定位问题，不改变 Flow 图、节点、结果、并行或 Agent 动作的语义。

## 2. 目录结构

一个 Flow 包是一个目录，目录名是稳定 Flow 标识。入口文件必须命名为`FLOW.md`，以免与普通参考 Markdown 或 Pi 的`SKILL.md`混淆。

```text
.flows/
└── release-check/
    ├── FLOW.md                 # 必需：流程入口
    ├── references/             # 可选：供 Agent 按需读取的 Markdown
    │   └── release-checklist.md
    ├── scripts/                # 可选：命令节点调用的 Node.js 模块
    │   ├── verify-version.mjs
    │   └── lib/
    │       └── semver.mjs
    ├── assets/                 # 可选：模板、JSON、静态数据等非可执行资源
    │   └── report-template.json
    └── tests/                  # 可选：仅用于维护该包的测试
        └── verify-version.test.mjs
```

目录名必须匹配`[a-z0-9][a-z0-9-]{0,63}`。`FLOW.md`不得嵌套在`references/`、`scripts/`、`assets/`或`tests/`中。包内不得提交`node_modules/`、构建产物或运行记录。

| 路径 | 允许内容 | 运行时含义 |
| --- | --- | --- |
| `FLOW.md` | 一个 V2 Flow 入口 | 必需，定义图、节点和动作。 |
| `references/**/*.md` | Markdown | 供 Agent 节点读取，不能被发现为 Flow。 |
| `scripts/**/*.mjs` | ESM Node.js 源码 | 只能由命令节点通过资源 URI 调用。 |
| `assets/**` | 静态资源 | 可作为 Agent 提示或脚本参数中的资源 URI。 |
| `tests/**` | 测试源码和夹具 | 不参与 Flow 执行与版本指纹。 |
| `README.md` | 包维护说明 | 可选，不参与 Flow 执行与版本指纹。 |

`scripts/`中的模块应依赖 Node.js 标准库或同目录的 ESM 模块。V2 不支持 Flow 包自行执行`npm install`，也不支持把依赖包、锁文件或`node_modules`作为执行前提。需要第三方依赖的能力应由宿主项目提供，或在后续单独设计受审计的依赖分发机制。

## 3. V2 入口

V2 的`FLOW.md`沿用[Flow 规范](flow-spec.md)中的图和节点格式，元信息扩展为以下四个且仅四个字段：

```markdown
---
format: 2
version: 1.0.0
name: 发布检查
description: 适用于准备发布前的依赖、版本和变更检查。
---
```

| 字段 | 规则 | 作用 |
| --- | --- | --- |
| `format` | 固定数字`2` | 明确采用 Flow 包格式。 |
| `version` | 非预发布 SemVer | 表示该工作方法的人工维护版本。 |
| `name` | 非空文本 | 供人展示。 |
| `description` | 非空文本 | 供目录发现、选择和复用。 |

Flow 标识不写入元信息，直接取包目录名`release-check`。同一发现根下的标识必须唯一。这样入口永远是`FLOW.md`也不会造成标识冲突，迁移 V1 时仍可保留原有标识。

`version`用于人类沟通和发布说明，不能取代资源内容指纹。运行恢复同时比较 Flow 标识和包内容指纹，任一生产资源变更都拒绝恢复旧 Run。

## 4. 资源引用和执行目录

`FLOW.md`中引用包内资源时，统一使用`flow://`资源 URI，后接相对包根目录的 POSIX 路径：

```markdown
请先阅读[发布检查清单](flow://references/release-checklist.md)，再判断是否可以发布。
```

```json
{
  "command": "node",
  "args": ["flow://scripts/verify-version.mjs", "flow://assets/report-template.json"],
  "stdin": { "task": "{outcome}" }
}
```

运行时在执行前把资源 URI 解析为包内真实路径：

- Agent 提示中的 URI 替换为绝对本地路径，使 Agent 能按需读取资料。
- 命令参数和`stdin`中的 URI 替换为绝对本地路径。
- 命令进程的`cwd`仍是本次 Run 的业务工作目录，不变为 Flow 包目录。
- 脚本读取同包模块时使用标准 ESM 相对导入或`import.meta.url`，读取业务项目时使用进程`cwd`。

因此 Flow 脚本和业务项目文件具有明确边界：前者随 Flow 分发，后者属于本次任务。禁止用相对路径假设二者位于同一目录，也禁止把包绝对路径写入`FLOW.md`。

资源 URI 必须指向本规范允许的生产资源：`references/**/*.md`、`scripts/**/*.mjs`或`assets/**`。`tests/`、`README.md`和`FLOW.md`不能作为资源 URI 的目标。普通 HTTP(S) URI 是提示和脚本自身的输入，不由 Flow 资源解析器下载或校验。

## 5. 安全和完整性

Flow 包是可执行内容的分发单元，安全模型与 Skill 一致：只安装和运行经过审查、来源可信的包。目录校验用于防止意外越界，不把 Node.js 脚本限制在沙箱内。

加载器必须执行以下校验：

1. 所有资源 URI 必须是相对 URI，禁止空路径、绝对路径、反斜杠、`.`、`..`和 URI 查询或片段。
2. 使用`realpath`解析入口和资源，解析后的真实路径必须仍位于包根目录内，拒绝符号链接逃逸。
3. 发现目录时不跟随目录符号链接，并忽略`.git/`、`.pi/`、`node_modules/`、`dist/`和本规范的资源目录。
4. 资源不存在、类型不符合所在目录、或 URI 指向未允许目录时，解析整个 Flow 失败。
5. 命令动作仍可能执行任意受信任脚本，加载器不得自动安装依赖、下载代码或提升权限。

包内容指纹必须按稳定顺序包含`FLOW.md`、`references/`、`scripts/`和`assets/`中所有允许的文件路径与字节内容。`tests/`和`README.md`不影响运行行为，不计入指纹。运行记录保存入口绝对路径、包根、`version`和指纹；恢复时重新完成上述校验后才能继续。

## 6. 发现、加载和分发

V2 发现根通常是`.flows/`。加载器递归寻找`FLOW.md`，每个命中的父目录恰好产生一个 Flow 候选。命令行和 SDK 支持传入包目录或其中的`FLOW.md`；两种形式解析到同一包根。

为兼容 V1，发现根的第一层`*.md`仍作为单文件 Flow 发现，显式传入任何 V1 `.md`路径也仍可执行。加载器必须在聚合候选后检查标识重复，例如`.flows/release-check.md`与`.flows/release-check/FLOW.md`同时存在时直接报错，不依据遍历顺序任选一个。

分发时将完整包目录纳入 Git 仓库或 npm 包的`files`白名单。例如运行时包可放在`flows/release-check/`，业务项目可放在`.flows/release-check/`。不要把`FLOW.md`散落在通用文档目录中，避免发现边界不清晰。

## 7. 迁移和实现门禁

迁移保持 V1 可读，按以下顺序实施：

1. 增加包加载模型，支持显式包目录、`FLOW.md`和 V1 单文件路径。
2. 在解析器中按入口位置分流 V1 与 V2 元信息，校验目录名、资源 URI 和真实路径边界。
3. 在 Agent 提示渲染和命令请求渲染中解析`flow://`，同时保持业务`cwd`语义。
4. 将包生产资源纳入版本指纹和恢复校验，随后再启用递归目录发现。
5. 提供迁移命令，把`release-check.md`迁为`release-check/FLOW.md`，保留 Flow 标识并补齐`format`、`version`。

实现验收至少覆盖：V1 兼容、V2 发现、重复标识、资源缺失、目录越界、符号链接逃逸、Agent 提示资源渲染、脚本参数资源渲染、业务`cwd`保持不变、资源修改后拒绝恢复，以及 npm 打包后资源完整性。

在所有门禁完成前，V2 目录规范只作为创作和实现契约，当前 V1 规范仍是唯一可运行格式。