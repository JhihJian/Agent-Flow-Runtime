# 定义与装载模块

## 定位与边界

本模块把 `FLOW.md` 和目录包转换为可执行前的结构化定义。它只读取和校验定义、资源及引用，不执行 Agent、命令或 Flow。

## 对外能力

- `parseFlow(markdown, id)` 生成 `FlowDefinition`。
- `loadFlow(path)` 生成根包和传递引用闭包。
- `loadFlowPackage(path)` 只装载一个包。
- `FlowDirectory.list/load` 递归发现和按 ID 装载 Flow。
- `resolvePromptResources`、`resolveCommandResources` 将包内资源转换为真实路径。
- `renderTemplate`、`renderCommandRequest`、`renderFlowReferenceTask` 提供执行前的模板渲染。

## 输入和结构规则

Parser 要求唯一的 YAML 元信息、唯一的 `flowchart TD`、节点二级标题、一个动作代码块和结果三级标题。它校验起点只有一个去向、终点无出边、所有工作节点可达且存在到终点路径。

动作分为 `新建Agent`、`复用Agent`、`执行自定义命令`、`执行Flow`。命令只能使用合法 JSON 请求，命令节点固定只有 `已执行` 结果。Flow 引用只能使用兄弟包标识，并采用无结果直连或 `已完成`/`已失败` 双结果边。

变量名拒绝原型污染名称。FlowValue 只接受可持久化 JSON 值，拒绝循环引用、非有限数字和不受支持的对象。模板分为全局变量、上一节点输入和并行分支作用域，分支引用只能出现在并行汇合命令的 stdin 中。

## 资源和引用规则

Flow 包入口固定为 `FLOW.md`，包 ID 取入口父目录名。Agent 提示中的 `references/...` 必须解析为包根内 `.md` 文件；命令参数中独立的 `scripts/...` 必须解析为包根内 `.mjs` 文件，命令 cwd 仍是业务项目目录。

引用 Flow 必须位于父包上一级目录的兄弟目录。Loader 递归装载完整闭包，缺失包、资源越界、自引用和引用环在装载阶段失败。

## 不实现范围

本模块不创建 Run，不保存状态，不拥有 Agent 会话，不执行命令，不负责业务路由，也不判断 Agent 提示词是否完成了业务目标。目录名、普通 import 和文档声明不能替代 Loader/Parser 的实际校验。

## 主要证据

- [parser.ts](../../src/parser.ts)
- [flow-loader.ts](../../src/flow-loader.ts)
- [directory.ts](../../src/directory.ts)
- [variables.ts](../../src/variables.ts)
- [types.ts](../../src/types.ts)
- [Flow 规范](../../flow-spec.md)
