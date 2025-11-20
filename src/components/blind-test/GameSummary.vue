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
      @back-to-home="$emit('back-to-home')"
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
  (e: 'back-to-home'): void
}

defineProps<Props>()
defineEmits<Emits>()
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