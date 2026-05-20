---
name: milestone-tasks
description: 里程碑流程第 7 段 · 拿 approved plan.md 拆 tasks.md（Phase + Checkpoint + [P]）+ 批量 gh issue create。用户说「/milestone-tasks <NNN>」或马海艇 approved plan 后路由进。
when_to_use: plan.md 已被马海艇 approved（git log 有 "approved by 马海艇" commit）、analyze.md 无 CRITICAL 未解决
user-invocable: true
allowed-tools: [Read, Write, Edit, Bash, Grep]
model: inherit
---

# milestone-tasks · 任务拆分阶段

## 定位

7 段流程第 7 段。把 approved plan.md 拆成可执行 task 清单、批量创建 GitHub issue。

## 输入
- `里程碑/<NNN-name>/plan.md`（已 approved by 马海艇）
- `里程碑/<NNN-name>/analyze.md`（无未解决 CRITICAL）

## 输出
- `里程碑/<NNN-name>/tasks.md`
- 一批 GitHub issue（label `待开发` + milestone 关联）
- 更新 `里程碑/<NNN-name>/ratification.md`

## 流程

### 1. 检查前置
```bash
git log --grep="<NNN>.*approved by 马海艇" --oneline | head -3
grep -c "CRITICAL" 里程碑/<NNN>/analyze.md  # 必须 0 或全已解决
ls .claude/PAUSE_FLAG 2>&1  # 必须不存在
```

### 2. 写 tasks.md（Phase 分组）

```markdown
# Tasks · <里程碑名>

## Phase 1 · Setup（基础设施、必先）
- [ ] T001 [P] 初始化 worktree、装依赖

## Phase 2 · Foundational（独立基础、并行可）
- [ ] T002 [P] 加 sortBy 字段到 TodoStore type
- [ ] T003 [P] 加 vitest 单测骨架

## Phase 3 · User Story P1（核心、checkpoint A）
- [ ] T004 实现 sortBy action
- [ ] T005 TodoList 渲染按 sortBy 排序
- [ ] T006 vitest 覆盖 sortBy edge cases
- **Checkpoint A**: pnpm test 全过、UI 可看到排序生效

## Phase 4 · Polish（lint / build）
- [ ] T007 pnpm lint
- [ ] T008 pnpm build

## 依赖关系
- T002, T003 BLOCKS T004-T006
- T004-T006 BLOCKS T007-T008

## [P] 标记说明
[P] = 同 phase 内可并行（无依赖 / 不同文件）
```

### 3. 批量 gh issue create
对每个 T-task 创建一个 issue：
```bash
gh issue create -R mahaiting-glitch/mono2026-sandbox \
  --title "[<NNN>] T001 · <标题>" \
  --body "$(cat <<'EOF'
## 来源里程碑
<NNN-name>

## Phase
1 · Setup

## 描述
<task 描述>

## 验收
- [ ] <验收条件>

## 依赖
<前置 task ID>
EOF
)" \
  --label "待开发"
```

### 4. 写 ratification.md
```markdown
# Ratification · <里程碑名>

## spec approved
- approver: 李庆
- timestamp: <ISO>
- commit: <hash>

## plan approved
- approver: 马海艇
- timestamp: <ISO>
- commit: <hash>

## tasks created
- timestamp: <ISO>
- issue 数: N
- issue 编号范围: #X - #Y
```

## 守门
- 必须有 Phase 1 (Setup) + Phase N (Polish)
- 每个 Phase 至少有 1 个 Checkpoint
- [P] 标记的 task 必须验证：不同文件、无依赖
