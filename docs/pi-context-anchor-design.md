# Pi 上下文锚点复用设计

## 1. 目标

同一项目会反复执行安全审计、架构评审或故障分析。每次任务开始前，Agent 都需要先阅读代码、调用工具并形成项目认知。这段准备工作本身已经存在于 Pi 会话历史中。

上下文锚点将某个“项目认知已经准备完成”的会话位置作为后续任务的起点。每个后续任务从该位置派生独立 Pi 会话，再追加本次任务。派生会话继承锚点之前的有效 LLM 上下文，因此保留构建过程中的消息、工具结果和 Agent 已形成的理解。

```text
构建会话
  了解项目、读取源码、形成项目认知
  └─ Context Anchor
       ├─ 派生会话 A：审计认证与授权
       ├─ 派生会话 B：审计依赖供应链
       └─ 派生会话 C：审计数据访问边界
```

该机制直接以 Pi 的持久化会话路径承载上下文，并通过分支操作保留原路径的 LLM context。

## 2. 范围与边界

### 2.1 包含内容

- 以 Pi 会话树中的指定 entry 作为可复用上下文位置。
- 恢复构建会话，继续完善项目认知。
- 从锚点派生隔离的新会话，并在派生会话中执行新任务或 Flow。
- 校验派生前缀和运行环境，为 provider prompt cache 提供稳定前缀。
- 在 Agent Flow Runtime 的 Pi 适配器中接入锚点派生能力。

### 2.2 解释口径

锚点继承的是 Pi 在该 entry 处实际发送给 LLM 的**有效上下文**。该上下文由 `SessionManager` 以锚点 entry 为 leaf 调用 `buildSessionContext()` 产生，包含消息序列、模型和 thinking level；本次运行再组合 system prompt、工具定义和模型配置。

有效上下文可能包含 compaction summary、branch summary 或截断后的工具结果。它准确表达 Pi 从该位置继续执行时可见的上下文。需要保留完整原始材料的场景使用严格模式，严格模式拒绝上下文路径中含有 compaction、branch summary 或明确标记为截断的 bash、PowerShell 工具输出的锚点。

### 2.3 排除内容

- 不恢复模型内部状态、KV cache、随机数状态或逐 token 输出。
- 不把 provider prompt cache 作为锚点持久化方式或正确性前提。
- 不改变 Flow Markdown 的通用语义。
- 不提供跨机器、跨账号的会话材料同步。
- 不以标签、会话名称或 session ID 作为锚点完整身份。

## 3. 核心对象

| 对象 | 职责 | 生命周期 |
| --- | --- | --- |
| 构建会话 | 让 Agent 了解项目并形成可审计的项目认知 | 可通过 Pi `/resume` 持续完善 |
| Context Anchor | 指向构建会话中一个已准备好的历史位置 | 发布后不可修改，失效后重新发布 |
| 派生会话 | 从一个锚点路径复制得到，并追加具体任务 | 一次任务或一次 Flow Run |
| Anchor Reference | 调用方传递的会话文件与 entry ID | 创建派生会话前解析 |

`ContextAnchor` 的最小记录如下。该记录保存定位与校验数据，不保存上下文正文。

```ts
interface ContextAnchor {
	id: string;
	sessionFile: string;
	entryId: string;
	createdAt: string;
	contextDigest: string;
	model: { provider: string; modelId: string } | null;
	thinkingLevel: string;
	cwd: string;
	label?: string;
	mode: "effective" | "strict";
}
```

- `sessionFile + entryId` 是锚点的定位身份。
- `contextDigest` 对锚点路径的消息序列、model 和 thinking level 进行规范化哈希。计算时在临时打开的 `SessionManager` 上先调用 `branch(entryId)`，再调用 `buildSessionContext()`。
- `label` 是 Pi Tree UI 中的查找别名，允许修改或清除，不参与身份校验。
- `cwd` 用于建立派生会话的工作目录约束。

首版由调用方保存和传递 `ContextAnchor`。交互式使用通过 Pi 的命名会话和标签定位。项目级锚点目录、跨项目索引和共享注册中心属于后续能力。

## 4. 原生 Pi 工作流

### 4.1 构建与发布

