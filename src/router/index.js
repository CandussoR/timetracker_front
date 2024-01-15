import { createRouter, createWebHistory } from 'vue-router'
import TimerView from '../views/TimerView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/time-record',
      name: 'timerView',
      component: TimerView
    }
  ]
})

export default router
