import { test, expect } from './fixtures'
import type { Pinia } from 'pinia'

declare global {
  interface Window { __pinia__?: Pinia }
}

test('在 list A 新增 todo、切换到 list B 时该 todo 不可见', async ({ page }) => {
  // 通过 pinia store 创建两个 list
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as {
      lists: Array<{ id: string; title: string; createdAt: number }>
      activeListId: string | null
      createList: (t: string) => { id: string; title: string; createdAt: number } | undefined
      setActiveList: (id: string | null) => void
    }
    const a = listsStore.createList('列表A')
    const b = listsStore.createList('列表B')
    if (a) listsStore.setActiveList(a.id)
    return { aId: a?.id, bId: b?.id }
  })

  // 等待列表选择器出现（TodoForm 在有 lists 时才渲染）
  await expect(page.getByTestId('list-select')).toBeVisible()

  // 当前 active 是列表A，添加 todo
  await page.getByTestId('todo-input').fill('属于列表A的任务')
  await page.getByTestId('todo-add').click()

  // 验证 todo 可见
  await expect(page.getByTestId('todo-title')).toHaveText('属于列表A的任务')

  // 切换到列表B
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as {
      lists: Array<{ id: string; title: string; createdAt: number }>
      setActiveList: (id: string | null) => void
    }
    const b = listsStore.lists.find(l => l.title === '列表B')
    if (b) listsStore.setActiveList(b.id)
  })

  // 列表A的 todo 不可见，显示空状态
  await expect(page.getByTestId('todo-title')).not.toBeVisible()
  await expect(page.getByTestId('empty')).toBeVisible()
})

test('list 选择器切换同时更新过滤视图', async ({ page }) => {
  // 通过 pinia 创建 lists 并添加 todos
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as {
      lists: Array<{ id: string; title: string; createdAt: number }>
      createList: (t: string) => { id: string; title: string; createdAt: number } | undefined
      setActiveList: (id: string | null) => void
    }
    const todoStore = pinia._s.get('todo') as {
      add: (title: string, priority: string, listId?: string) => void
    }
    const a = listsStore.createList('工作')
    const b = listsStore.createList('个人')
    if (a) {
      listsStore.setActiveList(a.id)
      todoStore.add('工作任务', 'normal', a.id)
    }
    if (b) {
      todoStore.add('个人任务', 'normal', b.id)
    }
  })

  // 当前是 "工作" 列表，只看到 "工作任务"
  await expect(page.getByTestId('todo-title')).toHaveText('工作任务')

  // 通过 list 选择器切换到 "个人"
  await page.evaluate(() => {
    const pinia = window.__pinia__
    if (!pinia) throw new Error('__pinia__ 未暴露')
    const listsStore = pinia._s.get('lists') as {
      lists: Array<{ id: string; title: string; createdAt: number }>
      setActiveList: (id: string | null) => void
    }
    const b = listsStore.lists.find(l => l.title === '个人')
    if (b) listsStore.setActiveList(b.id)
  })

  // 现在只看到 "个人任务"
  await expect(page.getByTestId('todo-title')).toHaveText('个人任务')
})
