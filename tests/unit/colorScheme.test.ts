import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useColorSchemeStore } from '../../src/stores/colorScheme'

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

function stubMatchMedia(matches: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = []
  const mql = {
    matches,
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => { listeners.push(cb) },
    removeEventListener: vi.fn(),
    dispatchChange: (m: boolean) => listeners.forEach(cb => cb({ matches: m })),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => mql))
  return mql
}

const LS_KEY = 'mono2026-sandbox.colorScheme'

describe('useColorSchemeStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    document.documentElement.className = ''
    setActivePinia(createPinia())
  })

  it('无 localStorage · 系统 light → isDark false', () => {
    stubMatchMedia(false)
    const s = useColorSchemeStore()
    expect(s.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('无 localStorage · 系统 dark → isDark true', () => {
    stubMatchMedia(true)
    const s = useColorSchemeStore()
    expect(s.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('localStorage=dark → isDark true 无视系统设置', () => {
    localStorage.setItem(LS_KEY, 'dark')
    stubMatchMedia(false)
    const s = useColorSchemeStore()
    expect(s.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('localStorage=light → isDark false 无视系统设置', () => {
    localStorage.setItem(LS_KEY, 'light')
    stubMatchMedia(true)
    const s = useColorSchemeStore()
    expect(s.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggle · light → dark · 写入 localStorage', () => {
    stubMatchMedia(false)
    const s = useColorSchemeStore()
    s.toggle()
    expect(s.isDark).toBe(true)
    expect(localStorage.getItem(LS_KEY)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggle · dark → light · 写入 localStorage', () => {
    localStorage.setItem(LS_KEY, 'dark')
    stubMatchMedia(false)
    const s = useColorSchemeStore()
    s.toggle()
    expect(s.isDark).toBe(false)
    expect(localStorage.getItem(LS_KEY)).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('系统改变 · 无显式偏好 → 跟随', () => {
    const mql = stubMatchMedia(false)
    const s = useColorSchemeStore()
    expect(s.isDark).toBe(false)

    mql.dispatchChange(true)
    expect(s.isDark).toBe(true)
  })

  it('系统改变 · 有显式偏好 → 不跟随', () => {
    localStorage.setItem(LS_KEY, 'light')
    const mql = stubMatchMedia(false)
    const s = useColorSchemeStore()

    mql.dispatchChange(true)
    expect(s.isDark).toBe(false)
  })
})
