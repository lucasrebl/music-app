<template>
  <div class="import-section">
    <h3>📁 Importer une partie</h3>
    <p>Visualisez les résultats d'une partie précédemment exportée</p>
    
    <div class="import-area">
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <button
        class="import-button"
        @click="triggerFileSelect"
      >
        <span class="import-icon">📤</span>
        <span class="import-text">
          <span class="import-title">Choisir un fichier JSON</span>
          <span class="import-subtitle">Résultats de partie précédente</span>
        </span>
      </button>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TrackResult, GameEndReason, GameSettings } from '@/types/blindTest'
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'

interface GameData {
  metadata: {
    exportDate: string
    gameVersion: string
    appName: string
  }
  gameSettings: GameSettings
  gameResults: {
    finalScore: number
    endReason: GameEndReason
    results: TrackResult[]
  }
  sources: {
    playlists: DeezerPlaylist[]
    artists: DeezerArtist[]
  }
}

interface Emits {
  (e: 'import-success', data: GameData): void
}

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement | null>(null)
const error = ref('')

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  error.value = ''
  
  // Vérifier le type de fichier
  if (!file.name.toLowerCase().endsWith('.json')) {
    error.value = 'Veuillez sélectionner un fichier JSON valide'
    return
  }
  
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data = JSON.parse(content) as GameData
      
      // Validation basique de la structure
      if (!data.gameResults || !data.gameSettings || !data.metadata) {
        throw new Error('Structure de fichier invalide')
      }
      
      if (!data.gameResults.results || !Array.isArray(data.gameResults.results)) {
        throw new Error('Données de résultats manquantes ou invalides')
      }
      
      emit('import-success', data)
      
    } catch (err) {
      console.error('Erreur lors de l\'import:', err)
      error.value = err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier'
    }
  }
  
  reader.onerror = () => {
    error.value = 'Erreur lors de la lecture du fichier'
  }
  
  reader.readAsText(file)
  
  // Reset input pour permettre de sélectionner le même fichier plusieurs fois
  target.value = ''
}
</script>

<style scoped>
.import-section {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  margin-top: var(--spacing-3xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.import-section h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--spotify-white);
}

.import-section p {
  color: var(--spotify-light-gray);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-base);
}

.import-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.import-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl) var(--spacing-2xl);
  background: rgba(255, 255, 255, 0.03);
  color: var(--spotify-white);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 280px;
}

.import-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(29, 185, 84, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.import-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.import-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.import-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  line-height: 1.2;
}

.import-subtitle {
  font-size: var(--font-size-sm);
  font-weight: 400;
  opacity: 0.8;
  line-height: 1.2;
  color: var(--spotify-light-gray);
}

.error-message {
  background: var(--color-error);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  text-align: center;
  max-width: 400px;
}

/* Responsive */
@media (max-width: 768px) {
  .import-section {
    padding: var(--spacing-lg);
  }
  
  .import-button {
    min-width: auto;
    width: 100%;
    max-width: 300px;
  }
  
  .import-text {
    align-items: center;
  }
}
</style>