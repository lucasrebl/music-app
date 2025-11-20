<template>
  <div class="playlist-search">
    <SearchHeader />

    <SelectedSources
      :selectedPlaylists="selectedPlaylists"
      :selectedArtists="selectedArtists"
      :loading="loading"
      :areSettingsValid="areSettingsValid"
      @remove-playlist="removeSelectedPlaylist"
      @remove-artist="removeSelectedArtist"
      @clear-selections="clearSelections"
      @confirm-playlist="confirmPlaylist"
    />

    <SearchTabs
      v-model:activeTab="activeTab"
      :isArtistTabDisabled="isArtistTabDisabled"
    />

    <!-- Contenu des tabs -->
    <div class="tab-content">
      <UrlSearch
        v-if="activeTab === 'url'"
        v-model:playlistUrl="playlistUrl"
        :urlError="urlError"
        :isValidUrl="isValidUrl"
        :loading="loading"
        @load-playlist="loadPlaylistFromUrl"
      />

      <PlaylistSearchTab
        v-if="activeTab === 'search'"
        v-model:searchQuery="searchQuery"
        :searchResults="searchResults"
        :selectedPlaylists="selectedPlaylists"
        @select-playlist="selectPlaylist"
      />

      <ArtistSearch
        v-if="activeTab === 'artist'"
        v-model:artistQuery="artistQuery"
        :artistResults="artistResults"
        :selectedArtists="selectedArtists"
        @select-artist="selectArtist"
      />
    </div>

    <ErrorMessage
      :error="error"
      @clear-error="error = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { deezerService, type DeezerPlaylist, type DeezerArtist, type DeezerTrack } from '@/services/deezerService'
import type { GameSettings } from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

// Composants
import SearchHeader from './playlist-search/SearchHeader.vue'
import SelectedSources from './playlist-search/SelectedSources.vue'
import SearchTabs from './playlist-search/SearchTabs.vue'
import UrlSearch from './playlist-search/UrlSearch.vue'
import PlaylistSearchTab from './playlist-search/PlaylistSearchTab.vue'
import ArtistSearch from './playlist-search/ArtistSearch.vue'
import ErrorMessage from './playlist-search/ErrorMessage.vue'

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

