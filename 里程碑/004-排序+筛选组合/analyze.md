# Analyze · 004-排序+筛选组合

## 总结
- CRITICAL: 0
- HIGH: 2
- MEDIUM: 1
- LOW: 0
- 覆盖率: P1 故事 1/1 有 plan 步骤、P2 故事 2/2 有 plan 步骤（隐含在 listView 实现中）、plan 步骤 4/4 可追溯到 spec

## 详细条目

| ID | Severity | Category | Location | Summary | Recommendation |
|---|---|---|---|---|---|
| H1 | HIGH | 跨里程碑共享派生 state | plan.md:32 (listView getter) | listView 同时依赖 001 `sortedTodos` + 003 `filteredTodos` 内部算法、未来任一里程碑改动其内部排序/筛选逻辑会连锁影响 004 | 在 listView 实现里加 unit test 同时锁定 001/003 行为契约、写注释明示"依赖 sortedTodos 算法稳定、改前必看 004" |
| H2 | HIGH | 跨里程碑共享 store state | plan.md:28 (依赖里程碑段) | listView 直接读取 sortBy / sortDir / filterTag 三个 state、跨 3 个里程碑（001/002/003）共享、形成强耦合 | 考虑把 listView 改为 pure function（参数注入）减少耦合、或接受耦合并在 modules.md 显式标记"派生 state 聚合点" |
| M1 | MEDIUM | 接口冗余 | plan.md:23 (保留 sortedTodos/filteredTodos) | listView 覆盖了 sortedTodos + filteredTodos 的用途、保留两个旧 getter 形成接口冗余、新代码不知道该用哪个 | 建议在 modules.md 加注释"新代码统一用 listView、sortedTodos/filteredTodos 仅向后兼容"、5 个里程碑后评估是否 deprecate |

## 跨里程碑扫描结果
- 已 merged 里程碑：001、002、003
- 重叠模块：
  - 001 sortedTodos getter（004 listView 内部复用算法）
  - 002 sortDir state（004 listView 读取）
  - 003 filteredTodos getter（004 listView 内部复用算法）
- 重叠级别：跨 3 个里程碑共享派生 state → HIGH（首次出现强耦合点、违反 MUST-5 隐含的"显式声明"虽然形式上已声明、但耦合密度高需警示）

## 宪法对齐
- MUST-4（接口契约稳定）：listView 是新增、不改 existing 接口 ✓
- MUST-5（跨里程碑显式声明）：plan.md 依赖段已列 3 条、形式合规、但耦合密度触发 HIGH 警示

## PAUSE_FLAG 触发
- 触发：否（HIGH 不阻塞、记录建议、继续流程）

## 备注
首个 HIGH 冲突里程碑、验证 check skill 能识别"跨里程碑强耦合"模式、给出可执行的解耦/警示建议、不会因 HIGH 误升 CRITICAL。
