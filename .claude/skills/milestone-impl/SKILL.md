---
name: milestone-impl
description: 里程碑流程第 8 段 · 后台 daemon 拉 task issue 起 worktree、写代码、跑测试、PR、merge。沿用 sandbox 现有 claude-loop 基建。用户说「/milestone-impl <NNN>」或 tasks 完后路由进。
when_to_use: tasks 已创建 GitHub issue、需要后台跑实施
user-invocable: true
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
model: inherit
---

# milestone-impl · 后台实施阶段

## 定位

7 段流程第 8 段。拿 tasks 阶段创建的 GitHub issue、后台 daemon 一个个跑通到 PR merge。

## 输入
- `里程碑/<NNN-name>/tasks.md`
- GitHub open issue（label `待开发`）

## 输出
- 每个 issue → worktree → 代码 → PR → merge → close
- 全部 close 后 → `里程碑/<NNN-name>/` 加 `impl-done.txt`

## 流程

### 1. PAUSE_FLAG 守门
```bash
[ -f .claude/PAUSE_FLAG ] && { echo "PAUSED"; exit 1; }
```
PAUSE_FLAG 存在 → 退出、等主对话解决。

### 2. 拉 1 个 issue
```bash
gh issue list -R <repo> --state open --label "待开发" --limit 1 --json number,title
```

### 3. 起 worktree
```bash
git worktree add .claude/worktrees/issue-<N> -b feat/issue-<N>
cd .claude/worktrees/issue-<N>
```

### 4. 写代码
按 issue body 描述、改 src/ + tests/。守宪法：
- 代码 ≤ 30 行
- 走 Pinia store
- 配 vitest

### 5. 跑基础门
```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```
全过 → 继续；任一失败 → 修到全过。

### 6. PR
```bash
git add . && git commit -m "feat(<NNN>): T<id> · <标题>"
git push -u origin feat/issue-<N>
gh pr create --fill
```

### 7. Merge + close
```bash
gh pr merge --squash --delete-branch
gh issue close <N> --comment "merged"
```

### 8. 清 worktree
```bash
cd ~/cc/mono2026-sandbox
git worktree remove .claude/worktrees/issue-<N> --force
```

### 9. 循环
回到 step 1、直到 open issue = 0。

### 10. impl 收尾
所有 issue close → 写 `里程碑/<NNN>/impl-done.txt`（仅时间戳 + commit hash）

## 守门
- PAUSE_FLAG 严格守门、不要绕过
- 每个 issue 一个 worktree、不要混用
- 基础门全过才能 PR、不允许 force merge
