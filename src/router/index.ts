import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlindTestView from '@/views/blind-test/BlindTestView.vue'
import BlindTestSettingsView from '@/views/blind-test/BlindTestSettingsView.vue'
import BlindTestGameView from '@/views/blind-test/BlindTestGameView.vue'
import BlindTestSummaryView from '@/views/blind-test/BlindTestSummaryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/blind-test',
      name: 'blind-test',
      component: BlindTestView,
    },
    {
      path: '/blind-test/settings',
      name: 'blind-test-settings',
      component: BlindTestSettingsView,
    },
    {
      path: '/blind-test/game',
      name: 'blind-test-game',
      component: BlindTestGameView,
    },
    {
      path: '/blind-test/summary',
      name: 'blind-test-summary',
      component: BlindTestSummaryView,
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
