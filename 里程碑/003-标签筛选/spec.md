# Spec · 003-标签筛选

## WHAT
Todo 加 tag 字段、TodoList 上提供输入框过滤显示带该 tag 的 todo。

## WHY
当用户的 todo 跨多个上下文（工作 / 个人 / 学习）时、找特定主题的待办需要滚动浏览全列表。标签筛选让用户按主题分组查看。

## 用户故事

### P1（核心）
- 作为用户、我想给 todo 打标签、并能按标签过滤显示、以便按主题查看待办

### P2（增强）
- 多标签同时筛选（OR 关系）

### P3（边缘）
- 标签自动补全

## 接受场景
1. GIVEN 我有 3 个 todo、其中 2 个打了 tag "work"
   WHEN 我在筛选框输入 "work"
   THEN 我只看到那 2 个 todo
2. GIVEN 筛选框为空
   WHEN TodoList 渲染
   THEN 显示全部 todo

## 与现有功能的关系
- 复用：`TodoStore` 现有 todos state、`Todo` type
- 改动：`Todo` type 加 tag 字段、`TodoStore` 加 filterTag state + filteredTodos getter、`TodoInput` 加 tag 输入、`TodoList` 加筛选框
- 不影响：001 的 sortedTodos / 002 的 toggleSortDir（本里程碑独立）

## 不在范围
- 多标签（P2 留给后续）
- 标签管理 UI（删除、重命名）
- 与 001 排序联动（留给 004）

## NEEDS CLARIFICATION
无
