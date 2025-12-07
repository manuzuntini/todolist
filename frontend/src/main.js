import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({ components, directives })

app.use(pinia)
app.use(router)
app.use(vuetify)

// Initialize auth store to pick up session
const auth = useAuthStore()
auth.init()

app.mount('#app')
