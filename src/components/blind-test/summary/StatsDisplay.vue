<template>
  <div class="stats-section">
    <h3>📊 Statistiques</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ correctAnswers }}/{{ totalTracks }}</div>
        <div class="stat-label">Bonnes réponses</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ successRate }}%</div>
        <div class="stat-label">Taux de réussite</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ averageTime }}s</div>
        <div class="stat-label">Temps moyen</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ averagePoints }}</div>
        <div class="stat-label">Points moyens</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TrackResult } from '@/types/blindTest'

interface Props {
  results: TrackResult[]
}

const props = defineProps<Props>()

// Computed properties pour les statistiques
const totalTracks = computed(() => props.results.length)
const correctAnswers = computed(() => props.results.filter(r => r.isCorrect).length)
const successRate = computed(() => {
  if (totalTracks.value === 0) return 0
  return Math.round((correctAnswers.value / totalTracks.value) * 100)
})

const averageTime = computed(() => {
  if (totalTracks.value === 0) return 0
  const totalTime = props.results.reduce((sum, r) => sum + r.timeToAnswer, 0)
  return (totalTime / totalTracks.value / 1000).toFixed(1)
})

const averagePoints = computed(() => {
  if (correctAnswers.value === 0) return 0
  const correctResults = props.results.filter(r => r.isCorrect)
  const totalPoints = correctResults.reduce((sum, r) => sum + r.points, 0)
  return (totalPoints / correctResults.length).toFixed(1)
})
</script>

<style scoped>
.stats-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.stats-section h3 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xl);
  color: var(--spotify-green);
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--spotify-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  border: 1px solid var(--spotify-light-gray);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--spotify-green);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>