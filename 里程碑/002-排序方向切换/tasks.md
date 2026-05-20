# Tasks · 002-排序方向切换

## Phase 1 · Setup
- [ ] T001 [P] 确认 001 已 merged（依赖前置）

## Phase 2 · Foundational
- [ ] T002 [P] TodoStore 加 sortDir state（默认 'asc'）
- [ ] T003 [P] TodoStore 加 toggleSortDir action

## Phase 3 · User Story P1
- [ ] T004 改 sortedTodos getter 按 sortDir 判断升序/降序
- [ ] T005 TodoList.vue 加切换按钮调 toggleSortDir
- [ ] T006 加 todo-sort-dir.spec.ts 覆盖切换后顺序反转
- **Checkpoint A**: 升序基线 + 降序切换两个测试都过

## Phase 4 · Polish
- [ ] T007 pnpm lint
- [ ] T008 pnpm build

## 依赖关系
- T001 BLOCKS T002, T003
- T002, T003 BLOCKS T004
- T004 BLOCKS T005, T006

## GitHub issue
不创建（同 001）
