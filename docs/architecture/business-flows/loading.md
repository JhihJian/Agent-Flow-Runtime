# Flow 装载

## 流程

- **触发者**：Extension 或 SDK 调用 `loadFlow(path)`。
- **前置条件**：入口为目录或固定文件 `FLOW.md`；引用目标按 sibling package ID 定位。
- **输入**：入口路径与 Markdown 定义。
- **正常路径**：`loadFlow` 调用 `loadFlowPackage`；Parser 解析 metadata、唯一 Mermaid TD 图、节点 action/results，校验图连通性、模板、变量和并行结构；Loader 只校验动作实际引用的 `references/*.md` 和 `scripts/*.mjs`，再递归装载 sibling Flow 闭包。
- **分支**：没有引用时闭包为空；同一闭包内已装载的引用 package 复用。目录发现由 `loadFlow` 驱动装载。
- **失败/恢复**：入口、语法、资源越界、引用缺失或成环均在 Run 创建前失败；装载阶段没有 Run 恢复。
- **后置结果**：返回 Flow、规范化入口路径、资源映射和引用包表。
- **副作用**：文件系统读取和路径解析；不写运行状态或执行节点。
- **证据**：`src/definition/flow-loader.ts#loadFlow`、`src/definition/flow-loader.ts#loadFlowPackage`、`src/definition/flow-loader.ts#loadReferenceClosure`、`src/definition/flow-loader.ts#validatePackageResources`、`src/definition/flow-loader.ts#validateResource`、`src/definition/parser.ts#parseFlow`、`src/definition/parser.ts#validateParallel`、`src/definition/parser.ts#validateTemplates`。
- **测试预言机**：模板与并行约束的直接断言见 `test/parser.test.ts:247-259`、`test/parser.test.ts:266-294`、`test/parser.test.ts:340-358`、`test/parser.test.ts:368-413`；引用缺失、成环、传递闭包的直接断言见 `test/flow-reference.test.ts:958-1058`。
