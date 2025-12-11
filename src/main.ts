import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'
import router from './router'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

app.use(router)
app.use(ui)
app.use(createPinia())

app.mount('#app')

// PWA auto-update
registerSW({ immediate: true })
