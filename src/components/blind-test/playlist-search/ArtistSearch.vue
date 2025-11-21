<template>
  <div class="artist-section">
    <div class="form-group">
      <label for="artistQuery">Rechercher un artiste</label>
      <input
        id="artistQuery"
        :value="artistQuery"
        @input="$emit('update:artistQuery', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Ex: Daft Punk, Édith Piaf, The Beatles..."
      />
    </div>
    
    <div v-if="artistResults.length" class="results-grid">
      <div
        v-for="artist in artistResults"
        :key="artist.id"
        :class="['artist-card', { selected: isSelected(artist) }]"
        @click="$emit('select-artist', artist)"
      >
        <img :src="artist.picture_medium" :alt="artist.name" />
        <div class="artist-info">
          <h4>{{ artist.name }}</h4>
          <p>{{ artist.nb_album }} albums</p>
          <small>{{ artist.nb_fan }} fans</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeezerArtist } from '@/services/deezerService'

interface Props {
  artistQuery: string
  artistResults: DeezerArtist[]
  selectedArtists: DeezerArtist[]
}

interface Emits {
  (e: 'update:artistQuery', value: string): void
  (e: 'select-artist', artist: DeezerArtist): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

function isSelected(artist: DeezerArtist) {
  return props.selectedArtists.some(a => a.id === artist.id)
}
</script>

<style scoped>
.artist-section {
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

.artist-card {
  background: var(--spotify-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-base);
  border: 2px solid transparent;
}

.artist-card:hover {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.artist-card.selected {
  border-color: var(--spotify-green);
}

.artist-card img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-sm);
  object-fit: cover;
}

.artist-info h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.artist-info p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--spacing-xs);
}

.artist-info small {
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