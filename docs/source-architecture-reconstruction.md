# Agent-Flow-Runtime 源码架构还原

## 1. 证据与版本

扫描根目录：`/data/dev/SUMM/Agent-Flow-Runtime`。

扫描基线：分支 `main`，提交 `43d7914e8bda77d11613c5a5f887e037fa86efd3`，包版本 `0.2.1`。当前工作树为 dirty，未提交的发布冒烟测试、fixture、文档和源码改动按当前树纳入观察，但不归因于该提交。

证据等级：源码和配置证明当前实现；实际执行且通过的测试只证明其断言覆盖的行为；目录、命名、注释和旧文档只作线索；没有直接证据的结论标为推断或待业务确认。

覆盖范围：67 个可读项目文件，逐文件记录见第 2 节。`dist/` 64 个构建产物、`node_modules/` 16,061 个依赖文件、`.pi/flow-runs.json` 1 个运行状态文件、`.git/` 898 个 Git 元数据文件，以及依赖目录内 20 个符号链接明确排除。项目范围内没有不可读文件、二进制资源或符号链接。

验证命令结果：`npm run test:smoke` 通过，3 个文件 5 个测试通过；`git diff --check` 通过。`npm run check` 和 `npm test` 均在 `docs:source-index:check` 阶段失败，原因是现有源码阅读资料与当前源码位置不同步，错误来自 `tools/generate-source-index.ts:153-166`，不是 TypeScript 编译错误。未运行真实 Pi/provider 集成测试。

## 2. 逐文件证据清单

记录格式：路径；类别和状态；关键定位；直接观察到的职责、输入、输出或副作用；调用线索；测试覆盖；不确定项。

### 根目录与 CI

- `biome.json`；配置/构建，纳入。`files.includes` 排除 `dist`、`.pi`、`node_modules`，启用 formatter/linter。被 `package.json:52` 的 `npm run check` 调用。没有独立测试。
- `.gitignore`；配置，纳入。直接排除 `dist/`、`node_modules/`、`.pi/`、`core`。是扫描排除规则的直接依据。
- `package.json`；配置/构建，纳入。`scripts` 定义 build、check、source-index、test、smoke、release、integration；`main/exports` 指向 `dist`；Pi 扩展和 Skill 入口在 `pi` 字段。没有测试其脚本清单完整性的断言。
- `package-lock.json`；配置/依赖锁定，纳入。锁定 Node/npm 依赖解析结果。由 CI `npm ci` 使用，没有语义测试。
- `tsconfig.json`；配置/构建，纳入。NodeNext、strict、声明文件、source map，包含 `src`、`test`、`tools`。被 TypeScript 和 source-index 工具读取。
- `tsconfig.build.json`；配置/构建，纳入。只构建 `src/**/*.ts` 到 `dist`，`rootDir` 为 `src`。被 `npm run build` 使用。
- `vitest.config.ts`；配置/测试入口，纳入。Node 环境、单 worker，并明确排除 correctness、extension、flow-package、flow-reference、source-index。被 `test:vitest` 使用；没有测试确保排除项仍被其他入口覆盖。
- `.github/workflows/publish.yml`；配置/构建 CI，纳入。tag push 触发，Node 22，`npm ci`、`npm test`、发布。未覆盖 `npm run check`、`test:smoke` 或 integration。
- `LICENSE`；文档/元数据，纳入。MIT 授权文本，无运行时行为。
- `README.md`；文档，纳入。描述安装、命令、变量、运行记录和测试命令；这些是待源码核对的声明，不单独作为事实。实现主线可回链 `src/flow-loader.ts`、`src/runtime.ts`、`src/extension.ts`。

### `src/` 实现

