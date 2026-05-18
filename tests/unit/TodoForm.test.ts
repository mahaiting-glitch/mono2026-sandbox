import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import TodoForm from '../../src/components/TodoForm.vue'
import { useTodoStore } from '../../src/stores/todo'
import { useListsStore } from '../../src/stores/lists'
import { idbStore, clearIdbStore, memoryStorage } from './_helpers/storage-mock'

vi.mock('idb-keyval', () => ({
  get: async (key: string) => idbStore[key],
  set: async (key: string, value: unknown) => { idbStore[key] = value },
  del: async (key: string) => { delete idbStore[key] },
}))

describe('TodoForm · list 选择器交互', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    clearIdbStore()
    setActivePinia(createPinia())
  })

  it('无 list 时不渲染 list-select', async () => {
    const wrapper = mount(TodoForm)
    await nextTick()
    expect(wrapper.find('[data-testid="list-select"]').exists()).toBe(false)
  })

  it('有 list 时渲染 list-select', async () => {
    const listsStore = useListsStore()
    listsStore.createList('工作')

    const wrapper = mount(TodoForm)
    await nextTick()
    expect(wrapper.find('[data-testid="list-select"]').exists()).toBe(true)
  })

  it('activeListId 为 list-1 时提交 → 新 todo 的 listId = list-1', async () => {
    const todoStore = useTodoStore()
    const listsStore = useListsStore()
    await todoStore._initPromise

    const list = listsStore.createList('工作')
    listsStore.setActiveList(list!.id)

    const wrapper = mount(TodoForm)
    await nextTick()

    await wrapper.find('[data-testid="todo-input"]').setValue('测试任务')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(todoStore.items).toHaveLength(1)
    expect(todoStore.items[0]!.listId).toBe(list!.id)
  })

  it('activeListId 为 null 时提交 → 新 todo 无 listId', async () => {
    const todoStore = useTodoStore()
    const listsStore = useListsStore()
    await todoStore._initPromise

    listsStore.createList('工作')
    listsStore.setActiveList(null)

    const wrapper = mount(TodoForm)
    await nextTick()

    await wrapper.find('[data-testid="todo-input"]').setValue('无分类任务')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(todoStore.items).toHaveLength(1)
    expect(todoStore.items[0]!.listId).toBeUndefined()
  })
})
