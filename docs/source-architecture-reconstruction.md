# Agent-Flow-Runtime 源码架构还原

## 1. 证据基线与口径

本候选文档先以原版本为历史线索，再按当前工作树重新核查；旧扫描中的提交号、dirty 状态、测试结果和文件状态不作为本次事实。

- 仓库：`/data/dev/SUMM/Agent-Flow-Runtime`
- 扫描起点：`main`，HEAD `835a655962cf77e8b6a6f174c0eb223a6cd33e6d`；`origin/main` 为 `4e89a40eb9fdba16f3df8bf580f82c86736cdaf2`，本地领先 1 个提交。扫描开始前工作树干净；本轮完成后唯一 Git 差异为本候选文档。
- 包版本：`package.json` 声明 `0.2.1`。
- 证据标签：**实现事实**指当前源码/配置直接表达的行为；**测试证据**指测试源码中存在相应断言，不代表本次已执行或通过；**文档声明**指 README/设计文档表达的推荐或意图；**推断/风险**指从实现路径推得但尚未由运行结果证明的后果；**待业务确认**指源码不能决定的产品策略。

本次只执行只读检查，没有运行构建、完整测试、发布或 Pi/provider 集成，也没有晋升正式架构基线。本文件是源码候选还原，不替代 `docs/agent-flow-runtime-architecture.md` 等设计文档。

## 2. 范围、排除项与追溯

范围以当前 Git 跟踪文件为准，共 67 个文件（`git ls-files`）。覆盖源码、依赖/编译/格式配置、所有测试和 fixture、发布 workflow、包元数据，以及用于核对设计声明的文档和示例。仓库中没有本地 `AGENTS.md`。

| 范围 | 纳入内容 | 证据入口 |
| --- | --- | --- |
| 核心源码（11） | `src/types.ts`、`variables.ts`、`parser.ts`、`flow-loader.ts`、`directory.ts`、`runtime.ts`、`observability.ts`、`pi.ts`、`extension.ts`、`cli-state.ts`、`index.ts` | 第 3、4 节及对应源码行号 |
| 构建、依赖和质量配置 | `package.json`、`package-lock.json`、`tsconfig.json`、`tsconfig.build.json`、`vitest.config.ts`、`biome.json`、`.github/workflows/publish.yml` | 第 6 节 |
| 测试代码与资源 | `test/*.test.ts`、`test/*.mjs`、`test/fixtures/**` | 第 5、6 节；命令和测试断言分开说明 |
| 开发/产品文档与示例 | `README.md`、`docs/*.md`、`examples/**`、`skills/flow-planning/SKILL.md`、`LICENSE` | 本节及第 6、7 节；只把文档作为意图声明或行为样例，不以文档代替实现证据 |
| 当前核验的生成索引 | `docs/source-index.md`、`tools/generate-source-index.ts`、`tools/source-guide-targets.ts` | 第 6 节；`docs:source-index:check` 只读检查 |

排除项及原因：`node_modules/` 是安装依赖而非仓库源码；`dist/` 是 `npm run build` 产生的发布输出，本次未构建；`.git/` 是版本控制元数据；`.pi/flow-runs.json` 是运行时数据，不是跟踪源码。没有将这些目录计入 67 个跟踪文件。`package-lock.json` 纳入依赖锁定/构建上下文，不逐包推导运行行为。外部 Pi/provider 实际运行、生产部署状态及业务规则不在可由当前仓库静态证据确认的范围。

## 3. 模块职责与依赖方向

### 3.1 模块边界

- **契约和值校验**：`types.ts` 定义 Flow 图、动作、结果、运行记录、事实提交、Store、宿主适配器及观测读模型；`variables.ts` 校验变量名、FlowValue 和声明默认值。类型定义本身不证明运行时校验完整，实际检查分别落在 parser/runtime/host。
- **Flow 解释和装载**：`parser.ts` 将 Markdown/YAML 元信息、Mermaid 图和动作块解析为定义，并验证可达性、模板和声明；`flow-loader.ts` 定位入口、验证引用资源路径和引用闭包；`directory.ts` 发现 Flow 包并按 id 加载。这些模块处理定义和文件，不负责节点调度。
- **执行与持久事实**：`runtime.ts` 包含 `InMemoryRunStore`、`JsonFileRunStore`、`ProcessCommandExecutor`、`AgentRunModel` 和 `FlowCoordinator`。Coordinator 驱动状态迁移、分派动作、路由、恢复和事实提交；Flow 指纹将节点结果说明纳入定义序列化，结果变量契约由 parser 从该说明解析，见第 7 节。
- **读模型和通知**：`observability.ts` 从 Store 投影运行历史、按策略读取节点 evidence，并提供进程内订阅/快照接口；不决定 Flow 路由，也不持久化事件。
- **Pi 宿主接入**：`pi.ts` 适配 Pi SDK/CLI Agent session、结果提交工具和运行查询工具；`extension.ts` 注册宿主命令、flag、事件和工具并装配 Flow 运行组件；`cli-state.ts` 以 `globalThis` 保存扩展进程内状态。
- **出口和开发工具**：`index.ts` 汇总 SDK 公共导出；`tools/*` 维护受控源码定位表并校验 `docs/source-index.md`。

