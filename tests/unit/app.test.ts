import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '../../src/App.vue'

const idbStore: Record<string, unknown> = {}
vi.mock('idb-keyval', () => ({
  get: async (key: string) => idbStore[key],
  set: async (key: string, value: unknown) => { idbStore[key] = value },
  del: async (key: string) => { delete idbStore[key] },
}))

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

function stubMatchMedia(matches = false) {
  const listeners: Array<(e: { matches: boolean }) => void> = []
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches,
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => { listeners.push(cb) },
    removeEventListener: vi.fn(),
  })))
}

describe('App · milestone footer', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    for (const k of Object.keys(idbStore)) delete idbStore[k]
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')
    stubMatchMedia(false)
  })

  it('footer 渲染 milestone 名', () => {
    const wrapper = mount(App, {
      global: { plugins: [createPinia()] },
    })
    const footer = wrapper.find('[data-testid="milestone-footer"]')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('当前阶段：')
    expect(footer.text()).toContain('数据持久化')
  })

  it('footer 渲染版本号和 commit sha', () => {
    const wrapper = mount(App, {
      global: { plugins: [createPinia()] },
    })
    const versionFooter = wrapper.find('[data-testid="app-version"]')
    expect(versionFooter.exists()).toBe(true)
    expect(versionFooter.text()).toMatch(/^v\d+\.\d+\.\d+ · [a-f0-9]{7}$/)
  })
})
