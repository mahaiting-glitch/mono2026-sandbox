# 沙盘开发规范（极简 8 条）

1、**TypeScript strict 全开**——`strict: true` + `noUncheckedIndexedAccess: true`。

2、**Vue 3 script setup + composables**——禁 Options API、共享逻辑抽 `useXxx()`（见 2a）。

   2a、**composable 至少 2 处复用才抽**——`useXxx()` 独立文件只在 ≥2 个地方复用时才建；单处使用直接写在当前组件 / store 内，不要「为拆而拆」（与 3a 同源：单处抽离 = 无意义分层、增加跳转负担）。

   2b、**boolean props 一律用 `is`/`has`/`can` 前缀**——如 `isCompleted`、`hasError`、`canEdit`；Vue Style Guide Priority B 推荐。普通非布尔 prop 不加前缀（如 `title`、`count`、`items`）。

   2c、**emits 用 `defineEmits<{...}>()` 3.3+ 类型签名**——`defineEmits<{ toggle: []; delete: [id: string] }>()`（无参写 `[]`、有参写参数类型列表）；不用字符串数组 `defineEmits(['toggle'])`，类型签名让 IDE 能推断事件参数类型。

   2d、**utils / helpers / lib 等工具目录只在 ≥2 处复用时才建**——`utils/*.ts` 单处使用的纯函数（≤30 行）直接写在组件 `<script setup>` 里，Vitest 通过 `mount(Comp)` 交互间接覆盖即可（`<script setup>` 不支持顶层 `export`、不要试图从里面导出函数）；若确需直接单测且逻辑 >30 行，把函数放到与组件同名的兄弟 `.ts` 工具文件（如 `TodoItem.utils.ts`）而非 `utils/` 目录——对应正例：`TodoItem.vue` + `TodoItem.utils.ts`（同目录、就近）（与 2a / 3a 同源：单处抽离 = 无意义分层、增加跳转负担）。

   2e、**`computed` / `:class` 对象 key 命名描述语义（做什么），不描述容器位置（属于哪个 DOM 元素）**——名字应回答「这个值是什么」，不应回答「这个值挂在哪个 HTML 标签上」。❌ `btnClass`→ ✅ `toggleClass`；❌ `:class="{ btnActive: isActive }"`→ ✅ `:class="{ isToggleActive: isActive }"`（或拆成 `computed`）。语义名在组件重构时不需要改名。

   2f、**`v-for` 必须 `:key` 稳定业务 id、禁 `:key="index"`**——`v-for` 渲染的每个元素必须绑定稳定唯一 id（如 `:key="item.id"`）；禁止用数组下标 `:key="index"`（列表重排 / 插入 / 删除时 Vue 会复用错误 DOM 节点，导致状态混乱、动画异常）。❌ `<li v-for="(item, index) in items" :key="index">` → ✅ `<li v-for="item in items" :key="item.id">`。若元素为原始值（如 `string[]`），用值本身作 key（`:key="item"`），前提是列表内值唯一；若值可能重复，先补 `id` 字段再渲染。若列表在整个生命周期内保证静态（顺序 / 长度不变、无动画），允许 `:key="index"` 并加注释说明原因；动态列表一律用稳定 id。与 6c 的 `data-testid` 稳定性同根同源，形成「渲染稳定性 + 测试稳定性」双闭环。

