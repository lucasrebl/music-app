<template>
  <main class="blind-test-summary">
    <GameSummary
      v-if="gameResults && gameSettings"
      :final-score="gameResults.score"
      :results="gameResults.results"
      :end-reason="gameResults.endReason"
      :settings="gameSettings"
      :selected-playlists="savedSources?.playlists"
      :selected-artists="savedSources?.artists"
      @quit-game="quit"
    />
    
    <div v-else class="error-state">
      <h2>Aucun résultat disponible</h2>
      <p>Les résultats de la partie ne sont pas disponibles.</p>
      <router-link to="/blind-test/settings" class="btn btn-primary">
        Nouvelle partie
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GameSummary from '@/components/blind-test/GameSummary.vue'
import type {
  GameSettings as GameSettingsType,
  TrackResult,
  GameEndReason
} from '@/types/blindTest'
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

const router = useRouter()

const gameResults = ref<{
  score: number
  results: TrackResult[]
  endReason: GameEndReason
} | null>(null)

const savedSources = ref<{ playlists?: DeezerPlaylist[]; artists?: DeezerArtist[] } | null>(null)

const gameSettings = ref<GameSettingsType | null>(null)

onMounted(() => {
  try {
    const savedResults = localStorage.getItem('blindTestResults')
    const savedSettings = localStorage.getItem('blindTestSettings')

    if (savedResults) {
      gameResults.value = JSON.parse(savedResults)
    }

    const savedSourcesRaw = localStorage.getItem('blindTestSources')
    if (savedSourcesRaw) {
      try {
        savedSources.value = JSON.parse(savedSourcesRaw)
      } catch (e) {
        savedSources.value = null
      }
    }

    if (savedSettings) {
      gameSettings.value = { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(savedSettings) }
    } else {
      gameSettings.value = { ...DEFAULT_GAME_SETTINGS }
    }

    if (!gameResults.value) {
      router.push('/blind-test/settings')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des résultats:', error)
    router.push('/blind-test/settings')
  }
})

function quit() {
  localStorage.removeItem('blindTestResults')
  localStorage.removeItem('blindTestPlaylist')
  localStorage.removeItem('blindTestTracks')
  localStorage.removeItem('blindTestSettings')
  localStorage.removeItem('blindTestSources')
  
  router.push('/blind-test')
}
</script>

<style scoped>
.blind-test-summary {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: var(--spacing-xl);
}

.error-state h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-error);
}

.error-state p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--spotify-light-gray);
}
</style>