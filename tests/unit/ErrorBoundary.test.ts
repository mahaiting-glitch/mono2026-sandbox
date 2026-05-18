import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, onMounted } from 'vue'
import ErrorBoundary from '../../src/components/ErrorBoundary.vue'

const ThrowingChild = defineComponent({
  render() {
    throw new Error('render error from child')
  },
})

const ThrowingOnMountedChild = defineComponent({
  setup() {
    onMounted(() => { throw new Error('onMounted error from child') })
  },
  template: '<div>child</div>',
})

const NormalChild = defineComponent({
  template: '<div data-testid="normal-child">正常子组件</div>',
})

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    warnSpy.mockRestore()
  })

  it('无错误时渲染子组件', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: NormalChild },
    })
    expect(wrapper.find('[data-testid="normal-child"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="error-boundary-fallback"]').exists()).toBe(false)
  })

  it('render 抛错时显示 fallback + 「出错了」+ 「刷新」按钮', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: ThrowingChild },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="error-boundary-fallback"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('出错了')
    expect(wrapper.find('[data-testid="error-boundary-reload"]').text()).toBe('刷新')
  })

  it('onMounted 抛错时显示 fallback', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: ThrowingOnMountedChild },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="error-boundary-fallback"]').exists()).toBe(true)
  })

  it('错误写入 console.error', () => {
    mount(ErrorBoundary, {
      slots: { default: ThrowingChild },
    })
    expect(consoleSpy).toHaveBeenCalledWith('[ErrorBoundary] caught:', expect.any(Error))
  })
})
