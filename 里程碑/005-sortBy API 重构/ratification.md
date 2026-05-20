# Ratification · 005-sortBy API 重构

## spec approved
- approver: 李庆
- timestamp: 2026-05-20T17:44:00+08:00
- commit: 见 `git log --grep="005.*approved by 李庆"`

## plan approved
- approver: 马海艇
- timestamp: 2026-05-20T17:49:00+08:00
- commit: 见 `git log --grep="005.*approved by 马海艇"`
- 备注:
  - plan v1 触发 CRITICAL × 3、PAUSE_FLAG 生效
  - 主对话介入 → plan v2（@deprecated 兼容方案）
  - PAUSE_FLAG 解除、CRITICAL 全部缓解（降级 HIGH 记录）
  - 在 plan v2 基础上 approve

## CRITICAL 介入流程记录
1. check skill 写 analyze.md v1（CRITICAL × 3）
2. touch .claude/PAUSE_FLAG + 写 .claude/pause-log
3. commit "feat(check): 005 plan 初稿 · CRITICAL × 3 · 触发 PAUSE_FLAG"（含 PAUSE_FLAG 文件创建）
4. 主对话介入修订 plan v2
5. analyze.md v2（CRITICAL 降级保留）
6. rm .claude/PAUSE_FLAG + pause-log 追加 resolved
7. commit "fix(005): 主对话介入 · plan v2 · 解除 PAUSE_FLAG"（含 PAUSE_FLAG 文件删除）

git log --diff-filter=AD --name-only -- .claude/PAUSE_FLAG 可见完整生命周期。

## tasks created
- 待 step 5（feat(tasks)）填充
