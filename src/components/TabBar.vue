<script setup lang="ts">
import type { ViewType } from '../types'
import { TABS } from '../constants/tabs'

defineProps<{ active: ViewType }>()
const emit = defineEmits<{ change: [tab: ViewType] }>()
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 flex border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
    data-testid="tab-bar"
  >
    <button
      v-for="tab in TABS"
      :key="tab.value"
      type="button"
      :class="[
        'flex-1 py-3 text-sm font-medium transition-colors',
        active === tab.value
          ? 'text-(--color-brand) border-t-2 border-(--color-brand)'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-t-2 border-transparent',
      ]"
      :data-testid="`tab-${tab.value}`"
      :aria-current="active === tab.value ? 'page' : undefined"
      @click="emit('change', tab.value)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>
