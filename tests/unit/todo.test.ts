import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../../src/stores/todo'

// Mock idb-keyval in-memory
const idbStore: Record<string, unknown> = {}
vi.mock('idb-keyval', () => ({
  get: async (key: string) => idbStore[key],
  set: async (key: string, value: unknown) => { idbStore[key] = value },
  del: async (key: string) => { delete idbStore[key] },
}))

function memoryStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length },
  }
}

describe('useTodoStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    for (const k of Object.keys(idbStore)) delete idbStore[k]
    setActivePinia(createPinia())
  })

  it('add 空字符串不入', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('   ')
    expect(s.total).toBe(0)
  })

  it('add / toggle / remove 链路', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('喝水')
    expect(s.total).toBe(1)
    expect(s.remaining).toBe(1)

    const id = s.items[0]!.id
    s.toggle(id)
    expect(s.remaining).toBe(0)

    s.remove(id)
    expect(s.total).toBe(0)
  })

  it('headingText · 0 todo 显示 Todo', async () => {
    const s = useTodoStore()
    await s._initPromise
    expect(s.headingText).toBe('Todo')
  })

  it('headingText · 有 todo 显示进度', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('喝水')
    s.add('吃饭')
    expect(s.headingText).toBe('Todo · 剩 2 / 总 2')
    s.toggle(s.items[0]!.id)
    expect(s.headingText).toBe('Todo · 剩 1 / 总 2')
    s.toggle(s.items[1]!.id)
    expect(s.headingText).toBe('Todo · 剩 0 / 总 2')
  })

  it('clearDone 只清已完成', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('a')
    s.add('b')
    s.toggle(s.items[0]!.id)
    s.clearDone()
    expect(s.total).toBe(1)
    expect(s.items[0]!.title).toBe('b')
  })

  it('edit · 正常更新标题', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('旧标题')
    const id = s.items[0]!.id
    s.edit(id, '新标题')
    expect(s.items[0]!.title).toBe('新标题')
  })

  it('edit · 空字符串回退原值', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('旧标题')
    const id = s.items[0]!.id
    s.edit(id, '   ')
    expect(s.items[0]!.title).toBe('旧标题')
  })

  it('edit · trim 后更新', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('旧标题')
    const id = s.items[0]!.id
    s.edit(id, '  新标题  ')
    expect(s.items[0]!.title).toBe('新标题')
  })

  it('edit · 不存在的 id 无副作用', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('旧标题')
    s.edit('not-exist', '新标题')
    expect(s.items[0]!.title).toBe('旧标题')
  })

  it('IDB 损坏·非数组 → 回退 []', async () => {
    idbStore['todos'] = { foo: 1 }
    const s = useTodoStore()
    await s._initPromise
    expect(s.total).toBe(0)
  })

  it('IDB 损坏·数组但 item 缺字段 → 回退 []', async () => {
    idbStore['todos'] = [{ id: '1', title: 'x' }]
    const s = useTodoStore()
    await s._initPromise
    expect(s.total).toBe(0)
  })

  describe('localStorage 迁移', () => {
    it('首次启动从 localStorage 迁移到 IDB', async () => {
      const todos = [{ id: '1', title: '迁移测试', done: false, createdAt: 123 }]
      localStorage.setItem('mono2026-sandbox.todos', JSON.stringify(todos))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(1)
      expect(s.items[0]!.title).toBe('迁移测试')
      expect(localStorage.getItem('mono2026-sandbox.todos')).toBeNull()
      expect(idbStore['todos']).toEqual(todos)
    })

    it('IDB 已有数据时不覆盖、仅清 localStorage', async () => {
      const existing = [{ id: '2', title: '已有数据', done: false, createdAt: 456 }]
      idbStore['todos'] = existing

      const old = [{ id: '1', title: '旧 localStorage 数据', done: false, createdAt: 123 }]
      localStorage.setItem('mono2026-sandbox.todos', JSON.stringify(old))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(1)
      expect(s.items[0]!.title).toBe('已有数据')
      expect(localStorage.getItem('mono2026-sandbox.todos')).toBeNull()
    })

    it('localStorage 数据损坏·JSON 无效 → 清 localStorage 不影响 IDB', async () => {
      localStorage.setItem('mono2026-sandbox.todos', 'not-valid-json')

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(0)
      expect(localStorage.getItem('mono2026-sandbox.todos')).toBeNull()
    })

    it('localStorage 数据损坏·非数组 → 清 localStorage', async () => {
      localStorage.setItem('mono2026-sandbox.todos', JSON.stringify({ foo: 1 }))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(0)
      expect(localStorage.getItem('mono2026-sandbox.todos')).toBeNull()
    })

    it('localStorage 数据损坏·数组但 item 缺字段 → 清 localStorage', async () => {
      localStorage.setItem('mono2026-sandbox.todos', JSON.stringify([{ id: '1', title: 'x' }]))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(0)
      expect(localStorage.getItem('mono2026-sandbox.todos')).toBeNull()
    })

    it('无 localStorage 数据 → 正常启动 IDB 为空', async () => {
      const s = useTodoStore()
      await s._initPromise
      expect(s.total).toBe(0)
    })
  })
})
