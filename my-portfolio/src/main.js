import { createApp } from 'vue'
import { gsap } from 'gsap'; // Import GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

import './assets/styles/main.css'
import App from './App.vue'
import router from './router'

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const app = createApp(App)
app.use(router)
app.mount('#app')