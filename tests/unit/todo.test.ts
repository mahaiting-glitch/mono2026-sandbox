import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../../src/stores/todo'
import { LS_TODOS_LEGACY_KEY } from '../../src/constants/storage-keys'

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

  it('add · 默认 priority 为 normal', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('喝水')
    expect(s.items[0]!.priority).toBe('normal')
  })

  it('add · 指定 priority', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('紧急任务', 'high')
    s.add('低优先级', 'low')
    expect(s.items[0]!.priority).toBe('high')
    expect(s.items[1]!.priority).toBe('low')
  })

  it('setPriority · 更新优先级', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('任务')
    const id = s.items[0]!.id
    s.setPriority(id, 'high')
    expect(s.items[0]!.priority).toBe('high')
    s.setPriority(id, 'low')
    expect(s.items[0]!.priority).toBe('low')
  })

  it('setPriority · 不存在的 id 无副作用', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('任务')
    s.setPriority('not-exist', 'high')
    expect(s.items[0]!.priority).toBe('normal')
  })

  describe('sortedItems', () => {
    it('未完成排在已完成前', async () => {
      const s = useTodoStore()
      await s._initPromise
      s.add('A')
      s.add('B')
      s.toggle(s.items[0]!.id) // A done
      expect(s.sortedItems[0]!.title).toBe('B')
      expect(s.sortedItems[1]!.title).toBe('A')
    })

    it('同为未完成时 high → normal → low', async () => {
      const s = useTodoStore()
      await s._initPromise
      s.add('低', 'low')
      s.add('高', 'high')
      s.add('普', 'normal')
      expect(s.sortedItems.map(t => t.priority)).toEqual(['high', 'normal', 'low'])
    })

    it('不改变 items 原始顺序（非破坏性排序）', async () => {
      const s = useTodoStore()
      await s._initPromise
      s.add('低', 'low')
      s.add('高', 'high')
      expect(s.items[0]!.priority).toBe('low')
      expect(s.sortedItems[0]!.priority).toBe('high')
    })

    it('空数组返回空数组', async () => {
      const s = useTodoStore()
      await s._initPromise
      expect(s.sortedItems).toEqual([])
    })
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

  it('setNote · 添加备注', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('任务')
    const id = s.items[0]!.id
    s.setNote(id, '这是备注')
    expect(s.items[0]!.note).toBe('这是备注')
  })

  it('setNote · 清空备注（空字符串 → 删字段）', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('任务')
    const id = s.items[0]!.id
    s.setNote(id, '旧备注')
    expect(s.items[0]!.note).toBe('旧备注')
    s.setNote(id, '')
    expect(s.items[0]!.note).toBeUndefined()
  })

  it('setNote · trim 后写入', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('任务')
    const id = s.items[0]!.id
    s.setNote(id, '  前后空格  ')
    expect(s.items[0]!.note).toBe('前后空格')
  })

  it('setNote · 不存在的 id 无副作用', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.add('任务')
    s.setNote('not-exist', '备注')
    expect(s.items[0]!.note).toBeUndefined()
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
    it('首次启动从 localStorage 迁移到 IDB · 补 priority 默认值', async () => {
      const todos = [{ id: '1', title: '迁移测试', done: false, createdAt: 123 }]
      localStorage.setItem(LS_TODOS_LEGACY_KEY, JSON.stringify(todos))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(1)
      expect(s.items[0]!.title).toBe('迁移测试')
      expect(s.items[0]!.priority).toBe('normal')
      expect(localStorage.getItem(LS_TODOS_LEGACY_KEY)).toBeNull()
      // 写入 IDB 时已补上 priority + schema version
      expect(idbStore['todos']).toEqual({ __schema_version: 1, items: [{ ...todos[0], priority: 'normal' }] })
    })

    it('IDB 已有数据时不覆盖、仅清 localStorage', async () => {
      const existing = [{ id: '2', title: '已有数据', done: false, createdAt: 456 }]
      idbStore['todos'] = existing

      const old = [{ id: '1', title: '旧 localStorage 数据', done: false, createdAt: 123 }]
      localStorage.setItem(LS_TODOS_LEGACY_KEY, JSON.stringify(old))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(1)
      expect(s.items[0]!.title).toBe('已有数据')
      expect(s.items[0]!.priority).toBe('normal')
      expect(localStorage.getItem(LS_TODOS_LEGACY_KEY)).toBeNull()
    })

    it('IDB 旧数据无 priority → read 补默认值', async () => {
      idbStore['todos'] = [{ id: '1', title: '旧数据', done: false, createdAt: 1 }]

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(1)
      expect(s.items[0]!.priority).toBe('normal')
    })

    it('localStorage 数据损坏·JSON 无效 → 清 localStorage 不影响 IDB', async () => {
      localStorage.setItem(LS_TODOS_LEGACY_KEY, 'not-valid-json')

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(0)
      expect(localStorage.getItem(LS_TODOS_LEGACY_KEY)).toBeNull()
    })

    it('localStorage 数据损坏·非数组 → 清 localStorage', async () => {
      localStorage.setItem(LS_TODOS_LEGACY_KEY, JSON.stringify({ foo: 1 }))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(0)
      expect(localStorage.getItem(LS_TODOS_LEGACY_KEY)).toBeNull()
    })

    it('localStorage 数据损坏·数组但 item 缺字段 → 清 localStorage', async () => {
      localStorage.setItem(LS_TODOS_LEGACY_KEY, JSON.stringify([{ id: '1', title: 'x' }]))

      const s = useTodoStore()
      await s._initPromise

      expect(s.total).toBe(0)
      expect(localStorage.getItem(LS_TODOS_LEGACY_KEY)).toBeNull()
    })

    it('无 localStorage 数据 → 正常启动 IDB 为空', async () => {
      const s = useTodoStore()
      await s._initPromise
      expect(s.total).toBe(0)
    })
  })
})
