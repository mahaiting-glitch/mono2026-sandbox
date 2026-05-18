import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useListsStore } from '../../src/stores/lists'
import { useTodoStore } from '../../src/stores/todo'

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

describe('useListsStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    for (const k of Object.keys(idbStore)) delete idbStore[k]
    setActivePinia(createPinia())
  })

  it('createList · 新增 list', () => {
    const s = useListsStore()
    s.createList('工作')
    expect(s.lists).toHaveLength(1)
    expect(s.lists[0]!.title).toBe('工作')
  })

  it('createList · 空字符串不入', () => {
    const s = useListsStore()
    s.createList('   ')
    expect(s.lists).toHaveLength(0)
  })

  it('createList · 返回新建的 list', () => {
    const s = useListsStore()
    const list = s.createList('个人')
    expect(list).toBeDefined()
    expect(list!.title).toBe('个人')
    expect(typeof list!.id).toBe('string')
  })

  it('deleteList · 删除指定 list', () => {
    const s = useListsStore()
    s.createList('工作')
    s.createList('个人')
    const id = s.lists[0]!.id
    s.deleteList(id)
    expect(s.lists).toHaveLength(1)
    expect(s.lists[0]!.title).toBe('个人')
  })

  it('deleteList · 删除 active list 时清空 activeListId', () => {
    const s = useListsStore()
    const list = s.createList('工作')
    s.setActiveList(list!.id)
    expect(s.activeListId).toBe(list!.id)
    s.deleteList(list!.id)
    expect(s.activeListId).toBeNull()
  })

  it('deleteList · 删除非 active list 不影响 activeListId', () => {
    const s = useListsStore()
    const a = s.createList('工作')
    const b = s.createList('个人')
    s.setActiveList(a!.id)
    s.deleteList(b!.id)
    expect(s.activeListId).toBe(a!.id)
  })

  it('setActiveList · 设置 activeListId', () => {
    const s = useListsStore()
    const list = s.createList('工作')
    s.setActiveList(list!.id)
    expect(s.activeListId).toBe(list!.id)
  })

  it('setActiveList · 传 null 清空', () => {
    const s = useListsStore()
    const list = s.createList('工作')
    s.setActiveList(list!.id)
    s.setActiveList(null)
    expect(s.activeListId).toBeNull()
  })

  it('activeList · 返回当前 active list 对象', () => {
    const s = useListsStore()
    const list = s.createList('工作')
    s.setActiveList(list!.id)
    expect(s.activeList).toEqual(list)
  })

  it('activeList · 无 active 时返回 null', () => {
    const s = useListsStore()
    s.createList('工作')
    expect(s.activeList).toBeNull()
  })
})

describe('useTodoStore.getTodosByListId', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    for (const k of Object.keys(idbStore)) delete idbStore[k]
    setActivePinia(createPinia())
  })

  it('按 listId 过滤正确', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.items.push(
      { id: '1', title: '任务A', done: false, createdAt: 1, priority: 'normal', listId: 'list-1' },
      { id: '2', title: '任务B', done: false, createdAt: 2, priority: 'normal', listId: 'list-2' },
      { id: '3', title: '任务C', done: false, createdAt: 3, priority: 'normal', listId: 'list-1' },
    )
    const result = s.getTodosByListId('list-1')
    expect(result).toHaveLength(2)
    expect(result.map(t => t.title)).toEqual(['任务A', '任务C'])
  })

  it('listId 不存在时返回空数组', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.items.push(
      { id: '1', title: '任务A', done: false, createdAt: 1, priority: 'normal', listId: 'list-1' },
    )
    expect(s.getTodosByListId('list-x')).toHaveLength(0)
  })

  it('无 listId 的 todo 不被返回', async () => {
    const s = useTodoStore()
    await s._initPromise
    s.items.push(
      { id: '1', title: '无分类任务', done: false, createdAt: 1, priority: 'normal' },
    )
    expect(s.getTodosByListId('list-1')).toHaveLength(0)
  })
})
