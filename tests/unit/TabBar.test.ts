import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabBar from '../../src/components/TabBar.vue'
import { TABS } from '../../src/constants/tabs'

const TAB_VALUES = TABS.map((t) => t.value)

describe('TabBar', () => {
  it.each(TAB_VALUES)('点击 %s tab 触发 emit("change", "%s")', async (tab) => {
    const otherTab = TAB_VALUES.find((t) => t !== tab) ?? TAB_VALUES[0]!
    const wrapper = mount(TabBar, { props: { active: otherTab } })
    await wrapper.find(`[data-testid="tab-${tab}"]`).trigger('click')
    expect(wrapper.emitted('change')).toEqual([[tab]])
  })

  it.each(TAB_VALUES)('active="%s" 时对应按钮有 aria-current="page"', (tab) => {
    const wrapper = mount(TabBar, { props: { active: tab } })
    const activeBtn = wrapper.find(`[data-testid="tab-${tab}"]`)
    expect(activeBtn.attributes('aria-current')).toBe('page')
    for (const other of TAB_VALUES.filter((t) => t !== tab)) {
      expect(wrapper.find(`[data-testid="tab-${other}"]`).attributes('aria-current')).toBeUndefined()
    }
  })
})
