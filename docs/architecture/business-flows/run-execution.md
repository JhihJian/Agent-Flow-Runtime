# Run 执行

## 流程

- **触发者**：Pi `/flow run`、`--flow` 输入或 SDK 调用 `FlowCoordinator.run`。
- **前置条件**：Flow 已成功装载；Store 与所需 Agent/command adapter 可用。
- **输入**：全局变量及 cwd、Flow path、session 等运行上下文。
- **正常路径**：`initializeVariables` 校验启动输入和默认值；通过后才创建 running Run 与指纹；随后创建 NodeRun、执行 action、验证结果/变量、提交 NodeRun 与 RouteDecision，再进入普通节点、并行入口或 finish。
- **分支**：结果名决定 destination；普通节点可循环访问，每次新建独立 NodeRun；全局变量 patch 写入 Run，当前结果变量只形成下一跳 input。普通结果边必须与结果声明匹配，`执行Flow` 允许一条无结果直连边并映射固定成功结果。
- **失败/恢复**：启动输入错误在 Run 创建前结束；结果变量错误由 `completeNode` 校验并进入节点/Run 失败路径；未知结果、无路由、动作或 Store 错误终结 Run。恢复另行校验 Flow ID、状态和 fingerprint 条件。
- **后置结果**：Run 返回 completed/failed/interrupted 等状态；NodeRun、route、round、recovery facts 形成可检索历史。
- **副作用**：Agent session、外部命令、Store 写入及可选观测/UI 事件。
- **证据**：`src/execution/runtime.ts#FlowCoordinator.run`、`src/execution/runtime.ts#continueRun`、`src/execution/runtime.ts#FlowCoordinator.executePreparedNode`、`src/execution/runtime.ts#FlowCoordinator.completeNode`、`src/execution/runtime.ts#FlowCoordinator.selectRoute`、`src/execution/runtime.ts#FlowCoordinator.commit`、`src/definition/parser.ts#validateAndWireGraph`、`src/definition/parser.ts#wireFlowReferenceNode`。
- **测试预言机**：NodeRun、循环和下一跳 input 的直接断言见 `test/runtime.test.ts:129-157`；启动输入、默认值和模板传递见 `test/variables.test.ts:91-96`、`test/variables.test.ts:104-119`、`test/variables.test.ts:126-136`、`test/variables.test.ts:149-153`；命令非零路径和命令结果留存见 `test/correctness.test.ts:425-449`；结果变量失败及父 Run 失败见 `test/flow-reference.test.ts:536-550`。
