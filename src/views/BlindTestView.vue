<template>
  <main class="blind-test">
    <!-- Étape 1: Configuration des paramètres -->
    <GameSettings
      v-if="currentStep === 'settings'"
      :settings="gameSettings"
      @update:settings="updateSettings"
      @next="goToPlaylistSelection"
    />

    <!-- Étape 2: Sélection de playlist -->
    <PlaylistSearch
      v-else-if="currentStep === 'playlist'"
      @playlist-selected="onPlaylistSelected"
      @back="goToSettings"
    />

    <!-- Étape 3: Jeu en cours -->
    <GamePlay
      v-else-if="currentStep === 'playing' && selectedPlaylist"
      :settings="gameSettings"
      :tracks="selectedTracks"
      :playlist="selectedPlaylist"
      @game-finished="onGameFinished"
      @game-stopped="onGameStopped"
    />

    <!-- Étape 4: Résumé de la partie -->
    <GameSummary
      v-else-if="currentStep === 'summary'"
      :final-score="gameResults.score"
      :results="gameResults.results"
      :end-reason="gameResults.endReason"
      :settings="gameSettings"
      @new-game="startNewGame"
      @back-to-home="goHome"
    />

    <!-- Bouton de retour (visible seulement dans les étapes settings et playlist) -->
    <div v-if="currentStep === 'settings' || currentStep === 'playlist'" class="back-navigation">
      <router-link to="/" class="back-button">
        ← Retour à l'accueil
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameSettings from '@/components/blind-test/GameSettings.vue'
import PlaylistSearch from '@/components/blind-test/PlaylistSearch.vue'
import GamePlay from '@/components/blind-test/GamePlay.vue'
import GameSummary from '@/components/blind-test/GameSummary.vue'
import type { 
  GameSettings as GameSettingsType, 
  TrackResult,
  GameEndReason
} from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'
import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'

const router = useRouter()

// État de l'application
type Step = 'settings' | 'playlist' | 'playing' | 'summary'
const currentStep = ref<Step>('settings')

// Configuration du jeu
const gameSettings = ref<GameSettingsType>({ ...DEFAULT_GAME_SETTINGS })

// Playlist sélectionnée
const selectedPlaylist = ref<DeezerPlaylist | null>(null)
const selectedTracks = ref<DeezerTrack[]>([])

// Résultats de la partie
const gameResults = ref<{
  score: number
  results: TrackResult[]
  endReason: GameEndReason
}>({
  score: 0,
  results: [],
  endReason: 'player_stopped' as GameEndReason
})

// Méthodes de navigation
function updateSettings(settings: GameSettingsType) {
  gameSettings.value = { ...settings }
}

function goToPlaylistSelection() {
  currentStep.value = 'playlist'
}

function goToSettings() {
  currentStep.value = 'settings'
}

function onPlaylistSelected(data: { playlist: DeezerPlaylist, tracks: DeezerTrack[] }) {
  selectedPlaylist.value = data.playlist
  selectedTracks.value = data.tracks
  currentStep.value = 'playing'
}

function onGameFinished(data: { 
  score: number, 
  results: TrackResult[], 
  endReason: GameEndReason 
}) {
  gameResults.value = data
  currentStep.value = 'summary'
}

function onGameStopped() {
  // Retourner à la sélection de playlist si le jeu est arrêté
  currentStep.value = 'playlist'
}

function startNewGame() {
  // Recommencer avec la même playlist
  if (selectedPlaylist.value && selectedTracks.value.length > 0) {
    currentStep.value = 'playing'
  } else {
    currentStep.value = 'playlist'
  }
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.blind-test {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.back-navigation {
  position: fixed;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  z-index: 100;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--spotify-dark-gray);
  color: var(--spotify-white);
  border: 1px solid var(--spotify-gray);
  border-radius: var(--border-radius-full);
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: var(--spotify-gray);
  border-color: var(--spotify-green);
  color: var(--spotify-green);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .back-navigation {
    position: relative;
    top: auto;
    left: auto;
    padding: var(--spacing-lg);
    text-align: center;
  }
}
</style>