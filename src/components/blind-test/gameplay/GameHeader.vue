<template>
  <div class="game-header">
    <div class="game-info">
      <span class="track-counter">{{ currentTrackIndex + 1 }}/{{ totalTracks }}</span>
      <span class="score">{{ score }}/{{ targetScore }}</span>
    </div>
    
    <div class="game-controls">
      <button @click="$emit('toggle-mute')" class="control-btn">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
      <button @click="$emit('stop-game')" class="control-btn stop-btn">
        ⏹️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentTrackIndex: number
  totalTracks: number
  score: number
  targetScore: number
  isMuted: boolean
}

interface Emits {
  (e: 'toggle-mute'): void
  (e: 'stop-game'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--spotify-dark-gray);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
}

.game-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.track-counter {
  font-weight: 600;
  color: var(--spotify-white);
}

.score {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--spotify-green);
}

.game-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-full);
  background: var(--spotify-gray);
  color: var(--spotify-white);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
}

.control-btn:hover {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.stop-btn:hover {
  background: var(--color-error);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}
</style>