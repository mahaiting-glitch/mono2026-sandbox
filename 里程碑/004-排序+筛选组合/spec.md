# Spec · 004-排序+筛选组合

## WHAT
TodoList 同时应用排序（001/002）和筛选（003）、用户看到的列表是「先按 tag 筛、再按日期排」的结果。

## WHY
001 出来后用户能排序、003 出来后能按标签筛、但两个功能各自独立、用户切换会互相覆盖。需要一个统一的展示态、让排序和筛选同时生效。

## 用户故事

### P1（核心）
- 作为用户、我想在 TodoList 看到「按 tag=work 过滤」之后再按「日期升序」排序的列表、两个操作都生效

### P2（增强）
- 切换排序方向时筛选状态保留
- 改变筛选标签时排序状态保留

### P3（边缘）
- 无

## 接受场景
1. GIVEN 我有 5 个 todo（tag work × 3 + tag personal × 2）
   WHEN 我筛选 tag=work + 升序按日期
   THEN 我看到 3 个 work todo、按日期升序排列
2. GIVEN 当前筛选 work + 升序
   WHEN 我切到降序（保留筛选）
   THEN 仍是 3 个 work todo、但变成降序

## 与现有功能的关系
- 复用：001 `sortedTodos` getter、002 `sortDir` state、003 `filteredTodos` getter
- 改动：加 `listView` getter 聚合两个派生 state（先 filter 再 sort）、TodoList 用 listView 替代 sortedTodos/filteredTodos
- 不影响：现有 sortedTodos / filteredTodos getter 不删（保留向后兼容）

## 不在范围
- 排序键多选（按日期 + 按完成状态）
- 筛选条件多选（多 tag OR）

## NEEDS CLARIFICATION
无
