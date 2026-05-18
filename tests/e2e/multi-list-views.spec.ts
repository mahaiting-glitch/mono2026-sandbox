import { test, expect } from './fixtures'
import type { Pinia } from 'pinia'

declare global {
  interface Window { __pinia__?: Pinia }
}

type ListsStoreRaw = {
  lists: Array<{ id: string; title: string; createdAt: number }>
  activeListId: string | null
  createList: (t: string) => { id: string; title: string; createdAt: number } | undefined
  setActiveList: (id: string | null) => void
}

type TodoStoreRaw = {
  add: (title: string, priority: string, listId?: string) => void
}

test('看板视图 · 按 activeListId 过滤、切换 list 内容隔离', async ({ page }) => {
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as ListsStoreRaw
    const todoStore = pinia._s.get('todo') as TodoStoreRaw
    const a = listsStore.createList('看板列表A')
    const b = listsStore.createList('看板列表B')
    if (a) todoStore.add('看板A任务', 'normal', a.id)
    if (b) todoStore.add('看板B任务', 'normal', b.id)
    if (a) listsStore.setActiveList(a.id)
  })

  await page.getByTestId('tab-kanban').click()

  await expect(page.getByTestId('kanban-col-pending')).toContainText('看板A任务')
  await expect(page.getByTestId('kanban-col-pending')).not.toContainText('看板B任务')

  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as ListsStoreRaw
    const b = listsStore.lists.find(l => l.title === '看板列表B')
    if (b) listsStore.setActiveList(b.id)
  })

  await expect(page.getByTestId('kanban-col-pending')).toContainText('看板B任务')
  await expect(page.getByTestId('kanban-col-pending')).not.toContainText('看板A任务')
})

test('日历视图 · 按 activeListId 过滤、切换 list 内容隔离', async ({ page }) => {
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as ListsStoreRaw
    const todoStore = pinia._s.get('todo') as TodoStoreRaw
    const a = listsStore.createList('日历列表A')
    const b = listsStore.createList('日历列表B')
    if (a) todoStore.add('日历A任务', 'normal', a.id)
    if (b) todoStore.add('日历B任务', 'normal', b.id)
    if (a) listsStore.setActiveList(a.id)
  })

  await page.getByTestId('tab-calendar').click()

  await expect(page.locator('[data-testid="calendar-card-title"]')).toHaveText(['日历A任务'])

  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as ListsStoreRaw
    const b = listsStore.lists.find(l => l.title === '日历列表B')
    if (b) listsStore.setActiveList(b.id)
  })

  await expect(page.locator('[data-testid="calendar-card-title"]')).toHaveText(['日历B任务'])
})

test('全链路 · 创建 list → 各 list 添加 todo → 切换验内容隔离 → 删除 list', async ({ page }) => {
  // 1. 列表视图创建两个 list
  await page.getByTestId('list-name-input').fill('全链路A')
  await page.getByTestId('list-create-btn').click()
  await page.getByTestId('list-name-input').fill('全链路B')
  await page.getByTestId('list-create-btn').click()
  await expect(page.getByTestId('list-btn')).toHaveCount(2)

  // 2. 激活 列表A，添加 todo
  await page.getByTestId('list-btn').first().click()
  await page.getByTestId('todo-input').fill('全链路A事项')
  await page.getByTestId('todo-add').click()

  // 3. 激活 列表B，添加 todo
  await page.getByTestId('list-btn').nth(1).click()
  await page.getByTestId('todo-input').fill('全链路B事项')
  await page.getByTestId('todo-add').click()

  // 4. 看板视图：当前激活 B，只显示 B 事项
  await page.getByTestId('tab-kanban').click()
  await expect(page.getByTestId('kanban-col-pending')).toContainText('全链路B事项')
  await expect(page.getByTestId('kanban-col-pending')).not.toContainText('全链路A事项')

  // 5. 切换激活到 A，看板视图实时响应
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as ListsStoreRaw
    const a = listsStore.lists.find(l => l.title === '全链路A')
    if (a) listsStore.setActiveList(a.id)
  })
  await expect(page.getByTestId('kanban-col-pending')).toContainText('全链路A事项')
  await expect(page.getByTestId('kanban-col-pending')).not.toContainText('全链路B事项')

  // 6. 日历视图：仍激活 A，只显示 A 事项
  await page.getByTestId('tab-calendar').click()
  const calendarEl = page.locator('[data-testid="calendar-card-title"]')
  await expect(calendarEl).toHaveText(['全链路A事项'])

  // 7. 切换激活到 B，日历视图实时响应
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as ListsStoreRaw
    const b = listsStore.lists.find(l => l.title === '全链路B')
    if (b) listsStore.setActiveList(b.id)
  })
  await expect(calendarEl).toHaveText(['全链路B事项'])

  // 8. 回列表视图，删除 全链路B（当前激活），activeListId 变 null
  await page.getByTestId('tab-list').click()
  await page.getByTestId('list-delete-btn').nth(1).click()
  await expect(page.getByTestId('list-btn')).toHaveCount(1)
})
