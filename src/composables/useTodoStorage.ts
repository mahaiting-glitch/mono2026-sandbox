import { get, set } from 'idb-keyval'
import type { Todo, Priority } from '../types'

const LEGACY_LS_KEY = 'mono2026-sandbox.todos'
const IDB_KEY = 'todos'
const SCHEMA_VERSION = 1

const VALID_PRIORITIES = new Set<string>(['high', 'normal', 'low'])

// Accepts old todos without priority (for migration compatibility)
function isTodoLike(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.done === 'boolean' &&
    typeof r.createdAt === 'number' &&
    (r.priority === undefined || (typeof r.priority === 'string' && VALID_PRIORITIES.has(r.priority)))
  )
}

function normalizeTodo(r: Record<string, unknown>): Todo {
  return {
    id: r.id as string,
    title: r.title as string,
    done: r.done as boolean,
    createdAt: r.createdAt as number,
    priority: (r.priority as Priority | undefined) ?? 'normal',
  }
}

interface StoredTodos {
  __schema_version: number
  items: unknown[]
}

function isStoredTodos(v: unknown): v is StoredTodos {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  const r = v as Record<string, unknown>
  return typeof r.__schema_version === 'number' && Array.isArray(r.items)
}

export function useTodoStorage() {
  async function read(): Promise<Todo[]> {
    const val = await get<unknown>(IDB_KEY)
    if (isStoredTodos(val)) {
      return val.items.filter(isTodoLike).map(normalizeTodo)
    }
    // Legacy: plain array without schema version — auto-upgrade to v1 on first read
    if (Array.isArray(val) && val.every(isTodoLike)) {
      const todos = val.map(normalizeTodo)
      await set(IDB_KEY, { __schema_version: SCHEMA_VERSION, items: todos })
      return todos
    }
    return []
  }

  async function write(todos: Todo[]): Promise<void> {
    await set(IDB_KEY, { __schema_version: SCHEMA_VERSION, items: todos })
  }

  // Migrate from localStorage on first run; IDB takes precedence if it already has data.
  async function migrate(): Promise<void> {
    const raw = localStorage.getItem(LEGACY_LS_KEY)
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(raw)
      const existing = await get<unknown>(IDB_KEY)
      if (Array.isArray(parsed) && parsed.every(isTodoLike) && existing === undefined) {
        await set(IDB_KEY, { __schema_version: SCHEMA_VERSION, items: parsed.map(normalizeTodo) })
      }
    } catch {
      // corrupt localStorage data — just clean it up
    }
    localStorage.removeItem(LEGACY_LS_KEY)
  }

  return { read, write, migrate }
}
