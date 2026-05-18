<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import type { Todo } from '../types'
import { PRIORITY_EMOJI } from '../constants/priority'

const store = useTodoStore()

function toDayStart(ts: number): number {
  const d = new Date(ts)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

function formatDay(dayStart: number): string {
  return new Date(dayStart).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const groupedByDay = computed(() => {
  const map = new Map<number, { label: string; todos: Todo[] }>()
  for (const todo of store.items) {
    const dayStart = toDayStart(todo.createdAt)
    const existing = map.get(dayStart)
    if (existing) {
      existing.todos.push(todo)
    } else {
      map.set(dayStart, { label: formatDay(dayStart), todos: [todo] })
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, group]) => group)
})
</script>

<template>
  <div class="mt-6 space-y-6">
    <p
      v-if="store.items.length === 0"
      class="text-sm text-slate-400 dark:text-slate-500 text-center py-4"
      data-testid="calendar-empty"
    >
      还没活儿、加一个试试
    </p>
    <div
      v-for="group in groupedByDay"
      :key="group.label"
      data-testid="calendar-day-group"
    >
      <h2
        class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2"
        data-testid="calendar-day-label"
      >{{ group.label }}</h2>
      <div class="space-y-2">
        <div
          v-for="todo in group.todos"
          :key="todo.id"
          class="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 flex items-center gap-2"
        >
          <span class="text-base leading-none">{{ PRIORITY_EMOJI[todo.priority] }}</span>
          <span
            :class="{ 'line-through text-slate-500': todo.done }"
            class="flex-1 text-sm"
            data-testid="calendar-card-title"
          >{{ todo.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
