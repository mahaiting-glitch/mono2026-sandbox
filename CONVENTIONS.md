# 沙盘开发规范（极简 8 条）

1、**TypeScript strict 全开**——`strict: true` + `noUncheckedIndexedAccess: true`。

2、**Vue 3 script setup + composables**——禁 Options API、共享逻辑抽 `useXxx()`。

3、**Pinia store 用 setup 风格**——`defineStore('todo', () => {...})`、不写 options 形式。

4、**Tailwind 4 CSS-first**——主题用 `@theme` 写 CSS 变量、不用 `tailwind.config.js`。组件内类名直接堆、不写额外 CSS。

5、**默认无注释**——命名足够好就别写注释；非平凡的「为什么」（约束 / 不变量 / workaround）才写、且一行讲完。

6、**测试三层都跑**：vitest 单测（store / 工具函数）+ Playwright e2e（关键链路）。提交前 `pnpm test && pnpm test:e2e` 必过。

7、**改动范围 ≤ 200 行 / PR**——拆得越细越好、单 issue 单关注点；大改动拆里程碑。

8、**Commit message 中文 + conventional 前缀**——`feat:` / `fix:` / `docs:` / `test:` / `chore:` / `refactor:`、标题 ≤ 50 字。

## 反例

- ❌ Options API `export default { data() { return {...} } }`
- ❌ Pinia options 形式 `defineStore('todo', { state: () => ({...}), actions: {...} })`
- ❌ 一 PR 改 500 行跨 5 个 feature
- ❌ 写 `tailwind.config.js`
- ❌ 注释解释「这里干嘛」（命名要够好）
