# Agent Flow Runtime

`@jhihjian/agent-flow-runtime` executes portable Markdown Flow files. A Flow controls node routing, gates, retries, command-only parallel checks, and explicit joins. Agent-specific behavior stays outside the Markdown definition.

Included examples:

- `examples/code-change.md`: code change and verification loop.
- `examples/simplify.md`: project simplification with a self-gated loop that continues until the remaining complexity has a documented reason.
- `examples/flow-observability-implementation.md`: implementation and acceptance gates for Flow runtime observability.

## Install

Install the published package through Pi:

```bash
pi install npm:@jhihjian/agent-flow-runtime
```

Or install directly from GitHub without npm:

```bash
pi install git:github.com/JhihJian/Agent-Flow-Runtime
```

Build the package before installing it from a local checkout:

```bash
npm install --ignore-scripts
npm run build
pi install /absolute/path/to/Agent-Flow-Runtime
```

After publishing the package, install a versioned package through Pi:

```bash
pi install npm:@jhihjian/agent-flow-runtime@0.1.0
```

Pi discovers `src/extension.ts` and the bundled `skills/flow-planning` through the package manifest, so local and git package installs work without a prebuilt artifact. `dist` remains the SDK entry point and is included in npm releases. Core Pi packages and `typebox` are peers, while `yaml` is installed as the runtime dependency. The extension uses the CLI's enabled tools, Skills, context files, model, and session.

To embed the runtime in your own Node.js program instead of the Pi CLI:

```bash
npm install @jhihjian/agent-flow-runtime
```

The package requires Node.js >= 22.19 and two peer dependencies, `@earendil-works/pi-coding-agent` and `typebox`. npm 7+ installs peers automatically; pnpm users need `auto-install-peers=true` or explicit installation.

## Run

The Flow file follows [the Flow specification](docs/flow-spec.md). Start a Flow in the current Pi session:

```bash
pi --flow ./examples/code-change.md "修复登录超时问题"
pi --flow ./examples/code-change.md -p "修复登录超时问题"
pi --flow ./examples/code-change.md --mode json -p "修复登录超时问题"
pi --flow ./examples/code-change.md --mode rpc
```

When testing a checkout before installing it, load the built extension explicitly:

```bash
pi -e ./dist/extension.js --flow ./test/fixtures/ordinary.md -p "验证 Flow"
```

In TUI, use `/flow run <文件> <任务>`, then `/flow list` to select a recent Run or `/flow show <runId>` to inspect it directly. In RPC mode, send a normal `prompt` request after starting Pi with `--flow`; the extension intercepts it and drives the full Flow. JSON and RPC streams receive `flow_event` custom messages whose `details` contain the structured event, rather than using Agent prose to infer state.

After installing the package, ask Pi to create a Flow and it can use the bundled `flow-planning` Skill. For example: `请根据当前项目的发布流程，创建一个可执行 Flow，保存到 .flows/release.md，并按规范检查结构。` The Skill only teaches the generic Flow format; the generated Markdown remains independent of Pi. The `./examples/*.md` paths above refer to a repository checkout; installed users point `--flow` at their own Flow files, such as `.flows/release.md`.

Flow records are stored in `.pi/flow-runs.json` under the working directory. Each record includes the input, outcome, Pi session reference, and Pi entry range for every Agent-node visit. When Pi resumes the same session, an unfinished CLI Flow is restored from this file and its interrupted Agent node is submitted again in that session. The interrupted node is recorded as a separate retry visit, so the original incomplete visit remains auditable. An interrupted custom-command node is marked failed rather than replayed, because its external side effect may already have occurred.

## SDK Quick Start

Use the runtime as a library to parse a Flow file and drive it with Pi SDK sessions:

