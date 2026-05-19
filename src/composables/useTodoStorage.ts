import { get, set } from 'idb-keyval'
import type { Todo, List, Priority } from '../types'
import { LS_TODOS_LEGACY_KEY } from '../constants/storage-keys'
import { useListStorage } from './useListStorage'

const IDB_KEY = 'todos'
const SCHEMA_VERSION = 3

const VALID_PRIORITIES = new Set<string>(['high', 'normal', 'low'])

// Lenient guard: validates required fields only; optional fields (note, listId) handled by normalizeTodo.
// Intentionally accepts both v1 (no listId) and v3 (with listId) todos.
function isTodoLike(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.done === 'boolean' &&
    typeof r.createdAt === 'number' &&
    (r.priority === undefined || (typeof r.priority === 'string' && VALID_PRIORITIES.has(r.priority))) &&
    (r.note === undefined || typeof r.note === 'string')
  )
}

function normalizeTodo(r: Record<string, unknown>): Todo {
  const todo: Todo = {
    id: r.id as string,
    title: r.title as string,
    done: r.done as boolean,
    createdAt: r.createdAt as number,
    priority: (r.priority as Priority | undefined) ?? 'normal',
  }
  // exactOptionalPropertyTypes: only set when value is present
  if (typeof r.note === 'string') {
    todo.note = r.note
  }
  if (typeof r.listId === 'string') {
    todo.listId = r.listId
  }
  return todo
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

// Precondition: callers must serialize — migrate() fully awaited before read() is called.
// The todo store guarantees this via: _initPromise = migrate().then(() => read())
async function migrateToV3(todos: Todo[]): Promise<Todo[]> {
  const listStorage = useListStorage()
  const { lists, defaultListId } = await listStorage.read()

  let resolvedDefaultListId: string
  if (defaultListId) {
    resolvedDefaultListId = defaultListId
  } else if (lists.length > 0) {
    // lists.length > 0 guarantees element; noUncheckedIndexedAccess requires explicit cast
    const firstList = lists[0] as List
    resolvedDefaultListId = firstList.id
    await listStorage.write(lists, resolvedDefaultListId)
  } else {
    const defaultList: List = { id: crypto.randomUUID(), title: '默认列表', createdAt: Date.now() }
    resolvedDefaultListId = defaultList.id
    await listStorage.write([defaultList], resolvedDefaultListId)
  }

  const migrated = todos.map(t => ({ ...t, listId: t.listId ?? resolvedDefaultListId }))
  await set(IDB_KEY, { __schema_version: SCHEMA_VERSION, items: migrated })
  return migrated
}

export function useTodoStorage() {
  async function read(): Promise<Todo[]> {
    const val = await get<unknown>(IDB_KEY)
    if (isStoredTodos(val)) {
      const todos = val.items.filter(isTodoLike).map(normalizeTodo)
      if (val.__schema_version < SCHEMA_VERSION) {
        return migrateToV3(todos)
      }
      return todos
    }
    // Legacy: plain array without schema version
    if (Array.isArray(val) && val.every(isTodoLike)) {
      return migrateToV3(val.map(normalizeTodo))
    }
    return []
  }

  async function write(todos: Todo[]): Promise<void> {
    await set(IDB_KEY, { __schema_version: SCHEMA_VERSION, items: todos })
  }

  // Migrate from localStorage on first run; IDB takes precedence if it already has data.
  // Writes v1 format so read() can upgrade to v3 (creating default list) on next call.
  async function migrate(): Promise<void> {
    const raw = localStorage.getItem(LS_TODOS_LEGACY_KEY)
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(raw)
      const existing = await get<unknown>(IDB_KEY)
      if (Array.isArray(parsed) && parsed.every(isTodoLike) && existing === undefined) {
        await set(IDB_KEY, { __schema_version: 1, items: parsed.map(normalizeTodo) })
      }
    } catch {
      // corrupt localStorage data — just clean it up
    }
    localStorage.removeItem(LS_TODOS_LEGACY_KEY)
  }

  return { read, write, migrate }
}
