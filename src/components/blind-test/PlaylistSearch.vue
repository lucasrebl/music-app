<template>
  <div class="playlist-search">
    <div class="search-header">
      <h2>🎵 Sélection de la musique</h2>
      <p>Choisissez la source musicale pour votre blind test</p>
    </div>

    <!-- Tabs de sélection -->
    <div class="search-tabs">
      <button
        :class="['tab-button', { active: activeTab === 'url' }]"
        @click="activeTab = 'url'"
      >
        🔗 URL Playlist
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'search' }]"
        @click="activeTab = 'search'"
      >
        🔍 Rechercher
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'artist', disabled: isArtistTabDisabled }]"
        @click="!isArtistTabDisabled && (activeTab = 'artist')"
        :disabled="isArtistTabDisabled"
        :title="isArtistTabDisabled ? 'Désactivé car seule la validation par artiste est cochée' : ''"
      >
        👤 Artiste
      </button>
    </div>

    <!-- Message d'information si l'onglet artiste est désactivé -->
    <div v-if="isArtistTabDisabled" class="info-message">
      ℹ️ L'onglet Artiste est désactivé car vous avez choisi de ne valider que par artiste. 
      Sélectionner un artiste unique rendrait le jeu impossible (même réponse pour tous les titres).
    </div>

    <!-- Contenu des tabs -->
    <div class="tab-content">
      <!-- Tab URL -->
      <div v-if="activeTab === 'url'" class="url-section">
        <div class="form-group">
          <label for="playlistUrl">URL de la playlist Deezer</label>
          <input
            id="playlistUrl"
            v-model="playlistUrl"
            type="url"
            placeholder="https://www.deezer.com/fr/playlist/123456789"
            @input="validateUrl"
          />
          <small v-if="urlError" class="error">{{ urlError }}</small>
          <small v-else>Collez l'URL de n'importe quelle playlist publique Deezer</small>
        </div>
        
        <button
          class="btn btn-primary"
          @click="loadPlaylistFromUrl"
          :disabled="!isValidUrl || loading"
        >
          {{ loading ? 'Chargement...' : 'Charger la playlist' }}
        </button>
      </div>

      <!-- Tab Recherche -->
      <div v-if="activeTab === 'search'" class="search-section">
        <div class="form-group">
          <label for="searchQuery">Rechercher une playlist</label>
          <input
            id="searchQuery"
            v-model="searchQuery"
            type="text"
            placeholder="Ex: Top Hits, Pop français, Rock classics..."
            @input="debounceSearch"
          />
        </div>
        
        <div v-if="searchResults.length" class="results-grid">
          <div
            v-for="playlist in searchResults"
            :key="playlist.id"
            :class="['playlist-card', { selected: selectedPlaylist?.id === playlist.id }]"
            @click="selectPlaylist(playlist)"
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

      <!-- Tab Artiste -->
      <div v-if="activeTab === 'artist'" class="artist-section">
        <div class="form-group">
          <label for="artistQuery">Rechercher un artiste</label>
          <input
            id="artistQuery"
            v-model="artistQuery"
            type="text"
            placeholder="Ex: Daft Punk, Édith Piaf, The Beatles..."
            @input="debounceArtistSearch"
          />
        </div>
        
        <div v-if="artistResults.length" class="results-grid">
          <div
            v-for="artist in artistResults"
            :key="artist.id"
            class="artist-card"
            @click="selectArtist(artist)"
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
    </div>

    <!-- Playlist sélectionnée -->
    <div v-if="selectedPlaylist" class="selected-playlist">
      <h3>Playlist sélectionnée</h3>
      <div class="playlist-preview">
        <img :src="selectedPlaylist.picture_medium" :alt="selectedPlaylist.title" />
        <div class="playlist-details">
          <h4>{{ selectedPlaylist.title }}</h4>
          <p>{{ selectedPlaylist.nb_tracks }} titres • {{ formatDuration(selectedPlaylist.duration) }}</p>
          <small v-if="selectedPlaylist.description">{{ selectedPlaylist.description }}</small>
        </div>
      </div>
      
      <div class="playlist-actions">
        <button
          class="btn btn-secondary"
          @click="selectedPlaylist = null"
        >
          Changer
        </button>
        <button
          class="btn btn-primary"
          @click="confirmPlaylist"
          :disabled="loading"
        >
          {{ loading ? 'Chargement des titres...' : 'Commencer le jeu' }}
        </button>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button class="btn btn-secondary" @click="error = ''">
        Fermer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { deezerService, type DeezerPlaylist, type DeezerArtist, type DeezerTrack } from '@/services/deezerService'