### 3.2 依赖方向

源码 import 形成的主要方向为：

`extension -> cli-state / flow-loader / observability / pi / runtime / variables`

`runtime -> flow-loader / parser / types / variables`

`flow-loader -> parser / types`，`parser -> types / variables`，`observability -> types`，`pi -> types / observability（类型及接口）/ Pi SDK`，`index -> public modules`。

`runtime` 直接使用 parser 的模板渲染及 loader 的资源/FlowPackage 能力；Pi 运行时接入经由 AgentIntegrationAdapter 等边界注入，Coordinator 不直接依赖 Pi SDK。测试通过 fake adapter、command executor、内存 Store 等替代外部行为。证据入口：上述模块 import 与 `src/runtime.ts` 的 Coordinator/Store 实现、`src/extension.ts` 的装配代码。

## 4. 运行链、状态与持久化

### 4.1 主运行链

1. `extension.ts` 收到命令、CLI flag 或启动事件，解析 Flow 路径和变量；`loadFlow` 定位 `FLOW.md`，调用 parser 并装载校验资源和子 Flow 引用闭包。
2. Extension 为当前工作目录创建 `.pi/flow-runs.json` Store、Publisher、Inspector 和 Coordinator。`FlowCoordinator.run` 校验/初始化变量，计算 Flow 指纹，写入初始 Run，再从起点进入执行循环。
3. 每次节点访问创建 NodeRun。Agent 动作交由 `AgentRunModel` 和宿主 adapter；命令动作交给注入的 executor 或 `ProcessCommandExecutor`；Flow 引用动作在同一 Store/执行设施下创建带父子关联的子 Run。
4. Coordinator 校验动作结果和变量，追加节点、路由、并行或恢复事实，推进 Run 游标。并行分支执行后汇合输入和变量；分支同名变量写入会冲突失败。完成或失败后写终态事实。
5. 成功提交后发布观测事件；Inspector 从持久事实构建历史视图。Pi adapter 将宿主会话结果与 Flow 结果工具交接，并让扩展观察运行状态。

以上为实现链，不表示产品文档中的所有工作流样例都在当前发布门禁执行。

### 4.2 状态与持久化模型

**实现事实**：Run 保存当前状态/阶段、游标、变量、Flow 版本、sequence、会话及父子关联；NodeRun 保存节点访问及其输入、结果、错误、命令输出和 session 引用；RouteDecision、ParallelRound、RunRecovery 分别记录路由、并行轮次与恢复历史。Store 的 `commit` 使用 expected sequence 检查并提交事实；Coordinator 在提交后更新运行副本并发布事件。

`JsonFileRunStore` 将这些 Map 序列化为一个完整 JSON 快照，经临时文件和 rename 替换目标文件。源码注释明确标记该实现为 single-process；写操作队列属于 Store 实例内。源码没有跨进程文件锁、读后 CAS 或共享并发协调。

**推断/风险**：两个独立 Store/进程同时写一个快照文件时，可能以旧快照覆盖另一方事实；是否构成业务缺陷取决于同一工作目录是否承诺多进程并发。

恢复方面，Coordinator 的 `resume` 接受 `running` 与 `interrupted`。未完成 Agent 工作会创建新的 NodeRun 重试；中断的命令不会自动重放，而转为失败路径；子 Run 不能直接恢复，由父 Run 续接。Pi extension 的自动发现路径调用 `listRunningRuns()`，该查询仅筛 `running`，所以 interrupted 不会由此自动选中。

### 4.3 观测与证据

Publisher 是进程内 best-effort 发布器，不是事件日志或 Store。`openRunObservation` 先订阅并缓存竞态窗口事件，再读取快照并过滤不晚于快照 sequence 的事件。

Inspector 的 RunSummary 隐去 Run 级 globals，但完整历史仍包括节点输入及 ParallelRound 的输入、outcome 和变量 patches；evidence 可包含节点 input/outcome、Agent 消息或命令输出。因此“运行摘要不含 globals”不等价于“观测数据不含业务变量”。`authorizeEvidence` 未配置时默认放行，授权策略需由宿主显式传入。

## 5. 测试证据与覆盖边界

