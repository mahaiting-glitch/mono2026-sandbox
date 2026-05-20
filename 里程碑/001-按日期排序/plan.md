# Plan · 001-按日期排序

## Technical Context

| 字段 | 值 |
|---|---|
| Language | TypeScript 5.7 |
| Framework | Vue 3.5 + Vite 6 |
| Storage | localStorage（不改） |
| Testing | Vitest |
| Target Platform | SPA |
| State Management | Pinia |
| Code Constraint | < 30 行（MUST-1） |
| Test Constraint | ≥1 vitest（MUST-3） |

## 依赖里程碑
无、独立里程碑（基线）

## 模块边界
- 修改：`src/stores/todo.ts`（加 sortBy 字段 + sortedTodos getter）、`src/components/TodoList.vue`（用 sortedTodos）
- 新增：`tests/unit/todo-sort.spec.ts`
- 不改：`TodoInput.vue` / `TodoItem.vue` / `types.ts`（假设 Todo 已有 createdAt）

## 数据模型变化
- 无新字段（假设 Todo 已有 createdAt: number、若缺先补）

## 新增接口
无

## 实施步骤
1. `TodoStore` 加 `sortBy: 'date'` state（默认值）
2. `TodoStore` 加 `sortedTodos` getter（按 createdAt 升序）
3. `TodoList.vue` 用 `store.sortedTodos` 替代 `store.todos`
4. 加 `todo-sort.spec.ts` 覆盖：3 个 todo 不同时间、sortedTodos 返回升序
5. pnpm test + build 全过

## 宪法 Gate 自检
- [x] MUST-1 代码量：估算 ~15 行（store +5、TodoList +1、test +9）≤ 30 ✓
- [x] MUST-2 Pinia store：sortedTodos 在 store 内 ✓
- [x] MUST-3 vitest：新建 todo-sort.spec.ts ✓
- [x] MUST-4 接口稳定：无 existing 接口改动（sortBy 是新字段）✓
- [x] MUST-5 跨里程碑显式声明：独立、依赖段已填「无」 ✓

## 风险
- 若 Todo 缺 createdAt 需先补、可能影响 localStorage 反序列化
- sortedTodos 在 todo 数百级别无性能问题
