import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Initialize and mount Vue app with Pinia store and Router
const app = createApp(App)
app.use(createPinia()) // Set up state management
app.use(router) // Set up routing
app.mount('#app')