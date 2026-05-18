import { test, expect } from './fixtures'

test('Tab 切换 · 默认列表视图', async ({ page }) => {
  await expect(page.getByTestId('tab-list')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('todo-input')).toBeVisible()
  await expect(page.getByTestId('view-kanban')).not.toBeVisible()
  await expect(page.getByTestId('view-calendar')).not.toBeVisible()
})

test('Tab 切换 · 看板显示占位 + 列表内容隐藏', async ({ page }) => {
  await page.getByTestId('tab-kanban').click()

  await expect(page.getByTestId('tab-kanban')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('view-kanban')).toBeVisible()
  await expect(page.getByTestId('todo-input')).not.toBeVisible()
})

test('Tab 切换 · 日历显示占位', async ({ page }) => {
  await page.getByTestId('tab-calendar').click()

  await expect(page.getByTestId('tab-calendar')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('view-calendar')).toBeVisible()
  await expect(page.getByTestId('todo-input')).not.toBeVisible()
})

test('Tab 切换 · 从看板切回列表恢复 todo 内容', async ({ page }) => {
  await page.getByTestId('tab-kanban').click()
  await expect(page.getByTestId('view-kanban')).toBeVisible()

  await page.getByTestId('tab-list').click()
  await expect(page.getByTestId('todo-input')).toBeVisible()
  await expect(page.getByTestId('tab-list')).toHaveAttribute('aria-current', 'page')
})

test('视图状态持久化 · 刷新后从 localStorage 恢复', async ({ page }) => {
  await page.getByTestId('tab-kanban').click()
  await expect(page.getByTestId('view-kanban')).toBeVisible()

  await page.reload()

  await expect(page.getByTestId('tab-kanban')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByTestId('view-kanban')).toBeVisible()
  await expect(page.getByTestId('todo-input')).not.toBeVisible()
})
