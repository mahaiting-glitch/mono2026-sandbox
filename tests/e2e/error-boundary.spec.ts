import { test, expect } from '@playwright/test'

test('正常渲染时不显示 fallback', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('error-boundary-fallback')).not.toBeVisible()
  await expect(page.getByTestId('heading')).toBeVisible()
})

test('注入 __crash__ = true 后显示 fallback UI', async ({ page }) => {
  // addInitScript runs before any page scripts, so __crash__ is set when App mounts
  await page.addInitScript(() => {
    (window as Window & { __crash__?: boolean }).__crash__ = true
  })
  await page.goto('/')
  await expect(page.getByTestId('error-boundary-fallback')).toBeVisible()
  await expect(page.getByText('出错了')).toBeVisible()
  await expect(page.getByTestId('error-boundary-reload')).toBeVisible()
})
