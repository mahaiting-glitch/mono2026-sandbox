# Spec · 005-sortBy API 重构

## WHAT
把当前 `TodoStore.sortBy: 'date'` + `TodoStore.sortDir: 'asc'|'desc'` 两个 state 合并成单个 `sortConfig: { field: 'date' | 'priority' | 'createdAt', dir: 'asc' | 'desc' }` 对象、为未来加新排序键（如 priority）做基础。

## WHY
当前 sortBy 和 sortDir 是两个独立 state、随排序键增多（004 已让架构压力显现、005 之后还想加按 priority）维护成本指数上升。一个对象化的 sortConfig 让排序配置在一处、扩展便利。

## 用户故事

### P1（核心）
- 作为开发者、我想把 sortBy/sortDir 合并成 sortConfig 对象、为加新排序键扫清架构障碍

### P2（增强）
- 用户能在 UI 上选按 priority 排序（新加的排序键）

### P3（边缘）
- 无

## 接受场景
1. GIVEN 当前用户在升序按日期场景
   WHEN 重构落地
   THEN 用户看到的列表行为完全不变（升序按日期）、但底层 sortConfig 已是新结构
2. GIVEN sortConfig = { field: 'priority', dir: 'desc' }
   WHEN listView 渲染
   THEN 列表按 priority 降序

## 与现有功能的关系
- 复用：001/002/003/004 全部已 merged 逻辑
- 改动：**sortBy / sortDir 两个 state → 单 sortConfig**（这是已 merged 接口签名变更、违反 MUST-4 必须 CRITICAL 标）
- 影响：001 的 sortedTodos getter、002 的 toggleSortDir action、004 的 listView getter 全部要改

## 不在范围
- 加 priority 字段到 Todo type（P2 留给后续）
- UI 排序键选择器（P2 留给后续）

## NEEDS CLARIFICATION
无（这次重构方向明确、风险也明确）
