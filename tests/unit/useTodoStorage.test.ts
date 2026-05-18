import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTodoStorage } from '../../src/composables/useTodoStorage'

const idbStore: Record<string, unknown> = {}
vi.mock('idb-keyval', () => ({
  get: async (key: string) => idbStore[key],
  set: async (key: string, value: unknown) => { idbStore[key] = value },
  del: async (key: string) => { delete idbStore[key] },
}))

describe('useTodoStorage · schema version', () => {
  beforeEach(() => {
    for (const k of Object.keys(idbStore)) delete idbStore[k]
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    })
  })

  it('write 存入 __schema_version: 1', async () => {
    const storage = useTodoStorage()
    const todo = { id: '1', title: 'test', done: false, createdAt: 100, priority: 'normal' as const }
    await storage.write([todo])
    expect(idbStore['todos']).toEqual({ __schema_version: 1, items: [todo] })
  })

  it('read · 含 __schema_version 字段 → 不动、正常返回 items', async () => {
    const storage = useTodoStorage()
    idbStore['todos'] = {
      __schema_version: 1,
      items: [{ id: '1', title: 'versioned', done: false, createdAt: 100, priority: 'normal' }],
    }
    const todos = await storage.read()
    expect(todos).toHaveLength(1)
    expect(todos[0]!.title).toBe('versioned')
    // IDB 数据未被改写
    expect((idbStore['todos'] as { __schema_version: number }).__schema_version).toBe(1)
  })

  it('read · 缺 __schema_version（旧格式数组）→ 自动升级存回 __schema_version: 1', async () => {
    const storage = useTodoStorage()
    const legacyItem = { id: '1', title: 'legacy', done: false, createdAt: 100, priority: 'normal' }
    idbStore['todos'] = [legacyItem]
    const todos = await storage.read()
    expect(todos).toHaveLength(1)
    expect(todos[0]!.title).toBe('legacy')
    // 自动升级：IDB 已回写新格式
    expect(idbStore['todos']).toEqual({ __schema_version: 1, items: [legacyItem] })
  })
})