```typescript
import { readFile } from "node:fs/promises";
import {
  AgentRunModel,
  FlowCoordinator,
  JsonFileRunStore,
  parseFlow,
  PiAgentIntegrationAdapter,
} from "@jhihjian/agent-flow-runtime";

const flow = parseFlow(
  await readFile("./.flows/code-change.md", "utf8"),
  "code-change.md",
);

const adapter = new PiAgentIntegrationAdapter({ cwd: process.cwd() });
const coordinator = new FlowCoordinator(
  flow,
  new JsonFileRunStore(".pi/flow-runs.json"),
  new AgentRunModel(adapter),
);

const run = await coordinator.run("修复登录超时问题");
console.log(run.status); // "completed"
```

The same Runtime facade provides read and observe access for SDK hosts:

```typescript
import {
	FlowObservationPublisher,
	FlowRunInspector,
	FlowRuntime,
} from "@jhihjian/agent-flow-runtime";

const runtime = new FlowRuntime(
	new FlowRunInspector(store, { evidenceReader: adapter }),
	new FlowObservationPublisher(),
);
const history = await runtime.inspectRun(run.id);
const recentRuns = await runtime.listRecentRuns(10);
const subscription = runtime.subscribe(run.id, (event) => {
	console.log(event.type, event.sequence, event.summary);
});
subscription.unsubscribe();
```

Pi Agent hosts also expose the read-only `inspect_flow_run` tool. TUI status and widget output, CLI history output, JSON/RPC `flow_event` messages, and SDK results are thin views over this same Runtime facade. Events are best-effort and are not replayed after a disconnect; reconnecting clients should read `inspectRun` first.

`PiAgentIntegrationAdapter` creates a real Pi SDK session for each `新建Agent` action and injects the `submit_flow_outcome` tool automatically. Model auth follows Pi conventions (`~/.pi/agent/auth.json`, environment variables, or the settings default model). Sessions persist under `~/.pi/agent/sessions/` by default; pass `sessionDir` to choose another location. Run records go wherever the `RunStore` points.

For the offline minimal example (no model required), resume and takeover, session storage details, and the API overview, see [SDK 快速开始](docs/sdk-quick-start.md).

## Architecture

For a compact source-level reading guide, see [源码逻辑阅读图](docs/source-pseudocode-guide.md).

- `src/parser.ts` parses metadata, the one Mermaid graph, node action sections, result descriptions, command templates, and all structural constraints.
- `src/directory.ts` discovers and loads Flow files by filename identifier for reuse.
- `skills/flow-planning/SKILL.md` identifies long-running complex tasks that need Flow planning, then guides creation and checking of generic Flow files.
- `src/runtime.ts` contains the coordinator, Agent binding model, command executor, in-memory store, and JSON-file store. The coordinator alone changes Flow state and records node visits.
- `src/pi.ts` implements `AgentIntegrationAdapter` for Pi SDK sessions, restored sessions, and the current CLI session bridge. SDK hosts embed the runtime through `dist/index.js`; see [SDK 快速开始](docs/sdk-quick-start.md).
- `src/extension.ts` registers `--flow`, `/flow run`, and `submit_flow_outcome`. CLI candidate outcomes are accepted after `turn_end`, then the next node is queued as a follow-up prompt.

The Pi CLI host treats every `新建Agent` action as a real fresh-session transition through the extension's injected `/flow-new-session` command and Pi's `ctx.newSession()` API. The command has a distinct name so it does not conflict with Pi's built-in interactive `/new`. The Flow coordinator survives extension reload through process-level handoff state, and the next node prompt is sent only after the replacement session is ready. `复用Agent` continues the current session. SDK hosts create an independent session for each `新建Agent` action and can take over a persisted Pi session.

## Development

```bash
npm run build
npx tsc --noEmit
npx biome check --write .
npm test
npm run test:integration
```

Fixtures cover ordinary routing, a gate loop, and command parallelism with a join. Runtime tests use a Fake Agent adapter and command executor. The production smoke test is:

```bash
pi -e ./dist/extension.js --flow ./test/fixtures/ordinary.md --mode json -p "运行 Flow"
```

The command should emit two successful `submit_flow_outcome` events, and `.pi/flow-runs.json` should contain a completed Flow run with two node records.