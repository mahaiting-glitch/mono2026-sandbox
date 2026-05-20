# Tasks · 005-sortBy API 重构

## Phase 1 · Setup
- [ ] T001 [P] 确认 001/002/003/004 已 merged
- [ ] T002 [P] 读 plan.md v2 缓解方案、规划 @deprecated wrapper 测试覆盖

## Phase 2 · Foundational
- [ ] T003 [P] 加 SortConfig 类型 + TodoStore.sortConfig state
- [ ] T004 [P] 加 setSortField / setSortDir actions

## Phase 3 · 内部迁移
- [ ] T005 改 sortedTodos getter 内部读 sortConfig
- [ ] T006 改 listView getter 内部读 sortConfig
- [ ] T007 sortBy / sortDir 改为 computed wrapper + @deprecated JSDoc
- [ ] T008 toggleSortDir 内部转调 setSortDir + @deprecated

## Phase 4 · localStorage 兼容
- [ ] T009 旧数据反序列化推导 sortConfig 初始值

## Phase 5 · 测试
- [ ] T010 加 todo-sortconfig.spec.ts 覆盖新接口
- [ ] T011 跑 001/002/004 老测试、确认 @deprecated wrapper 行为兼容
- **Checkpoint A**: pnpm test 全过、@deprecated wrapper 不破坏 existing 用例

## Phase 6 · Polish
- [ ] T012 pnpm lint
- [ ] T013 pnpm build
- [ ] T014 更新 .milestone/memory/modules.md（标 sortBy/sortDir/toggleSortDir 为 @deprecated）

## 依赖关系
- T001, T002 BLOCKS T003, T004
- T003, T004 BLOCKS T005, T006, T007, T008
- T005-T008 BLOCKS T009, T010, T011

## GitHub issue
不创建（Goal 第 9 条要求 issue=0）

## 备注
本里程碑代码量估算 ~28 行（含 wrapper）、贴近 MUST-1 上限 30 行、需在 impl 阶段精打细算。
