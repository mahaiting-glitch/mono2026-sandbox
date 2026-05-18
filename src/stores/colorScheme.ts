import { defineStore } from 'pinia'
import { ref, watch, onScopeDispose } from 'vue'

const LS_KEY = 'mono2026-sandbox.colorScheme'

function readSaved(): 'dark' | 'light' | null {
  const v = localStorage.getItem(LS_KEY)
  return v === 'dark' || v === 'light' ? v : null
}

export const useColorSchemeStore = defineStore('colorScheme', () => {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
  const saved = readSaved()
  const isDark = ref(saved !== null ? saved === 'dark' : systemDark.matches)

  watch(isDark, (v) => {
    document.documentElement.classList.toggle('dark', v)
  }, { immediate: true, flush: 'sync' })

  const onSystemChange = (e: MediaQueryListEvent) => {
    if (!readSaved()) isDark.value = e.matches
  }
  systemDark.addEventListener('change', onSystemChange)
  onScopeDispose(() => systemDark.removeEventListener('change', onSystemChange))

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(LS_KEY, isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggle }
})
