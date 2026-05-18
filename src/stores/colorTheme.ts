import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { LS_COLOR_THEME_KEY } from '../constants/storage-keys'

export type Theme = 'default' | 'forest' | 'sunset'

const VALID: Theme[] = ['default', 'forest', 'sunset']

function readSaved(): Theme | null {
  const v = localStorage.getItem(LS_COLOR_THEME_KEY)
  return VALID.includes(v as Theme) ? (v as Theme) : null
}

export const useColorThemeStore = defineStore('colorTheme', () => {
  const theme = ref<Theme>(readSaved() ?? 'default')

  watch(theme, (v) => {
    document.documentElement.dataset.theme = v
  }, { immediate: true, flush: 'sync' })

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(LS_COLOR_THEME_KEY, t)
  }

  return { theme, setTheme }
})
