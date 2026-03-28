<template>
  <div class="url-section">
    <div class="form-group">
      <label for="playlistUrl">URL de la playlist Deezer</label>
      <input
        id="playlistUrl"
        :value="playlistUrl"
        @input="$emit('update:playlistUrl', ($event.target as HTMLInputElement).value)"
        type="url"
        placeholder="https://www.deezer.com/fr/playlist/123456789"
      />
      <small v-if="urlError" class="error">{{ urlError }}</small>
      <small v-else>Collez l'URL de n'importe quelle playlist publique Deezer</small>
    </div>
    
    <button
      class="btn btn-primary"
      @click="$emit('load-playlist')"
      :disabled="!isValidUrl || loading"
    >
      {{ loading ? 'Chargement...' : 'Charger la playlist' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  playlistUrl: string
  urlError: string
  isValidUrl: boolean
  loading: boolean
}

interface Emits {
  (e: 'update:playlistUrl', value: string): void
  (e: 'load-playlist'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.url-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--spotify-white);
}

.form-group input {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--spotify-gray);
  border: 1px solid var(--spotify-light-gray);
  border-radius: var(--border-radius-md);
  color: var(--spotify-white);
  font-size: var(--font-size-base);
}

.form-group input:focus {
  border-color: var(--spotify-green);
  outline: none;
}

.form-group small {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

.form-group small.error {
  color: var(--color-error);
}
</style>