- `src/types.ts:1-534`；实现/契约，纳入。定义 Flow 值、动作、节点图、Agent/命令适配器、Run/NodeRun/Route/Parallel/Recovery 事实、Store、观测事件和 SDK 读模型接口。被全部核心模块导入；类型本身无运行时断言，实际约束由 parser、variables、runtime、pi 分别执行。测试覆盖主要接口路径，未覆盖所有字段组合。
- `src/variables.ts:1-67`；实现，纳入。`validateVariableName` 拒绝非法和原型污染名称；`validateFlowValue` 校验可持久化 JSON 值、循环和有限数字；`validateVariables` 与 `validateVariableDeclarations` 校验运行变量和元信息声明。被 parser、runtime、extension 调用；`test/parser.test.ts:110-232`、`test/variables.test.ts:85-158` 覆盖主要非法值和默认值。
- `src/parser.ts:46-121`、`:158-464`、`:665-884`；实现，纳入。读取 YAML 元信息、单 Mermaid TD 图、节点动作代码块、结果说明和结果变量表，建立 successors/parallels；校验起点、终点、可达性、并行命令分支、Flow 引用和模板作用域；`renderTemplate`、`renderCommandRequest` 保留结构化单引用并把嵌入值转文本。输入是 Markdown 和模板上下文，输出 `FlowDefinition` 或 `FlowSyntaxError`，无文件副作用。被 `flow-loader`、`runtime` 调用；`test/parser.test.ts`、`test/flow-reference.test.ts`、`test/variables.test.ts` 覆盖较广。未覆盖所有 Mermaid 语法和异常编码输入。
- `src/flow-loader.ts:24-223`；实现，纳入。接受目录或固定 `FLOW.md`，解析并校验 references/scripts 资源，限制路径在包根内，递归构建兄弟 Flow 引用闭包并检测环；输出 `LoadedFlow`。读取文件和 realpath/stat，有路径校验副作用但不写文件。被 extension、directory 调用；`test/flow-package.test.ts`、`test/flow-reference.test.ts` 覆盖入口、资源、符号链接逃逸、闭包和环。
- `src/directory.ts:6-68`；实现，纳入。递归扫描目录下含 `FLOW.md` 的子目录，跳过 `references`/`scripts`，按 Flow id 排序并拒绝重复 id；`load` 按 id 加载。只读目录。`test/runtime-smoke.mjs:102-134` 覆盖普通和嵌套发现；没有重复 id 测试。
- `src/runtime.ts:64-434`；实现，纳入。`InMemoryRunStore` 保存并克隆运行事实；`JsonFileRunStore` 用实例内 Promise 队列、临时文件和 rename 持久化；`ProcessCommandExecutor` spawn 外部命令并收集 stdout/stderr/exitCode；`AgentRunModel` 管理 Agent 绑定和单次结果提交。副作用包括进程执行、文件写入、Agent 创建/释放。被 coordinator、extension、SDK 使用；`test/correctness.test.ts:159-864`、`test/runtime.test.ts:116-244`、smoke/release tests 覆盖主要路径。
- `src/runtime.ts:543-2294`；实现，纳入。`FlowCoordinator` 初始化变量和指纹，创建/恢复 Run，逐节点执行 Agent、命令和子 Flow，记录 NodeRun、路由、并行轮次、恢复事实，合并变量并发布观测。其 `commit` 以 Run sequence 串行化单实例写入；命令非零退出仍可作为业务节点完成，命令中断不自动重放，Agent 中断创建 retry NodeRun。被 extension 和测试直接调用；普通、循环、并行、恢复、子 Flow、冲突、事件和持久化均有测试。发现 `fingerprintFlow` 未包含 `node.resultVariables`，见第 4 节。
- `src/observability.ts:26-315`；实现，纳入。`FlowObservationPublisher` 为进程内 best-effort 订阅发布器；`FlowRunInspector` 从 Store 投影 Run history 和按权限读取节点 evidence；`FlowRuntime` 统一查询/订阅，并在注册订阅后缓冲快照竞态；格式化历史和事件信封。副作用仅监听器回调。`test/correctness.test.ts:532-864` 覆盖投影、权限、事件异常、快照竞态和排序；没有跨进程事件持久化测试。
- `src/pi.ts:1-603`；实现，纳入。`PiAgentIntegrationAdapter` 对接 Pi SDK 或 CLI bridge，创建/接管/释放 Session，提供 `submit_flow_outcome` 和 `inspect_flow_run` 工具；CLI 结果先缓存候选，`agent_settled` 后确认，缺结果最多重试一次；SDK 以 session file 定位并发节点。副作用包括 Pi session、消息发送和工具调用。`test/adapter-contract.test.ts`、`test/correctness.test.ts:189-284`、`test/runtime-smoke.mjs:417-577` 覆盖适配器边界；`test/pi-sdk-smoke.mjs` 只在构建后验证 SDK session 创建/接管，未纳入默认 npm test。
- `src/extension.ts:37-618`；实现，纳入。注册 Pi flags/tools/commands/events；解析 CLI 变量，加载 Flow，构造 JSON Store、Runtime、Coordinator，启动和恢复 Flow；处理新会话切换、模型恢复、观测发送、compact 门禁和 session 生命周期。副作用包括 `.pi/flow-runs.json` 写入、Pi 消息和 UI 通知。`test/extension-session-replacement.test.ts:12-205` 覆盖会话替换和旧上下文隔离；自动恢复的 interrupted 状态路径没有直接测试。
- `src/cli-state.ts:15-52`；实现，纳入。通过 `globalThis` 保存单进程 CLI 状态、当前 adapter/runtime/context、活动 Run 和待会话替换 Promise；提供初始化和拒绝待替换会话。被 extension 使用；会话替换测试间接覆盖，跨 extension 实例隔离未测试。
- `src/index.ts:1-7`；实现/公共出口，纳入。重导出 directory、loader、observability、parser、pi、runtime、types。无逻辑副作用；没有专门测试所有 export 名称。

