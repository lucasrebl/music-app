<template>
  <div class="search-section">
    <div class="form-group">
      <label for="searchQuery">Rechercher une playlist</label>
      <input
        id="searchQuery"
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Ex: Top Hits, Pop français, Rock classics..."
      />
    </div>
    
    <div v-if="searchResults.length" class="results-grid">
      <div
        v-for="playlist in searchResults"
        :key="playlist.id"
        :class="['playlist-card', { selected: isSelected(playlist) }]"
        @click="$emit('select-playlist', playlist)"
      >
        <img :src="playlist.picture_medium" :alt="playlist.title" />
        <div class="playlist-info">
          <h4>{{ playlist.title }}</h4>
          <p>{{ playlist.nb_tracks }} titres</p>
          <small>Par {{ playlist.creator?.name || 'Inconnu' }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeezerPlaylist } from '@/services/deezerService'

interface Props {
  searchQuery: string
  searchResults: DeezerPlaylist[]
  selectedPlaylists: DeezerPlaylist[]
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'select-playlist', playlist: DeezerPlaylist): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

function isSelected(playlist: DeezerPlaylist) {
  return props.selectedPlaylists.some(p => p.id === playlist.id)
}
</script>

<style scoped>
.search-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--spotify-white);
}

.form-group input {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--spotify-gray);
  border: 1px solid var(--spotify-light-gray);
  border-radius: var(--border-radius-md);
  color: var(--spotify-white);
  font-size: var(--font-size-base);
}

.form-group input:focus {
  border-color: var(--spotify-green);
  outline: none;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.playlist-card {
  background: var(--spotify-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-base);
  border: 2px solid transparent;
}

.playlist-card:hover {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.playlist-card.selected {
  border-color: var(--spotify-green);
}

.playlist-card img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-sm);
  object-fit: cover;
}

.playlist-info h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.playlist-info p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--spacing-xs);
}

.playlist-info small {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>