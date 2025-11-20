<template>
  <main class="blind-test-playlist">
    <PlaylistSearch
      @playlist-selected="onPlaylistSelected"
      @back="goToSettings"
    />

    <!-- Bouton de retour -->
    <div class="back-navigation">
      <router-link to="/blind-test/settings" class="back-button">
        ← Retour aux paramètres
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PlaylistSearch from '@/components/blind-test/PlaylistSearch.vue'
import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'

const router = useRouter()

function onPlaylistSelected(data: { playlist: DeezerPlaylist, tracks: DeezerTrack[] }) {
  // Sauvegarder la playlist et les tracks sélectionnées
  localStorage.setItem('blindTestPlaylist', JSON.stringify(data.playlist))
  localStorage.setItem('blindTestTracks', JSON.stringify(data.tracks))
  
  // Rediriger vers le jeu
  router.push('/blind-test/game')
}

function goToSettings() {
  router.push('/blind-test/settings')
}
</script>

<style scoped>
.blind-test-playlist {
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