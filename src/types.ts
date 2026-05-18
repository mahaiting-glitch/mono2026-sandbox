export type Priority = 'high' | 'normal' | 'low'
export type ViewType = 'list' | 'kanban' | 'calendar'

export interface Todo {
  id: string
  title: string
  done: boolean
  createdAt: number
  priority: Priority
  note?: string
}
