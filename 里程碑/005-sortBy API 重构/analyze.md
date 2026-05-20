# Analyze · 005-sortBy API 重构（v2 · CRITICAL 已缓解）

> 状态变更记录
> · v1（初版）：CRITICAL × 3、触发 .claude/PAUSE_FLAG
> · v2（2026-05-20T17:48）：主对话介入、plan.md 改方案、CRITICAL 全部缓解 → 降为 HIGH 记录

## 总结
- CRITICAL: 3（**全部已缓解、保留记录**）
- HIGH: 3（CRITICAL 降级保留）
- MEDIUM: 0
- LOW: 0
- 覆盖率: P1 故事 1/1 有 plan 步骤

## 详细条目

| ID | Severity | Status | Category | Location | Summary | Mitigation |
|---|---|---|---|---|---|---|
| C1 | ~~CRITICAL~~ → **HIGH** | 已缓解 | 宪法-MUST-4 | plan.md (v1 删 sortBy) | 原计划删 001 已 merged 的 sortBy state | v2 改为 sortBy = computed wrapper（@deprecated）、签名保留 |
| C2 | ~~CRITICAL~~ → **HIGH** | 已缓解 | 宪法-MUST-4 | plan.md (v1 删 sortDir) | 原计划删 002 已 merged 的 sortDir state | v2 改为 sortDir = computed wrapper（@deprecated）、签名保留 |
| C3 | ~~CRITICAL~~ → **HIGH** | 已缓解 | 宪法-MUST-4 | plan.md (v1 改 toggleSortDir 签名) | 原计划改 002 已 merged 的 toggleSortDir 参数语义 | v2 保留 toggleSortDir 签名、内部转调 setSortDir、加 @deprecated |

## 跨里程碑扫描结果
- 已 merged 里程碑：001、002、003、004
- 重叠模块：001 sortedTodos / 002 sortDir / 004 listView
- 重叠级别：原 CRITICAL → v2 HIGH（@deprecated 兼容方案不破坏 existing 接口）

## 宪法对齐
- **MUST-4（接口契约稳定）：v2 通过**（所有 existing 接口签名保留、仅 @deprecated 注释）✓
- MUST-1 代码量：v2 估算 ~28 行 ≤ 30 ✓

## PAUSE_FLAG 状态
- v1 触发：2026-05-20T17:45:00+08:00（C1/C2/C3 三条 CRITICAL）
- v2 解除：2026-05-20T17:48:00+08:00（主对话介入 plan 修订后）
- 文件：`.claude/PAUSE_FLAG`（v2 已删除）
- 日志：`.claude/pause-log`（追加 resolved 记录）

## 后续监控
- @deprecated wrapper 形成技术债、3 个里程碑后必须有 deprecate 里程碑彻底删除
- 添加到 `.milestone/memory/modules.md` 的 "已知技术债" 段（modules.md 后续可加该段）

## 备注
本里程碑验证 check skill CRITICAL 流程闭环：
1、CRITICAL 检测 ✓
2、自动 touch .claude/PAUSE_FLAG ✓
3、写入 .claude/pause-log ✓
4、主对话介入修订 plan ✓
5、CRITICAL 降级标记保留 ✓
6、PAUSE_FLAG 解除 ✓
7、流程继续推进 ✓
