<template>
  <div class="game-summary">
    <SummaryHeader
      :finalScore="finalScore"
      :endReason="endReason"
    />

    <ObjectivesDisplay
      :settings="settings"
    />

    <SourcesDisplay
      :selectedPlaylists="selectedPlaylists"
      :selectedArtists="selectedArtists"
    />

    <StatsDisplay
      :results="results"
    />

    <TracksDetails
      :results="results"
    />

    <SummaryActions
      @quit-game="$emit('quit-game')"
      @download-results="downloadResults"
    />
  </div>
</template>

<script setup lang="ts">
import type { TrackResult, GameEndReason, GameSettings as GameSettingsType } from '@/types/blindTest'
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'

// Composants
import SummaryHeader from './summary/SummaryHeader.vue'
import ObjectivesDisplay from './summary/ObjectivesDisplay.vue'
import SourcesDisplay from './summary/SourcesDisplay.vue'
import StatsDisplay from './summary/StatsDisplay.vue'
import TracksDetails from './summary/TracksDetails.vue'
import SummaryActions from './summary/SummaryActions.vue'

interface Props {
  finalScore: number
  results: TrackResult[]
  endReason: GameEndReason
  settings?: GameSettingsType
  selectedPlaylists?: DeezerPlaylist[]
  selectedArtists?: DeezerArtist[]
}

interface Emits {
  (e: 'quit-game'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

function downloadResults() {
  const gameData = {
    metadata: {
      exportDate: new Date().toISOString(),
      gameVersion: '1.0.0',
      appName: 'Music App - Blind Test'
    },
    gameSettings: props.settings,
    gameResults: {
      finalScore: props.finalScore,
      endReason: props.endReason,
      results: props.results
    },
    sources: {
      playlists: props.selectedPlaylists || [],
      artists: props.selectedArtists || []
    }
  }

  const dataStr = JSON.stringify(gameData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `blind-test-results-${new Date().toISOString().split('T')[0]}.json`
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.game-summary {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .game-summary {
    padding: var(--spacing-lg);
  }
}
</style>