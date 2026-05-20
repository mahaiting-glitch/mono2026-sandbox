# Spec · 001-按日期排序

## WHAT
TodoList 支持按 todo 创建日期排序、默认升序展示（最早的在前）。

## WHY
当前 todo 按添加顺序展示、列表 > 10 条时用户找最近的待办困难。按日期排序帮助用户快速定位时间相关的待办。

## 用户故事

### P1（核心）
- 作为用户、我想让 todo 列表按创建日期升序排列、以便我能看到最早的待办在最上面

### P2（增强）
- 无（排序方向切换留给 002）

### P3（边缘）
- 无

## 接受场景
1. GIVEN 我有 3 个不同时间创建的 todo
   WHEN 我打开 TodoList
   THEN 我看到它们按创建时间升序排列（早→晚）
2. GIVEN 我新建一个 todo
   WHEN 它显示在列表中
   THEN 它的位置依据创建时间排在正确的位置

## 与现有功能的关系
- 复用：`TodoStore` 现有 todos state、`TodoList` 渲染逻辑
- 改动：`TodoStore` 加 sortBy 字段、`TodoList` 用 sorted getter
- 不影响：`TodoInput` / `TodoItem`、localStorage 持久化

## 不在范围
- 排序方向切换（留给 002）
- 标签筛选（留给 003）
- 排序与筛选组合（留给 004）

## NEEDS CLARIFICATION
无（spec 明确）
