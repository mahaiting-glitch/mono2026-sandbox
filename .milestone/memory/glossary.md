# 术语表

| 术语 | 定义 |
|---|---|
| 里程碑 | 一段从模糊想法到 implemented 的完整工程单元、走 7 段流程 |
| 7 段流程 | specify → clarify → spec 审批 → tech → check → plan 审批 → tasks → impl → retrospect |
| 宪法 | `.milestone/constitution.md`、MUST 级规则、plan / check 阶段强制对齐 |
| spec.md | 策划方案（WHAT/WHY）、李庆审 |
| plan.md | 技术方案（HOW）、马海艇审 |
| analyze.md | check skill 产出、跨文件 + 跨里程碑冲突报告、severity 分 CRITICAL/HIGH/MEDIUM/LOW |
| ratification.md | 审批记录、approver + timestamp + commit hash |
| tasks.md | 拆分到的 task 清单、对应 GitHub issue |
| CRITICAL | 必须解决才能继续、触发 `.claude/PAUSE_FLAG` 文件 + 主对话介入 |
| HIGH | 警告级、记录但不阻塞、建议解决 |
| MEDIUM | 提示级、可选解决 |
| LOW | 信息级、归档 |
| 李庆 | 策划角色、审 spec.md、commit message 含 `approved by 李庆` |
| 马海艇 | 技术角色、审 plan.md、commit message 含 `approved by 马海艇` |
| sortBy | TodoStore 排序字段、001 引入 |
| sortDir | 排序方向、002 引入 |
| filterTag | 标签筛选字段、003 引入 |
| listView | 派生 state、聚合排序 + 筛选、004 引入 |
