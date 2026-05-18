import { describe, it, expect } from 'vitest'
import { groupTodosByDay } from '../../src/utils/calendar'
import type { Todo } from '../../src/types'

function makeTodo(id: string, createdAt: number): Todo {
  return { id, title: id, done: false, createdAt, priority: 'normal' }
}

const DAY1 = new Date(2024, 0, 1).getTime()   // 2024-01-01 00:00:00
const DAY1_NOON = DAY1 + 12 * 60 * 60 * 1000  // 2024-01-01 12:00:00
const DAY2 = new Date(2024, 0, 2).getTime()   // 2024-01-02 00:00:00
const DAY2_EVE = DAY2 + 20 * 60 * 60 * 1000  // 2024-01-02 20:00:00

describe('groupTodosByDay', () => {
  it('空数组 → 返回空数组', () => {
    expect(groupTodosByDay([])).toEqual([])
  })

  it('同一天的 todo 聚合到同一组', () => {
    const todos = [
      makeTodo('a', DAY1),
      makeTodo('b', DAY1_NOON),
    ]
    const result = groupTodosByDay(todos)
    expect(result).toHaveLength(1)
    expect(result[0]!.todos).toHaveLength(2)
    expect(result[0]!.todos.map(t => t.id)).toEqual(['a', 'b'])
  })

  it('跨日 todo 分入不同组', () => {
    const todos = [
      makeTodo('a', DAY1),
      makeTodo('b', DAY2),
    ]
    const result = groupTodosByDay(todos)
    expect(result).toHaveLength(2)
    const ids = result.flatMap(g => g.todos.map(t => t.id))
    expect(ids).toContain('a')
    expect(ids).toContain('b')
  })

  it('按日期倒序排列（新日期在前）', () => {
    const todos = [
      makeTodo('old', DAY1),
      makeTodo('new', DAY2_EVE),
    ]
    const result = groupTodosByDay(todos)
    expect(result).toHaveLength(2)
    expect(result[0]!.todos[0]!.id).toBe('new')
    expect(result[1]!.todos[0]!.id).toBe('old')
  })
})
