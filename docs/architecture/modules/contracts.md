# 契约与值校验

## 边界

本模块定义跨 parser、runtime、host 和 observation 的 TypeScript 协议，并校验可持久化 Flow 值与变量名。它不解析 Markdown、不迁移 Run 状态，也不决定业务策略。

## 能力与实体

`src/types.ts#FlowValue`、`src/types.ts#FlowDefinition`、`src/types.ts#FlowPackage`、`src/types.ts#AgentExecutionContext`、`src/types.ts#AgentIntegrationAdapter`、`src/types.ts#CommandExecutor`、`src/types.ts#RunStore` 定义 Flow、动作、宿主适配器、执行器、Store、Run facts、history、evidence 和 observation contracts。`AgentExecutionContext` 只提供 Flow 和节点身份，不包含 Profile、工具或 Skill 语义。

`src/variables.ts#validateVariableName`、`src/variables.ts#validateFlowValue`、`src/variables.ts#validateVariables`、`src/variables.ts#validateVariableDeclarations` 校验变量名、JSON value、变量对象及声明；拒绝原型敏感名称、非有限数字、循环引用及未知声明字段。

## 依赖、状态与规则

其他模块依赖这里的类型边界；本模块本身不依赖宿主实现。Run、Node、Parallel status 与 error category 是显式 union，Run fact sequence 和 parent linkage 由结构表达。类型不替代运行时校验：Parser、Coordinator、Pi tool 分别承担输入边界验证。

## 权限和不实现范围

本模块不作访问授权；evidence authorizer 位于 Inspector options，实际默认行为见 `src/observability.ts#FlowRunInspector`。类型不能证明数据库并发、安全策略或模型输出正确。

## 代码映射

代码入口为 `src/types.ts`、`src/variables.ts`。变量直接断言见 `test/variables.test.ts:91-96`、`test/variables.test.ts:104-119`、`test/variables.test.ts:126-136`、`test/variables.test.ts:149-153`；其余契约行为无本次核对的直接测试断言。本轮未执行。
