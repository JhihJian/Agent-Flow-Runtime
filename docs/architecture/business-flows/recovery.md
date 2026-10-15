# Run 恢复

## 流程

- **触发者**：SDK/Coordinator 显式调用 `resume`；Pi Extension 在恢复 session 时检索匹配 Run。
- **前置条件**：Run 属于当前 Flow，状态为 running/interrupted；`resumeRun` 始终校验 Flow ID。只有 `historyCompleteness` 为 `complete` 时才比较组合 Flow fingerprint；legacy 历史跳过该比较。Extension 自动恢复还要求 cwd、sessionReference、flowPath 匹配，且根 Run 只能唯一匹配。
- **输入**：Store 中 Run/NodeRun facts、Flow closure、session reference 和 cwd。
- **正常路径**：定位当前访问；Agent 中断先结束原访问，再以 retryOf 创建新 NodeRun；已完成但未路由节点补写 recovery fact 并继续路由；子引用节点依据子 Run 状态续接。
- **分支**：子 Run 只随父 Run 恢复；Extension 自动查询 `listRunningRuns()`，Coordinator 的显式接口接受 running/interrupted；命令和并行命令分支不自动重放。
- **失败/恢复**：Flow ID 不匹配、完整历史 drift、错误状态/位置或 Agent takeover 错误会拒绝或失败；命令中断写入 command_interrupted 和 fail_command recovery，保留原访问事实。
- **后置结果**：继续执行或得到终态 Run，保留 recovery fact 和访问历史。
- **副作用**：JSON Store 读取/写入、Agent session takeover、新 Agent 节点执行；命令中断不重放外部副作用。
- **证据**：`src/runtime.ts#FlowCoordinator.resume`、`src/runtime.ts#FlowCoordinator.resumeRun`、`src/runtime.ts#FlowCoordinator.failInterruptedCommand`、`src/runtime.ts#FlowCoordinator.resumeFlowReferenceNode`、`src/runtime.ts#fingerprintFlow`、`src/extension.ts#resumeFlow`。
- **测试预言机**：Agent 原访问中断、新访问 retryOf 和完成见 `test/correctness.test.ts:536-542`；命令请求数为零、Run failed 和类别见 `test/release-flow-recovery.test.ts:184-192`；子 Run 终态复用与递归恢复见 `test/flow-reference.test.ts:710-725`、`test/flow-reference.test.ts:809-820`；完整历史 drift 拒绝见 `test/flow-reference.test.ts:1097-1102`。本轮未执行。
