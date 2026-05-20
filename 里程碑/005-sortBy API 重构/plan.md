# Plan · 005-sortBy API 重构（v2 · CRITICAL 缓解后版本）

> 修订记录
> · v1 初稿（CRITICAL × 3）→ 触发 .claude/PAUSE_FLAG
> · v2 主对话介入修订（2026-05-20T17:48）→ 改为 deprecated 兼容方案 → 解除 PAUSE_FLAG

## Technical Context

| 字段 | 值 |
|---|---|
| Language | TypeScript 5.7 |
| Framework | Vue 3.5 + Vite 6 |
| Storage | localStorage |
| Testing | Vitest |
| Target Platform | SPA |
| State Management | Pinia |
| Code Constraint | < 30 行（MUST-1） |
| Test Constraint | ≥1 vitest（MUST-3） |

## 依赖里程碑
- **001-按日期排序**：sortedTodos getter（内部改读 sortConfig、对外接口不变）
- **002-排序方向切换**：sortDir state（保留为 deprecated computed wrapper、读 sortConfig.dir）、toggleSortDir action（保留、内部调 setSortDir）
- **004-排序+筛选组合**：listView getter（内部改读 sortConfig、对外接口不变）

## 模块边界（v2 · 不破坏 existing 接口）
- 修改：`src/stores/todo.ts`
  - **加** sortConfig: SortConfig state（field + dir）
  - **加** setSortField / setSortDir actions
  - 改 sortedTodos getter 内部读 sortConfig（外部签名不变）
  - 改 listView getter 内部读 sortConfig（外部签名不变）
  - **保留** sortBy 作为 computed wrapper：`get sortBy() { return sortConfig.field === 'createdAt' ? 'date' : sortConfig.field }`（@deprecated 标注）
  - **保留** sortDir 作为 computed wrapper：`get sortDir() { return sortConfig.dir }`（@deprecated）
  - **保留** toggleSortDir action：内部调 `setSortDir(sortConfig.dir === 'asc' ? 'desc' : 'asc')`（@deprecated）
- 新增：`tests/unit/todo-sortconfig.spec.ts`

## 数据模型变化
- 新类型 `SortConfig { field: 'createdAt' | 'priority'; dir: 'asc' | 'desc' }`
- localStorage 反序列化兼容：若旧版本无 sortConfig 字段、从 sortBy + sortDir 推导初始值

## 新增接口
- `TodoStore.sortConfig: SortConfig`
- `TodoStore.setSortField(field): void`
- `TodoStore.setSortDir(dir): void`

## 删除接口
- 无（v1 计划删的全部改为 @deprecated 保留）

## @deprecated 接口
- `TodoStore.sortBy`（@deprecated v2 起、用 sortConfig.field）
- `TodoStore.sortDir`（@deprecated v2 起、用 sortConfig.dir）
- `TodoStore.toggleSortDir`（@deprecated v2 起、用 setSortDir）

未来 3 个里程碑后评估是否真删（届时另立 deprecate 里程碑、走完整 7 段流程）。

## 实施步骤
1. 加 sortConfig state（默认从 sortBy/sortDir 推导）
2. 加 setSortField / setSortDir actions
3. 改 sortedTodos / listView 内部读 sortConfig
4. 把 sortBy / sortDir 改为 computed wrapper、加 @deprecated JSDoc
5. toggleSortDir 内部转调 setSortDir、加 @deprecated
6. localStorage 迁移：旧字段 sortBy + sortDir → 推导出 sortConfig
7. 加 todo-sortconfig.spec.ts 覆盖新接口
8. 跑 vitest 全过（包括 001/002/004 老测试、@deprecated wrapper 必须行为兼容）

## 宪法 Gate 自检
- [x] MUST-1 代码量：估算 ~28 行 ≤ 30 ✓（保留 wrapper 只占少量行）
- [x] MUST-2 Pinia store ✓
- [x] MUST-3 vitest ✓
- [x] MUST-4 接口稳定：**所有 existing 接口签名保留**、仅 @deprecated 注释、零破坏 ✓
- [x] MUST-5 跨里程碑显式声明：001/002/004 已列出 ✓

## 风险
- @deprecated wrapper 增加维护负担、3 个里程碑后必须有 deprecate 里程碑收尾
- localStorage 迁移逻辑需测试覆盖（旧用户、新用户）
