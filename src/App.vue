<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useTodoStore } from './stores/todo'
import { useColorSchemeStore } from './stores/colorScheme'

const store = useTodoStore()
const colorScheme = useColorSchemeStore()
const input = ref('')
const editingId = ref<string | null>(null)
const editingTitle = ref('')
const editInputRefs = ref<Record<string, HTMLInputElement | null>>({})

watch(editingId, (id) => {
  if (!id) return
  nextTick(() => {
    const el = editInputRefs.value[id]
    el?.focus()
    el?.select()
  })
})

function submit() {
  store.add(input.value)
  input.value = ''
}

function startEdit(id: string, title: string) {
  editingId.value = id
  editingTitle.value = title
}

function saveEdit() {
  const id = editingId.value
  if (!id) return
  store.edit(id, editingTitle.value)
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}
</script>

<template>
  <button
    type="button"
    class="fixed top-4 right-4 rounded-full bg-slate-200 dark:bg-slate-700 p-2 text-lg leading-none hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
    :aria-label="colorScheme.isDark ? '切换到浅色模式' : '切换到深色模式'"
    data-testid="theme-toggle"
    @click="colorScheme.toggle()"
  >{{ colorScheme.isDark ? '☀' : '🌙' }}</button>

  <main class="mx-auto max-w-xl px-4 py-12">
    <h1 class="text-2xl font-semibold mb-6" data-testid="heading">{{ store.headingText }}</h1>

    <form class="flex gap-2 mb-6" @submit.prevent="submit">
      <input
        v-model="input"
        type="text"
        placeholder="加点啥"
        class="flex-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        class="flex items-center gap-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
      >
        <input
          type="checkbox"
          :checked="todo.done"
          :aria-label="'标记完成：' + todo.title"
          @change="store.toggle(todo.id)"
          class="h-4 w-4"
        />
        <span
          v-if="editingId !== todo.id"
          :class="{ 'line-through text-slate-400': todo.done }"
          class="flex-1 cursor-text"
          data-testid="todo-title"
          @dblclick="startEdit(todo.id, todo.title)"
        >{{ todo.title }}</span>
        <input
          v-else
          :ref="(el) => { editInputRefs[todo.id] = el as HTMLInputElement | null }"
          v-model="editingTitle"
          type="text"
          class="flex-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="todo-edit-input"
          @blur="saveEdit"
          @keydown.enter.prevent="saveEdit"
          @keydown.esc="cancelEdit"
        />
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
        class="hover:text-slate-900 dark:hover:text-slate-100"
        data-testid="clear-done"
      >
        清完成
      </button>
    </footer>
  </main>
</template>