1. 创建或恢复一个构建会话，目标为了解项目并准备后续工作所需的上下文。
2. Agent 读取代码、文档、配置和测试，必要时完成多轮工具调用。
3. 在一次完整 turn 结束后确定锚点。通常选择 Agent 完成项目理解后的 assistant 消息，且该 turn 的全部 tool call 已有配对结果。
4. 使用 `/tree` 浏览会话树，并使用 `Shift+L` 添加易识别标签，例如 `security-audit:v1`。
5. 记录目标 entry ID、会话文件和 `contextDigest`，形成 `ContextAnchor`。

`/resume` 用于继续构建会话，补充或修正项目认知。它恢复的是构建过程本身。后续任务需要以锚点派生独立会话。

人工标记锚点时优先选择已完成 assistant 消息。`/tree` 选中 user entry 会将 leaf 移到该消息的父节点并将文本放回编辑器，`/clone` 此时复制的是锚点之前的路径。

### 4.2 人工派生

Pi 的交互界面可以通过 `/resume` 打开构建会话、使用 `/tree` 选中锚点、再用 `/clone` 创建当前路径的独立会话。这条路径适合人工试用与探索。

自动化路径不依赖当前 UI leaf。它直接根据 `ContextAnchor.entryId` 创建派生会话，保证包含锚点 entry，且不改变构建会话当前分支。

### 4.3 自动化派生

```text
读取 ContextAnchor
  -> 打开 source sessionFile
  -> branch 到 entryId 并校验 contextDigest
  -> 提取 root 到 entryId 的路径
  -> 创建独立派生 session
  -> 重建 Pi AgentSession
  -> 追加本次任务
```

派生后的 session header 使用新的 Pi session ID，并通过 `parentSession` 指向构建会话。源会话及其其他分支保持不变。每个具体任务都拥有独立的追加历史、压缩记录和结果。

## 5. Pi 与 Runtime 的职责

```mermaid
flowchart LR
  builder[构建 Pi 会话] --> anchor[Context Anchor]
  anchor --> source[源 SessionManager]
  source --> clone[派生 SessionManager]
  clone --> piSession[派生 AgentSession]
  piSession --> task[任务或 Flow 节点]
  task --> record[Run 与 NodeRun 记录]
```

### 5.1 Pi 会话层

Pi 负责保存构建会话、维护 entry 树、按指定 entry 提取路径，并以该路径创建新 session。SDK 路径使用以下顺序：

```ts
const source = SessionManager.open(anchor.sessionFile);
source.branch(anchor.entryId);
assertContextDigest(source.buildSessionContext(), anchor.contextDigest);
const derivedSessionFile = source.createBranchedSession(anchor.entryId);
const derived = SessionManager.open(derivedSessionFile!);
const { session } = await createAgentSession({ sessionManager: derived, modelRuntime });
```

`createBranchedSession()` 会将调用它的 manager 切换到派生会话。因此实现必须在新打开的临时 `SessionManager` 上调用它。构建会话的活动 manager 保持只读，避免替换仍被使用的源会话。

CLI 路径使用扩展 API 的 `ctx.fork(anchor.entryId, { position: "at" })`。跨会话派生时，Host 先切换到源会话，再在 replacement context 中执行 fork，并重新绑定 Flow Host 的会话级回调。

### 5.2 Agent Flow Runtime

Flow Runtime 只消费已经派生的 Pi Agent 连接。锚点派生属于 Pi Host 的会话来源能力，不属于 Flow Markdown，也不进入通用 `AgentIntegrationAdapter` 接口。

Pi Host 完成锚点校验和派生后，将派生 session file 作为既有 `agentReference` 交给当前 `AgentRunModel.takeOverAgent()` 路径。Runtime 因此继续使用已有的 Agent 连接、节点执行和会话引用模型。

Flow 的既有动作语义保持不变：

- `新建Agent` 创建空上下文的新 Agent。
- `复用Agent` 继续当前 Run 已绑定的 Agent。

一个使用锚点的 Flow Run 在进入首个 `复用Agent` 节点前完成锚点派生与绑定。后续 Flow 节点继续沿用既有规则。首节点为 `新建Agent` 的 Flow 不使用启动锚点，因为该动作会按定义创建空上下文。

