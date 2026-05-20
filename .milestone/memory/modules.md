# Sandbox 模块清单

> 维护人：plan / check skill 自动更新
> 项目：Vue 3 Todo app

## 已实施模块（main 分支）

| 模块 | 文件 | 暴露接口 |
|---|---|---|
| TodoStore | `src/stores/todo.ts` | `useTodoStore()` |
| TodoList | `src/components/TodoList.vue` | `<TodoList />` |
| TodoItem | `src/components/TodoItem.vue` | `<TodoItem :todo />` |
| TodoInput | `src/components/TodoInput.vue` | `<TodoInput />` |

## 计划中模块（按里程碑）

| 里程碑 | 新增 | 状态 |
|---|---|---|
| 001-按日期排序 | `TodoStore.sortBy` field | 待开发 |
| 002-排序方向切换 | `TodoStore.sortDir` field | 待开发 |
| 003-标签筛选 | `Todo.tag` + `TodoStore.filterTag` | 待开发 |
| 004-排序+筛选组合 | `TodoStore.listView` getter | 待开发 |
| 005-sortBy API 重构 | `TodoStore.sortBy` 接口变更 | 待开发 |
