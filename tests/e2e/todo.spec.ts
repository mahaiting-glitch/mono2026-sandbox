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

test('H1 显示进度随 todo 变化', async ({ page }) => {
  const h1 = page.getByTestId('heading')
  await expect(h1).toHaveText('Todo')

  await page.getByTestId('todo-input').fill('喝水')
  await page.getByTestId('todo-add').click()
  await expect(h1).toHaveText('Todo · 剩 1 / 总 1')

  await page.getByRole('checkbox').first().check()
  await expect(h1).toHaveText('Todo · 剩 0 / 总 1')

  await page.getByTestId('todo-remove').click()
  await expect(h1).toHaveText('Todo')
})

test('空字符串拦', async ({ page }) => {
  const btn = page.getByTestId('todo-add')
  await expect(btn).toBeDisabled()

  await page.getByTestId('todo-input').fill('   ')
  await expect(btn).toBeDisabled()
})

test('行内编辑 · 双击 → enter 保存', async ({ page }) => {
  await page.getByTestId('todo-input').fill('原始标题')
  await page.getByTestId('todo-add').click()

  // 双击标题进入编辑模式
  await page.getByTestId('todo-title').dblclick()
  await expect(page.getByTestId('todo-edit-input')).toBeVisible()
  await expect(page.getByTestId('todo-title')).not.toBeVisible()

  // 清空 + 输入新内容 + enter
  await page.getByTestId('todo-edit-input').fill('修改后标题')
  await page.getByTestId('todo-edit-input').press('Enter')

  // 保存后 input 消失、标题更新
  await expect(page.getByTestId('todo-edit-input')).not.toBeVisible()
  await expect(page.getByTestId('todo-title')).toHaveText('修改后标题')
})

test('行内编辑 · Esc 取消', async ({ page }) => {
  await page.getByTestId('todo-input').fill('原始标题')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('todo-title').dblclick()
  await page.getByTestId('todo-edit-input').fill('修改中')
  await page.getByTestId('todo-edit-input').press('Escape')

  // 取消后回原值
  await expect(page.getByTestId('todo-title')).toHaveText('原始标题')
})

test('行内编辑 · 空字符串不保存', async ({ page }) => {
  await page.getByTestId('todo-input').fill('原始标题')
  await page.getByTestId('todo-add').click()

  await page.getByTestId('todo-title').dblclick()
  await page.getByTestId('todo-edit-input').fill('   ')
  await page.getByTestId('todo-edit-input').press('Enter')

  // 空字符串不保存、回原值
  await expect(page.getByTestId('todo-title')).toHaveText('原始标题')
})

test('行内编辑 · 只允许单行编辑', async ({ page }) => {
  await page.getByTestId('todo-input').fill('第一条')
  await page.getByTestId('todo-add').click()
  await page.getByTestId('todo-input').fill('第二条')
  await page.getByTestId('todo-add').click()

  // 双击第一条进入编辑
  await page.getByTestId('todo-title').first().dblclick()
  await expect(page.getByTestId('todo-edit-input')).toHaveCount(1)

  // 双击第二条 → 第一条自动保存、第二条进入编辑
  await page.getByTestId('todo-title').dblclick()
  await expect(page.getByTestId('todo-edit-input')).toHaveCount(1)
})

test('/ 键聚焦输入框', async ({ page }) => {
  // 初始焦点不在输入框（点空白区域）
  await page.locator('h1').click()
  await page.keyboard.press('/')
  await expect(page.getByTestId('todo-input')).toBeFocused()
})

test('/ 键焦点已在输入框时不拦截', async ({ page }) => {
  const input = page.getByTestId('todo-input')
  await input.click()
  await page.keyboard.press('/')
  // 能正常输入 /（input value 应含 /）
  await expect(input).toHaveValue('/')
})

test('dark mode 切换 + 持久化', async ({ page }) => {
  // 强制 light 起点
  await page.evaluate(() => localStorage.setItem('mono2026-sandbox.colorScheme', 'light'))
  await page.reload()

  const html = page.locator('html')
  await expect(html).not.toHaveClass(/dark/)

  // 点一下 → dark
  await page.getByTestId('theme-toggle').click()
  await expect(html).toHaveClass(/dark/)

  // 刷新 → 还是 dark（localStorage 持久化）
  await page.reload()
  await expect(html).toHaveClass(/dark/)

  // 再点 → 回 light
  await page.getByTestId('theme-toggle').click()
  await expect(html).not.toHaveClass(/dark/)
})