Pi Host 持久化一条 `AnchorDerivation` 记录，并将其关联到 Flow Run。记录包含锚点身份、派生 attempt、源会话与 entry、派生会话文件、`contextDigest`、运行环境校验结果和当前状态。通用 Run 与 NodeRun 保持既有 Flow 语义。

## 6. 完整性、环境与派生校验

### 6.1 锚点资格

发布和使用锚点时必须满足以下条件：

- 源 session 已持久化，且 `sessionFile` 可读取。
- `entryId` 位于源 session 树中。
- 该位置处于完成的 turn 边界，路径可构建有效 LLM context。
- 严格模式路径中不包含 compaction、branch summary 或明确标记为截断的 bash、PowerShell 工具输出。
- 目标工作目录与锚点 `cwd` 一致，或调用方明确建立新的项目身份策略。

锚点发布后，使用端以临时 manager 定位到 `entryId`，重新构建消息序列、model 和 thinking level 后计算 `contextDigest`。摘要不一致时返回 `anchor_integrity_mismatch`，不创建派生会话。

### 6.2 运行环境

会话历史相同只保证消息前缀相同。后续 Agent 行为及 provider 请求还依赖当前运行环境。派生前构造 `runtimeFingerprint`，至少包含：

- provider、model 和 thinking level。
- 完整 system prompt 的摘要。
- 可用工具名称和 schema 摘要。
- AGENTS/CLAUDE 上下文文件、skills、extensions 和 prompts 的版本摘要。
- 项目 trust 决策、cwd、工具白名单和关键 settings。

同一锚点的连续任务可以采用相同运行环境。环境变化时，默认以 `environment_drift` 拒绝执行；经显式批准继续时，Run 记录差异、批准原因和新的 `runtimeFingerprint`。

### 6.3 可恢复派生

Pi session JSONL 和 Flow Run Store 是两个独立文件，无法组成跨文件事务。派生采用可恢复流程：

1. Pi Host 在 Run Store 写入 `AnchorDerivation`，状态为 `pending`，并生成稳定 `attemptId`。
2. Host 校验锚点与环境，再创建派生 session。
3. Host 在派生 session 追加不进入 LLM context 的 `custom` entry，写入 `attemptId`、锚点身份和 `contextDigest`。
4. Host 将派生 session file 写入 `AnchorDerivation`，状态更新为 `created`。
5. Host 重建 Agent runtime 并绑定 Flow Run，状态更新为 `bound`。

恢复时，`bound` 状态接管已记录的派生 session。`pending` 或 `created` 状态通过 `attemptId` 查找派生 session 的 custom entry 并继续绑定。进程在 Pi 创建文件与写入可识别记录之间中断时，状态进入 `derivation_uncertain`，恢复流程停止自动派生并要求用户确认或清理候选文件。该规则使 Runtime 不会静默创建第二个派生分支。

## 7. Prompt Cache

派生会话在首次任务消息之前继承相同的有效上下文路径。`contextDigest` 用于验证该路径。provider 实际收到的可缓存前缀还取决于请求前的自动 compaction、`before_agent_start`、`context`、`before_provider_request` 等扩展改写，以及 provider 的序列化格式。

Cache 资格在最终出站请求处计算 `requestPrefixDigest`。该摘要覆盖 provider 已序列化的 system、tools 和锚点路径消息，且在所有上下文变换完成后生成。运行时设置 compaction headroom，预留本次任务、模型输出和工具调用的最小窗口；未满足余量的锚点在缓存验证模式下返回 `anchor_ineligible`。

```text
system prompt + tools + root 到 anchor 的有效消息路径 + 本次任务
\_______________________________________________/
          以最终出站请求为准的可复用前缀
```

缓存命中由 provider 决定。Pi 可以验证请求前缀一致性，并记录 provider 返回的 usage；provider 决定缓存生命周期、路由和最终命中。

首版只在 provider 返回 `cacheRead` 用量时报告命中状态：

1. 从同一锚点创建一次派生会话并执行任务，记录最终 `requestPrefixDigest`、静态前缀 token 估计和 provider usage。
2. 从同一锚点创建第二个独立派生会话，使用相同运行环境和不同短任务。
3. 比较两次 `requestPrefixDigest`，仅相同前缀进入缓存观测。
4. 第二次响应返回 `cacheRead` 后，记录 `cache_hit_observed`，同时保存 `cacheRead` token 数与预期前缀 token 数。

