import type { Priority } from '../types'

export const PRIORITY_LIST = ['high', 'normal', 'low'] as const satisfies readonly Priority[]

export const PRIORITY_EMOJI: Record<Priority, string> = {
  high: '🔴',
  normal: '⚪',
  low: '🔵',
}
