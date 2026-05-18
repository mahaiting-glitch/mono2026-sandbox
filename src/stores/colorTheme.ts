import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'default' | 'forest' | 'sunset'

const VALID: Theme[] = ['default', 'forest', 'sunset']
export const COLOR_THEME_LS_KEY = 'mono2026-sandbox.colorTheme'

function readSaved(): Theme | null {
  const v = localStorage.getItem(COLOR_THEME_LS_KEY)
  return VALID.includes(v as Theme) ? (v as Theme) : null
}

export const useColorThemeStore = defineStore('colorTheme', () => {
  const theme = ref<Theme>(readSaved() ?? 'default')

  watch(theme, (v) => {
    document.documentElement.dataset.theme = v
  }, { immediate: true, flush: 'sync' })

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(COLOR_THEME_LS_KEY, t)
  }

  return { theme, setTheme }
})
