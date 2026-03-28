<template>
  <main class="blind-test-game">
    <GamePlay
      v-if="gameSettings && selectedPlaylist && selectedTracks.length > 0"
      :settings="gameSettings"
      :tracks="selectedTracks"
      :playlist="selectedPlaylist"
      @game-finished="onGameFinished"
    />
    
    <div v-else class="error-state">
      <h2>Erreur</h2>
      <p>Les données de la partie ne sont pas disponibles.</p>
      <router-link to="/blind-test/settings" class="btn btn-primary">
        Retour aux paramètres
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import GamePlay from '@/components/blind-test/GamePlay.vue'
import type {
  GameSettings as GameSettingsType,
  TrackResult,
  GameEndReason
} from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'
import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'

const router = useRouter()

const gameSettings = ref<GameSettingsType | null>(null)
const selectedPlaylist = ref<DeezerPlaylist | null>(null)
const selectedTracks = ref<DeezerTrack[]>([])

onBeforeRouteLeave(() => {
  const audioElements = document.querySelectorAll('audio')
  audioElements.forEach(audio => {
    audio.pause()
    audio.currentTime = 0
    audio.src = ''
  })
  return true
})

onMounted(() => {
  try {
    const savedSettings = localStorage.getItem('blindTestSettings')
    const savedPlaylist = localStorage.getItem('blindTestPlaylist')
    const savedTracks = localStorage.getItem('blindTestTracks')

    if (savedSettings) {
      gameSettings.value = { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(savedSettings) }
    } else {
      gameSettings.value = { ...DEFAULT_GAME_SETTINGS }
    }

    if (savedPlaylist) {
      selectedPlaylist.value = JSON.parse(savedPlaylist)
    }

    if (savedTracks) {
      selectedTracks.value = JSON.parse(savedTracks)
    }

    if (!selectedPlaylist.value || selectedTracks.value.length === 0) {
      localStorage.removeItem('blindTestPlaylist')
      localStorage.removeItem('blindTestTracks')
      localStorage.removeItem('blindTestSources')
      localStorage.removeItem('blindTestResults')
      localStorage.removeItem('blindTestSettings')
      router.push('/blind-test')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données de jeu:', error)
    router.push('/blind-test/settings')
  }
})

function onGameFinished(data: {
  score: number
  results: TrackResult[]
  endReason: GameEndReason
}) {
  localStorage.setItem('blindTestResults', JSON.stringify(data))
  
  setTimeout(() => {
    router.push('/blind-test/summary')
  }, 100)
}
</script>

<style scoped>
.blind-test-game {
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