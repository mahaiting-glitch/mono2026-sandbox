import { test, expect } from './fixtures'
import type { Pinia } from 'pinia'

declare global {
  interface Window { __pinia__?: Pinia }
}

test('创建新 list → 出现在列表栏', async ({ page }) => {
  await expect(page.getByTestId('list-manager')).toBeVisible()

  await page.getByTestId('list-name-input').fill('工作')
  await page.getByTestId('list-create-btn').click()

  await expect(page.getByTestId('list-btn')).toBeVisible()
  await expect(page.getByTestId('list-btn')).toHaveText('工作')
})

test('创建 list 后输入框清空', async ({ page }) => {
  await page.getByTestId('list-name-input').fill('工作')
  await page.getByTestId('list-create-btn').click()

  await expect(page.getByTestId('list-name-input')).toHaveValue('')
})

test('创建新 list → 切换 → TodoList 内容按 listId 过滤', async ({ page }) => {
  // 创建两个 list
  await page.getByTestId('list-name-input').fill('工作')
  await page.getByTestId('list-create-btn').click()
  await expect(page.getByTestId('list-btn').first()).toBeVisible()

  await page.getByTestId('list-name-input').fill('个人')
  await page.getByTestId('list-create-btn').click()
  await expect(page.getByTestId('list-btn')).toHaveCount(2)

  // 切换到「工作」
  await page.getByTestId('list-btn').first().click()

  // 在「工作」列表添加 todo
  await page.getByTestId('todo-input').fill('工作任务')
  await page.getByTestId('todo-add').click()
  await expect(page.getByTestId('todo-title')).toHaveText('工作任务')

  // 切换到「个人」列表 → 工作任务不可见
  await page.getByTestId('list-btn').nth(1).click()
  await expect(page.getByTestId('todo-title')).not.toBeVisible()
  await expect(page.getByTestId('empty')).toBeVisible()

  // 切回「全部」→ 工作任务重新可见
  await page.getByTestId('list-btn-all').click()
  await expect(page.getByTestId('todo-title')).toHaveText('工作任务')
})

test('删除 list → 从列表栏消失', async ({ page }) => {
  await page.getByTestId('list-name-input').fill('临时')
  await page.getByTestId('list-create-btn').click()
  await expect(page.getByTestId('list-btn')).toBeVisible()

  await page.getByTestId('list-delete-btn').click()

  await expect(page.getByTestId('list-btn')).not.toBeVisible()
})

test('删除 active list → 切回全部视图', async ({ page }) => {
  // 创建 list 并切换到它
  await page.getByTestId('list-name-input').fill('工作')
  await page.getByTestId('list-create-btn').click()
  await page.getByTestId('list-btn').click()

  // 在工作 list 添加 todo
  await page.getByTestId('todo-input').fill('工作任务')
  await page.getByTestId('todo-add').click()
  await expect(page.getByTestId('todo-title')).toHaveText('工作任务')

  // 删除工作 list
  await page.getByTestId('list-delete-btn').click()

  // activeListId → null，显示全部 todo（todo 仍存在）+ list-btn-all 处于 active 态
  await expect(page.getByTestId('list-btn')).not.toBeVisible()
  await expect(page.getByTestId('todo-title')).toHaveText('工作任务')
  await expect(page.getByTestId('list-btn-all')).toHaveClass(/bg-\(--color-brand\)/)
})
