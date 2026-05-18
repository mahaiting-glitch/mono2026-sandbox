<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from './stores/todo'

const store = useTodoStore()
const input = ref('')

function submit() {
  store.add(input.value)
  input.value = ''
}
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-12">
    <h1 class="text-2xl font-semibold mb-6">mono2026 沙盘 · Todo</h1>

    <form class="flex gap-2 mb-6" @submit.prevent="submit">
      <input
        v-model="input"
        type="text"
        placeholder="加点啥"
        class="flex-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        data-testid="todo-input"
      />
      <button
        type="submit"
        class="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        :disabled="!input.trim()"
        data-testid="todo-add"
      >
        加
      </button>
    </form>

    <ul class="space-y-2" data-testid="todo-list">
      <li
        v-for="todo in store.items"
        :key="todo.id"
        class="flex items-center gap-3 rounded border border-slate-200 bg-white px-3 py-2"
      >
        <input
          type="checkbox"
          :checked="todo.done"
          @change="store.toggle(todo.id)"
          class="h-4 w-4"
        />
        <span :class="{ 'line-through text-slate-400': todo.done }" class="flex-1">{{ todo.title }}</span>
        <button
          type="button"
          @click="store.remove(todo.id)"
          class="text-sm text-slate-400 hover:text-red-600"
          data-testid="todo-remove"
        >
          删
        </button>
      </li>
    </ul>

    <p v-if="store.total === 0" class="mt-8 text-center text-slate-400" data-testid="empty">
      还没活儿、加一个试试
    </p>

    <footer v-else class="mt-6 flex items-center justify-between text-sm text-slate-500">
      <span data-testid="remaining">还剩 {{ store.remaining }} / {{ store.total }}</span>
      <button
        type="button"
        @click="store.clearDone()"
        class="hover:text-slate-900"
        data-testid="clear-done"
      >
        清完成
      </button>
    </footer>
  </main>
</template>
