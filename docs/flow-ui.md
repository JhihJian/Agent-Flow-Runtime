# Flow 运行台

`/flow ui` 会在本机启动一个只读的 Flow 运行台。页面展示当前工作目录下 `.pi/flow-runs.json` 中的 Flow Run，会话列表和单次运行详情共用 Runtime 的历史查询模型。

## 启动

在 Pi 中执行：

```text
/flow ui
```

默认地址为 `http://127.0.0.1:4387`。端口被占用时，运行台会向后尝试可用端口；也可以指定起始端口：

```text
/flow ui 4390
```

服务监听 `0.0.0.0`，通知中的 `127.0.0.1` 地址用于本机访问。运行台默认没有额外认证，虽然只提供 GET 接口和静态资源，也不提供启动、暂停、修改状态或提交结果的能力，但仍不应在不可信网络中暴露。

## 页面能力

- 会话列表：每个独立根 Flow Run 占一行，按最近活动排序，支持搜索和状态筛选。子 Flow Run 不重复占会话行，可从父 Flow 对应节点的“查看子 Flow”进入。
- Run 详情：显示状态、阶段、当前位置、版本和历史完整性。
- 运行状态是持久化记录，不表示运行台已确认执行进程存活。`running` 记录超过 5 分钟没有事实更新时，页面额外标记“久未更新”；运行台不会自动修改或终结 Run。
- 执行图：Pele 一次渲染 Mermaid SVG，节点状态来自实际 NodeRun，已选路由来自 RouteDecision。新 Run 保存 Flow 定义快照，Flow 文件迁移或删除后仍可按原版本展示；旧 Run 会先尝试从 Git 历史恢复指纹匹配的定义，无法匹配时仅展示已保存的运行历史，不会拿当前定义误画拓扑。
- 时间线：按 sequence 展示节点访问、路由、并行轮次和恢复记录。
- 节点证据：有拓扑时可在图中选节点；定义不可用时通过已访问节点选择器查看历史 NodeRun，再按需读取 Agent 会话或命令执行证据。
- 运行中刷新：详情每两秒读取一次 Run snapshot，依据 sequence 判断是否更新。刷新或断线后重新读取 snapshot，不依赖事件补发。

Run 创建时保存解析后的 Flow 定义快照。历史 Run 若没有快照且无法读取 `flowPath`，运行台会尝试从该文件的 Git 历史恢复指纹完全匹配的定义；仍无法验证时，页面保留节点访问、路由、并行轮次、证据和时间线，但不渲染静态拓扑。

## 接口

运行台内部使用以下只读接口：

- `GET /api/runs`
- `GET /api/runs/:runId`
- `GET /api/runs/:runId/nodes/:nodeRunId/evidence`
- `GET /api/health`

核心运行时仍不依赖浏览器。运行台使用 `JsonFileRunStore`、`FlowRunInspector` 和序列化后的 Flow Run View，前端不直接读取 JSON Store，也不执行 Flow 路由。
