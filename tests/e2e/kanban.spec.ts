import { test, expect } from '@playwright/test'

const LS_VIEW_KEY = 'mono2026-sandbox.view'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate((key) => localStorage.removeItem(key), LS_VIEW_KEY)
  await page.reload()
})

test('看板视图 · 显示左右两栏列标题', async ({ page }) => {
  await page.getByTestId('tab-kanban').click()

  await expect(page.getByTestId('view-kanban')).toBeVisible()
  await expect(page.getByTestId('kanban-col-pending-title')).toContainText('待完成')
  await expect(page.getByTestId('kanban-col-done-title')).toContainText('已完成')
})

test('看板视图 · 新增 todo 出现在待完成栏', async ({ page }) => {
  await page.getByTestId('todo-input').fill('看板测试任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-kanban').click()

  await expect(page.getByTestId('kanban-col-pending')).toContainText('看板测试任务')
  await expect(page.getByTestId('kanban-col-done')).not.toContainText('看板测试任务')
})

test('看板视图 · 点完成按钮后卡片移到已完成栏', async ({ page }) => {
  await page.getByTestId('todo-input').fill('待完成任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-kanban').click()

  await expect(page.getByTestId('kanban-col-pending')).toContainText('待完成任务')
  await expect(page.getByTestId('kanban-col-done')).not.toContainText('待完成任务')

  await page.getByTestId('kanban-done-btn').first().click()

  await expect(page.getByTestId('kanban-col-done')).toContainText('待完成任务')
  await expect(page.getByTestId('kanban-col-pending')).not.toContainText('待完成任务')
})

test('看板视图 · 点撤回按钮后卡片移回待完成栏', async ({ page }) => {
  await page.getByTestId('todo-input').fill('已完成任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-kanban').click()
  await page.getByTestId('kanban-done-btn').first().click()

  await expect(page.getByTestId('kanban-col-done')).toContainText('已完成任务')

  await page.getByTestId('kanban-undo-btn').first().click()

  await expect(page.getByTestId('kanban-col-pending')).toContainText('已完成任务')
  await expect(page.getByTestId('kanban-col-done')).not.toContainText('已完成任务')
})

test('看板视图 · 无 todo 时显示空态文案', async ({ page }) => {
  await page.getByTestId('tab-kanban').click()

  await expect(page.getByTestId('kanban-pending-empty')).toBeVisible()
  await expect(page.getByTestId('kanban-done-empty')).toBeVisible()
})

test('看板视图 · 不影响列表视图渲染', async ({ page }) => {
  await page.getByTestId('todo-input').fill('列表视图任务')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('tab-kanban').click()
  await expect(page.getByTestId('view-kanban')).toBeVisible()
  await expect(page.getByTestId('todo-input')).not.toBeVisible()

  await page.getByTestId('tab-list').click()
  await expect(page.getByTestId('todo-list')).toBeVisible()
  await expect(page.getByTestId('todo-input')).toBeVisible()
  await expect(page.getByTestId('todo-list')).toContainText('列表视图任务')
})
