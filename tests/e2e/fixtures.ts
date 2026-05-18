import { test as base, expect } from '@playwright/test'

// page fixture 已内置 goto('/') + localStorage.clear() + IDB 'todos' 清理 + reload
export const test = base.extend({
  page: async ({ page }, use) => {
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
    await use(page)
  },
})

export { expect }
