import { test, expect } from '@playwright/test'
import { LS_VIEW_KEY } from '../../src/constants/storage-keys'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate((key) => localStorage.removeItem(key), LS_VIEW_KEY)
  await page.reload()
})

test('日历视图 · 添加 todo 后切换日历视图，今天区块内显示该 todo', async ({ page }) => {
  const todayLabel = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })

  await page.getByTestId('todo-input').fill('日历测试任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-calendar').click()

  await expect(page.getByTestId('view-calendar')).toBeVisible()

  const firstGroup = page.getByTestId('calendar-day-group').first()
  await expect(firstGroup.getByTestId('calendar-day-label')).toContainText(todayLabel)
  await expect(firstGroup).toContainText('日历测试任务')
})

test('日历视图 · 无 todo 时显示空态文案', async ({ page }) => {
  await page.getByTestId('tab-calendar').click()

  await expect(page.getByTestId('calendar-empty')).toBeVisible()
})

test('日历视图 · 不影响列表视图渲染', async ({ page }) => {
  await page.getByTestId('todo-input').fill('列表视图任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-calendar').click()
  await expect(page.getByTestId('view-calendar')).toBeVisible()
  await expect(page.getByTestId('todo-input')).not.toBeVisible()

  await page.getByTestId('tab-list').click()
  await expect(page.getByTestId('todo-list')).toBeVisible()
  await expect(page.getByTestId('todo-list')).toContainText('列表视图任务')
})

test('日历视图 · 不影响看板视图渲染', async ({ page }) => {
  await page.getByTestId('todo-input').fill('看板视图任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-calendar').click()
  await expect(page.getByTestId('view-calendar')).toBeVisible()

  await page.getByTestId('tab-kanban').click()
  await expect(page.getByTestId('view-kanban')).toBeVisible()
  await expect(page.getByTestId('kanban-col-pending')).toContainText('看板视图任务')
})
