<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '../types'
import { PRIORITY_EMOJI } from '../constants/priority'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: []
}>()

const BASE_BTN = 'text-xs rounded px-2 py-0.5 transition-colors'

const toggleBtn = computed(() =>
  props.todo.done
    ? {
        cls: `${BASE_BTN} border border-slate-300 dark:border-slate-600 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100`,
        ariaLabel: '撤回：' + props.todo.title,
        testid: 'kanban-undo-btn',
        text: '撤回',
      }
    : {
        cls: `${BASE_BTN} bg-(--color-brand) text-white hover:bg-(--color-brand-hover)`,
        ariaLabel: '完成：' + props.todo.title,
        testid: 'kanban-done-btn',
        text: '完成',
      }
)
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
      type="button"
      :class="toggleBtn.cls"
      :aria-label="toggleBtn.ariaLabel"
      :data-testid="toggleBtn.testid"
      @click="emit('toggle')"
    >{{ toggleBtn.text }}</button>
  </div>
</template>
