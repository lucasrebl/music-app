<template>
  <main class="blind-test">
    <div class="container">
      <h1>🎯 Blind Test</h1>
      <p>Le jeu de blind test sera bientôt disponible ici !</p>
      <p>Connectez-vous avec Spotify et testez vos connaissances musicales.</p>
      
      <router-link to="/" class="back-button">
        ← Retour à l'accueil
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
// Logique du blind test à implémenter
</script>

<style scoped>
.blind-test {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--spotify-green) 0%, var(--spotify-green-dark) 100%);
  color: var(--spotify-black);
}

.container {
  text-align: center;
  max-width: 600px;
  padding: var(--spacing-xl);
}

h1 {
  font-size: var(--font-size-5xl);
  margin-bottom: var(--spacing-lg);
  font-weight: 700;
}

p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.back-button {
  background: rgba(18, 18, 18, 0.2);
  color: var(--spotify-black);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(18, 18, 18, 0.3);
}

.back-button:hover {
  background: rgba(18, 18, 18, 0.3);
  color: var(--spotify-black);
  transform: translateY(-2px);
}
</style>