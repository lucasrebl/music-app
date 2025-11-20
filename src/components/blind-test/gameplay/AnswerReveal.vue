<template>
  <div class="answer-state">
    <div class="result-icon">
      {{ isCorrect ? '✅' : '❌' }}
    </div>
    
    <div class="correct-answer">
      <h3>{{ isCorrect ? 'Bravo !' : 'Réponse correcte :' }}</h3>
      <h4>{{ track?.title }}</h4>
      <p>{{ track?.artist.name }}</p>
    </div>
    
    <div v-if="isCorrect && points" class="points-earned">
      +{{ points }} points
    </div>
    
    <div class="countdown">
      Piste suivante dans {{ countdown }}s
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeezerTrack } from '@/services/deezerService'

interface Props {
  track: DeezerTrack | null
  isCorrect: boolean
  points?: number
  countdown: number
}

defineProps<Props>()
</script>

<style scoped>
.answer-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
}

.result-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.correct-answer h3 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-white);
}

.correct-answer h4 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--spotify-green);
  margin-bottom: var(--spacing-sm);
}

.correct-answer p {
  font-size: var(--font-size-xl);
  color: var(--spotify-light-gray);
}

.points-earned {
  background: var(--spotify-green);
  color: var(--spotify-black);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.countdown {
  font-size: var(--font-size-xl);
  color: var(--spotify-light-gray);
  font-weight: 600;
}
</style>