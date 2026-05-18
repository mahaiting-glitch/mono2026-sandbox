import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabBar from '../../src/components/TabBar.vue'
import type { ViewType } from '../../src/types'

const TABS: ViewType[] = ['list', 'kanban', 'calendar']

describe('TabBar', () => {
  it.each(TABS)('点击 %s tab 触发 emit("change", "%s")', async (tab) => {
    const otherTab = TABS.find((t) => t !== tab) ?? 'list'
    const wrapper = mount(TabBar, { props: { active: otherTab } })
    await wrapper.find(`[data-testid="tab-${tab}"]`).trigger('click')
    expect(wrapper.emitted('change')).toEqual([[tab]])
  })

  it.each(TABS)('active="%s" 时对应按钮有 aria-current="page"', (tab) => {
    const wrapper = mount(TabBar, { props: { active: tab } })
    const activeBtn = wrapper.find(`[data-testid="tab-${tab}"]`)
    expect(activeBtn.attributes('aria-current')).toBe('page')
    for (const other of TABS.filter((t) => t !== tab)) {
      expect(wrapper.find(`[data-testid="tab-${other}"]`).attributes('aria-current')).toBeUndefined()
    }
  })
})
