<template>
  <div class="settings-header">
    <h2>⚙️ Paramètres de partie</h2>
    <p>Configurez votre expérience de blind test</p>
  </div>
</template>

<script setup lang="ts">
// Pas de props nécessaires pour ce composant
</script>

<style scoped>
.settings-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.settings-header h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
  color: var(--spotify-white);
}

.settings-header p {
  color: var(--spotify-light-gray);
  font-size: var(--font-size-lg);
}
</style>