import { test, expect } from '@playwright/test'

test('footer 显示版本号和 commit sha', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByTestId('app-version')
  await expect(footer).toBeVisible()
  // vX.Y.Z · <7位commit sha>
  await expect(footer).toHaveText(/^v\d+\.\d+\.\d+ · [a-f0-9]{7}$/)
})
