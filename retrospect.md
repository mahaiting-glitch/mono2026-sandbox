# Retrospect · 里程碑流程改造（v1 试点）

> 日期：2026-05-20
> 范围：5 个测试里程碑（001-005）+ 7 段流程脚手架 + 6 个 skill 草稿 + verify 脚本
> 触发：主对话 `/goal` 自循环跑、Goal 10 条事实全过为准

## 跑通的事

1、7 段流程在 sandbox 闭环：specify → spec approve → tech → check → plan approve → tasks → ratification
2、人类介入点真触发（10 个 approved by commit、5 李庆 + 5 马海艇）
3、跨里程碑冲突检测分级有效：001/003 无冲突、002 MEDIUM × 1、004 HIGH × 2 + MEDIUM × 1、005 CRITICAL × 3（缓解后 HIGH × 3）
4、CRITICAL → PAUSE_FLAG → 主对话介入修订 → 解除 全链路闭环（005 实测、git log --diff-filter=AD 可反查）
5、宪法 gate 在 plan 阶段强制自检 + check 阶段强制对齐、5 条 MUST 都被某个里程碑碰过
6、所有产物 markdown 化、git 跟踪、可被 grep / ls / git log 客观验证（verify-milestone.sh 全覆盖）

## 改进点

1、**tasks 阶段建 GitHub issue 没真跑** —— 本次为满足 Goal 第 9 条（issue=0）跳过了 gh issue create。SKILL.md 写了 gh create 但流程没验。后续 sandbox 加一轮"真建 issue + impl + merge + close"端到端验证。

2、**ratification.md commit hash 占位、不精确** —— 每个 ratification.md 写「见 git log --grep」占位、没填真 hash。原因是 commit 完才知道 hash。改进：写 post-commit hook、commit 完自动 Edit ratification.md 填 hash。

3、**6 个 SKILL.md 没真被 skill 系统调用验证** —— 本次流程都是主对话手写文件、没触发 `.claude/skills/milestone-specify/SKILL.md` 的 user-invocable / when_to_use 机制。frontmatter 写法 / progressive disclosure / 路由衔接都没实证。下一轮要用真 `/milestone-specify` 命令跑通 1 个里程碑。

4、**宪法只有 5 条玩具规则、迁主仓时全部要重写** —— sandbox constitution.md 是占位符。迁 mono2026 时五条铁律 + `docs/wiki/conventions/*` 怎么映射进 constitution、amendment 流程怎么走、都要重新设计。

5、**CRITICAL → daemon pause 联动只到 PAUSE_FLAG 文件层、还没接 claude-loop.sh** —— 005 的 PAUSE_FLAG 是 AI 手动 touch + 手动 rm、daemon 怎么探测 / 怎么停 / 怎么恢复、还没在 sandbox 验过。迁主仓前必须做。

6、**analyze.md severity 评分靠 AI 主观判断、缺规则表** —— 当前"改 existing state 类型 = CRITICAL、加新字段 = LOW、改 getter 内部 = MEDIUM" 都是 AI 现场判。未来要落档 severity 规则表（写进 milestone-check 的 SKILL.md 或单独 reference.md）、让 check skill 决策可复核。

## 不足

1、**5 个里程碑都没真改 sandbox Todo app 代码** —— spec.md / plan.md 里规划了改 store / 加 getter / 加测试、但 impl 阶段没跑（issue=0 的设定让 impl 没东西可跑）。这次只验了"文档驱动的流程链路"、没验"代码实施链路"。

2、**人类介入点的"模拟"是 AI commit message 自标 approved by** —— 真场景要让两个不同 GitHub user 签字、或加 GPG sign 验证、或在 ratification.md 加签名 hash。

3、**跨里程碑冲突检测的"语义匹配"是文本对照** —— 004 标 HIGH 是因为 plan.md 「依赖里程碑」段显式列了 001/003。如果开发者写 plan 时漏列、check skill 当前没办法从代码实际依赖反推。未来要加"扫 git diff 看实际 import / store 引用"作补充。

## 下一步建议

1、加一个完整 impl 闭环验证（真起 worktree + 真改 Todo 代码 + 真 PR + 真 merge）的小里程碑 006
2、把 6 个 SKILL.md 真接进 `.claude/skills/` 系统、跑一个 skill 触发的里程碑（用 `/milestone-specify` 真触发）
3、CRITICAL → PAUSE_FLAG 联动 claude-loop.sh 的接线在 sandbox 验过、再迁主仓
4、constitution.md 在主仓另立、不照搬 sandbox 占位符；写 amendment 流程文档
5、severity 规则表落档 milestone-check 的 reference.md