import type { GameSettings } from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

interface Emits {
  (e: 'playlist-selected', data: { playlist: DeezerPlaylist, tracks: DeezerTrack[] }): void
  (e: 'back'): void
}

const emit = defineEmits<Emits>()

// Paramètres de jeu (chargés depuis localStorage)
const gameSettings = ref<GameSettings>({ ...DEFAULT_GAME_SETTINGS })

// État réactif
const activeTab = ref<'url' | 'search' | 'artist'>('search')
const loading = ref(false)
const error = ref('')

// Computed pour savoir si l'onglet artiste doit être désactivé
const isArtistTabDisabled = computed(() => {
  // Désactiver si seule la validation par artiste est cochée
  return !gameSettings.value.validateTitle && gameSettings.value.validateArtist
})

// URL Tab
const playlistUrl = ref('')
const urlError = ref('')
const isValidUrl = computed(() => deezerService.isValidPlaylistUrl(playlistUrl.value))

// Search Tab
const searchQuery = ref('')
const searchResults = ref<DeezerPlaylist[]>([])

// Artist Tab
const artistQuery = ref('')
const artistResults = ref<DeezerArtist[]>([])

// Sélection
const selectedPlaylist = ref<DeezerPlaylist | null>(null)
// Cache temporaire des tracks pour les playlists virtuelles (artistes)
const cachedTracks = ref<DeezerTrack[] | null>(null)

let searchTimeout: number | null = null
let artistSearchTimeout: number | null = null

// Lifecycle
onMounted(() => {
  // Charger les paramètres depuis localStorage
  const savedSettings = localStorage.getItem('blindTestSettings')
  if (savedSettings) {
    try {
      gameSettings.value = { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(savedSettings) }
    } catch (e) {
      console.warn('Erreur lors du chargement des paramètres')
    }
  }
  
  // Si l'onglet artiste est désactivé et qu'il est actif, changer d'onglet
  if (isArtistTabDisabled.value && activeTab.value === 'artist') {
    activeTab.value = 'search'
  }
})

// Validation URL
function validateUrl() {
  urlError.value = ''
  if (playlistUrl.value && !isValidUrl.value) {
    urlError.value = 'URL de playlist Deezer invalide'
  }
}

// Chargement depuis URL
async function loadPlaylistFromUrl() {
  if (!isValidUrl.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const playlistId = deezerService.parsePlaylistUrl(playlistUrl.value)
    if (!playlistId) throw new Error('ID de playlist invalide')
    
    const playlist = await deezerService.getPlaylist(playlistId)
    if (!playlist.public) {
      throw new Error('Cette playlist n\'est pas publique')
    }
    
    selectedPlaylist.value = playlist
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors du chargement de la playlist'
  } finally {
    loading.value = false
  }
}

// Recherche de playlists avec debounce
function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = window.setTimeout(async () => {
    if (searchQuery.value.trim().length >= 2) {
      await searchPlaylists()
    } else {
      searchResults.value = []
    }
  }, 500)
}

async function searchPlaylists() {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  try {
    const results = await deezerService.searchPlaylists(searchQuery.value)
    searchResults.value = results.slice(0, 20) // Limite à 20 résultats
  } catch (err) {
    error.value = 'Erreur lors de la recherche de playlists'
  } finally {
    loading.value = false
  }
}

// Recherche d'artistes avec debounce
function debounceArtistSearch() {
  if (artistSearchTimeout) clearTimeout(artistSearchTimeout)
  artistSearchTimeout = window.setTimeout(async () => {
    if (artistQuery.value.trim().length >= 2) {
      await searchArtists()
    } else {
      artistResults.value = []
    }
  }, 500)
}

async function searchArtists() {
  if (!artistQuery.value.trim()) return
  
  loading.value = true
  try {
    const results = await deezerService.searchArtists(artistQuery.value)
    artistResults.value = results.slice(0, 20) // Limite à 20 résultats
  } catch (err) {
    error.value = 'Erreur lors de la recherche d\'artistes'
  } finally {
    loading.value = false
  }
}

// Sélection playlist
function selectPlaylist(playlist: DeezerPlaylist) {
  selectedPlaylist.value = playlist
}

