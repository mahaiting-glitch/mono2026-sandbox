import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import './style.css'

createApp({ render: () => h(ErrorBoundary, null, { default: () => h(App) }) })
  .use(createPinia())
  .mount('#app')
