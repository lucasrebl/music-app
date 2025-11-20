<template>
  <div>
    <!-- Tabs de sélection -->
    <div class="search-tabs">
      <button
        :class="['tab-button', { active: activeTab === 'url' }]"
        @click="$emit('update:activeTab', 'url')"
      >
        🔗 URL Playlist
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'search' }]"
        @click="$emit('update:activeTab', 'search')"
      >
        🔍 Rechercher
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'artist', disabled: isArtistTabDisabled }]"
        @click="!isArtistTabDisabled && $emit('update:activeTab', 'artist')"
        :disabled="isArtistTabDisabled"
        :title="isArtistTabDisabled ? 'Désactivé car seule la validation par artiste est cochée' : ''"
      >
        👤 Artiste
      </button>
    </div>

    <!-- Message d'information si l'onglet artiste est désactivé -->
    <div v-if="isArtistTabDisabled" class="info-message">
      ℹ️ L'onglet Artiste est désactivé car vous avez choisi de ne valider que par artiste. 
      Sélectionner un artiste unique rendrait le jeu impossible (même réponse pour tous les titres).
    </div>
  </div>
</template>

<script setup lang="ts">
type TabType = 'url' | 'search' | 'artist'

interface Props {
  activeTab: TabType
  isArtistTabDisabled: boolean
}

interface Emits {
  (e: 'update:activeTab', tab: TabType): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.search-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-2xl);
}

.tab-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--spotify-gray);
  color: var(--spotify-light-gray);
  border: 1px solid var(--spotify-gray);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  transition: var(--transition-base);
}

.tab-button.active {
  background: var(--spotify-green);
  color: var(--spotify-black);
  border-color: var(--spotify-green);
}

.tab-button:hover:not(.active):not(.disabled) {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.tab-button.disabled {
  background: var(--spotify-dark-gray);
  color: var(--spotify-gray);
  border-color: var(--spotify-dark-gray);
  cursor: not-allowed;
  opacity: 0.5;
}

.info-message {
  background: var(--spotify-dark-gray);
  border: 1px solid var(--spotify-gray);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .search-tabs {
    flex-direction: column;
  }
}
</style>