测试源文件为 14 个：`adapter-contract.test.ts`、`correctness.test.ts`、`extension-session-replacement.test.ts`、`flow-package.test.ts`、`flow-reference.test.ts`、`parser.test.ts`、`release-flow-conflict.test.ts`、`release-flow-recovery.test.ts`、`release-flow-smoke.test.ts`、`runtime.test.ts`、`source-index.test.ts`、`variables.test.ts`、`runtime-smoke.mjs`、`pi-sdk-smoke.mjs`。fixture 位于 `test/fixtures/**`，由测试加载，不视为独立测试文件。

**测试断言存在（本次未运行）**：

- parser/variables：语法、模板、结果变量声明及非法输入（`parser.test.ts`、`variables.test.ts`）。
- runtime/contract：Agent、命令、路由、并行、恢复、Store、adapter 合约（`runtime.test.ts`、`correctness.test.ts`、`runtime-smoke.mjs`、`adapter-contract.test.ts`）。
- 包和引用：资源路径/逃逸、Flow 引用闭包、子 Flow、崩溃窗口恢复与指纹变化（`flow-package.test.ts`、`flow-reference.test.ts`）。
- Pi extension：session 替换、compact 门禁、settle 时机及完成通知（`extension-session-replacement.test.ts`）。
- release smoke：父子 Flow、持久化恢复和并行变量冲突（3 个 `release-flow-*.test.ts`）。
- SDK 集成：真实 Pi SDK session 创建/接管的检查脚本（`pi-sdk-smoke.mjs`）；不等同于真实 provider/model 集成。

**测试缺口/边界**：测试文件存在并不代表本次通过；当前没有本轮完整执行结果。Store 跨进程并发、命令超时/输出预算、默认 evidence 授权边界、session_start 自动恢复 interrupted 等行为没有由已查到的直接测试断言确立。`flow-reference.test.ts` 覆盖子 Flow 描述变化导致恢复拒绝，但没有专门断言结果变量声明变化对指纹的影响；当前 parser 将结果变量声明从结果说明文本解析，而该文本本身已纳入指纹（见第 7 节），所以这是测试覆盖的直接性缺口，不构成已证实的运行时漂移。

## 6. 配置、构建与发布入口

### 6.1 脚本间关系

`package.json` 定义：

- `check`：Biome、`tsc --noEmit`、source-index check。
- `build`：`tsc -p tsconfig.build.json`，输出 `dist`。
- `test`：source-index check、build、Node test runner 显式执行 6 个文件：`runtime-smoke.mjs`、`flow-package.test.ts`、`source-index.test.ts`、`correctness.test.ts`、`extension-session-replacement.test.ts`、`flow-reference.test.ts`。
- `test:vitest`：Vitest 默认发现，`vitest.config.ts` 排除上述 Node 主套件中的 5 个 `.test.ts` 文件（不含 mjs）。当前余下 Vitest 文件是 adapter-contract、parser、runtime、variables 及 3 个 release-flow 测试，共 7 个。
- `test:smoke`：显式执行 3 个 release-flow 测试。
- `test:release`：依次运行 check、build、test:smoke、test。
- `test:integration`：build 后执行 `pi-sdk-smoke.mjs`。

所以 `test:release` 和 `npm test` 均不执行 adapter-contract、parser、runtime、variables 这 4 个 Vitest 文件；Vitest 默认入口覆盖它们，但未包含于推荐 release 脚本。`test:smoke` 的 3 个文件由 `test:release` 执行，但不属于 `npm test`。

### 6.2 发布和质量配置

- `tsconfig.json` 启用 strict，涵盖 src/test/tools；`tsconfig.build.json` 仅构建 src。`biome.json` 配置 formatter/linter 并排除 dist、`.pi` 和依赖目录。
- `.github/workflows/publish.yml` 在 `v*` tag push 时使用 Node 22，运行 `npm ci`、`npm test` 后发布。Workflow 并未调用 `test:release`、`check`、`test:smoke` 或 `test:integration`。因 `npm test` 内含 build 和 source-index check，CI 仍构建但不做 Biome/完整 TypeScript check，也不跑 smoke。
- **文档声明**：README 与 `docs/release-smoke-design.md` 将 `npm run test:release` 描述为发布前唯一推荐入口；与之不同，当前 tag workflow 执行 `npm test`。文档声明不能替代 workflow 实际配置。
- `docs/source-index.md` 由 `tools/generate-source-index.ts` 对照 `tools/source-guide-targets.ts` 管理。本次执行 `npm run docs:source-index:check`，通过；另执行 `git diff --check`，通过。没有执行会写生成文件的 `docs:source-index`，也没有构建或测试。

## 7. 实现边界、风险与待确认事项

### 7.1 Flow 指纹与结果变量契约

