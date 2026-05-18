import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { Todo } from '../types'
import { useListsStore } from '../stores/lists'

export function useActiveListFilter(source: MaybeRefOrGetter<Todo[]>) {
  const listsStore = useListsStore()
  return computed(() => {
    const id = listsStore.activeListId
    const items = toValue(source)
    if (!id) return items
    return items.filter(t => t.listId === id)
  })
}
