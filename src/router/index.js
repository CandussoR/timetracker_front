import { createRouter, createWebHistory } from 'vue-router'
import TimerFormview from '../views/TimerFormView.vue'
import HomeView from '../views/HomeView.vue'
import TaskView from '../views/TaskView.vue'
import TimerView from '../views/TimerView.vue'
import TimeRecords from '../views/TimeRecords.vue'
import RecordsSearchResult from '../views/RecordsSearchResult.vue'
import OldTimer from '../views/OldTimer.vue'

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
      component: TimerFormview
    },
    {
      path: '/old',
      name: 'oldTimerView',
      component: OldTimer
    },
    {
      path: '/ongoing',
      name: 'timerView',
      component: TimerView
    },
    {
      path: '/tasks',
      name: 'taskView',
      component: TaskView
    },
    {
      path: '/time_records',
      name: 'timeRecords',
      component: TimeRecords
    },
    {
      path: '/time_records/search/:id',
      name: 'RecordsSearchResult',
      component: RecordsSearchResult
    }
  ]
})

export default router
