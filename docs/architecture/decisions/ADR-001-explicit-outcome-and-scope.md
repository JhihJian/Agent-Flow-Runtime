# ADR-001：显式结果和变量作用域

## 状态

已实现。

## 决策

节点只能通过结构化结果提交进入流程控制。结果名选择当前节点的结果边；变量必须出现在 Flow 全局声明或当前结果的变量表中。全局变量写入当前 Run，其他已声明变量只传给实际下一节点。并行分支变量按分支引用隔离，汇合节点显式读取。

## 影响

这种边界使 Agent 自然语言不直接成为路由信号，也避免未声明数据隐式扩散到后续节点。循环、返工和子 Flow 都必须通过显式输入和输出建立数据关系。

## 证据

`src/definition/parser.ts` 校验结果边、变量表和模板作用域；`src/execution/runtime.ts` 的 `initializeVariables`、`validateOutcomeVariables`、`extractNextInput` 和 `mergeParallelVariables` 执行运行时约束；`src/pi/adapter.ts` 提供 `submit_flow_outcome`。
