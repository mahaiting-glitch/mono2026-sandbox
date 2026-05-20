# Analyze · 005-sortBy API 重构（初版 · CRITICAL 触发 PAUSE_FLAG）

## 总结
- CRITICAL: 3
- HIGH: 0
- MEDIUM: 0
- LOW: 0
- 覆盖率: P1 故事 1/1 有 plan 步骤

## 详细条目

| ID | Severity | Category | Location | Summary | Recommendation |
|---|---|---|---|---|---|
| C1 | CRITICAL | 宪法-MUST-4 | plan.md 删 sortBy state | 删 001 已 merged 的 `TodoStore.sortBy` state、破坏接口契约、001/002/004 全部连锁失效 | 重写 plan：保留 sortBy 作 deprecated wrapper（读 sortConfig.field）、新代码用 sortConfig |
| C2 | CRITICAL | 宪法-MUST-4 | plan.md 删 sortDir state | 删 002 已 merged 的 `TodoStore.sortDir` state、破坏接口契约 | 同 C1、保留 sortDir 作 deprecated wrapper |
| C3 | CRITICAL | 宪法-MUST-4 | plan.md 改 toggleSortDir 签名 | 改 002 已 merged 的 `toggleSortDir` action 参数语义、破坏接口契约 | 保留 toggleSortDir 兼容（内部调 setSortDir）、新代码用 setSortDir |

## 跨里程碑扫描结果
- 已 merged 里程碑：001、002、003、004
- 重叠模块：
  - 001 sortedTodos getter（必受影响、删 sortBy 后断了引用）
  - 002 sortDir / toggleSortDir（直接被删 / 改）
  - 004 listView（间接依赖 sortBy / sortDir、级联失效）
- 重叠级别：**CRITICAL**（破坏 4 个里程碑的 existing 接口）

## 宪法对齐
- **MUST-4（接口契约稳定）：违反 3 处、CRITICAL** ✗
- MUST-1 代码量超 30 行：plan gate 自检已标 ✗（重写后估算下降）

## PAUSE_FLAG 触发
- 触发：**是**
- 触发时间：2026-05-20T17:45:00+08:00
- 原因：C1 + C2 + C3 三条 CRITICAL
- 文件：`.claude/PAUSE_FLAG`（本次 commit 创建）
- 日志：`.claude/pause-log`（本次 commit 写入）

## 待主对话介入
本 analyze.md 已落档、PAUSE_FLAG 文件已创建、主对话需介入：
1、Read plan.md 初稿
2、改方案为「保留旧接口 deprecated 兼容、新加 sortConfig 不破坏 existing」
3、Edit plan.md 反映新方案
4、Edit analyze.md 把 CRITICAL 改为已缓解（保留记录、降为 HIGH）
5、`rm .claude/PAUSE_FLAG`、追加 pause-log "resolved"
6、commit "fix(005): 主对话介入 · 加缓解 · 解除 PAUSE_FLAG"

PAUSE_FLAG 不解除、daemon 不会跑下一步 / 主对话不会推进。
