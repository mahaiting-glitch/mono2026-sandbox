import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { defines } from './build-info'

export default defineConfig({
  plugins: [vue()],
  define: defines,
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    globals: false,
  },
})
