import type { ViewType } from '../types'

export type TabDef = { value: ViewType; label: string }

export const TABS = [
  { value: 'list', label: '列表' },
  { value: 'kanban', label: '看板' },
  { value: 'calendar', label: '日历' },
] as const satisfies readonly TabDef[]
