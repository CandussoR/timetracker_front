import { createRouter, createWebHistory } from 'vue-router'
import TimerFormview from '../views/TimerFormView.vue'
import HomeView from '../views/HomeView.vue'
import TaskView from '../views/TaskView.vue'
import TimerView from '../views/TimerView.vue'
import SearchTimeRecords from '../views/SearchTimeRecords.vue'
import OldTimer from '../views/OldTimer.vue'
import StatsView from '../views/StatsView.vue'
import StatDiveView from '../views/StatDiveView.vue'
import TagView from '../views/TagView.vue'

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
      component: SearchTimeRecords
    },
    {
      path: '/stats',
      name: 'statsView',
      component: StatsView
    },
    {
      path: '/stats/dive',
      name: 'StatDiveView',
      component: StatDiveView
    },
    {
      path: '/tags',
      name: 'TagView',
      component: TagView
    }
  ]
})

export default router
