import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Todo } from '../types'
import { useTodoStorage } from '../composables/useTodoStorage'

export const useTodoStore = defineStore('todo', () => {
  const items = ref<Todo[]>([])
  const storage = useTodoStorage()

  let initialized = false

  const _initPromise = storage.migrate()
    .then(() => storage.read())
    .then(saved => {
      items.value = saved
      initialized = true
    })

  const remaining = computed(() => items.value.filter(t => !t.done).length)
  const total = computed(() => items.value.length)
  const headingText = computed(() =>
    total.value > 0 ? `Todo · 剩 ${remaining.value} / 总 ${total.value}` : 'Todo'
  )

  function add(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return
    items.value.push({
      id: crypto.randomUUID(),
      title: trimmed,
      done: false,
      createdAt: Date.now(),
    })
  }

  function toggle(id: string) {
    const t = items.value.find(t => t.id === id)
    if (t) t.done = !t.done
  }

  function remove(id: string) {
    items.value = items.value.filter(t => t.id !== id)
  }

  function clearDone() {
    items.value = items.value.filter(t => !t.done)
  }

  function edit(id: string, title: string) {
    const trimmed = title.trim()
    const t = items.value.find(t => t.id === id)
    if (t && trimmed) t.title = trimmed
  }

  watch(items, v => { if (initialized) void storage.write(v) }, { deep: true })

  return { items, remaining, total, headingText, add, toggle, remove, clearDone, edit, _initPromise }
})
