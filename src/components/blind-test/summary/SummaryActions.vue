<template>
  <div class="summary-actions">
    <router-link
      to="/blind-test/settings"
      class="btn btn-secondary"
    >
      🔄 Nouvelle partie
    </router-link>
    <button
      class="btn btn-primary"
      @click="$emit('back-to-home')"
    >
      🏠 Retour à l'accueil
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'back-to-home'): void
}

defineEmits<Emits>()
</script>

<style scoped>
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

/* Responsive */
@media (max-width: 768px) {
  .summary-actions {
    flex-direction: column;
  }
  
  .summary-actions .btn {
    min-width: auto;
  }
}
</style>