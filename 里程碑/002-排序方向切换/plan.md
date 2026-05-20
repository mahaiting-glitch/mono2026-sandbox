# Plan · 002-排序方向切换

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
- **001-按日期排序**：复用 `TodoStore.sortBy` 字段、扩展 `TodoStore.sortedTodos` getter 内部逻辑

## 模块边界
- 修改：`src/stores/todo.ts`（加 sortDir 字段 + 改 sortedTodos getter 内部）、`src/components/TodoList.vue`（加切换按钮）
- 新增：`tests/unit/todo-sort-dir.spec.ts`
- 不改：`TodoInput.vue` / `TodoItem.vue` / `types.ts`

## 数据模型变化
无新字段（sortDir 是 store state、'asc' | 'desc'）

## 新增接口
- `TodoStore.toggleSortDir(): void` —— 切换方向 action

## 实施步骤
1. `TodoStore` 加 `sortDir: 'asc' | 'desc'` state（默认 'asc'）
2. `TodoStore` 加 `toggleSortDir` action
3. 改 `TodoStore.sortedTodos` getter：按 sortDir 判断升序/降序
4. `TodoList.vue` 加按钮调 `store.toggleSortDir()`
5. 加 `todo-sort-dir.spec.ts` 覆盖：切换后 sortedTodos 顺序反转

## 宪法 Gate 自检
- [x] MUST-1 代码量：估算 ~20 行 ≤ 30 ✓
- [x] MUST-2 Pinia store：所有状态在 store ✓
- [x] MUST-3 vitest：新建 todo-sort-dir.spec.ts ✓
- [x] MUST-4 接口稳定：sortedTodos getter 返回类型不变（仍是 Todo[]）、只是内部排序方向变 → 行为兼容、不算签名变更 ✓
- [x] MUST-5 跨里程碑显式声明：依赖 001 已列出 ✓

## 风险
- sortedTodos getter 内部改动影响 001 的接受场景（升序基线）、需测试覆盖确保升序场景仍过
- localStorage 持久化 sortDir 字段（P2）若实现需扩展 plugin 配置
