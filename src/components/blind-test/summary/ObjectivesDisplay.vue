<template>
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
</template>

<script setup lang="ts">
import type { GameSettings } from '@/types/blindTest'

interface Props {
  settings?: GameSettings
}

defineProps<Props>()
</script>

<style scoped>
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
</style>