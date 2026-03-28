<template>
  <div class="summary-header">
    <div class="final-score">
      <h2>🎉 Partie terminée !</h2>
      <div class="score-display">
        <span class="score">{{ finalScore }}</span>
        <span class="label">points</span>
      </div>
      <p class="end-reason">{{ endReasonText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameEndReason } from '@/types/blindTest'

interface Props {
  finalScore: number
  endReason: GameEndReason
}

const props = defineProps<Props>()

const endReasonText = computed(() => {
  switch (props.endReason) {
    case 'target_score_reached':
      return 'Objectif de points atteint ! 🎯'
    case 'all_tracks_played':
      return 'Tous les titres ont été joués 🎵'
    case 'player_stopped':
      return 'Partie arrêtée par le joueur ⏹️'
    default:
      return 'Partie terminée'
  }
})
</script>

<style scoped>
.summary-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.final-score h2 {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-xl);
  color: var(--spotify-white);
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.score {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  color: var(--spotify-green);
}

.label {
  font-size: var(--font-size-2xl);
  color: var(--spotify-light-gray);
}

.end-reason {
  font-size: var(--font-size-lg);
  color: var(--spotify-light-gray);
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .score {
    font-size: var(--font-size-4xl);
  }
}

@media (max-width: 480px) {
  .score-display {
    flex-direction: column;
    gap: 0;
  }
  
  .label {
    font-size: var(--font-size-lg);
  }
}
</style>