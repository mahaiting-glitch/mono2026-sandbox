import { get, set } from 'idb-keyval'
import type { List } from '../types'

const IDB_KEY = 'lists'
const SCHEMA_VERSION = 1

interface StoredLists {
  __schema_version: number
  items: List[]
  defaultListId: string | null
}

function isListLike(v: unknown): v is List {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return typeof r.id === 'string' && typeof r.title === 'string' && typeof r.createdAt === 'number'
}

export function isStoredLists(v: unknown): v is StoredLists {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  const r = v as Record<string, unknown>
  return (
    typeof r.__schema_version === 'number' &&
    Array.isArray(r.items) &&
    (r.defaultListId === null || typeof r.defaultListId === 'string')
  )
}

export function useListStorage() {
  async function read(): Promise<{ lists: List[]; defaultListId: string | null }> {
    const val = await get<unknown>(IDB_KEY)
    if (isStoredLists(val)) {
      return { lists: val.items.filter(isListLike), defaultListId: val.defaultListId }
    }
    return { lists: [], defaultListId: null }
  }

  async function write(lists: List[], defaultListId: string | null = null): Promise<void> {
    await set(IDB_KEY, { __schema_version: SCHEMA_VERSION, items: lists, defaultListId })
  }

  return { read, write }
}
