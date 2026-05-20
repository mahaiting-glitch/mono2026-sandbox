---
name: milestone-specify
description: 里程碑流程第 1 段 · 把模糊想法变成 spec.md（WHAT/WHY、玩家故事、接受场景）· 李庆向。用户说「/milestone-specify <名字>」「起新里程碑 <名字>」时触发。
when_to_use: 用户启动一个新里程碑的策划阶段
user-invocable: true
allowed-tools: [Read, Write, Edit, Bash]
model: inherit
---

# milestone-specify · 策划阶段

## 定位

7 段流程第 1 段。把模糊想法塑造成可被审批的 `spec.md`、产出物给「李庆」审。

## 输入
- 里程碑名（如 `001-按日期排序`）
- 模糊想法（自然语言、可由 Socratic 引导出来）

## 输出
- `里程碑/<NNN-name>/spec.md`

## 流程

### 1. 创建目录
```bash
mkdir -p 里程碑/<NNN-name>
```

### 2. Socratic 引导（5 题、一次一题）
1. 这个里程碑要做什么？（WHAT 一句话）
2. 为什么要做？解决什么用户痛点？（WHY）
3. 用户故事拆 P1（核心）/ P2（增强）/ P3（边缘）？每个故事一句话能讲完吗？
4. 接受场景写 GIVEN-WHEN-THEN（每个 P1 故事至少一条）
5. 哪些是不确定的？（标 `[NEEDS CLARIFICATION]`、留给 clarify 阶段）

### 3. 写 spec.md（固定模板）

```markdown
# Spec · <里程碑名>

## WHAT
<一句话>

## WHY
<动机 + 用户痛点>

## 用户故事
### P1（核心）
- 作为 <角色>、我想 <动作>、以便 <价值>

### P2（增强）
...

### P3（边缘、可选）
...

## 接受场景
1. GIVEN <初始> WHEN <动作> THEN <结果>
2. ...

## 与现有功能的关系
- 复用：<模块>
- 改动：<模块>
- 不影响：<模块>

## 不在范围
- <边界 1>
- <边界 2>

## NEEDS CLARIFICATION
- [ ] <不确定项 1>
- [ ] <不确定项 2>
```

### 4. 等审批
spec.md 写完 → **暂停**、等李庆 Edit + commit `feat(specify): <NNN> spec approved by 李庆` → 继续下一段（clarify 或直接 tech）。

## 守门
- 只写 WHAT/WHY、**禁 HOW**（具体技术决策留给 plan.md）
- 必须有 P1 故事、不能全是 P2/P3
- 每个 P1 故事必须有 ≥1 个接受场景
- 不确定项必须标 `[NEEDS CLARIFICATION]`、不能模糊跳过
