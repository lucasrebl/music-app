<template>
  <div v-if="selectedPlaylists.length || selectedArtists.length" class="selected-playlist">
    <h3>Sources sélectionnées</h3>

    <div class="sources-grid">
      <div v-for="pl in selectedPlaylists" :key="`playlist-${pl.id}`" class="source-item">
        <img :src="pl.picture_medium" :alt="pl.title" class="source-image">
        <div class="source-info">
          <h4 class="source-title">{{ pl.title }}</h4>
          <p class="source-details">{{ pl.creator?.name }} • {{ pl.nb_tracks }} titres</p>
        </div>
        <button @click="$emit('remove-playlist', pl.id)" class="remove-btn" title="Supprimer cette playlist">
          ✕
        </button>
      </div>
      
      <div v-for="art in selectedArtists" :key="`artist-${art.id}`" class="source-item">
        <img :src="art.picture_medium" :alt="art.name" class="source-image">
        <div class="source-info">
          <h4 class="source-title">{{ art.name }}</h4>
          <p class="source-details">{{ art.nb_fan }} fans</p>
        </div>
        <button @click="$emit('remove-artist', art.id)" class="remove-btn" title="Supprimer cet artiste">
          ✕
        </button>
      </div>
    </div>

    <div class="playlist-actions">
      <button
        class="btn btn-secondary"
        @click="$emit('clear-selections')"
      >
        Effacer
      </button>
      <button
        class="btn btn-primary"
        @click="$emit('confirm-playlist')"
        :disabled="loading || !areSettingsValid"
      >
        {{ loading ? 'Chargement...' : 'Valider et commencer le jeu' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'

interface Props {
  selectedPlaylists: DeezerPlaylist[]
  selectedArtists: DeezerArtist[]
  loading: boolean
  areSettingsValid: boolean
}

interface Emits {
  (e: 'remove-playlist', id: number): void
  (e: 'remove-artist', id: number): void
  (e: 'clear-selections'): void
  (e: 'confirm-playlist'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.selected-playlist {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  border: 2px solid var(--spotify-green);
  margin-bottom: var(--spacing-2xl);
}

.selected-playlist h3 {
  color: var(--spotify-green);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.sources-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.source-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--spotify-gray);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  position: relative;
}

.source-image {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.source-info {
  flex: 1;
  min-width: 0;
}

.source-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--spotify-white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-details {
  margin: 0;
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  background: var(--spotify-dark-gray);
  color: var(--spotify-light-gray);
  border: 1px solid var(--spotify-gray);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
  transform: scale(1.1);
}

.playlist-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
}

.playlist-actions .btn {
  flex: 1;
  max-width: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .sources-grid {
    grid-template-columns: 1fr;
  }
  
  .source-item {
    padding: var(--spacing-sm);
  }
  
  .playlist-actions {
    flex-direction: column;
  }
  
  .playlist-actions .btn {
    max-width: none;
  }
}
</style>