import { get, set } from 'idb-keyval'
import type { Todo } from '../types'

const LEGACY_LS_KEY = 'mono2026-sandbox.todos'
const IDB_KEY = 'todos'

function isTodo(v: unknown): v is Todo {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.done === 'boolean' &&
    typeof r.createdAt === 'number'
  )
}

export function useTodoStorage() {
  async function read(): Promise<Todo[]> {
    const val = await get<unknown>(IDB_KEY)
    if (Array.isArray(val) && val.every(isTodo)) return val as Todo[]
    return []
  }

  async function write(todos: Todo[]): Promise<void> {
    await set(IDB_KEY, todos)
  }

  // Migrate from localStorage on first run; IDB takes precedence if it already has data.
  async function migrate(): Promise<void> {
    const raw = localStorage.getItem(LEGACY_LS_KEY)
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(raw)
      const existing = await get<unknown>(IDB_KEY)
      if (Array.isArray(parsed) && parsed.every(isTodo) && existing === undefined) {
        await set(IDB_KEY, parsed)
      }
    } catch {
      // corrupt localStorage data — just clean it up
    }
    localStorage.removeItem(LEGACY_LS_KEY)
  }

  return { read, write, migrate }
}
