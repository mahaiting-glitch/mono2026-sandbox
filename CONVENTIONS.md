# 沙盘开发规范（极简 8 条）

1、**TypeScript strict 全开**——`strict: true` + `noUncheckedIndexedAccess: true`。

2、**Vue 3 script setup + composables**——禁 Options API、共享逻辑抽 `useXxx()`（见 2a）。

   2a、**composable 至少 2 处复用才抽**——`useXxx()` 独立文件只在 ≥2 个地方复用时才建；单处使用直接写在当前组件 / store 内，不要「为拆而拆」（与 3a 同源：单处抽离 = 无意义分层、增加跳转负担）。

   2b、**boolean props 一律用 `is`/`has`/`can` 前缀**——如 `isCompleted`、`hasError`、`canEdit`；Vue Style Guide Priority B 推荐。普通非布尔 prop 不加前缀（如 `title`、`count`、`items`）。

   2c、**emits 用 `defineEmits<{...}>()` 3.3+ 类型签名**——`defineEmits<{ toggle: []; delete: [id: string] }>()`（无参写 `[]`、有参写参数类型列表）；不用字符串数组 `defineEmits(['toggle'])`，类型签名让 IDE 能推断事件参数类型。

3、**Pinia store 用 setup 风格**——`defineStore('todo', () => {...})`、不写 options 形式。

   3a、**按业务域拆 store、不按 state/getters/actions 文件类型拆**——store 内的 ref / computed 直接内联（见 `stores/todo.ts` 现有范例）；除非某状态 / 派生确有跨 store 复用，不拆工厂文件（如 `useTodoState.ts` + `useTodoGetters.ts` 是无意义分层，让状态来源更难追）。多个关注点时按业务域拆 store（如 `useTodoStore` / `useFilterStore`），不是按文件类型拆。

   3b、**纯 refactor PR 必须净减或持平代码行数 / 文件数**——以 `git diff --stat` 业务代码行计（不含测试与空行注释）；净增则需在 PR 描述里写明「引入的抽象未来谁会复用」，否则视为无意义分层、拒绝合入。

4、**Tailwind 4 CSS-first**——主题用 `@theme` 写 CSS 变量、不用 `tailwind.config.js`。组件内类名直接堆、不写额外 CSS。

5、**默认无注释**——命名足够好就别写注释；非平凡的「为什么」（约束 / 不变量 / workaround）才写、且一行讲完。

6、**测试三层都跑**：vitest 单测（store / 工具函数）+ Playwright e2e（关键链路）。提交前 `pnpm test && pnpm test:e2e` 必过。

7、**改动范围 ≤ 200 行 / PR**——拆得越细越好、单 issue 单关注点；大改动拆里程碑。

8、**Commit message 中文 + conventional 前缀**——`feat:` / `fix:` / `docs:` / `test:` / `chore:` / `refactor:`、标题 ≤ 50 字。

## 反例

- ❌ boolean prop 不用 is/has/can 前缀：`completed`、`error`（应为 `isCompleted`、`hasError`）
- ❌ emits 用字符串数组：`defineEmits(['toggle', 'delete'])`（应用类型签名 `defineEmits<{ toggle: []; delete: [id: string] }>()`）
- ❌ Options API `export default { data() { return {...} } }`
- ❌ Pinia options 形式 `defineStore('todo', { state: () => ({...}), actions: {...} })`
- ❌ 只一处用到却单独抽 `useXxx.ts`（无复用 = 无意义分层）
- ❌ Pinia 按文件类型拆：`useTodoState.ts` + `useTodoGetters.ts`（无复用价值、状态来源更难追）
- ❌ 纯 refactor PR 净增文件 / 行数却不说明「未来谁会复用」
- ❌ 一 PR 改 500 行跨 5 个 feature
- ❌ 写 `tailwind.config.js`
- ❌ 注释解释「这里干嘛」（命名要够好）
