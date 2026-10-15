# 子 Flow

## 流程

- **触发者**：父 Flow 的 `执行Flow` 节点。
- **前置条件**：目标 Flow 已进入 LoadedFlow closure；action 提供引用 ID，可选显式 inputs。
- **输入**：父节点 input、父 Run globals、声明的 input 模板。
- **正常路径**：`startChildRun` 只渲染显式 inputs，创建带 parent IDs 的独立子 Run，并共享 Store、Agent model、command executor 和 Publisher；成功后 `childOutcome` 只提取父节点成功结果声明的 child variables，再返回固定成功结果。
- **分支**：子失败时，父节点有失败边则走该边且不注入成功变量；没有失败边则父 Run 进入 flow_reference 失败路径。无结果直连边使用固定成功映射。
- **失败/恢复**：缺失 closure、子执行失败或持久化错误按 flow_reference 路径处理；父级恢复时复用已终态子 Run，或递归恢复未终态子 Run。子 Run 不支持独立恢复。
- **后置结果**：父 NodeRun 有 childRunId 和 outcome；子 Run 保持独立状态和历史，NodeRun/ParallelRound 在各自生命周期内可更新。
- **副作用**：子节点可建立 Agent session、执行命令，并写入共享 Store。
- **证据**：`src/runtime.ts#FlowCoordinator.executeFlowReference`、`src/runtime.ts#FlowCoordinator.startChildRun`、`src/runtime.ts#FlowCoordinator.childOutcome`、`src/runtime.ts#FlowCoordinator.resumeFlowReferenceNode`、`src/flow-loader.ts#loadReferenceClosure`。
- **测试预言机**：输入、父子关联和输出限制的直接断言见 `test/flow-reference.test.ts:461-480`；父失败和失败边见 `test/flow-reference.test.ts:496-515`、`test/flow-reference.test.ts:536-550`；成功输出映射见 `test/flow-reference.test.ts:571-585`；父子恢复见 `test/flow-reference.test.ts:710-725`、`test/flow-reference.test.ts:809-820`。本轮未执行。
