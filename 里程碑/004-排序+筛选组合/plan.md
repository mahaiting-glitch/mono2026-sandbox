# Plan · 004-排序+筛选组合

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
- **001-按日期排序**：复用 `sortedTodos` getter 的内部排序算法
- **002-排序方向切换**：复用 `sortDir` state
- **003-标签筛选**：复用 `filteredTodos` getter 的内部筛选算法

## 模块边界
- 修改：`src/stores/todo.ts`（加 listView getter、依赖现有 sortedTodos + filteredTodos）、`src/components/TodoList.vue`（用 listView 替代直接调 sortedTodos）
- 新增：`tests/unit/todo-listview.spec.ts`
- 不改：sortedTodos / filteredTodos getter 本身不删（向后兼容）、TodoInput / TodoItem

## 数据模型变化
无

## 新增接口
- `TodoStore.listView: ComputedRef<Todo[]>` —— 聚合 getter（先 filter 再 sort）

## 实施步骤
1. `TodoStore` 加 `listView` getter：内部先调 filteredTodos 拿筛选结果、再按 sortBy/sortDir 排序（复用 sortedTodos 的算法）
2. `TodoList.vue` 改用 `store.listView` 替代 `store.sortedTodos`
3. 加 `todo-listview.spec.ts` 覆盖：先 filter 再 sort 的组合行为
4. 验证 001/003 的原 spec 接受场景仍然通过（保留 sortedTodos / filteredTodos getter）

## 宪法 Gate 自检
- [x] MUST-1 代码量：估算 ~15 行 ≤ 30 ✓
- [x] MUST-2 Pinia store：listView 在 store ✓
- [x] MUST-3 vitest：新建 todo-listview.spec.ts ✓
- [x] MUST-4 接口稳定：listView 是新增 getter、不改 existing 接口 ✓
- [x] MUST-5 跨里程碑显式声明：依赖 001/002/003 已列出（3 条）✓

## 风险
- listView 同时依赖 001 + 003 内部派生 state、若 001 sortedTodos 或 003 filteredTodos 内部改动 → listView 行为可能受影响
- 005（sortBy API 重构）若改 sortBy 类型、004 listView 也连锁受影响、需配套升级
