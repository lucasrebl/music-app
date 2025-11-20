<template>
  <div class="search-header">
    <h2>🎵 Sélection de la musique</h2>
    <p>Choisissez la source musicale pour votre blind test</p>
  </div>
</template>

<script setup lang="ts">
// Pas de props nécessaires pour ce composant statique
</script>

<style scoped>
.search-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.search-header h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
  color: var(--spotify-white);
}

.search-header p {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-lg);
}
</style>