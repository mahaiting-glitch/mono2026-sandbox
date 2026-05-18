import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defines } from './build-info'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: defines,
  server: {
    port: 5175,
    strictPort: true,
  },
})
