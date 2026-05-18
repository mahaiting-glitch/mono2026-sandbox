import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('加 todo + toggle + 删', async ({ page }) => {
  await page.getByTestId('todo-input').fill('喝水')
  await page.getByTestId('todo-add').click()

  await expect(page.getByTestId('remaining')).toHaveText('还剩 1 / 1')

  await page.getByRole('checkbox').first().check()
  await expect(page.getByTestId('remaining')).toHaveText('还剩 0 / 1')

  await page.getByTestId('todo-remove').click()
  await expect(page.getByTestId('empty')).toBeVisible()
})

test('空字符串拦', async ({ page }) => {
  const btn = page.getByTestId('todo-add')
  await expect(btn).toBeDisabled()

  await page.getByTestId('todo-input').fill('   ')
  await expect(btn).toBeDisabled()
})
