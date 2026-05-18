import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { MILESTONE } from './milestone'

export default defineConfig({
  plugins: [vue()],
  define: {
    __MILESTONE__: JSON.stringify(MILESTONE),
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    globals: false,
  },
})
