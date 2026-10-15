# ADR-002：单进程 JSON Store

## 状态

已实现，边界明确。

## 决策

默认本地运行记录使用 JsonFileRunStore。一个 Store 实例内通过 mutation 队列串行化写入，把 Run 和相关事实写成完整 JSON 快照，使用临时文件和 rename 替换目标文件。该实现只承诺 single-process 场景，不承担跨进程锁、共享并发协调或高并发查询职责。

## 影响

Coordinator 可以依赖 expected sequence 和提交后再发布观测的顺序。需要多 Pi 进程共享同一运行目录时，必须引入新的 Store 实现或部署隔离，不能把当前 JSON 文件当作数据库或事件日志。

## 证据

`src/runtime.ts` 的 `JsonFileRunStore`、`mutate`、`persist` 和 `src/types.ts` 的 `RunStore`、`RunFactCommit`；既有设计声明也明确将其限定为单进程本地运行记录。
