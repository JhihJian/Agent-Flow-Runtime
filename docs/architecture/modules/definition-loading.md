# 定义与装载

## 边界

把固定入口 `FLOW.md` 转换为可执行前的结构化 Flow，并装载动作实际引用的资源及引用闭包。只读取和校验定义，不运行节点、不创建 Run。

## 能力与实体

`src/definition/parser.ts#parseFlow` 解析 YAML metadata、唯一 Mermaid TD 图、工作节点 action/results、变量表和 successors；`src/definition/parser.ts#validateAndWireGraph`、`src/definition/parser.ts#validateParallel`、`src/definition/parser.ts#validateTemplates` 验证图连通性、模板作用域和 parallel join。

`src/definition/flow-loader.ts#loadFlow`、`src/definition/flow-loader.ts#loadFlowPackage` 检查入口与 realpath，解析资源并递归 sibling Flow closure；`src/definition/flow-loader.ts#validatePackageResources` 只检查动作实际引用的 references/scripts 资源；`src/definition/directory.ts` 提供目录发现。

## 依赖与规则

Parser 依赖 types 和变量校验；Loader 调 Parser，并产出 FlowPackage/LoadedFlow 供 Runtime 消费。首节点不得引用 input；branch 只在 join 使用；命令 branch 必须汇至同一个命令 join。Flow 引用闭包缺失或成环则加载失败。

## 状态、权限与不实现范围

没有 Run 状态或授权职责。Loader 对文件路径执行读取、realpath、扩展名和包内边界校验，但不拥有资源访问后的安全政策；不执行 Agent、command 或 child Flow。

## 代码与测试映射

代码映射为 `src/definition/parser.ts#parseFlow`、`src/definition/flow-loader.ts#loadFlow`、`src/definition/flow-loader.ts#loadFlowPackage`、`src/definition/directory.ts`。直接断言见 `test/parser.test.ts:266-294`、`test/parser.test.ts:340-413`、`test/flow-reference.test.ts:958-1058`；动作资源边界由 `flow-package.test.ts` 和 `flow-reference.test.ts` 覆盖。