// Sélection artiste (crée une playlist virtuelle avec les top tracks)
async function selectArtist(artist: DeezerArtist) {
  loading.value = true
  try {
    const tracks = await deezerService.getArtistTopTracks(artist.id)
    
    if (tracks.length === 0) {
      throw new Error('Aucun titre disponible pour cet artiste')
    }
    
    // Créer une playlist virtuelle
    const virtualPlaylist: DeezerPlaylist = {
      id: -artist.id, // ID négatif pour différencier
      title: `Top tracks - ${artist.name}`,
      description: `Les meilleures chansons de ${artist.name}`,
      duration: tracks.reduce((sum, track) => sum + track.duration, 0),
      public: true,
      nb_tracks: tracks.length,
      picture: artist.picture,
      picture_small: artist.picture_small,
      picture_medium: artist.picture_medium,
      picture_big: artist.picture_big,
      creator: {
        id: 0,
        name: 'Music App'
      }
    }
    
    selectedPlaylist.value = virtualPlaylist
    // Shuffle cached tracks so virtual playlist order is random
    cachedTracks.value = shuffleArray(tracks)
    // Ne pas émettre directement — l'utilisateur doit cliquer sur "Commencer le jeu"
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la sélection de l\'artiste'
  } finally {
    loading.value = false
  }
}

// Confirmation de playlist
async function confirmPlaylist() {
  if (!selectedPlaylist.value) return
  
  loading.value = true
  try {
    let tracks: DeezerTrack[]
    
      if (selectedPlaylist.value.id < 0) {
          // Playlist virtuelle d'artiste — utiliser les tracks en cache
          tracks = cachedTracks.value ?? []
        } else {
          // Playlist normale, récupérer les tracks
          tracks = await deezerService.getPlaylistTracks(selectedPlaylist.value.id)
        }

      // Shuffle the final tracks list so each game has a random order
      tracks = shuffleArray(tracks)
    
    if (tracks.length === 0) {
      throw new Error('Cette playlist ne contient aucun titre avec aperçu disponible')
    }
    
    // Émettre la sélection pour rediriger vers la page de jeu
    emit('playlist-selected', { playlist: selectedPlaylist.value, tracks })
    // Nettoyer le cache
    cachedTracks.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des titres'
  } finally {
    loading.value = false
  }
}

// Utilitaires
function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i] as T
    arr[i] = arr[j] as T
    arr[j] = tmp
  }
  return arr
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}
</script>

<style scoped>
.playlist-search {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.search-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.search-header h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
  color: var(--spotify-white);
}

.search-header p {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-lg);
}

.search-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
}

.tab-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--spotify-gray);
  color: var(--spotify-light-gray);
  border: 1px solid var(--spotify-gray);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  transition: var(--transition-base);
}

.tab-button.active {
  background: var(--spotify-green);
  color: var(--spotify-black);
  border-color: var(--spotify-green);
}

.tab-button:hover:not(.active):not(.disabled) {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.tab-button.disabled {
  background: var(--spotify-dark-gray);
  color: var(--spotify-gray);
  border-color: var(--spotify-dark-gray);
  cursor: not-allowed;
  opacity: 0.5;
}

.info-message {
  background: var(--spotify-dark-gray);
  border: 1px solid var(--spotify-gray);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
  text-align: center;
}

.tab-content {
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

.form-group small {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

.form-group small.error {
  color: var(--color-error);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.playlist-card, .artist-card {
  background: var(--spotify-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-base);
  border: 2px solid transparent;
}

.playlist-card:hover, .artist-card:hover {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.playlist-card.selected {
  border-color: var(--spotify-green);
}

.playlist-card img, .artist-card img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-sm);
  object-fit: cover;
}

.playlist-info h4, .artist-info h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.playlist-info p, .artist-info p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--spacing-xs);
}

.playlist-info small, .artist-info small {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

.selected-playlist {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  border: 2px solid var(--spotify-green);
}

.selected-playlist h3 {
  color: var(--spotify-green);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.playlist-preview {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.playlist-preview img {
  width: 100px;
  height: 100px;
  border-radius: var(--border-radius-md);
  object-fit: cover;
}

.playlist-details h4 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--spotify-white);
}

.playlist-details p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--spacing-sm);
}

.playlist-details small {
  color: var(--spotify-light-gray);
  font-style: italic;
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

.error-message {
  background: var(--color-error);
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  text-align: center;
  margin-top: var(--spacing-lg);
}

.error-message .btn {
  margin-top: var(--spacing-md);
}

/* Responsive */
@media (max-width: 768px) {
  .playlist-search {
    padding: var(--spacing-lg);
  }
  
  .search-tabs {
    flex-direction: column;
  }
  
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .playlist-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .playlist-actions {
    flex-direction: column;
  }
  
  .playlist-actions .btn {
    max-width: none;
  }
}
</style>