### `tools/` 构建辅助

- `tools/generate-source-index.ts:20-252`；配置/构建辅助实现，纳入。用 ts-morph 按 tsconfig 定位受控关键函数，生成阅读图源码位置和 `docs/source-index.md`，`--check` 比较生成结果。`test/source-index.test.ts:13-91` 覆盖位置、受控区块、Mermaid、登记表和模块索引；当前 `npm run check` 在此工具的过期检查失败。
- `tools/source-guide-targets.ts:1-82`；配置/构建辅助，纳入。声明 9 个受控关键函数/方法及其文件定位，供生成器使用。由上一个工具读取；测试断言目标数量为 9。

### `test/` 测试与测试资源

- `test/parser.test.ts:110-442`；测试，纳入。实际断言变量声明/结果变量表、模板作用域、结构化渲染、并行分支引用和显式子 Flow 输入，主要调用 `parseFlow`、`renderTemplate`、`renderCommandRequest`。未被 `npm test` 的显式 Node test 文件列表直接执行。
- `test/runtime.test.ts:116-244`；测试，纳入。实际断言普通 Agent、门禁循环、中断 Agent 恢复、并行命令和独立 NodeRun。使用 FakeAdapter/FakeCommandExecutor。未被默认 `npm test` 直接执行。
- `test/variables.test.ts:85-158`；测试，纳入。实际断言未声明/非法启动变量、必填和默认值、文本/结构化渲染及命令变量传递。未被默认 `npm test` 直接执行。
- `test/adapter-contract.test.ts:10-80`；测试，纳入。实际断言 AgentRunModel 拒绝未声明结果、保留 interaction reference 并读取证据。被默认 `npm test` 间接包含在 correctness 之外的 Vitest 集合，未在 npm test 显式列表中。
- `test/correctness.test.ts:159-882`；测试，纳入。实际断言 cwd 传递、Pi 会话结果路由、事实序列/指纹/路由、命令非零退出、失败终结、恢复、JSON Store、Inspector、事件发布/异常隔离、持久化后发布和近期运行排序。被 `npm test` 显式执行。
- `test/extension-session-replacement.test.ts:12-205`；测试，纳入。实际断言新会话切换时旧 context 不再访问、谱系 custom entry、compact 门禁、Agent settle 时机和完成通知。被 npm test 显式执行。
- `test/flow-package.test.ts:65-293`；测试，纳入。实际断言目录包 id、资源路径重写、业务 cwd、入口命名、空资源包、缺失资源和外部符号链接拒绝。被 npm test 显式执行。
- `test/flow-reference.test.ts:437-1270`；测试，纳入。实际断言子 Flow 成功/失败映射、显式输入、父子 Agent 隔离、崩溃窗口恢复、父子中断、闭包/环/缺失引用、组合指纹漂移、非法引用写法和嵌套 input。被 npm test 显式执行。
- `test/runtime-smoke.mjs:83-577`；测试，纳入。构建后通过 Node test 验证 FlowDirectory、普通/循环/并行运行、恢复 checkpoint、并行复用、中断命令不重放、Agent contract、CLI 新会话和缺结果重试。被 npm test 显式执行。
- `test/pi-sdk-smoke.mjs:1-34`；测试，纳入。构建后创建真实 Pi SDK session、释放并以 sessionReference 接管。只由 `npm run test:integration` 调用，当前未执行。
- `test/release-flow-smoke.test.ts:78-193`；测试，纳入且当前未跟踪。使用 release fixture、Fake Agent、ProcessCommandExecutor 和 JsonFileRunStore 验证变量覆盖、并行、子 Flow、持久化快照。`npm run test:smoke` 通过。
- `test/release-flow-recovery.test.ts:113-194`；测试，纳入且当前未跟踪。验证 JSON 快照中的 Agent 恢复和中断命令不重放。`npm run test:smoke` 通过。
- `test/release-flow-conflict.test.ts:34-81`；测试，纳入且当前未跟踪。验证并行分支写同名变量时无论值是否相同都确定性失败并保留各分支事实。`npm run test:smoke` 通过。
- `test/fixtures/command-parallel/FLOW.md`；测试资源，纳入。被 runtime smoke、runtime/correctness 使用，提供 Agent 后并行 test/lint 命令汇合场景。资源本身无独立断言文件。
- `test/fixtures/gate-loop/FLOW.md`；测试资源，纳入。提供 review 自循环和通过出口，被 runtime smoke/runtime test 使用。
- `test/fixtures/ordinary/FLOW.md`；测试资源，纳入。提供 analyze 到 finishNode 的普通 Agent 路径，被多个恢复、事件、持久化测试使用。
- `test/fixtures/release-smoke/child-flow/FLOW.md`；测试资源，纳入且未跟踪。release 资源文件，当前未见测试直接引用该目录，属于待确认的新增 fixture。
- `test/fixtures/release-smoke/conflict-flow/FLOW.md`；测试资源，纳入且未跟踪。被 conflict smoke 用于并行同名变量冲突。
- `test/fixtures/release-smoke/parent-flow/FLOW.md`；测试资源，纳入且未跟踪。被完整 release smoke 加载，串联变量、并行和子 Flow。
- `test/fixtures/release-smoke/parent-flow/scripts/check.mjs`；测试资源/脚本，纳入且未跟踪。被 parent Flow 的命令节点作为资源脚本执行；由 smoke 间接验证。
- `test/fixtures/release-smoke/recovery-agent/FLOW.md`；测试资源，纳入且未跟踪。被 recovery smoke 用于 Agent 恢复。
- `test/fixtures/release-smoke/recovery-command/FLOW.md`；测试资源，纳入且未跟踪。被 recovery smoke 用于中断命令失败。

