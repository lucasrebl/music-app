<template>
  <div class="settings-actions">
    <button
      type="button"
      class="btn btn-secondary"
      @click="$emit('reset')"
    >
      Réinitialiser
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'reset'): void
}

defineEmits<Emits>()
</script>

<style scoped>
.settings-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--spotify-gray);
}

.settings-actions .btn {
  flex: 1;
  max-width: 200px;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .settings-actions {
    flex-direction: column;
  }
  
  .settings-actions .btn {
    max-width: none;
  }
}
</style>