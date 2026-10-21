# 架构基线审计摘要

架构基线以当前源码、配置和测试定位为依据，区分实现事实、结构归纳与待确认事项。顶层架构提供系统边界和不变量；业务流、模块、术语、决策及来源映射提供分层细节。

## 复核范围

- `src/contracts/types.ts`、`src/contracts/variables.ts`、`src/definition/parser.ts`、`src/definition/flow-loader.ts`、`src/definition/directory.ts`
- `src/execution/runtime.ts`、`src/execution/agent.ts`、`src/observability/index.ts`、`src/pi/adapter.ts`、`src/pi/extension.ts`、`src/pi/cli-state.ts`
- `package.json`、TypeScript 配置、源码索引工具及发布 workflow

架构结论及其源码、配置和测试定位见[来源映射](source-map.md)。测试文件中的断言定位不代表测试已经执行或通过。

## 待确认边界

- `JsonFileRunStore` 没有跨进程协调，多进程并发要求由部署策略决定。
- 命令执行没有超时、取消或输出预算，资源限制由运行环境和安全策略决定。
- evidence 默认授权器放行，访问授权与脱敏策略由宿主决定。
- 自动恢复只扫描 `running` Run，`interrupted` 的自动恢复策略由产品行为决定。