// Computed pour vérifier la validité des paramètres
const areSettingsValid = computed(() => {
  return (
    gameSettings.value.targetScore >= 10 &&
    gameSettings.value.targetScore <= 200 &&
    gameSettings.value.maxTracks >= 5 &&
    gameSettings.value.maxTracks <= 50 &&
    (gameSettings.value.validateTitle || gameSettings.value.validateArtist)
  )
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

// Sélection (support multi-sélection)
const selectedPlaylists = ref<DeezerPlaylist[]>([])
const selectedArtists = ref<DeezerArtist[]>([])
// Cache des tracks par artiste id pour éviter les re-fetch
const artistTracks = ref<Record<number, DeezerTrack[]>>({})

let searchTimeout: number | null = null
let artistSearchTimeout: number | null = null

// Watchers
watch(() => playlistUrl.value, validateUrl)
watch(() => searchQuery.value, debounceSearch)
watch(() => artistQuery.value, debounceArtistSearch)

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
    
    // ajouter la playlist sélectionnée à la liste (toggle)
    const idx = selectedPlaylists.value.findIndex(p => p.id === playlist.id)
    if (idx === -1) selectedPlaylists.value.push(playlist)
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
function isPlaylistSelected(playlist: DeezerPlaylist) {
  return selectedPlaylists.value.some(p => p.id === playlist.id)
}

function isArtistSelected(artist: DeezerArtist) {
  return selectedArtists.value.some(a => a.id === artist.id)
}

function removeSelectedPlaylist(playlistId: number) {
  const idx = selectedPlaylists.value.findIndex(p => p.id === playlistId)
  if (idx !== -1) selectedPlaylists.value.splice(idx, 1)
}

function removeSelectedArtist(artistId: number) {
  const idx = selectedArtists.value.findIndex(a => a.id === artistId)
  if (idx !== -1) selectedArtists.value.splice(idx, 1)
  delete artistTracks.value[artistId]
}

function selectPlaylist(playlist: DeezerPlaylist) {
  const idx = selectedPlaylists.value.findIndex(p => p.id === playlist.id)
  if (idx === -1) selectedPlaylists.value.push(playlist)
  else selectedPlaylists.value.splice(idx, 1)
}

function clearSelections() {
  selectedPlaylists.value = []
  selectedArtists.value = []
  artistTracks.value = {}
}

// Sélection artiste: toggle et cache des top tracks
async function selectArtist(artist: DeezerArtist) {
  const idx = selectedArtists.value.findIndex(a => a.id === artist.id)
  if (idx === -1) {
    // add
    selectedArtists.value.push(artist)
    loading.value = true
    try {
      const tracks = await deezerService.getArtistTopTracks(artist.id)
      if (tracks.length === 0) {
        throw new Error('Aucun titre disponible pour cet artiste')
      }
      artistTracks.value[artist.id] = tracks
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la récupération des titres d\'artiste'
      const rem = selectedArtists.value.findIndex(a => a.id === artist.id)
      if (rem !== -1) selectedArtists.value.splice(rem, 1)
    } finally {
      loading.value = false
    }
  } else {
    // remove
    selectedArtists.value.splice(idx, 1)
    delete artistTracks.value[artist.id]
  }
}

// Confirmation des sources sélectionnées : agrège, déduplique, shuffle et émet
async function confirmPlaylist() {
  const selectedCount = selectedPlaylists.value.length + selectedArtists.value.length
  if (selectedCount === 0) {
    error.value = 'Veuillez sélectionner au moins une playlist ou un artiste'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const allTracks: DeezerTrack[] = []

    // Récupérer les tracks des playlists sélectionnées
    for (const pl of selectedPlaylists.value) {
      const tracks = await deezerService.getPlaylistTracks(pl.id)
      allTracks.push(...tracks)
    }

    // Ajouter les tracks des artistes (depuis le cache si présent)
    for (const art of selectedArtists.value) {
      const tracks = artistTracks.value[art.id] ?? await deezerService.getArtistTopTracks(art.id)
      allTracks.push(...tracks)
    }

    // Dédupliquer par id
    const uniqueMap: Record<number, DeezerTrack> = {}
    for (const t of allTracks) uniqueMap[t.id] = t
    let combined = Object.values(uniqueMap)

    // Shuffle et limiter au maxTracks
    combined = shuffleArray(combined)
    combined = combined.slice(0, gameSettings.value.maxTracks)

    if (combined.length === 0) {
      throw new Error('Aucune piste disponible avec aperçu dans les sources sélectionnées')
    }

    const virtualPlaylist: DeezerPlaylist = {
      id: Date.now(),
      title: `Mix — ${selectedPlaylists.value.length} playlists, ${selectedArtists.value.length} artistes`,
      description: `Mix généré à partir des sources sélectionnées`,
      duration: combined.reduce((s, t) => s + t.duration, 0),
      public: true,
      nb_tracks: combined.length,
      picture: selectedPlaylists.value[0]?.picture || selectedArtists.value[0]?.picture || '',
      picture_small: selectedPlaylists.value[0]?.picture_small || selectedArtists.value[0]?.picture_small || '',
      picture_medium: selectedPlaylists.value[0]?.picture_medium || selectedArtists.value[0]?.picture_medium || '',
      picture_big: selectedPlaylists.value[0]?.picture_big || selectedArtists.value[0]?.picture_big || '',
      creator: { id: 0, name: 'Music App' }
    }

    // Persister comme avant
    localStorage.setItem('blindTestPlaylist', JSON.stringify(virtualPlaylist))
    localStorage.setItem('blindTestTracks', JSON.stringify(combined))
    // Save selected sources so summary can show them
    localStorage.setItem('blindTestSources', JSON.stringify({
      playlists: selectedPlaylists.value,
      artists: selectedArtists.value
    }))

    emit('playlist-selected', { playlist: virtualPlaylist, tracks: combined })
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

/* Responsive */
@media (max-width: 768px) {
  .playlist-search {
    padding: var(--spacing-lg);
  }
}
</style>