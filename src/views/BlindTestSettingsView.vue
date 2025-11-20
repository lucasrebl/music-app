<template>
  <main class="blind-test-settings">
    <GameSettings
      :settings="gameSettings"
      @update:settings="updateSettings"
      @next="goToPlaylistSelection"
    />

    <!-- Bouton de retour -->
    <div class="back-navigation">
      <router-link to="/" class="back-button">
        ← Retour à l'accueil
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameSettings from '@/components/blind-test/GameSettings.vue'
import type { GameSettings as GameSettingsType } from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

const router = useRouter()

// Configuration du jeu (stockée globalement via localStorage ou store)
const gameSettings = ref<GameSettingsType>({ ...DEFAULT_GAME_SETTINGS })

// Charger les paramètres depuis localStorage au montage
const savedSettings = localStorage.getItem('blindTestSettings')
if (savedSettings) {
  try {
    gameSettings.value = { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(savedSettings) }
  } catch (e) {
    console.warn('Erreur lors du chargement des paramètres sauvegardés')
  }
}

function updateSettings(settings: GameSettingsType) {
  gameSettings.value = { ...settings }
  // Sauvegarder les paramètres
  localStorage.setItem('blindTestSettings', JSON.stringify(settings))
}

function goToPlaylistSelection() {
  router.push('/blind-test/playlist')
}
</script>

<style scoped>
.blind-test-settings {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.back-navigation {
  position: fixed;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  z-index: 100;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--spotify-dark-gray);
  color: var(--spotify-white);
  border: 1px solid var(--spotify-gray);
  border-radius: var(--border-radius-full);
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: var(--spotify-gray);
  border-color: var(--spotify-green);
  color: var(--spotify-green);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .back-navigation {
    position: relative;
    top: auto;
    left: auto;
    padding: var(--spacing-lg);
    text-align: center;
  }
}
</style>