<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from './stores/todo'
import { useColorSchemeStore } from './stores/colorScheme'
import { useColorThemeStore, type Theme } from './stores/colorTheme'
import type { ViewType } from './types'
import TabBar from './components/TabBar.vue'
import KanbanView from './components/KanbanView.vue'
import CalendarView from './components/CalendarView.vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import ListManager from './components/ListManager.vue'
import { LS_VIEW_KEY } from './constants/storage-keys'

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

const selectedTheme = computed({
  get: () => colorTheme.theme,
  set: (v: Theme) => colorTheme.setTheme(v),
})

const todoFormRef = ref<InstanceType<typeof TodoForm> | null>(null)
const helloVisible = ref(false)
const helloTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function isInputFocused(): boolean {
  const el = document.activeElement
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement
}

function showHello() {
  helloVisible.value = true
  if (helloTimer.value) clearTimeout(helloTimer.value)
  helloTimer.value = setTimeout(() => {
    helloVisible.value = false
    helloTimer.value = null
  }, 2000)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === '/') {
    todoFormRef.value?.handleSlashKey(e)
    return
  }
  if (e.key === 'h' && !isInputFocused()) {
    e.preventDefault()
    showHello()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  if (helloTimer.value) clearTimeout(helloTimer.value)
})

// e2e crash hook: set window.__crash__ = true before navigation to trigger ErrorBoundary
onMounted(() => {
  if ((window as Window & { __crash__?: boolean }).__crash__) {
    throw new Error('intentional crash for ErrorBoundary e2e test')
  }
})
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
      <ListManager />
      <TodoForm ref="todoFormRef" />
      <TodoList />
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

    <footer class="mt-8 text-center text-xs text-slate-500 space-y-1">
      <div data-testid="milestone-footer">当前阶段：{{ MILESTONE }}</div>
      <div data-testid="app-version">v{{ APP_VERSION }} · {{ GIT_COMMIT }}</div>
    </footer>
  </main>
  <TabBar :active="activeView" @change="activeView = $event" />
  <Transition
    enter-active-class="transition-opacity duration-200 ease-in-out"
    leave-active-class="transition-opacity duration-200 ease-in-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="helloVisible"
      data-testid="hello-banner"
      role="status"
      aria-live="polite"
      class="fixed top-20 left-1/2 -translate-x-1/2 rounded-xl bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-6 py-3 text-lg font-semibold shadow-lg pointer-events-none select-none whitespace-nowrap z-50"
    >Hello, World!</div>
  </Transition>
</template>