3、**Pinia store 用 setup 风格**——`defineStore('todo', () => {...})`、不写 options 形式。

   3a、**按业务域拆 store、不按 state/getters/actions 文件类型拆**——store 内的 ref / computed 直接内联（见 `stores/todo.ts` 现有范例）；除非某状态 / 派生确有跨 store 复用，不拆工厂文件（如 `useTodoState.ts` + `useTodoGetters.ts` 是无意义分层，让状态来源更难追）。多个关注点时按业务域拆 store（如 `useTodoStore` / `useFilterStore`），不是按文件类型拆。

   3b、**纯 refactor PR 必须净减或持平代码行数 / 文件数**——以 `git diff --stat` 业务代码行计（不含测试与空行注释）；净增则需在 PR 描述里写明「引入的抽象未来谁会复用」，否则视为无意义分层、拒绝合入。

   3c、**模板只消费 ref / computed、禁内联复杂表达式**——模板任意位置（`v-for` / `v-if` / 插值）只引用 ref / computed，禁止写多步链式调用 / 三元嵌套 / 字面量 `new`（每次渲染重新分配）等复杂表达式；所有派生逻辑（排序 / 过滤 / 格式化 / 条件计算）在 store 内用 `computed` 计算后暴露给模板消费。集合类 computed 命名用语义形容词前缀 + 原集合名（`sortedItems` / `filteredItems` / `activeItems`）。**store `computed` 不受 2a「≥2 处复用才抽」约束**——单处使用也可写、它是状态的一部分而非可复用逻辑。❌ `v-for="item in [...store.items].sort((a,b)=>a.order-b.order)"`、`v-if="store.items.filter(i=>i.done).length>0"`、`{{ item.tags.map(t=>t.name).join(', ') }}`、`v-if="a ? fn1() : fn2()"`（三元嵌套）、`:value="new Date(item.ts)"`（字面量 new）→ ✅ store 内 `const sortedItems = computed(() => [...items.value].sort(...))` / `const hasDone = computed(() => items.value.some(i=>i.done))` / `const tagNames = computed(() => items.value.flatMap(i => i.tags).map(t => t.name).join(', '))` / `const itemDate = computed(() => new Date(item.value.ts))`，模板只引用这些 computed。

   3d、**`computed` 依赖组件 `props` 时在组件内写、不传 props 入 store**——派生值依赖 `props` 时，在组件 `<script setup>` 内直接写 `computed(() => props.xxx)`，不把 `props` 注入 store state / action（store 只依赖自身 state，组件销毁后 store 不会残留脏值）。`watch(props, ...)` 触发 store mutation 同样违反此规则（如 `watch(() => props.keyword, kw => store.setFilter(kw))`）——应改为组件内 computed 或传参给 getter 函数。store 需要外部参数的派生值改用「返回 `computed` 的 getter 函数」：`const getByTag = (tag: string) => computed(() => items.value.filter(i => i.tags.includes(tag)))`，组件内用 `const result = store.getByTag(props.tag)` 赋值给局部变量后模板引用 `result`（不在模板里直接调用 `store.getByTag(props.tag)`，否则每次渲染新建 computed 实例）。❌ `store.setFilter(props.keyword)`（props 打入 store state，组件销毁后脏值残留）→ ✅ 组件内 `const filtered = computed(() => store.items.filter(i => i.name.includes(props.keyword)))`。

4、**Tailwind 4 CSS-first**——主题用 `@theme` 写 CSS 变量、不用 `tailwind.config.js`。组件内类名直接堆、不写额外 CSS。

   4a、**同一元素不同状态分支的公共类提取，避免多处同步**——当 `computed` 或 `:class` 绑定的两个状态分支共享大段重复前缀时，把公共部分提到基础字符串，再拼接差异部分。❌ 两个 branch 各自写 `'px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-700'` 和 `'px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-400'`（改尺寸需两处同步）→ ✅ `const base = 'px-2 py-1 rounded text-sm font-medium'`，然后 `` `${base} ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}` ``（模板字符串、整体是一个值）。

5、**默认无注释**——命名足够好就别写注释；非平凡的「为什么」（约束 / 不变量 / workaround）才写、且一行讲完。

