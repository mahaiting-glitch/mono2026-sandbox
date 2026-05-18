import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import TodoList from '../../src/components/TodoList.vue'
import { useTodoStore } from '../../src/stores/todo'
import { useListsStore } from '../../src/stores/lists'
import { idbStore, clearIdbStore, memoryStorage } from './_helpers/storage-mock'

vi.mock('idb-keyval', () => ({
  get: async (key: string) => idbStore[key],
  set: async (key: string, value: unknown) => { idbStore[key] = value },
  del: async (key: string) => { delete idbStore[key] },
}))

describe('TodoList · 按 listId 过滤', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    clearIdbStore()
    setActivePinia(createPinia())
  })

  it('activeListId 为 null 时展示全部 todo', async () => {
    const todoStore = useTodoStore()
    const listsStore = useListsStore()
    await todoStore._initPromise

    todoStore.items.push(
      { id: '1', title: '任务A', done: false, createdAt: 1, priority: 'normal', listId: 'list-1' },
      { id: '2', title: '任务B', done: false, createdAt: 2, priority: 'normal', listId: 'list-2' },
    )
    listsStore.setActiveList(null)

    const wrapper = mount(TodoList)
    await nextTick()

    const titles = wrapper.findAll('[data-testid="todo-title"]').map(el => el.text())
    expect(titles).toContain('任务A')
    expect(titles).toContain('任务B')
  })

  it('activeListId 为 list-1 时只展示 list-1 的 todo', async () => {
    const todoStore = useTodoStore()
    const listsStore = useListsStore()
    await todoStore._initPromise

    todoStore.items.push(
      { id: '1', title: '任务A', done: false, createdAt: 1, priority: 'normal', listId: 'list-1' },
      { id: '2', title: '任务B', done: false, createdAt: 2, priority: 'normal', listId: 'list-2' },
      { id: '3', title: '任务C', done: false, createdAt: 3, priority: 'normal', listId: 'list-1' },
    )
    listsStore.setActiveList('list-1')

    const wrapper = mount(TodoList)
    await nextTick()

    const titles = wrapper.findAll('[data-testid="todo-title"]').map(el => el.text())
    expect(titles).toHaveLength(2)
    expect(titles).toContain('任务A')
    expect(titles).toContain('任务C')
    expect(titles).not.toContain('任务B')
  })

  it('切换 activeListId 时展示内容更新', async () => {
    const todoStore = useTodoStore()
    const listsStore = useListsStore()
    await todoStore._initPromise

    todoStore.items.push(
      { id: '1', title: '任务A', done: false, createdAt: 1, priority: 'normal', listId: 'list-1' },
      { id: '2', title: '任务B', done: false, createdAt: 2, priority: 'normal', listId: 'list-2' },
    )

    listsStore.setActiveList('list-1')
    const wrapper = mount(TodoList)
    await nextTick()

    let titles = wrapper.findAll('[data-testid="todo-title"]').map(el => el.text())
    expect(titles).toEqual(['任务A'])

    listsStore.setActiveList('list-2')
    await nextTick()

    titles = wrapper.findAll('[data-testid="todo-title"]').map(el => el.text())
    expect(titles).toEqual(['任务B'])
  })

  it('过滤后无 todo 时显示空状态', async () => {
    const todoStore = useTodoStore()
    const listsStore = useListsStore()
    await todoStore._initPromise

    todoStore.items.push(
      { id: '1', title: '任务A', done: false, createdAt: 1, priority: 'normal', listId: 'list-1' },
    )
    listsStore.setActiveList('list-2')

    const wrapper = mount(TodoList)
    await nextTick()

    expect(wrapper.find('[data-testid="empty"]').exists()).toBe(true)
  })
})
