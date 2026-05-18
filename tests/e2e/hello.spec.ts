import { test, expect } from './fixtures'

test('h 键显示 hello banner', async ({ page }) => {
  await page.keyboard.press('h')
  await expect(page.getByTestId('hello-banner')).toBeVisible()
  expect(await page.getByTestId('hello-banner').textContent()).toBe('Hello, World!')
})

test('hello banner 2s 后自动消失', async ({ page }) => {
  await page.keyboard.press('h')
  await expect(page.getByTestId('hello-banner')).toBeVisible()
  await expect(page.getByTestId('hello-banner')).not.toBeVisible({ timeout: 3500 })
})

test('h 键在输入框聚焦时不触发 banner', async ({ page }) => {
  await page.getByTestId('todo-input').focus()
  await page.keyboard.press('h')
  await expect(page.getByTestId('hello-banner')).not.toBeVisible({ timeout: 1000 })
})
