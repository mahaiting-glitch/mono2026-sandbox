<script setup lang="ts">
import type { Todo } from '../types'
import { PRIORITY_EMOJI } from '../constants/priority'

defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div
    class="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 flex items-center gap-2"
    :class="{ 'opacity-70': todo.done }"
  >
    <span class="text-base leading-none">{{ PRIORITY_EMOJI[todo.priority] }}</span>
    <span
      class="flex-1 text-sm"
      :class="{ 'line-through text-slate-500': todo.done }"
      data-testid="kanban-card-title"
    >{{ todo.title }}</span>
    <button
      v-if="!todo.done"
      type="button"
      class="text-xs rounded bg-(--color-brand) text-white px-2 py-0.5 hover:bg-(--color-brand-hover) transition-colors"
      :aria-label="'完成：' + todo.title"
      data-testid="kanban-done-btn"
      @click="emit('toggle')"
    >完成</button>
    <button
      v-else
      type="button"
      class="text-xs rounded border border-slate-300 dark:border-slate-600 text-slate-500 px-2 py-0.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      :aria-label="'撤回：' + todo.title"
      data-testid="kanban-undo-btn"
      @click="emit('toggle')"
    >撤回</button>
  </div>
</template>
