import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/new',
      name: 'timerFormView',
      component: () => import('../views/TimerFormView.vue')
    },
    {
      path: '/old',
      name: 'oldTimerView',
      component: () => import('../views/OldTimer.vue')
    },
    {
      path: '/ongoing',
      name: 'timerView',
      component: () => import('../views/TimerView.vue')
    },
    {
      path: '/tasks',
      name: 'taskView',
      component: () => import('../views/TaskView.vue')
    },
    {
      path: '/time_records',
      name: 'timeRecords',
      component: () => import('../views/SearchTimeRecords.vue')
    },
    {
      path: '/stats/:period',
      name: 'statsView',
      component: () => import('../views/StatsView.vue')
    },
    {
      path: '/stats/dive',
      name: 'StatsDiveView',
      component: () => import('../views/StatsDiveView.vue')
    },
    {
      path: '/tags',
      name: 'TagView',
      component: () => import('../views/TagView.vue')
    },
    {
      path: '/settings',
      name: 'SettingsView',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/flow',
      name: 'FlowView',
      component: () => import('../views/FlowView.vue')
    },
    {
      path: '/flow/edit',
      name: 'FlowEditView',
      component: () => import('../views/FlowView.vue')
    }
  ]
})

export default router
