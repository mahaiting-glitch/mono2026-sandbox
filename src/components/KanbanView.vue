<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import type { Priority } from '../types'

const store = useTodoStore()

const PRIORITY_EMOJI: Record<Priority, string> = {
  high: '🔴',
  normal: '⚪',
  low: '🔵',
}

const pending = computed(() => store.items.filter(t => !t.done))
const completed = computed(() => store.items.filter(t => t.done))
</script>

<template>
  <div class="grid grid-cols-2 gap-4 mt-6">
    <div>
      <h2
        class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3"
        data-testid="kanban-col-pending-title"
      >待完成</h2>
      <div class="space-y-2" data-testid="kanban-col-pending">
        <div
          v-for="todo in pending"
          :key="todo.id"
          class="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 flex items-center gap-2"
        >
          <span class="text-base leading-none">{{ PRIORITY_EMOJI[todo.priority] }}</span>
          <span class="flex-1 text-sm" data-testid="kanban-card-title">{{ todo.title }}</span>
          <button
            type="button"
            class="text-xs rounded bg-(--color-brand) text-white px-2 py-0.5 hover:bg-(--color-brand-hover) transition-colors"
            :aria-label="'完成：' + todo.title"
            data-testid="kanban-done-btn"
            @click="store.toggle(todo.id)"
          >完成</button>
        </div>
        <p
          v-if="pending.length === 0"
          class="text-sm text-slate-400 dark:text-slate-500 text-center py-4"
          data-testid="kanban-pending-empty"
        >全部完成啦</p>
      </div>
    </div>

    <div>
      <h2
        class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3"
        data-testid="kanban-col-done-title"
      >已完成</h2>
      <div class="space-y-2" data-testid="kanban-col-done">
        <div
          v-for="todo in completed"
          :key="todo.id"
          class="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 flex items-center gap-2 opacity-70"
        >
          <span class="text-base leading-none">{{ PRIORITY_EMOJI[todo.priority] }}</span>
          <span class="flex-1 text-sm line-through text-slate-500" data-testid="kanban-card-title">{{ todo.title }}</span>
          <button
            type="button"
            class="text-xs rounded border border-slate-300 dark:border-slate-600 text-slate-500 px-2 py-0.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            :aria-label="'撤回：' + todo.title"
            data-testid="kanban-undo-btn"
            @click="store.toggle(todo.id)"
          >撤回</button>
        </div>
        <p
          v-if="completed.length === 0"
          class="text-sm text-slate-400 dark:text-slate-500 text-center py-4"
          data-testid="kanban-done-empty"
        >还没完成的</p>
      </div>
    </div>
  </div>
</template>
