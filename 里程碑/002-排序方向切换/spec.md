# Spec · 002-排序方向切换

## WHAT
TodoList 上加一个按钮、点击切换排序方向（升序 ↔ 降序）。

## WHY
001 落地后用户能按日期排序、但只有升序。用户反馈想看「最近的在最上面」时需要降序。

## 用户故事

### P1（核心）
- 作为用户、我想点击一个按钮把排序方向从升序切到降序、以便查看最新待办

### P2（增强）
- 切换状态持久化到 localStorage、刷新后保留方向

### P3（边缘）
- 无

## 接受场景
1. GIVEN 当前升序展示（最早在前）
   WHEN 我点击「方向切换」按钮
   THEN 列表变成降序（最新在前）
2. GIVEN 当前降序
   WHEN 我刷新页面
   THEN 列表仍是降序（持久化）

## 与现有功能的关系
- 复用：`001` 的 `TodoStore.sortBy` 字段、`TodoStore.sortedTodos` getter
- 改动：`TodoStore.sortedTodos` 内部逻辑（加方向判断）、`TodoList.vue` 加切换按钮
- 不影响：`TodoInput` / `TodoItem`

## 不在范围
- 多排序键（按完成状态、按字母）
- 标签筛选（留给 003）

## NEEDS CLARIFICATION
无
