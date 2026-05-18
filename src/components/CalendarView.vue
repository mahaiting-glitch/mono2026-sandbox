<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import { PRIORITY_EMOJI } from '../constants/priority'
import { groupTodosByDay } from '../utils/calendar'

const store = useTodoStore()

const groupedByDay = computed(() => groupTodosByDay(store.items))
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
