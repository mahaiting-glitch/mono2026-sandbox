<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import { useListsStore } from '../stores/lists'
import { PRIORITY_EMOJI, PRIORITY_LIST } from '../constants/priority'
import type { Priority } from '../types'

const todoStore = useTodoStore()
const listsStore = useListsStore()

const input = ref('')
const newPriority = ref<Priority>('normal')
const todoInputRef = ref<HTMLInputElement | null>(null)

const selectedListId = computed({
  get: () => listsStore.activeListId ?? '',
  set: (v: string) => listsStore.setActiveList(v || null),
})

function submit() {
  todoStore.add(input.value, newPriority.value, listsStore.activeListId ?? undefined)
  input.value = ''
  newPriority.value = 'normal'
}

function handleSlashKey(e: KeyboardEvent) {
  if (!todoInputRef.value) return
  if (document.activeElement === todoInputRef.value) return
  e.preventDefault()
  todoInputRef.value.focus()
}

defineExpose({ handleSlashKey })
</script>

<template>
  <form class="flex gap-2 mb-6" @submit.prevent="submit">
    <select
      v-if="listsStore.lists.length > 0"
      v-model="selectedListId"
      aria-label="所属列表"
      data-testid="list-select"
      class="rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
    >
      <option value="">全部</option>
      <option v-for="l in listsStore.lists" :key="l.id" :value="l.id">{{ l.title }}</option>
    </select>
    <select
      v-model="newPriority"
      aria-label="优先级"
      data-testid="priority-select"
      class="rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
    >
      <option v-for="p in PRIORITY_LIST" :key="p" :value="p">{{ PRIORITY_EMOJI[p] }}</option>
    </select>
    <input
      v-model="input"
      type="text"
      ref="todoInputRef"
      placeholder="加点啥"
      aria-label="新待办事项"
      class="flex-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
      data-testid="todo-input"
    />
    <button
      type="submit"
      class="rounded bg-(--color-brand) px-3 py-2 text-white hover:bg-(--color-brand-hover) disabled:opacity-50"
      :disabled="!input.trim()"
      aria-label="添加待办"
      data-testid="todo-add"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
    </button>
  </form>
</template>
