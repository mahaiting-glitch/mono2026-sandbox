import { createApp, h } from 'vue'
import { createPinia, type Pinia } from 'pinia'
import App from './App.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import './style.css'

const pinia = createPinia()

createApp({ render: () => h(ErrorBoundary, null, { default: () => h(App) }) })
  .use(pinia)
  .mount('#app')

if (import.meta.env.DEV) {
  (window as Window & { __pinia__?: Pinia }).__pinia__ = pinia
}
