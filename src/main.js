import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { supabase } from './supabase.js'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
// Redirect user to home after successful auth (e.g., email confirmation)
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    router.push('/')
  }
})
app.mount('#app')