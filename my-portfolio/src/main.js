import { createApp } from 'vue'
import './assets/styles/main.css' 
import App from './App.vue'
import router from './router' // Import our new router

const app = createApp(App)

app.use(router) // Tell Vue to use the router

app.mount('#app')