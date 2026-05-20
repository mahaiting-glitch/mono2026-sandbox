# Plan · 003-标签筛选

## Technical Context

| 字段 | 值 |
|---|---|
| Language | TypeScript 5.7 |
| Framework | Vue 3.5 + Vite 6 |
| Storage | localStorage（复用） |
| Testing | Vitest |
| Target Platform | SPA |
| State Management | Pinia |
| Code Constraint | < 30 行（MUST-1） |
| Test Constraint | ≥1 vitest（MUST-3） |

## 依赖里程碑
无、独立里程碑（不依赖 001/002 的 sort 逻辑）

## 模块边界
- 修改：`src/types.ts`（Todo 加 tag: string）、`src/stores/todo.ts`（加 filterTag + filteredTodos）、`src/components/TodoInput.vue`（加 tag 输入）、`src/components/TodoList.vue`（加筛选框）
- 新增：`tests/unit/todo-filter.spec.ts`
- 不改：001 的 sortedTodos、002 的 toggleSortDir、TodoItem

## 数据模型变化
- `Todo` 加 `tag: string`（可空字符串、向后兼容）

## 新增接口
- `TodoStore.setFilterTag(tag: string): void`

## 实施步骤
1. `Todo` type 加 tag 字段（默认空字符串）
2. `TodoStore` 加 `filterTag: ''` state
3. `TodoStore` 加 `filteredTodos` getter（filter by tag）+ `setFilterTag` action
4. `TodoInput` 加 tag 输入框（可选）
5. `TodoList` 加筛选输入框、调 `setFilterTag`
6. 加 `todo-filter.spec.ts` 覆盖：3 个 todo 不同 tag、filteredTodos 只返回匹配的

## 宪法 Gate 自检
- [x] MUST-1 代码量：估算 ~25 行 ≤ 30 ✓
- [x] MUST-2 Pinia store：filterTag + filteredTodos 在 store ✓
- [x] MUST-3 vitest：新建 todo-filter.spec.ts ✓
- [x] MUST-4 接口稳定：Todo type 加字段是向后兼容（新字段、旧数据 tag=''）✓
- [x] MUST-5 跨里程碑显式声明：独立、依赖段已填「无」 ✓

## 风险
- Todo type 字段加完旧 localStorage 反序列化需兼容（tag 缺省 ''）
- 004 会聚合 001 sortedTodos + 003 filteredTodos、需 plan 段提前留接口空间
