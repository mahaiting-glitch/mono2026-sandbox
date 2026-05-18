import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { MILESTONE } from './milestone'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    __MILESTONE__: JSON.stringify(MILESTONE),
  },
  server: {
    port: 5175,
    strictPort: true,
  },
})
