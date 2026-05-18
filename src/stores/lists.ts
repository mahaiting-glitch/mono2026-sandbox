import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { List } from '../types'

export const useListsStore = defineStore('lists', () => {
  const lists = ref<List[]>([])
  const activeListId = ref<string | null>(null)

  const activeList = computed(() =>
    lists.value.find(l => l.id === activeListId.value) ?? null
  )

  function createList(title: string): List | undefined {
    const trimmed = title.trim()
    if (!trimmed) return undefined
    const list: List = { id: crypto.randomUUID(), title: trimmed, createdAt: Date.now() }
    lists.value.push(list)
    return list
  }

  function deleteList(id: string) {
    lists.value = lists.value.filter(l => l.id !== id)
    if (activeListId.value === id) activeListId.value = null
  }

  function setActiveList(id: string | null) {
    activeListId.value = id
  }

  return { lists, activeListId, activeList, createList, deleteList, setActiveList }
})
