<template>
  <div class="summary-actions">
    <button
      class="btn btn-primary"
      @click="$emit('quit-game')"
    >
      ✕ Quitter
    </button>
    
    <div class="secondary-actions">
      <button
        class="btn btn-outline"
        @click="$emit('download-results')"
        title="Télécharger les résultats au format JSON"
      >
        📥 Exporter les résultats
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'quit-game'): void
  (e: 'download-results'): void
}

defineEmits<Emits>()
</script>

<style scoped>
.summary-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
}

.secondary-actions {
  display: flex;
  justify-content: center;
}

.summary-actions .btn {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
  min-width: 200px;
}

.btn-outline {
  background: transparent;
  color: var(--spotify-light-gray);
  border: 1px solid var(--spotify-gray);
}

.btn-outline:hover {
  background: var(--spotify-gray);
  color: var(--spotify-white);
  border-color: var(--spotify-light-gray);
}

/* Responsive */
@media (max-width: 768px) {
  .summary-actions .btn {
    min-width: auto;
  }
}
</style>