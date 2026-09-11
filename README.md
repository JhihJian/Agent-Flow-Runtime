# Agent Flow Runtime

`@summ/agent-flow-runtime` executes portable Markdown Flow files. A Flow controls node routing, gates, retries, command-only parallel checks, and explicit joins. Agent-specific behavior stays outside the Markdown definition.

Included examples:

- `examples/code-change.md`: code change and verification loop.
- `examples/simplify.md`: project simplification with a review gate that loops until the remaining complexity has a documented reason.

## Install

Build the package before installing it from a local checkout:

```bash
npm install --ignore-scripts
npm run build
pi install /absolute/path/to/Agent-Flow-Runtime
```

After publishing the package, install a versioned package through Pi:

```bash
pi install npm:@summ/agent-flow-runtime@0.1.0
```

Pi discovers `src/extension.ts` and the bundled `skills/flow-authoring` through the package manifest, so local and git package installs work without a prebuilt artifact. `dist` remains the SDK entry point and is included in npm releases. Core Pi packages and `typebox` are peers, while `yaml` is installed as the runtime dependency. The extension uses the CLI's enabled tools, Skills, context files, model, and session.

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

In TUI, use `/flow run <文件> <任务>`. In RPC mode, send a normal `prompt` request after starting Pi with `--flow`; the extension intercepts it and drives the full Flow. JSON and RPC event streams include each `submit_flow_outcome` tool execution with `{ outcome, content }` in `details`.

After installing the package, ask Pi to create a Flow and it can use the bundled `flow-authoring` Skill. For example: `请根据当前项目的发布流程，创建一个可执行 Flow，保存到 .flows/release.md，并按规范检查结构。` The Skill only teaches the generic Flow format; the generated Markdown remains independent of Pi.

Flow records are stored in `.pi/flow-runs.json` under the working directory. Each record includes the input, outcome, Pi session reference, and Pi entry range for every Agent-node visit.

## Architecture

- `src/parser.ts` parses metadata, the one Mermaid graph, node action sections, result descriptions, command templates, and all structural constraints.
- `src/directory.ts` discovers and loads Flow files by filename identifier for reuse.
- `skills/flow-authoring/SKILL.md` guides Pi to create and check generic Flow files.
- `src/runtime.ts` contains the coordinator, Agent binding model, command executor, in-memory store, and JSON-file store. The coordinator alone changes Flow state and records node visits.
- `src/pi.ts` implements `AgentIntegrationAdapter` for Pi SDK sessions, restored sessions, and the current CLI session bridge.
- `src/extension.ts` registers `--flow`, `/flow run`, and `submit_flow_outcome`. CLI candidate outcomes are accepted after `turn_end`, then the next node is queued as a follow-up prompt.

The Pi CLI MVP supports a Flow whose first Agent action is `新建Agent` and whose later Agent actions are `复用Agent`. SDK hosts can create a new Agent session or take over a persisted Pi session. A CLI Flow that creates another Agent after the first one is rejected because one visible Pi CLI session cannot represent it.

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