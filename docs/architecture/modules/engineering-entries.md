# 工程入口模块

## 包和公共出口

`package.json`声明包名 `@jhihjian/agent-flow-runtime`、Node `>=22.19.0`、公共 SDK 入口 `dist/index.js`，并通过 `pi.extensions` 暴露 `src/extension.ts`，通过 `pi.skills`暴露 Flow planning Skill。`src/index.ts`重导出目录、装载、解析、Pi、Runtime、观测和类型能力。

## 源码阅读入口

`tools/source-guide-targets.ts`登记关键控制流目标，`tools/generate-source-index.ts`使用 ts-morph 从 tsconfig 定位源码行并检查 `docs/source-index.md` 和源码阅读图。该工具是文档追溯入口，不是运行时组件。

## 质量和发布入口

当前脚本关系如下：

- `npm run check`：Biome、TypeScript noEmit、源码索引检查。
- `npm run build`：只编译 `src` 到 `dist`。
- `npm test`：源码索引检查、构建和一组显式 Node test 文件。
- `npm run test:vitest`：Vitest 默认集合。
- `npm run test:smoke`：release Flow 的三组冒烟测试。
- `npm run test:release`：check、build、smoke 和 npm test 的串联入口。
- `npm run test:integration`：构建后执行 Pi SDK session smoke。

GitHub tag 发布 workflow 当前执行 `npm ci`、`npm test` 后发布，没有调用 `check`、`test:smoke`、`test:release` 或 `test:integration`。这些是配置事实，不代表本次已执行验证。

## 不实现范围

工程入口不改变 Runtime 语义，不替代架构文档的来源映射，也不因测试文件存在就证明对应行为在本次运行中通过。

## 主要证据

- [package.json](../../package.json)
- [index.ts](../../src/index.ts)
- [source-guide-targets.ts](../../tools/source-guide-targets.ts)
- [generate-source-index.ts](../../tools/generate-source-index.ts)
- [publish.yml](../../.github/workflows/publish.yml)
- [docs/README.md](../../README.md)
