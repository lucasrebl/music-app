<template>
  <div v-if="selectedPlaylists?.length || selectedArtists?.length" class="sources-section">
    <h3>📚 Sources sélectionnées</h3>
    <div class="sources-grid">
      <div v-if="selectedPlaylists?.length" class="sources-column">
        <h4>Playlists</h4>
        <ul>
          <li v-for="pl in selectedPlaylists" :key="pl.id">
            <strong>{{ pl.title }}</strong>
            <div class="source-meta">{{ pl.nb_tracks }} titres</div>
          </li>
        </ul>
      </div>

      <div v-if="selectedArtists?.length" class="sources-column">
        <h4>Artistes</h4>
        <ul>
          <li v-for="ar in selectedArtists" :key="ar.id">
            <strong>{{ ar.name }}</strong>
            <div class="source-meta">{{ ar.nb_album }} albums — {{ ar.nb_fan }} fans</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'

interface Props {
  selectedPlaylists?: DeezerPlaylist[]
  selectedArtists?: DeezerArtist[]
}

defineProps<Props>()
</script>

<style scoped>
.sources-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.sources-section h3 {
  color: var(--spotify-green);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.sources-grid {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.sources-column {
  flex: 1;
  min-width: 200px;
}

.sources-column h4 {
  color: var(--spotify-green);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-lg);
}

.sources-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sources-column li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px dashed rgba(255,255,255,0.03);
}

.sources-column li:last-child {
  border-bottom: none;
}

.sources-column strong {
  color: var(--spotify-white);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.source-meta {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}
</style>