<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)

onErrorCaptured((err: unknown) => {
  hasError.value = true
  console.error('[ErrorBoundary] caught:', err)
  return false
})

function reload() {
  window.location.reload()
}
</script>

<template>
  <slot v-if="!hasError" />
  <div
    v-else
    class="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
    data-testid="error-boundary-fallback"
  >
    <p class="text-lg font-semibold text-red-600">出错了</p>
    <button
      type="button"
      class="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300"
      data-testid="error-boundary-reload"
      @click="reload()"
    >
      刷新
    </button>
  </div>
</template>
