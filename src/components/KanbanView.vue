<script setup lang="ts">
import { computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import KanbanCard from './KanbanCard.vue'
import { useActiveListFilter } from '../composables/useActiveListFilter'

const store = useTodoStore()
const filteredItems = useActiveListFilter(() => store.sortedItems)

const pending = computed(() => filteredItems.value.filter(t => !t.done))
const completed = computed(() => filteredItems.value.filter(t => t.done))
</script>

<template>
  <div class="grid grid-cols-2 gap-4 mt-6">
    <div>
      <h2
        class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3"
        data-testid="kanban-col-pending-title"
      >待完成</h2>
      <div class="space-y-2" data-testid="kanban-col-pending">
        <KanbanCard
          v-for="todo in pending"
          :key="todo.id"
          :todo="todo"
          @toggle="store.toggle(todo.id)"
        />
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
        <KanbanCard
          v-for="todo in completed"
          :key="todo.id"
          :todo="todo"
          @toggle="store.toggle(todo.id)"
        />
        <p
          v-if="completed.length === 0"
          class="text-sm text-slate-400 dark:text-slate-500 text-center py-4"
          data-testid="kanban-done-empty"
        >还没完成的</p>
      </div>
    </div>
  </div>
</template>
