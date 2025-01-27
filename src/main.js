import './assets/main.css'
import './assets/forms.css'
import './assets/modal.css'
import './assets/infoDisplay.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from "vue3-apexcharts";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
    .use(router)
    .use(VueApexCharts)
    .mount('#app')