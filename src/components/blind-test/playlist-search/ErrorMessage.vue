<template>
  <div v-if="error" class="error-message">
    <p>{{ error }}</p>
    <button class="btn btn-secondary" @click="$emit('clear-error')">
      Fermer
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string
}

interface Emits {
  (e: 'clear-error'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.error-message {
  background: var(--color-error);
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  text-align: center;
  margin-top: var(--spacing-lg);
}

.error-message .btn {
  margin-top: var(--spacing-md);
}
</style>