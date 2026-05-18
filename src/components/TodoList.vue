<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useTodoStore } from '../stores/todo'
import { useListsStore } from '../stores/lists'
import { PRIORITY_EMOJI, PRIORITY_LIST } from '../constants/priority'
import type { Priority } from '../types'

const todoStore = useTodoStore()
const listsStore = useListsStore()

const editingId = ref<string | null>(null)
const editingTitle = ref('')
const editInputRefs = ref<Record<string, HTMLInputElement | null>>({})
const noteEditingId = ref<string | null>(null)
const noteEditingText = ref('')
const noteInputRefs = ref<Record<string, HTMLInputElement | null>>({})

const PRIORITY_CYCLE = PRIORITY_LIST

const displayedItems = computed(() => {
  const id = listsStore.activeListId
  if (!id) return todoStore.sortedItems
  return todoStore.sortedItems.filter(t => t.listId === id)
})

const displayedRemaining = computed(() => displayedItems.value.filter(t => !t.done).length)
const displayedTotal = computed(() => displayedItems.value.length)

watch(editingId, (id) => {
  if (!id) return
  nextTick(() => {
    const el = editInputRefs.value[id]
    el?.focus()
    el?.select()
  })
})

watch(noteEditingId, (id) => {
  if (!id) return
  nextTick(() => {
    const el = noteInputRefs.value[id]
    el?.focus()
    el?.select()
  })
})

function cyclePriority(id: string, current: Priority) {
  const idx = PRIORITY_CYCLE.indexOf(current)
  const next = PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length]!
  todoStore.setPriority(id, next)
}

function startEdit(id: string, title: string) {
  editingId.value = id
  editingTitle.value = title
}

function saveEdit() {
  const id = editingId.value
  if (!id) return
  todoStore.edit(id, editingTitle.value)
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

function startNoteEdit(id: string, currentNote: string | undefined) {
  noteEditingId.value = id
  noteEditingText.value = currentNote ?? ''
}

function saveNote() {
  const id = noteEditingId.value
  if (!id) return
  todoStore.setNote(id, noteEditingText.value)
  noteEditingId.value = null
}

function cancelNoteEdit() {
  noteEditingId.value = null
}
</script>

<template>
  <ul class="space-y-2" data-testid="todo-list">
    <li
      v-for="todo in displayedItems"
      :key="todo.id"
      class="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
    >
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          :checked="todo.done"
          :aria-label="'标记完成：' + todo.title"
          @change="todoStore.toggle(todo.id)"
          class="h-4 w-4"
        />
        <button
          type="button"
          :aria-label="'优先级：' + todo.priority"
          :data-priority="todo.priority"
          data-testid="todo-priority"
          class="text-base leading-none hover:scale-110 transition-transform"
          @click="cyclePriority(todo.id, todo.priority)"
        >{{ PRIORITY_EMOJI[todo.priority] }}</button>
        <span
          v-if="editingId !== todo.id"
          :class="{ 'line-through text-slate-500': todo.done }"
          class="flex-1 cursor-text"
          data-testid="todo-title"
          @dblclick="startEdit(todo.id, todo.title)"
        >{{ todo.title }}</span>
        <input
          v-else
          :ref="(el) => { editInputRefs[todo.id] = el as HTMLInputElement | null }"
          v-model="editingTitle"
          type="text"
          :aria-label="'编辑：' + todo.title"
          class="flex-1 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
          data-testid="todo-edit-input"
          @blur="saveEdit"
          @keydown.enter.prevent="saveEdit"
          @keydown.esc="cancelEdit"
        />
        <button
          type="button"
          @click="todoStore.remove(todo.id)"
          :aria-label="'删除：' + todo.title"
          class="text-sm text-slate-500 hover:text-red-600"
          data-testid="todo-remove"
        >
          删
        </button>
      </div>
      <div class="mt-1 ml-8">
        <template v-if="noteEditingId !== todo.id">
          <span
            v-if="todo.note"
            class="text-xs text-slate-400 dark:text-slate-500 cursor-text"
            data-testid="todo-note"
            @dblclick="startNoteEdit(todo.id, todo.note)"
          >{{ todo.note }}</span>
          <button
            v-else
            type="button"
            class="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            data-testid="todo-note-add"
            @click="startNoteEdit(todo.id, todo.note)"
          >＋ 备注</button>
        </template>
        <input
          v-else
          :ref="(el) => { noteInputRefs[todo.id] = el as HTMLInputElement | null }"
          v-model="noteEditingText"
          type="text"
          placeholder="添加备注…"
          aria-label="编辑备注"
          class="w-full text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-(--color-brand)"
          data-testid="todo-note-input"
          @blur="saveNote"
          @keydown.enter.prevent="saveNote"
          @keydown.esc="cancelNoteEdit"
        />
      </div>
    </li>
  </ul>

  <span
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="sr-only"
    data-testid="remaining-live"
  >{{ displayedTotal > 0 ? `还剩 ${displayedRemaining} / ${displayedTotal}` : '' }}</span>

  <p v-if="displayedTotal === 0" class="mt-8 text-center text-slate-500" data-testid="empty">
    还没活儿、加一个试试
  </p>

  <footer v-else class="mt-6 flex items-center justify-between text-sm text-slate-500">
    <span data-testid="remaining">还剩 {{ displayedRemaining }} / {{ displayedTotal }}</span>
    <button
      type="button"
      @click="todoStore.clearDone()"
      class="hover:text-slate-900 dark:hover:text-slate-100"
      data-testid="clear-done"
    >
      清完成
    </button>
  </footer>
</template>
