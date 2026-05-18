export type Priority = 'high' | 'normal' | 'low'

export interface Todo {
  id: string
  title: string
  done: boolean
  createdAt: number
  priority: Priority
  note?: string
}
