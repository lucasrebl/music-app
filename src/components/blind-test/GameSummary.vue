<template>
  <div class="game-summary">
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

    <!-- Objectifs de la partie -->
    <div v-if="settings" class="objectives-section">
      <h3>🎯 Objectifs définis</h3>
      <div class="objectives-grid">
        <div class="objective-card">
          <div class="objective-label">Points pour gagner</div>
          <div class="objective-value">{{ settings.targetScore }}</div>
        </div>
        <div class="objective-card">
          <div class="objective-label">Nombre maximum de titres</div>
          <div class="objective-value">{{ settings.maxTracks }}</div>
        </div>
        <div class="objective-card">
          <div class="objective-label">Durée par piste (s)</div>
          <div class="objective-value">{{ settings.trackDuration }}</div>
        </div>
      </div>
    </div>

    <!-- Statistiques générales -->
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

    <!-- Détail des titres -->
    <div class="tracks-section">
      <h3>🎵 Détail des titres</h3>
      <div class="tracks-list">
        <div
          v-for="(result, index) in results"
          :key="index"
          :class="['track-result', { correct: result.isCorrect, incorrect: !result.isCorrect }]"
        >
          <div class="track-number">{{ index + 1 }}</div>
          
          <div class="track-info">
            <h4>{{ result.track.title }}</h4>
            <p>{{ result.track.artist.name }}</p>
          </div>
          
          <div class="player-answer">
            <div class="answer-text">
              {{ result.playerAnswer || 'Pas de réponse' }}
            </div>
            <div class="answer-status">
              {{ result.isCorrect ? '✅ Correct' : '❌ Incorrect' }}
            </div>
          </div>
          
          <div class="mistakes" v-if="result.attempts && result.attempts.length">
            <div class="mistakes-label">Erreurs :</div>
            <ul class="mistakes-list">
              <li v-for="(a, i) in result.attempts" :key="i">{{ a }}</li>
            </ul>
          </div>
          
          <div class="track-stats">
            <div class="points">{{ result.points }} pts</div>
            <div class="time">{{ (result.timeToAnswer / 1000).toFixed(1) }}s</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="summary-actions">
      <button
        class="btn btn-secondary"
        @click="$emit('new-game')"
      >
        🔄 Nouvelle partie
      </button>
      <button
        class="btn btn-primary"
        @click="$emit('back-to-home')"
      >
        🏠 Retour à l'accueil
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TrackResult, GameEndReason, GameSettings as GameSettingsType } from '@/types/blindTest'

interface Props {
  finalScore: number
  results: TrackResult[]
  endReason: GameEndReason
  settings?: GameSettingsType
}

interface Emits {
  (e: 'new-game'): void
  (e: 'back-to-home'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

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
.game-summary {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

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

.stats-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.objectives-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.objectives-grid {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.objective-card {
  background: var(--spotify-gray);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  text-align: center;
  min-width: 160px;
  border: 1px solid var(--spotify-light-gray);
}

.objective-label {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.objective-value {
  color: var(--spotify-white);
  font-weight: 700;
  font-size: var(--font-size-xl);
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

.tracks-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.tracks-section h3 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xl);
  color: var(--spotify-green);
  text-align: center;
}

.tracks-list {
  max-height: 400px;
  overflow-y: auto;
  border-radius: var(--border-radius-md);
}

.track-result {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 100px;
  gap: var(--spacing-lg);
  align-items: center;
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  background: var(--spotify-gray);
  border-radius: var(--border-radius-md);
  border-left: 4px solid transparent;
}

.track-result.correct {
  border-left-color: var(--spotify-green);
}

.track-result.incorrect {
  border-left-color: var(--color-error);
}

.track-number {
  font-weight: 700;
  color: var(--spotify-light-gray);
  text-align: center;
  background: var(--spotify-dark-gray);
  width: 30px;
  height: 30px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
}

.track-info h4 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--spotify-white);
  margin-bottom: var(--spacing-xs);
}

.track-info p {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

.player-answer {
  text-align: center;
}

.answer-text {
  font-size: var(--font-size-sm);
  color: var(--spotify-white);
  margin-bottom: var(--spacing-xs);
  font-style: italic;
}

.answer-status {
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.track-result.correct .answer-status {
  color: var(--spotify-green);
}

.track-result.incorrect .answer-status {
  color: var(--color-error);
}

.track-stats {
  text-align: center;
}

.points {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--spotify-green);
  margin-bottom: var(--spacing-xs);
}

.time {
  font-size: var(--font-size-sm);
  color: var(--spotify-light-gray);
}

.summary-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
}

.summary-actions .btn {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
  min-width: 200px;
}

/* Scrollbar custom */
.tracks-list::-webkit-scrollbar {
  width: 8px;
}

.tracks-list::-webkit-scrollbar-track {
  background: var(--spotify-gray);
  border-radius: var(--border-radius-full);
}

.tracks-list::-webkit-scrollbar-thumb {
  background: var(--spotify-light-gray);
  border-radius: var(--border-radius-full);
}

.tracks-list::-webkit-scrollbar-thumb:hover {
  background: var(--spotify-green);
}

/* Responsive */
@media (max-width: 768px) {
  .game-summary {
    padding: var(--spacing-lg);
  }
  
  .score {
    font-size: var(--font-size-4xl);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .track-result {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .track-number {
    margin: 0 auto;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .summary-actions .btn {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .score-display {
    flex-direction: column;
    gap: 0;
  }
  
  .label {
    font-size: var(--font-size-lg);
  }
}
</style>