**实现事实**：`fingerprintFlow` 没有单独序列化 `node.resultVariables` 字段，但当前 parser 在 `src/parser.ts:414-419` 将完整结果说明文本存入 `node.results`，并从同一文本解析 `resultVariables`；`src/runtime.ts:2102-2108` 将 `node.results` 的条目纳入指纹。因此，通过当前 Markdown/parser 路径修改结果变量声明时，源结果说明文本也会变化并进入指纹。`src/types.ts:56` 中结果变量声明只包含 `description`，没有默认值字段。现有证据不支持“结果变量契约变化但 Flow 指纹不变”这一缺陷结论，也没有发现可复现的语义漂移场景。

`test/flow-reference.test.ts:1061-1103` 验证子 Flow 描述变化后恢复因组合指纹不匹配而拒绝；它没有专门断言结果变量声明变化的指纹行为。可以补充该用例提高覆盖直接性，但不应将缺少独立序列化字段或测试用例表述为已证实的运行时缺陷。本轮未运行复现测试。

### 7.2 实现风险与覆盖不足

- **发布检查范围不一致**：已证实的配置事实是 release 推荐入口包含 4 个未由该入口运行的 Vitest 文件，GitHub tag 发布使用更窄的 `npm test`。这是门禁覆盖差异；是否作为产品缺陷取决于项目对推荐命令和 CI 的约定。README/设计文档的推荐与 workflow 不一致。
- **JSON Store 并发**：源码明确 single-process，多个实例/进程无协同。并发覆盖是基于写快照实现的风险推断，不能据此断言业务必须支持并发。
- **自动恢复范围**：Coordinator 支持 interrupted，但 extension 自动扫描只列 running。行为已由实现直接证明；是否应自动恢复 interrupted 是策略选择。
- **命令执行预算**：`ProcessCommandExecutor` spawn 命令并累积完整 stdout/stderr，没有源码层超时或输出上限。长时间挂起/大量输出会造成资源风险；运行环境是否要求限制尚无仓库证据。
- **Evidence 可见性**：默认授权器放行，History/evidence 中有输入和输出；此为实现事实。哪些宿主或用户可访问、应采用何种脱敏/授权由业务安全策略确认。
- **外部集成**：源码适配 Pi SDK/CLI，存在 SDK session smoke；本次未运行该集成脚本，也没有真实 provider/model 证据。

### 7.3 待业务确认

1. 同一 `.pi/flow-runs.json` 是否承诺多 Pi 进程/多 Store 并发写入？
2. interrupted Run 是否应由 `session_start` 自动发现恢复，还是保留仅显式恢复？
3. 命令是否允许无限运行和无限输出，是否需要取消、超时与容量预算？
4. evidence 中的节点输入、变量、Agent 消息和命令输出由哪些主体读取，是否需要默认拒绝或脱敏？
5. GitHub tag 发布是否应执行 README 推荐的 `test:release`，以及推荐发布门禁是否必须覆盖 4 个额外 Vitest 文件？
6. Pi SDK session smoke 是否足够，还是发布需要真实 Pi/provider 验证？

## 8. 历史候选结论的处理记录

- 更新核查记录：扫描起点 HEAD 为 `835a655…`，当时工作树干净；文档更新后唯一 Git 差异是本候选文档。仅 source-index check 与最终 diff check 实际执行并通过。
- 修正测试关系：`adapter-contract.test.ts` 不会被 `npm test` 间接执行；它属于 Vitest 集合。Vitest 排除列表包含 Node 主套件的 5 个 TypeScript 测试，不是完整覆盖所有测试的替代入口。
- 修正发布描述：GitHub workflow 执行 `npm test`，而非 `test:release`；发布 smoke 目前只由 `test:smoke` 和 `test:release` 调用链执行。
- 不再将 Flow 指纹未单独序列化 `node.resultVariables` 判为缺陷：parser 从结果说明文本解析该字段，指纹已纳入完整结果说明文本；目前没有证据证明经 parser 修改结果变量契约会绕过版本检查。补充记录了结果变量指纹行为缺少专门测试断言这一覆盖边界，并指出结果变量类型不含默认值字段。收紧观测安全表述，指出默认 evidence authorizer 放行且历史包含运行输入/输出。
- JSON Store 并发、interrupted 自动恢复、命令预算等由确定的代码边界导出的风险保留为风险/待确认，不冒充已确认的业务缺陷。
- 本文不逐条复述 67 个文件的所有局部测试细节。范围按第 2 节列出并以目录/脚本追溯；关键架构和测试行为均给出模块路径，局部证明回链源码或测试文件。未读取到的文件或运行行为不宣称已验证。

## 9. 当前交付状态

本候选文档仅按当前工作树更新。核查证据为：HEAD、分支和扫描开始前工作树状态来自 Git；最终唯一 Git 差异是本候选文档；脚本及依赖边界来自当前 package/config/workflow；`npm run docs:source-index:check` 与最终 `git diff --check` 均通过。测试、构建、Pi/provider 集成未在本轮运行。未修改代码、其他文档或正式架构基线。