# Tasks · 004-排序+筛选组合

## Phase 1 · Setup
- [ ] T001 [P] 确认 001/002/003 已 merged
- [ ] T002 [P] 读 analyze.md HIGH 条目、规划 listView 行为契约测试

## Phase 2 · Foundational
- [ ] T003 TodoStore 加 listView getter（依赖 sortedTodos + filteredTodos）

## Phase 3 · User Story P1
- [ ] T004 TodoList.vue 改用 listView
- [ ] T005 加 todo-listview.spec.ts 覆盖 filter→sort 组合
- [ ] T006 加 todo-listview-contract.spec.ts 锁定 001/003 行为契约（防回归）
- **Checkpoint A**: listView 在 tag=work + 降序场景下输出正确

## Phase 4 · Polish
- [ ] T007 在 .milestone/memory/modules.md 加 listView 是"派生 state 聚合点"标记
- [ ] T008 pnpm lint
- [ ] T009 pnpm build

## 依赖关系
- T001, T002 BLOCKS T003
- T003 BLOCKS T004, T005, T006
- T004, T005, T006 BLOCKS T007

## GitHub issue
不创建（同 001-003）
