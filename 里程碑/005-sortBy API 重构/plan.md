# Plan · 005-sortBy API 重构（初稿、含 CRITICAL · 待主对话介入修复）

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
001/002/003/004 **全部** 已 merged、本里程碑是跨多里程碑接口重构

## 模块边界（初稿、破坏性）
- 修改：`src/stores/todo.ts`
  - **删** sortBy: 'date' state（001 引入）
  - **删** sortDir: 'asc'|'desc' state（002 引入）
  - **加** sortConfig: { field, dir } state
  - 改 sortedTodos getter 内部读 sortConfig
  - **改** toggleSortDir action 签名 → setSortDir(dir)
  - 改 listView getter 内部读 sortConfig
- 新增：`tests/unit/todo-sortconfig.spec.ts`

## 数据模型变化
- 新类型 `SortConfig { field: 'createdAt' | 'priority'; dir: 'asc' | 'desc' }`

## 新增接口
- `TodoStore.sortConfig: SortConfig`
- `TodoStore.setSortField(field): void`
- `TodoStore.setSortDir(dir): void`

## 删除接口（违反 MUST-4）
- `TodoStore.sortBy`（被 sortConfig.field 取代）
- `TodoStore.sortDir`（被 sortConfig.dir 取代）
- `TodoStore.toggleSortDir`（参数语义变、改名 setSortDir）

## 实施步骤
1. 删 sortBy / sortDir / toggleSortDir
2. 加 sortConfig / setSortField / setSortDir
3. 改 sortedTodos / listView 内部用 sortConfig
4. 改测试 todo-sort.spec.ts / todo-sort-dir.spec.ts / todo-listview.spec.ts 适配
5. 加 todo-sortconfig.spec.ts 覆盖新接口

## 宪法 Gate 自检
- [ ] MUST-1 代码量：估算 ~50 行（超 30、需要拆里程碑）✗
- [x] MUST-2 Pinia store ✓
- [x] MUST-3 vitest ✓
- [ ] MUST-4 接口稳定：**删 3 个已 merged 接口、必须 CRITICAL 标 + 主对话介入** ✗
- [x] MUST-5 跨里程碑显式声明 ✓

## 风险
- 破坏 001/002/004 已 merged 接口、需要全部里程碑配套升级
- 升级路径不明、有把已有 vitest 全打挂的风险

## 待主对话介入
本 plan 触发 CRITICAL × 3、analyze.md 已写、`.claude/PAUSE_FLAG` 已 touch。等主对话审议 → 改方案（保留兼容 deprecated wrapper、不删 existing 接口）→ 解除 PAUSE_FLAG → 继续。
