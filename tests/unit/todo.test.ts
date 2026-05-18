import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../../src/stores/todo'

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

describe('useTodoStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage())
    setActivePinia(createPinia())
  })

  it('add 空字符串不入', () => {
    const s = useTodoStore()
    s.add('   ')
    expect(s.total).toBe(0)
  })

  it('add / toggle / remove 链路', () => {
    const s = useTodoStore()
    s.add('喝水')
    expect(s.total).toBe(1)
    expect(s.remaining).toBe(1)

    const id = s.items[0]!.id
    s.toggle(id)
    expect(s.remaining).toBe(0)

    s.remove(id)
    expect(s.total).toBe(0)
  })

  it('headingText · 0 todo 显示 Todo', () => {
    const s = useTodoStore()
    expect(s.headingText).toBe('Todo')
  })

  it('headingText · 有 todo 显示进度', () => {
    const s = useTodoStore()
    s.add('喝水')
    s.add('吃饭')
    expect(s.headingText).toBe('Todo · 剩 2 / 总 2')
    s.toggle(s.items[0]!.id)
    expect(s.headingText).toBe('Todo · 剩 1 / 总 2')
    s.toggle(s.items[1]!.id)
    expect(s.headingText).toBe('Todo · 剩 0 / 总 2')
  })

  it('clearDone 只清已完成', () => {
    const s = useTodoStore()
    s.add('a')
    s.add('b')
    s.toggle(s.items[0]!.id)
    s.clearDone()
    expect(s.total).toBe(1)
    expect(s.items[0]!.title).toBe('b')
  })
})
