import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useColorThemeStore } from '../../src/stores/colorTheme'
import { LS_COLOR_THEME_KEY } from '../../src/constants/storage-keys'

function memoryStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length },
  }
}

describe('useColorThemeStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    document.documentElement.removeAttribute('data-theme')
    setActivePinia(createPinia())
  })

  it('无 localStorage → 默认主题 default', () => {
    const s = useColorThemeStore()
    expect(s.theme).toBe('default')
    expect(document.documentElement.dataset.theme).toBe('default')
  })

  it('localStorage=forest → 恢复 forest', () => {
    localStorage.setItem(LS_COLOR_THEME_KEY, 'forest')
    const s = useColorThemeStore()
    expect(s.theme).toBe('forest')
    expect(document.documentElement.dataset.theme).toBe('forest')
  })

  it('localStorage=sunset → 恢复 sunset', () => {
    localStorage.setItem(LS_COLOR_THEME_KEY, 'sunset')
    const s = useColorThemeStore()
    expect(s.theme).toBe('sunset')
    expect(document.documentElement.dataset.theme).toBe('sunset')
  })

  it('localStorage 非法值 → 回退 default', () => {
    localStorage.setItem(LS_COLOR_THEME_KEY, 'invalid')
    const s = useColorThemeStore()
    expect(s.theme).toBe('default')
    expect(document.documentElement.dataset.theme).toBe('default')
  })

  it('setTheme → 更新 theme + data-theme + localStorage', () => {
    const s = useColorThemeStore()
    s.setTheme('forest')
    expect(s.theme).toBe('forest')
    expect(document.documentElement.dataset.theme).toBe('forest')
    expect(localStorage.getItem(LS_COLOR_THEME_KEY)).toBe('forest')
  })

  it('setTheme 支持所有合法主题', () => {
    const s = useColorThemeStore()
    for (const t of ['default', 'forest', 'sunset'] as const) {
      s.setTheme(t)
      expect(s.theme).toBe(t)
      expect(document.documentElement.dataset.theme).toBe(t)
    }
  })

  it('setTheme 覆盖写入 localStorage', () => {
    localStorage.setItem(LS_COLOR_THEME_KEY, 'forest')
    const s = useColorThemeStore()
    s.setTheme('sunset')
    expect(localStorage.getItem(LS_COLOR_THEME_KEY)).toBe('sunset')
  })
})
