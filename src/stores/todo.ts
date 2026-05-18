import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Todo } from '../types'

const STORAGE_KEY = 'mono2026-sandbox.todos'

function isTodo(v: unknown): v is Todo {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.done === 'boolean' &&
    typeof r.createdAt === 'number'
  )
}

function load(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isTodo)) return []
    return parsed
  } catch {
    return []
  }
}

export const useTodoStore = defineStore('todo', () => {
  const items = ref<Todo[]>(load())

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

  watch(items, v => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })

  return { items, remaining, total, headingText, add, toggle, remove, clearDone, edit }
})
