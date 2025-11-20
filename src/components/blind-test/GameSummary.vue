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
      <div class="objectives-header">
        <div class="objectives-icon">🎯</div>
        <h3>Objectifs définis</h3>
      </div>
      <div class="objectives-grid">
        <div class="objective-card">
          <div class="objective-icon">🏆</div>
          <div class="objective-content">
            <div class="objective-value">{{ settings.targetScore }}</div>
            <div class="objective-label">Points pour gagner</div>
          </div>
        </div>
        <div class="objective-card">
          <div class="objective-icon">🎵</div>
          <div class="objective-content">
            <div class="objective-value">{{ settings.maxTracks }}</div>
            <div class="objective-label">Titres maximum</div>
          </div>
        </div>
        <div class="objective-card">
          <div class="objective-icon">⏱️</div>
          <div class="objective-content">
            <div class="objective-value">{{ settings.trackDuration }}s</div>
            <div class="objective-label">Durée par titre</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sources sélectionnées -->
    <div v-if="selectedPlaylists?.length || selectedArtists?.length" class="sources-section">
      <h3>📚 Sources sélectionnées</h3>
      <div class="sources-grid">
        <div v-if="selectedPlaylists?.length" class="sources-column">
          <h4>Playlists</h4>
          <ul>
            <li v-for="pl in selectedPlaylists" :key="pl.id">
              <strong>{{ pl.title }}</strong>
              <div class="source-meta">{{ pl.nb_tracks }} titres</div>
            </li>
          </ul>
        </div>

        <div v-if="selectedArtists?.length" class="sources-column">
          <h4>Artistes</h4>
          <ul>
            <li v-for="ar in selectedArtists" :key="ar.id">
              <strong>{{ ar.name }}</strong>
              <div class="source-meta">{{ ar.nb_album }} albums — {{ ar.nb_fan }} fans</div>
            </li>
          </ul>
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
          
          <div class="answer-section">
            <div class="answer-and-stats">
              <div class="track-stats">
                <span class="points">{{ result.points }} pts</span>
                <span class="time">{{ (result.timeToAnswer / 1000).toFixed(1) }}s</span>
              </div>
            </div>

            <div class="mistakes" v-if="result.attempts && result.attempts.length">
              <div class="mistakes-list">
                <span
                  v-for="(a, i) in result.attempts"
                  :key="i"
                  :class="['mistake-chip', { 'mistake-last': i === result.attempts.length - 1 }]"
                >
                  {{ a }}
                </span>
              </div>
            </div>
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
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'

interface Props {
  finalScore: number
  results: TrackResult[]
  endReason: GameEndReason
  settings?: GameSettingsType
  selectedPlaylists?: DeezerPlaylist[]
  selectedArtists?: DeezerArtist[]
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
  background: linear-gradient(135deg, rgba(29, 185, 84, 0.08) 0%, rgba(29, 185, 84, 0.02) 100%);
  border: 1px solid rgba(29, 185, 84, 0.12);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

.objectives-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--spotify-green) 0%, rgba(29, 185, 84, 0.5) 100%);
}

.objectives-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  justify-content: center;
}

.objectives-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(29, 185, 84, 0.3));
}

.objectives-header h3 {
  color: var(--spotify-white);
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
}

.objectives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
}

.objective-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.objective-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.objective-card:hover {
  transform: translateY(-2px);
  border-color: rgba(29, 185, 84, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.objective-card:hover::before {
  opacity: 1;
}

.objective-icon {
  font-size: 1.8rem;
  margin-bottom: var(--spacing-sm);
  display: block;
  filter: drop-shadow(0 0 6px rgba(29, 185, 84, 0.2));
}

.objective-content {
  position: relative;
  z-index: 1;
}

.objective-value {
  color: var(--spotify-green);
  font-weight: 700;
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
}

.objective-label {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.sources-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.sources-grid {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.sources-column h4 {
  color: var(--spotify-green);
  margin-bottom: var(--spacing-sm);
}

.sources-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sources-column li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px dashed rgba(255,255,255,0.03);
}

.source-meta {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

.mistakes {
  margin-top: var(--spacing-sm);
}

.mistakes-list {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.mistake-chip {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.04);
  color: var(--spotify-light-gray);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
}

.mistake-chip.mistake-last {
  background: rgba(255,90,100,0.12);
  border-color: rgba(255,90,100,0.24);
  color: #ff6b6b;
  font-weight: 700;
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
  grid-template-columns: 50px 1fr 1fr;
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

.answer-and-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.answer-text {
  font-size: var(--font-size-sm);
  color: var(--spotify-white);
  font-style: italic;
  flex: 1;
}

.track-stats {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.points {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--spotify-green);
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