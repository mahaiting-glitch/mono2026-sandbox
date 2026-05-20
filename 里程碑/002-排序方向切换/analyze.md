# Analyze · 002-排序方向切换

## 总结
- CRITICAL: 0
- HIGH: 0
- MEDIUM: 1
- LOW: 0
- 覆盖率: P1 故事 1/1 有 plan 步骤、P2 故事 1/1 有 plan 步骤（在风险段标记）、plan 步骤 5/5 可追溯到 spec

## 详细条目

| ID | Severity | Category | Location | Summary | Recommendation |
|---|---|---|---|---|---|
| M1 | MEDIUM | 跨里程碑共享逻辑 | plan.md:21 (sortedTodos getter 内部改动) | 002 改动 001 已 merged 的 sortedTodos getter 内部排序方向逻辑、虽返回类型不变但行为分支增多 | 加 vitest 同时覆盖升序 + 降序两个场景、确保 001 接受场景不被打破 |

## 跨里程碑扫描结果
- 已 merged 里程碑：001-按日期排序
- 重叠模块：`src/stores/todo.ts`（sortedTodos getter）
- 重叠级别：内部逻辑扩展、对外接口签名不变 → MEDIUM（非 HIGH/CRITICAL）

## 宪法对齐
- MUST-4（接口契约稳定）：sortedTodos getter 返回类型 Todo[] 不变、形式契约稳定 ✓
- 其他 MUST 全过

## PAUSE_FLAG 触发
- 触发：否

## 备注
首个有依赖的里程碑、MEDIUM 提示但不阻塞。验证 check skill 能正确识别"共享逻辑改动"为 MEDIUM（非 HIGH/CRITICAL）。
