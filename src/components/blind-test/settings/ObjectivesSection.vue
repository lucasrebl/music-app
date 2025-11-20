<template>
  <div class="settings-section">
    <h3>🎯 Objectifs</h3>
    
    <div class="form-group">
      <label for="targetScore">Points pour gagner</label>
      <input
        id="targetScore"
        v-model.number="localTargetScore"
        type="number"
        min="10"
        max="200"
        step="10"
      />
      <small>Entre 10 et 200 points</small>
    </div>

    <div class="form-group">
      <label for="maxTracks">Nombre maximum de titres</label>
      <input
        id="maxTracks"
        v-model.number="localMaxTracks"
        type="number"
        min="5"
        max="50"
        step="5"
      />
      <small>Entre 5 et 50 titres</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  targetScore: number
  maxTracks: number
}

interface Emits {
  (e: 'update:targetScore', value: number): void
  (e: 'update:maxTracks', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTargetScore = ref(props.targetScore)
const localMaxTracks = ref(props.maxTracks)

// Sync avec le parent
watch(localTargetScore, (newValue) => {
  emit('update:targetScore', newValue)
})

watch(localMaxTracks, (newValue) => {
  emit('update:maxTracks', newValue)
})

// Sync avec les props
watch(() => props.targetScore, (newValue) => {
  localTargetScore.value = newValue
})

watch(() => props.maxTracks, (newValue) => {
  localMaxTracks.value = newValue
})
</script>

<style scoped>
.settings-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--spotify-gray);
}

.settings-section h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-green);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--spotify-white);
}

.form-group input[type="number"] {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--spotify-gray);
  border: 1px solid var(--spotify-light-gray);
  border-radius: var(--border-radius-md);
  color: var(--spotify-white);
  font-size: var(--font-size-base);
}

.form-group input[type="number"]:focus {
  border-color: var(--spotify-green);
  outline: none;
}

.form-group small {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}
</style>