## 3. 模块聚合与依赖边界

### 3.1 静态层次

1. **值与契约层**：`types.ts`、`variables.ts`。定义可持久化值、Flow 图、Run 事实和宿主适配器边界。
2. **解释与包加载层**：`parser.ts`、`flow-loader.ts`、`directory.ts`。把 Markdown 包转换为已校验图，解析资源和引用闭包，不执行节点。
3. **执行与事实层**：`runtime.ts`。以 `FlowCoordinator` 驱动状态迁移，以 Store 保存事实，以 AgentRunModel 和 CommandExecutor 执行动作。
4. **观测层**：`observability.ts`。从 Store 投影历史并发布进程内事件，不参与路由和状态写入。
5. **宿主适配层**：`pi.ts`、`extension.ts`、`cli-state.ts`。把 runtime 接到 Pi SDK/CLI 生命周期、Session、工具、命令和 UI。
6. **公共出口与开发工具层**：`index.ts`、`tools/*`。导出 SDK，并生成源码索引/阅读图。

### 3.2 主要依赖方向

`extension -> flow-loader/parser -> runtime -> types/variables`；`runtime -> parser/flow-loader` 仅使用模板、资源重写和 FlowPackage 类型；`runtime -> pi` 通过 `AgentIntegrationAdapter` 反向注入，不直接依赖 Pi SDK；`observability -> types/RunStore`；`index -> public modules`。测试主要从 `parser`、`runtime`、`flow-loader` 和 `pi` 边界注入 Fake 实现。

