import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    localStorage.clear()
    await new Promise<void>(resolve => {
      const openReq = indexedDB.open('keyval-store')
      openReq.onerror = () => resolve()
      openReq.onsuccess = () => {
        const db = openReq.result
        if (!db.objectStoreNames.contains('keyval')) { db.close(); resolve(); return }
        const tx = db.transaction('keyval', 'readwrite')
        tx.objectStore('keyval').delete('todos')
        tx.oncomplete = () => { db.close(); resolve() }
        tx.onerror = () => { db.close(); resolve() }
      }
    })
  })
  await page.reload()
})

test('axe-core: 空状态 0 violation', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('axe-core: 有 todo 时 0 violation', async ({ page }) => {
  await page.getByTestId('todo-input').fill('买菜')
  await page.getByTestId('todo-add').click()
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Tab 序列: theme-toggle → todo-input 可达', async ({ page }) => {
  // 首次 Tab 进入页面 → theme-toggle（DOM 第一个可聚焦元素）
  await page.keyboard.press('Tab')
  await expect(page.getByTestId('theme-toggle')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByTestId('todo-input')).toBeFocused()
})

test('Tab 序列: todo-input 有内容时 todo-add 可聚焦', async ({ page }) => {
  // todo-add 在 input 为空时 disabled，填入内容后才进入 tab 序列
  await page.getByTestId('todo-input').fill('买菜')
  await page.keyboard.press('Tab')
  await expect(page.getByTestId('todo-add')).toBeFocused()
})

test('Tab 序列: todo 列表中 checkbox → 删除按钮可达', async ({ page }) => {
  await page.getByTestId('todo-input').fill('买菜')
  await page.getByTestId('todo-add').click()

  // 提交后 input 清空、todo-add 重新 disabled
  // 从 todo-input Tab → 跳过 disabled add 按钮 → 直接到 checkbox
  await page.getByTestId('todo-input').focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('checkbox')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '删除：买菜' })).toBeFocused()
})

test('aria-live: 常驻 status 区域始终存在并更新', async ({ page }) => {
  const liveRegion = page.getByTestId('remaining-live')
  await expect(liveRegion).toHaveAttribute('aria-live', 'polite')
  await expect(liveRegion).toHaveText('')

  await page.getByTestId('todo-input').fill('买菜')
  await page.getByTestId('todo-add').click()
  await expect(liveRegion).toHaveText('还剩 1 / 1')
})

test('删除按钮 aria-label 含 todo 标题', async ({ page }) => {
  await page.getByTestId('todo-input').fill('买菜')
  await page.getByTestId('todo-add').click()
  await expect(page.getByRole('button', { name: '删除：买菜' })).toBeVisible()
})

test('checkbox aria-label 含 todo 标题', async ({ page }) => {
  await page.getByTestId('todo-input').fill('喝水')
  await page.getByTestId('todo-add').click()
  await expect(page.getByRole('checkbox', { name: '标记完成：喝水' })).toBeVisible()
})

test('aria snapshot: 有 todo 时 main 区域结构', async ({ page }) => {
  await page.getByTestId('todo-input').fill('买菜')
  await page.getByTestId('todo-add').click()
  await expect(page.locator('main')).toMatchAriaSnapshot(`
    - main:
      - heading /Todo/
      - textbox "新待办事项"
      - button "添加待办"
      - list:
        - listitem:
          - checkbox "标记完成：买菜"
          - text: 买菜
          - button "删除：买菜"
      - text: /还剩 1 \/ 1/
      - button "清完成"
      - combobox "主题"
  `)
})
