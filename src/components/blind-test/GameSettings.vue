<template>
  <div class="game-settings">
    <SettingsHeader />

    <form @submit.prevent class="settings-form">
      <ObjectivesSection
        :target-score="localSettings.targetScore"
        :max-tracks="localSettings.maxTracks"
        @update:target-score="localSettings.targetScore = $event"
        @update:max-tracks="localSettings.maxTracks = $event"
      />

      <ValidationSection
        :validate-title="localSettings.validateTitle"
        :validate-artist="localSettings.validateArtist"
        :exact-match="localSettings.exactMatch"
        @update:validate-title="localSettings.validateTitle = $event"
        @update:validate-artist="localSettings.validateArtist = $event"
        @update:exact-match="localSettings.exactMatch = $event"
      />

      <SettingsActions @reset="resetToDefaults" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GameSettings } from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

// Composants
import SettingsHeader from './settings/SettingsHeader.vue'
import ObjectivesSection from './settings/ObjectivesSection.vue'
import ValidationSection from './settings/ValidationSection.vue'
import SettingsActions from './settings/SettingsActions.vue'

interface Props {
  settings: GameSettings
}

interface Emits {
  (e: 'update:settings', settings: GameSettings): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localSettings = ref<GameSettings>({ ...props.settings })

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    localSettings.value.targetScore >= 10 &&
    localSettings.value.targetScore <= 200 &&
    localSettings.value.maxTracks >= 5 &&
    localSettings.value.maxTracks <= 50 &&
    (localSettings.value.validateTitle || localSettings.value.validateArtist)
  )
})

// Watch les changements pour valider en temps réel et auto-save
watch(localSettings, () => {
  // S'assurer qu'au moins une validation est cochée
  if (!localSettings.value.validateTitle && !localSettings.value.validateArtist) {
    localSettings.value.validateTitle = true
  }
  
  // Auto-save settings if valid
  if (isFormValid.value) {
    const settingsWithFixedTiming = {
      ...localSettings.value,
      trackDuration: 30,        // 30 secondes par titre
      showAnswerDelay: 3,       // 3 secondes d'affichage si trouvé
      nextTrackDelay: 5         // 5 secondes avant piste suivante
    }
    emit('update:settings', settingsWithFixedTiming)
  }
}, { deep: true })

function resetToDefaults() {
  localSettings.value = { 
    ...DEFAULT_GAME_SETTINGS,
    // Forcer les valeurs de timing en dur
    trackDuration: 30,
    showAnswerDelay: 3,
    nextTrackDelay: 5
  }
}
</script>

<style scoped>
.game-settings {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}



.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}



/* Responsive */
@media (max-width: 768px) {
  .game-settings {
    padding: var(--spacing-lg);
  }
}
</style>