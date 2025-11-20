import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlindTestView from '@/views/BlindTestView.vue'
import BlindTestSettingsView from '@/views/BlindTestSettingsView.vue'
import BlindTestPlaylistView from '@/views/BlindTestPlaylistView.vue'
import BlindTestGameView from '@/views/BlindTestGameView.vue'
import BlindTestSummaryView from '@/views/BlindTestSummaryView.vue'

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
      path: '/blind-test/playlist',
      name: 'blind-test-playlist',
      component: BlindTestPlaylistView,
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
})

export default router
