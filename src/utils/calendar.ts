import type { Todo } from '../types'

export interface DayGroup {
  label: string
  todos: Todo[]
}

function toDayStart(ts: number): number {
  const d = new Date(ts)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

function formatDay(dayStart: number): string {
  return new Date(dayStart).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function groupTodosByDay(todos: Todo[]): DayGroup[] {
  const map = new Map<number, DayGroup>()
  for (const todo of todos) {
    const dayStart = toDayStart(todo.createdAt)
    const existing = map.get(dayStart)
    if (existing) {
      existing.todos.push(todo)
    } else {
      map.set(dayStart, { label: formatDay(dayStart), todos: [todo] })
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, group]) => group)
}
