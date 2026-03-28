<template>
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
</template>

<script setup lang="ts">
import type { TrackResult } from '@/types/blindTest'

interface Props {
  results: TrackResult[]
}

defineProps<Props>()
</script>

<style scoped>
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

.answer-and-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  .track-result {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .track-number {
    margin: 0 auto;
  }
}
</style>