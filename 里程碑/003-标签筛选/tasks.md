# Tasks · 003-标签筛选

## Phase 1 · Setup
- [ ] T001 [P] 确认 Todo type 当前结构、规划 tag 字段

## Phase 2 · Foundational
- [ ] T002 [P] Todo type 加 tag: string 字段（默认 ''）
- [ ] T003 [P] TodoStore 加 filterTag state（默认 ''）

## Phase 3 · User Story P1
- [ ] T004 TodoStore 加 filteredTodos getter + setFilterTag action
- [ ] T005 TodoInput 加 tag 输入框
- [ ] T006 TodoList 加筛选输入框
- [ ] T007 加 todo-filter.spec.ts 覆盖筛选
- **Checkpoint A**: 3 个 todo 不同 tag、筛选框输入后只显示匹配的

## Phase 4 · Polish
- [ ] T008 pnpm lint
- [ ] T009 pnpm build

## 依赖关系
- T001 BLOCKS T002
- T002 BLOCKS T003, T004, T005
- T003, T004 BLOCKS T006
- T006 BLOCKS T007

## GitHub issue
不创建（同 001/002）
