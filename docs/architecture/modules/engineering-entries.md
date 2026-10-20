# 工程入口

## 包与出口

`package.json#exports` 声明 Core SDK 出口 `dist/index.js`、Pi 适配器出口 `dist/pi.js` 和 Extension 出口 `dist/extension.js`；`package.json#pi.extensions` 声明 Pi extension source，`package.json#pi.skills` 声明 bundled skill；`src/index.ts` 只导出 Core SDK-facing modules。

构建配置由 `tsconfig.build.json#compilerOptions` 和 `tsconfig.build.json#include` 定义，只包括 `src/**/*.ts` 并输出 `dist`；开发配置 `tsconfig.json#include` 还包括 test/tools。

## 检查、测试与发布

脚本由 `package.json#scripts.build`、`package.json#scripts.check`、`package.json#scripts.test`、`package.json#scripts.test:vitest`、`package.json#scripts.test:smoke`、`package.json#scripts.test:release`、`package.json#scripts.test:integration` 和 `package.json#scripts.docs:source-index:check` 声明。Vitest 文件选择见 `vitest.config.ts#test.exclude`。Tag workflow 的 `npm ci`、`npm test` 和发布步骤见 `.github/workflows/publish.yml#jobs.publish.steps`。配置不等于本轮验证结果，本轮没有执行上述命令。

`tools/generate-source-index.ts` 与 `tools/source-guide-targets.ts` 管理文档源码定位，不属于 Runtime 执行链。工程模块不改变业务语义，也不以测试文件存在推断测试通过。
