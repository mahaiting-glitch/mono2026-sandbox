# mono2026-sandbox

mono2026 项目的「AI 工程团队」流程沙盘。验证 22 条目标、跑通后切回 mono2026。

## 形态

Vue 3.5 + Vite 6 + TS 5.7 + Tailwind 4 + Pinia + vue-router + Vitest + Playwright 单页 Todo 应用。本地 localStorage 持久化、零后端、即开即跑。

## 启动

```bash
pnpm install
pnpm dev          # http://localhost:5175
pnpm test         # vitest 单测
pnpm test:e2e     # playwright e2e
pnpm build        # 编译期类型检查 + 产物
```

## 端口

`:5175`（错开 admin-site web :5174）。

## 项目结构

```
src/
├── main.ts
├── App.vue
├── style.css        # Tailwind 4 入口
├── components/      # TodoList / TodoItem / TodoInput
├── stores/todo.ts   # Pinia
└── types.ts

tests/
├── unit/            # vitest
└── e2e/             # playwright
```

## 流程约定

issue 标题 + 描述 + 验收三段、`待开发 → 开发中 → 待PR → closed` 四档（撞 bug 退 `待解决`）。AI 全自动调度、人类只发 issue + 拍大方向。
