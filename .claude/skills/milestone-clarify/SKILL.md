---
name: milestone-clarify
description: 里程碑流程第 2 段 · 扫 spec.md 的 [NEEDS CLARIFICATION] 标记、出问卷、消歧、更新 spec.md。用户说「/milestone-clarify <NNN>」或 specify 完后路由进。
when_to_use: spec.md 已写完、有 [NEEDS CLARIFICATION] 标记待消除
user-invocable: true
allowed-tools: [Read, Write, Edit, Bash]
model: inherit
---

# milestone-clarify · 消歧阶段

## 定位

7 段流程第 2 段。扫 spec.md 的不确定项、出问卷、答完更新 spec。

## 输入
- `里程碑/<NNN-name>/spec.md`（含 [NEEDS CLARIFICATION] 标记）

## 输出
- `里程碑/<NNN-name>/clarify.md`（问卷历史）
- `spec.md` 更新（删 [NEEDS CLARIFICATION]、加确定后的内容）

## 流程

### 1. 扫不确定项
```bash
grep -n "NEEDS CLARIFICATION" 里程碑/<NNN-name>/spec.md
```

### 2. 出问卷
对每个 `[NEEDS CLARIFICATION]` 出一个问题、用 AskUserQuestion 提供 2-4 个候选答案 + Other。问卷一次问完、用户答完再继续。

### 3. 写 clarify.md
```markdown
# Clarify · <里程碑名>

## 问卷历史

### Q1: <原 [NEEDS CLARIFICATION] 描述>
- 选项：<A / B / C>
- 答：<用户选的>
- 落入 spec 哪段：<段名>

### Q2: ...
```

### 4. 更新 spec.md
- 删每条 `[NEEDS CLARIFICATION]`
- 把确定内容填入对应段（用户故事 / 接受场景 / 不在范围）

### 5. 检查
- `grep "NEEDS CLARIFICATION" spec.md` 应该 0 命中
- 如果 spec.md 没有 [NEEDS CLARIFICATION] 标记 → 直接跳过本 skill、写空 clarify.md 标"无歧义"

## 守门
- 不许私自补完 [NEEDS CLARIFICATION]、必须经用户确认
- 一个问题一个选项卡、不要一次堆 5 题
