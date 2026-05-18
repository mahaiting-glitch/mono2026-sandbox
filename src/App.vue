<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from './stores/todo'
import { useColorSchemeStore } from './stores/colorScheme'
import { useColorThemeStore, type Theme } from './stores/colorTheme'
import type { Priority, ViewType } from './types'
import TabBar from './components/TabBar.vue'
import KanbanView from './components/KanbanView.vue'
import CalendarView from './components/CalendarView.vue'
import { LS_VIEW_KEY } from './constants/storage-keys'
import { PRIORITY_EMOJI } from './constants/priority'

function readSavedView(): ViewType {
  const v = localStorage.getItem(LS_VIEW_KEY)
  return v === 'list' || v === 'kanban' || v === 'calendar' ? v : 'list'
}

const activeView = ref<ViewType>(readSavedView())
watch(activeView, (v) => localStorage.setItem(LS_VIEW_KEY, v))

const store = useTodoStore()
const colorScheme = useColorSchemeStore()
const colorTheme = useColorThemeStore()
const MILESTONE = __MILESTONE__
const APP_VERSION = __APP_VERSION__
const GIT_COMMIT = __GIT_COMMIT__

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'default', label: '默认' },
  { value: 'forest', label: '森林' },
  { value: 'sunset', label: '日落' },
]

const PRIORITY_CYCLE: Priority[] = ['high', 'normal', 'low']

const selectedTheme = computed({
  get: () => colorTheme.theme,
  set: (v: Theme) => colorTheme.setTheme(v),
})
const input = ref('')
const newPriority = ref<Priority>('normal')
const editingId = ref<string | null>(null)
const editingTitle = ref('')
const editInputRefs = ref<Record<string, HTMLInputElement | null>>({})
const noteEditingId = ref<string | null>(null)
const noteEditingText = ref('')
const noteInputRefs = ref<Record<string, HTMLInputElement | null>>({})
const todoInputRef = ref<HTMLInputElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key !== '/') return
  if (!todoInputRef.value) return  // todoInputRef 挂在 v-if="list" 内，非列表视图时卸载 = null
  if (document.activeElement === todoInputRef.value) return
  e.preventDefault()
  todoInputRef.value.focus()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

// e2e crash hook: set window.__crash__ = true before navigation to trigger ErrorBoundary
onMounted(() => {
  if ((window as Window & { __crash__?: boolean }).__crash__) {
    throw new Error('intentional crash for ErrorBoundary e2e test')
  }
})

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

function submit() {
  store.add(input.value, newPriority.value)
  input.value = ''
  newPriority.value = 'normal'
}

function cyclePriority(id: string, current: Priority) {
  const idx = PRIORITY_CYCLE.indexOf(current)
  const next = PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length]!
  store.setPriority(id, next)
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

function startNoteEdit(id: string, currentNote: string | undefined) {
  noteEditingId.value = id
  noteEditingText.value = currentNote ?? ''
}

function saveNote() {
  const id = noteEditingId.value
  if (!id) return
  store.setNote(id, noteEditingText.value)
  noteEditingId.value = null
}

function cancelNoteEdit() {
  noteEditingId.value = null
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

  <main class="mx-auto max-w-xl px-4 py-12 pb-20">
    <h1 class="text-2xl font-semibold mb-6" data-testid="heading">{{ store.headingText }}</h1>

    <template v-if="activeView === 'list'">
    <form class="flex gap-2 mb-6" @submit.prevent="submit">
      <select
        v-model="newPriority"
        aria-label="优先级"
        data-testid="priority-select"
        class="rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
      >
        <option value="high">🔴</option>
        <option value="normal">⚪</option>
        <option value="low">🔵</option>
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

    <ul class="space-y-2" data-testid="todo-list">
      <li
        v-for="todo in store.sortedItems"
        :key="todo.id"
        class="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
      >
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="todo.done"
            :aria-label="'标记完成：' + todo.title"
            @change="store.toggle(todo.id)"
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
            @click="store.remove(todo.id)"
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

    <!-- 常驻 live region：v-else 内的元素首次挂载时 aria-live 可能漏报；单独放这里保证始终存在 -->
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
      data-testid="remaining-live"
    >{{ store.total > 0 ? `还剩 ${store.remaining} / ${store.total}` : '' }}</span>

    <p v-if="store.total === 0" class="mt-8 text-center text-slate-500" data-testid="empty">
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
    </template>

    <div
      v-else-if="activeView === 'kanban'"
      data-testid="view-kanban"
    >
      <KanbanView />
    </div>

    <div
      v-else-if="activeView === 'calendar'"
      data-testid="view-calendar"
    >
      <CalendarView />
    </div>

    <div class="mt-6 flex items-center justify-end gap-2 text-sm text-slate-500">
      <label for="theme-select" class="select-none">主题</label>
      <select
        id="theme-select"
        v-model="selectedTheme"
        data-testid="theme-select"
        class="rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-(--color-brand)"
      >
        <option v-for="t in THEME_OPTIONS" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
    </div>

    <div class="mt-8 text-center text-xs text-slate-500" data-testid="milestone-footer">
      当前阶段：{{ MILESTONE }}
    </div>
    <div class="mt-1 text-center text-xs text-slate-500" data-testid="app-version">v{{ APP_VERSION }} · {{ GIT_COMMIT }}</div>
  </main>
  <TabBar :active="activeView" @change="activeView = $event" />
</template>