### 3.3 事实存储模型

Run 是当前游标和元数据，NodeRun、RouteDecision、ParallelRound、RunRecovery 是追加式历史事实。`sequence` 是单个 Store 实例内的提交水位；`JsonFileRunStore` 将所有 Map 整体序列化为一个 JSON 文件并原子 rename。观测事件在提交成功后生成，`FlowRuntime.openRunObservation` 先订阅再取快照，按序列过滤快照水位以前事件。

## 4. 业务可观察流程

以下是源码直接支持的运行链，不把它解释为未验证的产品意图。

1. Pi extension 从 `/flow run`、配置 flag 或普通 input 获取路径和变量，`extension.ts:244-306, 420-498` 解析 JSON 文件、`--var` 和自由文本。
2. `loadFlow` 在 `flow-loader.ts:24-108` 定位 `FLOW.md`，`parseFlow` 在 `parser.ts:59-121` 生成并校验图；引用包在包根上一级按目录 id 加载并形成闭包。
3. `FlowCoordinator.run` 在 `runtime.ts:588-639` 初始化全局变量、生成组合指纹、创建 running Run，并从 start 节点进入 `continueRun`。
4. Agent 节点由 `AgentRunModel` 调用适配器，命令节点由 `ProcessCommandExecutor` 或注入 executor 执行，Flow 引用节点创建带 parentRun/parentNodeRun 的子 Run。动作结果先经过结果名和变量声明校验，再写 NodeRun。
5. 普通路由由 `destination` 和 `selectRoute` 记录；并行入口建立 `ParallelRound`，分支仅允许命令节点，完成后汇合命令读取 `{branch.<ref>.<name>}`，变量按分支合并且同名写入失败。
6. finish 触发 Run completed；异常终结 NodeRun/Run 并记录 `FlowError`。Agent 中断可在既有 Session 上创建 retry NodeRun，命令中断被标为不可安全自动重试。
7. 每次成功 commit 后发布事件；Inspector 从持久化事实生成不含内部变量的历史投影，节点 evidence 可经授权读取 Agent 消息或命令输出。
8. Pi CLI 的 Agent 结果由工具写入候选，`agent_settled` 后才提交给 Coordinator；session_start 可恢复符合 cwd、sessionReference 且被查询为 running 的父 Run。

## 5. 已证实不足、实现风险与改进

### 已证实缺陷

- **Flow 版本指纹遗漏结果变量契约。** `src/runtime.ts:2097-2111` 的 `fingerprintFlow` 收录动作、结果名、后继、并行和全局变量，但未收录 `node.resultVariables`；该字段由 `src/parser.ts:59-121, 304-404` 解析，并由 `src/runtime.ts:1435-1448` 用于变量校验和下一跳输入。只修改结果变量表时，恢复检查仍可能通过，旧 Run 会用新变量契约继续。现有 `test/flow-reference.test.ts:1061-1103` 只验证子 Flow 描述变化，未验证结果变量表变化。改进：把每个结果的变量声明及描述纳入指纹，并增加暂停后修改变量名、删除变量表、修改默认值的恢复拒绝测试。

- **推荐发布入口没有执行核心 Vitest 测试。** `package.json:51-54` 的 `npm test` 显式执行 Node test 文件，不包含 `test/parser.test.ts`、`test/runtime.test.ts`、`test/variables.test.ts`；`test:release` 只是复用该入口。`vitest.config.ts:6-19` 又排除一组由 npm test 执行的文件，因此 `npm run test:vitest` 也不是完整入口。改进：建立一个明确的完整测试入口，或在发布门禁中显式覆盖所有 23 个测试文件，并加入入口完整性测试。

### 实现风险

