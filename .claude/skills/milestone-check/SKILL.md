---
name: milestone-check
description: 里程碑流程第 5 段 · 跨文件 + 跨里程碑 + 宪法 + 覆盖率扫描、出 analyze.md severity 表。CRITICAL 触发 .claude/PAUSE_FLAG。用户说「/milestone-check <NNN>」或 plan 完后路由进。
when_to_use: plan.md 已写完（不一定 approved）、需要跨文件 + 跨里程碑 + 宪法 一致性扫描
user-invocable: true
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
model: inherit
---

# milestone-check · 检查门

## 定位

7 段流程第 5 段。读 spec/plan + 已批准的其他里程碑 + 宪法 + open GitHub issue、做跨文件 / 跨里程碑 / 宪法 / 覆盖率 / 术语漂移检测、产出 `analyze.md`。

## 输入
- `里程碑/<NNN-name>/{spec.md, plan.md}`
- 其他已存在 `里程碑/*/` 目录（参照对比）
- `.milestone/constitution.md`
- `.milestone/memory/modules.md`
- `gh issue list -R <repo> --state all`

## 输出
- `里程碑/<NNN-name>/analyze.md`
- 若 CRITICAL → `touch .claude/PAUSE_FLAG` + 主对话通知

## Severity 分级

| 级别 | 含义 | 行动 |
|---|---|---|
| CRITICAL | 必须解决、否则崩 | 触发 PAUSE_FLAG、主对话介入 |
| HIGH | 警告、强烈建议解决 | 记录、不阻塞、留 retrospect |
| MEDIUM | 提示、可选解决 | 记录 |
| LOW | 信息、归档用 | 记录 |

## 检测维度（6 类）

### A. 宪法对齐（CRITICAL/HIGH）
扫 plan.md 是否违反 `.milestone/constitution.md` 任一 MUST。
- MUST-1 代码量 → 看实施步骤估算
- MUST-2 Pinia → 看模块边界
- MUST-3 vitest → 看 Test Constraint 字段
- MUST-4 接口稳定 → 跟已 merged 里程碑接口对比
- MUST-5 跨里程碑显式声明 → 看「依赖里程碑」段

### B. 跨里程碑冲突（HIGH/CRITICAL）
对比 `里程碑/*/plan.md` 的「模块边界」段、找重叠：
- 改同一文件、同一字段 → HIGH
- 改 existing 已 merged 接口签名 → CRITICAL（违反 MUST-4）

### C. 覆盖率（HIGH/MEDIUM）
spec 的每个 P1 故事 → 必须有 plan 实施步骤对应、否则 HIGH
plan 的实施步骤 → 必须可追溯到 spec 的某段（FR/接受场景）、否则 MEDIUM

### D. 术语漂移（MEDIUM）
spec/plan 用词跟 `.milestone/memory/glossary.md` 不一致 → MEDIUM

### E. 模糊形容词（MEDIUM）
spec/plan 用「快」「易用」「稳定」「合适」等无可测指标的词 → MEDIUM

### F. open issue 重叠（HIGH/MEDIUM）
`gh issue list --state open` 标题 / body 跟当前里程碑 spec 主题相似度高 → HIGH（可能重复）

## 输出格式

```markdown
# Analyze · <里程碑名>

## 总结
- CRITICAL: N 条
- HIGH: N 条
- MEDIUM: N 条
- LOW: N 条
- 覆盖率: P1 故事 X/Y 有 plan 步骤、plan 步骤 X/Y 可追溯到 spec

## 详细条目

| ID | Severity | Category | Location | Summary | Recommendation |
|---|---|---|---|---|---|
| A1 | CRITICAL | 宪法-MUST-4 | plan.md:42 | 改 sortBy 接口签名 | 标 CRITICAL、daemon pause |
| B1 | HIGH | 跨里程碑 | plan.md:30 | 与 003-标签筛选 共享 listView state | plan 显式标依赖 |

## PAUSE_FLAG 触发
- 触发：<是/否>
- 触发时间：<ISO>
- 原因：<CRITICAL 条目 ID>
```

## CRITICAL 处理流程

1. 写 analyze.md
2. `touch .claude/PAUSE_FLAG`
3. `echo "<NNN> CRITICAL: <原因>" >> .claude/pause-log`
4. （如果有 daemon）`pkill -SIGTERM claude-loop`、或留给用户手动停
5. 在主对话输出醒目通知、等待用户解决后 `rm .claude/PAUSE_FLAG` 恢复

## 守门
- 即使 CRITICAL 也要写完整 analyze.md、不要 short-circuit 退出
- analyze.md 不包修复方案、只标问题、修复留给 plan 阶段返工