`cacheRead` 只能表明 provider 报告读取了缓存。`cache_hit_observed` 是一次带前缀摘要的 usage 观测，不将该数值归因于某次特定预热请求。

## 8. 失败语义

| 错误码 | 含义 | 后续动作 |
| --- | --- | --- |
| `anchor_not_found` | 源 session 或目标 entry 不存在 | 重新选择或发布锚点 |
| `anchor_ineligible` | entry 不在完成边界或不符合严格模式 | 选择新的锚点 |
| `anchor_integrity_mismatch` | 当前有效上下文与发布摘要不同 | 重新发布锚点 |
| `anchor_context_unbuildable` | Pi 无法从该路径构建上下文 | 修复会话或选择新的锚点 |
| `environment_drift` | 运行环境与约束不一致 | 固定环境或显式批准差异 |
| `clone_creation_failed` | 派生 session 文件创建失败 | 保留源会话，重试派生 |
| `runtime_rebind_failed` | 派生 session 已创建但 Pi runtime 未完成绑定 | 保留 attempt，恢复时继续绑定或清理 |
| `derivation_uncertain` | 进程在派生文件可识别前中断 | 停止自动派生，确认候选文件后继续 |
| `resume_source_mismatch` | 恢复操作指向构建会话而非派生会话 | 以 Run 记录的派生会话恢复 |

Pi session JSONL 和 Run Store 通过 `AnchorDerivation` 的状态机形成可恢复流程，不依赖跨文件原子提交。

## 9. 安全与审计

构建会话通常含有源码、配置、架构结论和安全发现。锚点派生沿用源会话的敏感级别：

- 仅允许能够读取源 session 的主体使用锚点。
- session 文件、派生文件和 Flow Run 引用使用相同的访问控制与备份策略。
- Anchor Reference 中不写入上下文正文、凭据或 provider token。
- 项目认知中的工具输出仍按不可信项目数据处理，运行时 system prompt 不授予其更高指令优先级。
- 导出、共享或跨机器复制会话材料前，单独执行脱敏、授权和依赖锁定流程。

## 10. 验收标准

1. 从带有多个分支的构建会话中指定一个 entry 创建派生会话，派生会话只包含 root 到该 entry 的路径，包含目标 entry，不包含源会话后续消息和其他分支。
2. 两个任务从同一锚点派生后各自追加消息、工具结果或 compaction，源会话和彼此的会话树保持不变。
3. 标签被重命名或清除后，已保存的 `sessionFile + entryId + contextDigest` 仍可解析；entry 或上下文被篡改时派生被拒绝。
4. 含 compaction、branch summary 或明确标记为截断的 bash、PowerShell 工具输出的路径在严格模式下被拒绝；有效模式派生后得到与 Pi `buildSessionContext()` 相同的消息序列、model 和 thinking level。
5. 环境发生模型、system prompt、工具、skill、extension、trust 或 cwd 漂移时默认拒绝，并保留可审计的差异记录。
6. 使用锚点的 Flow Run 首个 `复用Agent` 节点接收派生会话；后续 `新建Agent` 与 `复用Agent` 继续遵循既有 Flow 语义。
7. 在派生流程的每个中断窗口恢复，验证已识别的派生会话只被接管一次；`derivation_uncertain` 阻止自动创建新分支。
8. 在支持 usage 的 provider 上，两个独立派生会话的最终 `requestPrefixDigest` 相同，第二次请求的 `cacheRead` 与预期前缀 token 估计一并记录。

## 11. 实现依据

- Pi [Session Format](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/session-format.md) 定义会话树、标签、上下文构建和派生 session 行为。
- Pi [Sessions](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sessions.md) 定义 `/resume`、`/tree` 和 `/clone` 的交互语义。
- Pi [SessionManager](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/session-manager.ts) 提供 `open()`、`getBranch()`、`buildSessionContext()` 和 `createBranchedSession()`。
- [Pi Agent 集成适配器实现设计](pi-agent-integration-adapter-design.md) 定义当前 Runtime 对 Pi 会话的新建、接管和交互读取边界。
- [Pi Flow 启动入口设计](pi-flow-host-design.md) 定义 Pi CLI Host 与 FlowCoordinator 的职责分离。
