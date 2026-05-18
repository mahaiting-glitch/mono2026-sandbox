import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import ListManager from '../../src/components/ListManager.vue'
import { useListsStore } from '../../src/stores/lists'
import { idbStore, clearIdbStore, memoryStorage } from './_helpers/storage-mock'

vi.mock('idb-keyval', () => ({
  get: async (key: string) => idbStore[key],
  set: async (key: string, value: unknown) => { idbStore[key] = value },
  del: async (key: string) => { delete idbStore[key] },
}))

describe('ListManager', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    clearIdbStore()
    setActivePinia(createPinia())
  })

  it('渲染时显示「全部」按钮', () => {
    const wrapper = mount(ListManager)
    expect(wrapper.find('[data-testid="list-btn-all"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="list-btn-all"]').text()).toBe('全部')
  })

  it('输入列表名称 + 点击新建 → 新增 list', async () => {
    const listsStore = useListsStore()
    const wrapper = mount(ListManager)

    await wrapper.find('[data-testid="list-name-input"]').setValue('工作')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(listsStore.lists).toHaveLength(1)
    expect(listsStore.lists[0]!.title).toBe('工作')
  })

  it('创建后输入框清空', async () => {
    const wrapper = mount(ListManager)

    await wrapper.find('[data-testid="list-name-input"]').setValue('工作')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect((wrapper.find('[data-testid="list-name-input"]').element as HTMLInputElement).value).toBe('')
  })

  it('空字符串不新建 list', async () => {
    const listsStore = useListsStore()
    const wrapper = mount(ListManager)

    await wrapper.find('[data-testid="list-name-input"]').setValue('   ')
    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(listsStore.lists).toHaveLength(0)
  })

  it('新建按钮在空输入时 disabled', () => {
    const wrapper = mount(ListManager)
    expect((wrapper.find('[data-testid="list-create-btn"]').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('显示已有 list 的按钮', async () => {
    const listsStore = useListsStore()
    listsStore.createList('工作')
    listsStore.createList('个人')

    const wrapper = mount(ListManager)
    await nextTick()

    const btns = wrapper.findAll('[data-testid="list-btn"]')
    expect(btns).toHaveLength(2)
    expect(btns[0]!.text()).toBe('工作')
    expect(btns[1]!.text()).toBe('个人')
  })

  it('点击 list 按钮 → setActiveList', async () => {
    const listsStore = useListsStore()
    const list = listsStore.createList('工作')

    const wrapper = mount(ListManager)
    await nextTick()

    await wrapper.find('[data-testid="list-btn"]').trigger('click')
    await nextTick()

    expect(listsStore.activeListId).toBe(list!.id)
  })

  it('点击「全部」按钮 → activeListId 置 null', async () => {
    const listsStore = useListsStore()
    const list = listsStore.createList('工作')
    listsStore.setActiveList(list!.id)

    const wrapper = mount(ListManager)
    await nextTick()

    await wrapper.find('[data-testid="list-btn-all"]').trigger('click')
    await nextTick()

    expect(listsStore.activeListId).toBeNull()
  })

  it('点击删除按钮 → 删除 list', async () => {
    const listsStore = useListsStore()
    listsStore.createList('工作')

    const wrapper = mount(ListManager)
    await nextTick()

    expect(listsStore.lists).toHaveLength(1)

    await wrapper.find('[data-testid="list-delete-btn"]').trigger('click')
    await nextTick()

    expect(listsStore.lists).toHaveLength(0)
  })

  it('删除 active list → activeListId 置 null', async () => {
    const listsStore = useListsStore()
    const list = listsStore.createList('工作')
    listsStore.setActiveList(list!.id)

    const wrapper = mount(ListManager)
    await nextTick()

    await wrapper.find('[data-testid="list-delete-btn"]').trigger('click')
    await nextTick()

    expect(listsStore.activeListId).toBeNull()
  })
})