6、**测试三层都跑**：vitest 单测（store / 工具函数）+ Playwright e2e（关键链路）。提交前 `pnpm test && pnpm test:e2e` 必过。

   6a、**≥2 个 spec 共用相同前置逻辑时提取为 Playwright `base.extend` fixture**——当 ≥2 个 spec 文件写了**完全相同**的 `beforeEach`（如页面初始化 + localStorage 清理 + IDB 清理 + reload），应提取到 `tests/e2e/fixtures.ts`，用 `base.extend` 覆盖内置 `page` fixture；各 spec 从 `'./fixtures'` 导入 `test` 和 `expect`，不从 `'@playwright/test'` 直接导入再写重复 `beforeEach`。单文件内多 case 共享前置时可用 `test.beforeEach`；有特殊初始化需求（如 `addInitScript` 必须在 goto 前）的 spec 不适用此规则。范例：PR [#67](https://github.com/mahaiting-glitch/mono2026-sandbox/pull/67)。

   ```ts
   // tests/e2e/fixtures.ts
   import { test as base, expect } from '@playwright/test'
   export const test = base.extend({
     page: async ({ page }, use) => {
       await page.goto('/')
       // 清理 localStorage + IDB，详见 tests/e2e/fixtures.ts
       await page.reload()
       await use(page)
     },
   })
   export { expect }
   ```

   ```ts
   // tests/e2e/foo.spec.ts
   import { test, expect } from './fixtures'  // ✅ 从 fixtures 导入
   // import { test, expect } from '@playwright/test' // ❌ 不直接导入 + 再写 beforeEach
   ```

   6b、**Pinia store 单测共享的 storage mock 放在 `tests/unit/_helpers/` 下**——当 ≥2 个 spec 需要相同的 `idb-keyval` in-memory mock（`idbStore` 对象 + `vi.mock('idb-keyval', factory)`）或相同的 `memoryStorage()` localStorage stub 时，提取到 `tests/unit/_helpers/storage-mock.ts` 统一导出；各 spec 从 helpers 导入、本地不再重复定义。`vi.mock('idb-keyval', factory)` 仍需保留在各 spec 文件内（Vitest hoisting 要求），factory 直接引用导入的 `idbStore`。❌ 各 spec 各自 `const idbStore = {}` + 重复粘贴 `function memoryStorage()` → ✅ `import { idbStore, memoryStorage } from './_helpers/storage-mock'`。

   6c、**v-for 内 `data-testid` 必须唯一（携带稳定 id）**——v-for 渲染的可交互/可断言元素 `data-testid` 必须拼接 item 稳定 id（如 `:data-testid="'list-btn-' + list.id"` 或 `` :data-testid="`list-btn-${list.id}`" ``），或改用 `getByRole({ name })` 语义定位；禁止靠 `.nth(n)` / `.first()` 顺序耦合断言（列表重排后立刻失效）。同理适用于任何 v-for 渲染的可交互/可断言元素（行、卡片、菜单项等）。❌ `<button data-testid="list-btn" v-for="list in lists">` → ✅ `<button :data-testid="'list-btn-' + list.id" v-for="list in lists">`。

7、**改动范围 ≤ 200 行 / PR**——拆得越细越好、单 issue 单关注点；大改动拆里程碑。

8、**Commit message 中文 + conventional 前缀**——`feat:` / `fix:` / `docs:` / `test:` / `chore:` / `refactor:`、标题 ≤ 50 字。

9、**枚举列表用 `as const` 做 SoT、类型同文件派生**——

   9a、**`as const` 常量做 SoT**——菜单项 / tab / 状态枚举一律 `export const XS = [...] as const`，再 `export type XDef = typeof XS[number]`、`export type X = XDef['value']` 派生联合类型（也可一步 `typeof XS[number]['value']`，二选一）；禁止另写同一组值的字符串联合（双写 = 漂移风险）。**外层 `as const` 必须保留**——丢掉后 `value` 推断退化成 `string`、派生类型失效。

   ```ts
   // ✅ constants/tabs.ts
   export const TABS = [
     { value: 'list', label: '列表' },
     { value: 'kanban', label: '看板' },
     { value: 'calendar', label: '日历' },
   ] as const                              // 必须保留，丢掉则 value: string
   export type TabDef = typeof TABS[number]
   export type ViewType = TabDef['value']   // 从数据派生，无双写
   ```

   9b、**常量与派生类型同文件 co-locate**——常量文件同时 `export type X = ...`，消费方直接 `import type { X }` 不用绕去 `types.ts`；若需统一入口，`types.ts` 可 re-export（`export type { X } from '../constants/xs'`），不在 `types.ts` 里重新 `type X = ...`（re-export 只转发、不重新声明）。

10、**SVG 图标按复用次数决定内联 / 组件**——单处一次性图标允许直接内联 `<svg>`；同一图标出现 ≥2 处必须提取为独立组件（如 `components/icons/IconPlus.vue`），通过 `<IconPlus class="h-5 w-5" />` 引用。尺寸由调用方 `class` 控制，组件内不写硬编码尺寸（如 `h-5 w-5`）；图标组件默认加 `aria-hidden="true"`（纯装饰图标不进 a11y 树），`fill` 默认 `currentColor`（调用方用 `text-*` 控制颜色）。

## 反例

- ❌ boolean prop 不用 is/has/can 前缀：`completed`、`error`（应为 `isCompleted`、`hasError`）
- ❌ emits 用字符串数组：`defineEmits(['toggle', 'delete'])`（应用类型签名 `defineEmits<{ toggle: []; delete: [id: string] }>()`）
- ❌ Options API `export default { data() { return {...} } }`
- ❌ 只一处用到却单独抽 `useXxx.ts`（无复用 = 无意义分层）
- ❌ 把组件内 ≤30 行的纯函数抽到 `utils/*.ts`、只为「可测试」却无第二处复用（应直接写在 `<script setup>` 内；>30 行或需直接单测 → 兄弟文件 `TodoItem.utils.ts`，不建 `utils/` 目录）
- ❌ `computed` 或 `:class` key 以 DOM 容器命名：`btnClass`、`btnTestid`、`{ btnActive: isActive }`（应描述语义：`toggleClass`、`actionTestid`、`{ isToggleActive: isActive }`）
- ❌ 在模板任意位置写复杂表达式：`v-for="item in [...store.items].sort(...)"` / `v-if="store.items.filter(i=>i.done).length>0"` / 插值里写 `.map().join()` / 三元嵌套 `v-if="a ? fn1() : fn2()"` / 字面量 `new` `:value="new Date(item.ts)"`（应在 store 内用 `computed` 计算、模板只消费 `sortedItems` / `filteredItems` / `hasDoneItems`）
- ❌ Pinia options 形式 `defineStore('todo', { state: () => ({...}), actions: {...} })`
- ❌ Pinia 按文件类型拆：`useTodoState.ts` + `useTodoGetters.ts`（无复用价值、状态来源更难追）
- ❌ 纯 refactor PR 净增文件 / 行数却不说明「未来谁会复用」
- ❌ 一 PR 改 500 行跨 5 个 feature
- ❌ 写 `tailwind.config.js`
- ❌ 两个状态分支各自重复写大段公共 Tailwind 类，改间距时需同步两处（应提取公共前缀到 `base` 变量 + 模板字符串拼接差异部分）
- ❌ ≥2 个 spec 写了**完全相同**的前置逻辑（如 IDB 清理 + reload）却各自重复 `beforeEach`，而不是提取到 `tests/e2e/fixtures.ts`（`base.extend` fixture）
- ❌ 多个单测 spec 各自 `const idbStore = {}` + 重复粘贴 `function memoryStorage()`（应提取到 `tests/unit/_helpers/storage-mock.ts`，各 spec 从 helpers 导入）
- ❌ `v-for` 用 `:key="index"`（动态列表重排 / 插入 / 删除时 DOM 复用错乱，应用稳定业务 id `:key="item.id"`；静态列表例外，需加注释说明）

- ❌ v-for 内 `data-testid="list-btn"`（多个相同 testid，e2e 定位不稳定，重排后 `.nth(n)` 断言立刻失效）
- ❌ 注释解释「这里干嘛」（命名要够好）
- ❌ `types.ts` 手写 `type ViewType = 'list' | 'kanban' | 'calendar'`，同时 `tabs.ts` 单独维护同一组值（双写漂移）
- ❌ 常量文件只 export 数据、消费方绕去 `types.ts` 取同名类型（非 co-locate）
- ❌ 同一 SVG path 硬编码在 ≥2 个组件模板里（改图标需多处同步，应提取为 `components/icons/IconXxx.vue`）；✅ `<IconPlus class="h-5 w-5" />`（`components/icons/IconPlus.vue` 只含 `<svg aria-hidden="true" fill="currentColor" ...>`）
- ❌ 把组件 props 写入 store：`store.setFilter(props.keyword)`（组件销毁后 store 仍持脏值）→ ✅ 组件内 `const filtered = computed(() => store.items.filter(i => i.name.includes(props.keyword)))`
- ❌ `watch(() => props.keyword, kw => store.setFilter(kw))`（watch 触发 store mutation，同样把组件级状态打入 store）→ ✅ 组件内 `const filtered = computed(() => store.items.filter(i => i.name.includes(props.keyword)))` 或 `const result = store.getByTag(props.tag)`（getter 函数 + 局部 const）
