<template>
  <main class="blind-test-settings">
    <div class="settings-container">
      <div class="settings-column">
        <GameSettings
          :settings="gameSettings"
          @update:settings="updateSettings"
        />
      </div>
      
      <div class="playlist-column">
        <PlaylistSearch
          @playlist-selected="onPlaylistSelected"
          @back="goToSettings"
        />
      </div>
    </div>
    
    <div class="back-navigation">
      <router-link to="/blind-test" class="back-button">
        ← Retour
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameSettings from '@/components/blind-test/GameSettings.vue'
import PlaylistSearch from '@/components/blind-test/PlaylistSearch.vue'
import type { GameSettings as GameSettingsType } from '@/types/blindTest'
import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

const router = useRouter()

const gameSettings = ref<GameSettingsType>({ ...DEFAULT_GAME_SETTINGS })

const savedSettings = localStorage.getItem('blindTestSettings')
if (savedSettings) {
  try {
    gameSettings.value = { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(savedSettings) }
  } catch (e) {
    console.warn('Erreur lors du chargement des paramètres sauvegardés')
  }
}

function updateSettings(settings: GameSettingsType) {
  gameSettings.value = { ...settings }
  localStorage.setItem('blindTestSettings', JSON.stringify(settings))
}

function onPlaylistSelected(data: { playlist: DeezerPlaylist, tracks: DeezerTrack[] }) {
  localStorage.setItem('blindTestPlaylist', JSON.stringify(data.playlist))
  localStorage.setItem('blindTestTracks', JSON.stringify(data.tracks))
  
  router.push('/blind-test/game')
}

function goToSettings() {
  const settingsColumn = document.querySelector('.settings-column')
  if (settingsColumn) {
    settingsColumn.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.blind-test-settings {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.settings-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  min-height: 100vh;
  padding: var(--spacing-xl);
}

.settings-column,
.playlist-column {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.settings-column {
  border-right: 1px solid var(--spotify-gray);
  padding-right: var(--spacing-xl);
}

.playlist-column {
  padding-left: var(--spacing-xl);
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
@media (max-width: 1200px) {
  .settings-container {
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }
  
  .settings-column {
    padding-right: var(--spacing-lg);
  }
  
  .playlist-column {
    padding-left: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
  }
  
  .settings-column {
    border-right: none;
    border-bottom: 1px solid var(--spotify-gray);
    padding-right: 0;
    padding-bottom: var(--spacing-lg);
  }
  
  .playlist-column {
    padding-left: 0;
    padding-top: var(--spacing-lg);
  }
  
  .back-navigation {
    position: relative;
    top: auto;
    left: auto;
    padding: var(--spacing-lg);
    text-align: center;
  }
}
</style>