- **JSON Store 的并发边界。** `src/runtime.ts:241-331` 的 mutations 只存在于一个 Store 实例；整体快照写回没有跨进程锁、重新读取或 CAS。两个 Pi 进程/Store 实例同时写同一 `.pi/flow-runs.json` 时，后写者可能覆盖前写者事实。当前源码注释和架构声明把它限制为单进程场景，因此“必须多进程安全”仍是待确认；若需要，应使用带锁或数据库的 Store。
- **自动恢复漏查 interrupted。** `src/extension.ts:504-522` 使用 `listRunningRuns()`，而 `FlowCoordinator.resume` 在 `src/runtime.ts:664-677` 接受 `running` 和 `interrupted`。若运行已落为 interrupted，session_start 不会自动发现它。需要明确 interrupted 是自动恢复还是只允许显式恢复，并固定测试。
- **命令执行没有超时或输出上限。** `src/runtime.ts:402-433` 直接 spawn，持续收集 stdout/stderr，没有 AbortSignal、超时或大小上限。外部命令挂起或大量输出可能长期占用 Flow 进程内存。是否需要限制取决于命令节点的运行环境。
- **工具 schema 较宽。** `src/pi.ts:42-61, 397-423, 475-501` 用 Unknown 数组/记录表达递归 FlowValue，完整校验在运行时完成。不同 provider 对该 schema 的兼容性需要真实 provider 集成证据；当前只测 Fake 或 SDK session。
- **Store 事实校验不完整。** `src/runtime.ts:87-111` 校验关联 runId 和 sequence 水位，但没有阻止同一 commit 内重复 id、旧 NodeRun 覆盖、记录 sequence 与 Run sequence 的不一致。建议增加 Store 不变量测试。

### 改进机会

- 统一 `npm test`、Vitest、Node test 和 integration 的职责，输出“默认测试覆盖哪些文件”的机器可验证清单。
- 将 `fingerprintFlow` 提取为可单测的稳定序列化函数，覆盖动作、结果、结果变量、模板、并行、资源和传递引用。
- 为 `FlowCoordinator` 的 commit/Store 建立失败注入测试，覆盖并发提交、重复事实、部分恢复和跨实例竞争。
- 为 extension 的 `resumeFlow` 增加 running/interrupted、多候选、子 Run、版本漂移和当前 session 不匹配测试。
- 为命令执行加入明确的超时、取消、输出上限和信号终止策略，并把策略写入 `CommandRequest` 或宿主配置。
- 将测试 fixture 的“未跟踪但被发布 smoke 使用”状态纳入交付检查，避免工作树测试与提交版本不一致。

## 6. 待业务确认事项

1. `.pi/flow-runs.json` 是否只保证单进程单 Store，还是必须支持同一工作目录的多 Pi 会话/多进程并发？
2. `interrupted` Run 是否应在 Pi `session_start` 自动恢复，还是只能通过显式命令恢复？
3. 命令节点是否允许无限运行和无限 stdout/stderr，还是发布环境必须有超时及大小预算？
4. 子 Flow 的成功结果是否只允许回传声明的最终结果变量，当前实现已按此限制，业务是否确认该边界？
5. `npm run test:release` 是否应被视为发布唯一门禁？若是，parser/runtime/variables Vitest 测试必须纳入；若不是，需要明确责任入口。
6. release smoke 的 Fake Agent、Fake command 和 SDK session smoke 是否足以作为发布证据，还是必须接入真实 Pi/provider？
7. 当前文档中旧架构和设计声明与源码不一致时，是否以当前源码为准并同步重写现有设计文档？

## 7. 独立审计结论

独立只读审计复核了 `runtime.ts`、`parser.ts`、`flow-loader.ts`、`pi.ts`、`extension.ts`、`types.ts`、配置和主要测试。审计与主扫描一致确认：结果变量未进入 Flow 指纹是已证实的一致性缺陷；发布命令遗漏核心测试是已证实的测试可信度问题；JSON 文件跨实例并发和 interrupted 自动恢复属于有直接代码证据、但业务边界尚未确认的风险。审计未修改文件。

## 8. 交付与覆盖结论

架构文档路径：`docs/source-architecture-reconstruction.md`。

本文件覆盖源码、配置/构建和测试的逐文件证据，并保留上一节点确认的 67 文件清单及排除规则。实现、配置和测试文件均有路径、定位、职责/输入/输出/副作用、依赖线索、测试覆盖和不确定项记录；无法读取项为 0，生成目录和依赖目录未被静默跳过。后续修复应优先处理指纹一致性和发布测试入口，再由业务确认并发、恢复和命令执行边界。
