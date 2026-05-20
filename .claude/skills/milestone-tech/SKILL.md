---
name: milestone-tech
description: 里程碑流程第 4 段 · 拿 approved spec.md 出技术方案 plan.md + data-model.md + contracts/ · 马海艇向 · 含宪法 gate 自检。用户说「/milestone-tech <NNN>」或李庆 approved spec 后路由进。
when_to_use: spec.md 已被李庆 approved（git log 有 "approved by 李庆" commit）
user-invocable: true
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
model: inherit
---

# milestone-tech · 技术方案阶段

## 定位

7 段流程第 4 段。把 approved spec.md 翻译成技术方案、产出物给「马海艇」审。

## 输入
- `里程碑/<NNN-name>/spec.md`（已 approved by 李庆）
- `.milestone/constitution.md`（宪法、用于 gate 自检）
- `.milestone/memory/modules.md`（已实施模块清单、用于复用判断）

## 输出
- `里程碑/<NNN-name>/plan.md`
- `里程碑/<NNN-name>/data-model.md`（如有数据模型变化）
- `里程碑/<NNN-name>/contracts/`（如有新接口、内含 .md 描述）

## 流程

### 1. 检查前置审批
```bash
git log --grep="<NNN>.*approved by 李庆" --oneline | head -3
```
没有命中 → 抛回 specify 阶段。

### 2. 写 plan.md（固定模板）

```markdown
# Plan · <里程碑名>

## Technical Context（8 字段表）
| 字段 | 值 |
|---|---|
| Language | TypeScript 5.7 |
| Framework | Vue 3.5 + Vite 6 |
| Storage | localStorage |
| Testing | Vitest + Playwright |
| Target Platform | SPA |
| State Management | Pinia |
| Code Constraint | < 30 行（MUST-1） |
| Test Constraint | ≥1 vitest（MUST-3） |

## 依赖里程碑
- <已 merged 里程碑名>：复用 <字段/接口>
- 若空 → 写「无、独立里程碑」

## 模块边界
- 修改：<文件>
- 新增：<文件>
- 不改：<文件>

## 数据模型变化
见 `data-model.md`、若无 → 「无」

## 新增接口
见 `contracts/`、若无 → 「无」

## 实施步骤
1. <步骤 1>
2. <步骤 2>
3. <步骤 3>（≤5 步、对应 tasks.md）

## 宪法 Gate 自检
- [ ] MUST-1 代码量 ≤ 30 行：<估算>
- [ ] MUST-2 走 Pinia store：<是/否、若否说明理由>
- [ ] MUST-3 vitest 单测：<计划补哪个测试>
- [ ] MUST-4 接口契约稳定：<是否改 existing 接口、改了走 CRITICAL>
- [ ] MUST-5 跨里程碑显式声明：<依赖里程碑段已填>

## 风险
- <风险 1>
- <风险 2>
```

### 3. data-model.md / contracts/（按需）

### 4. 跑宪法 gate 自检
任一 MUST 违反 → 修 plan.md 直到全过。MUST-4 改 existing 接口 → 标记给 check 阶段强制 CRITICAL。

### 5. 等审批
plan.md 写完 → **暂停**、等马海艇 Edit + commit `feat(tech): <NNN> plan approved by 马海艇` → 继续 check 段。

## 守门
- 必须有 Technical Context 表（8 字段全填）
- 必须有宪法 gate 自检（5 条全勾）
- 实施步骤 ≤ 5 步、太长 → 拆里程碑
- 改 existing 接口必须明示、留给 check 标 CRITICAL
