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
const pinia = createPinia()

pinia.use(({ store }) => {
  const persistOptions = store.$options?.persist
  if (!persistOptions) return

  const strategies = Array.isArray(persistOptions.strategies)
    ? persistOptions.strategies
    : [persistOptions]

  strategies.forEach((strategy) => {
    const key = strategy.key || store.$id
    const storage = strategy.storage || localStorage
    const paths = strategy.paths || null

    const storedState = storage.getItem(key)
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState)
        store.$patch(parsed)
      } catch (e) {
        console.warn(`Failed to restore persisted store ${store.$id}:`, e)
      }
    }

    store.$subscribe((mutation, state) => {
      const dataToPersist = paths
        ? paths.reduce((acc, path) => {
            if (path in state) acc[path] = state[path]
            return acc
          }, {})
        : state

      storage.setItem(key, JSON.stringify(dataToPersist))
    }, { detached: true })
  })
})

app.use(pinia)
app.use(router)
app.use(vuetify)
// Redirect user to home after successful auth (e.g., email confirmation)
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    router.push('/')
  }
})
app.mount('#app')