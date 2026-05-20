# Constitution · mono2026-sandbox

> 版本：v1.0.0
> 批准日期：2026-05-20
> 最后修订：2026-05-20

## 定位

本宪法是 sandbox 流程改造的**占位符宪法**——用于验证 plan / check 阶段宪法 gate 会触发、内容是 sandbox Todo app 上的玩具级 MUST 规则。真正生产规范见 `CONVENTIONS.md`（Vue/TS 编码规范、25KB、不是宪法）。

迁主仓 mono2026 时另立宪法（届时根据 mono2026 实际再定）。

## 五条 MUST 规则

### MUST-1 · 里程碑代码量上限
每个里程碑的代码改动 ≤ 30 行（不含测试 / 不含 spec/plan 文档）。

违反 → plan 阶段抛回、要求拆里程碑。

### MUST-2 · 必须用 Pinia store
所有状态改动必须经 Pinia store action、不允许在组件内直接 mutate state。

违反 → plan 阶段抛回、要求重构走 store。

### MUST-3 · 必须有 vitest 单测
每个新功能必须配 ≥1 个 vitest 单元测试、覆盖核心逻辑。

违反 → plan 阶段抛回、要求补测试。

### MUST-4 · 接口契约稳定
已 merged 里程碑的对外接口（store action 签名、Component props）不可在新里程碑里直接改、要改必须先在 analyze.md 标 CRITICAL 冲突触发 daemon pause。

违反 → check 阶段强制 CRITICAL、daemon pause + 主对话介入。

### MUST-5 · 跨里程碑共享状态显式声明
新里程碑若使用已 merged 里程碑的 store state、必须在 plan.md 的「依赖里程碑」段显式列出依赖项。

违反 → check 阶段标 HIGH。

## Amendment 日志

- v1.0.0 (2026-05-20) · 初版、5 条 MUST、由流程改造 Goal 拉起
