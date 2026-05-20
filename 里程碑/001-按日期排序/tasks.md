# Tasks · 001-按日期排序

## Phase 1 · Setup
- [ ] T001 [P] 检查 Todo 类型是否有 createdAt 字段、缺则补

## Phase 2 · Foundational
- [ ] T002 [P] TodoStore 加 sortBy state（默认 'date'）
- [ ] T003 [P] TodoStore 加 sortedTodos getter

## Phase 3 · User Story P1
- [ ] T004 TodoList.vue 用 sortedTodos 替代 todos 渲染
- [ ] T005 加 todo-sort.spec.ts 覆盖升序
- **Checkpoint A**: pnpm test 全过、UI 看到 3 个 todo 按时间升序

## Phase 4 · Polish
- [ ] T006 pnpm lint
- [ ] T007 pnpm build

## 依赖关系
- T001 BLOCKS T002, T003
- T002, T003 BLOCKS T004
- T004 BLOCKS T005
- T005 BLOCKS T006, T007

## [P] 标记
T001 / T002 / T003 同 phase 可并行（不同字段、不同文件）

## GitHub issue
本里程碑 sandbox 流程验证、不创建实际 issue（Goal 第 9 条要求 issue=0）。tasks 仅作流程产物存档。
