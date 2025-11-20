<template>
  <div class="game-settings">
    <div class="settings-header">
      <h2>⚙️ Paramètres de partie</h2>
      <p>Configurez votre expérience de blind test</p>
    </div>

    <form @submit.prevent class="settings-form">
      <!-- Score et durée -->
      <div class="settings-section">
        <h3>🎯 Objectifs</h3>
        <div class="form-group">
          <label for="targetScore">Points pour gagner</label>
          <input
            id="targetScore"
            v-model.number="localSettings.targetScore"
            type="number"
            min="10"
            max="200"
            step="10"
          />
          <small>Entre 10 et 200 points</small>
        </div>

        <div class="form-group">
          <label for="maxTracks">Nombre maximum de titres</label>
          <input
            id="maxTracks"
            v-model.number="localSettings.maxTracks"
            type="number"
            min="5"
            max="50"
            step="5"
          />
          <small>Entre 5 et 50 titres</small>
        </div>
      </div>

      <!-- Validation -->
      <div class="settings-section">
        <h3>✅ Validation des réponses</h3>
        
        <div class="form-group">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="localSettings.validateTitle"
                type="checkbox"
              />
              <span class="checkmark"></span>
              Valider le titre
            </label>
            
            <label class="checkbox-label">
              <input
                v-model="localSettings.validateArtist"
                type="checkbox"
              />
              <span class="checkmark"></span>
              Valider l'artiste
            </label>
          </div>
          <small>Au moins une option doit être cochée</small>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="localSettings.exactMatch"
              type="checkbox"
            />
            <span class="checkmark"></span>
            Correspondance exacte
          </label>
          <small>
            {{ localSettings.exactMatch 
              ? 'La réponse doit être exactement identique' 
              : 'Réponses approximatives acceptées (70% de similarité)' 
            }}
          </small>
        </div>
      </div>



      <!-- Boutons d'action -->
      <div class="settings-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="resetToDefaults"
        >
          Réinitialiser
        </button>
        
        <button
          type="button"
          class="btn btn-primary"
          @click="saveSettings"
          :disabled="!isFormValid"
        >
          Valider les paramètres
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GameSettings } from '@/types/blindTest'
import { DEFAULT_GAME_SETTINGS } from '@/types/blindTest'

interface Props {
  settings: GameSettings
}

interface Emits {
  (e: 'update:settings', settings: GameSettings): void
  (e: 'next'): void
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

// Watch les changements pour valider en temps réel
watch(localSettings, () => {
  // S'assurer qu'au moins une validation est cochée
  if (!localSettings.value.validateTitle && !localSettings.value.validateArtist) {
    localSettings.value.validateTitle = true
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

function saveSettings() {
  if (isFormValid.value) {
    // Forcer les valeurs de timing en dur
    const settingsWithFixedTiming = {
      ...localSettings.value,
      trackDuration: 30,        // 30 secondes par titre
      showAnswerDelay: 3,       // 3 secondes d'affichage si trouvé
      nextTrackDelay: 5         // 5 secondes avant piste suivante
    }
    emit('update:settings', settingsWithFixedTiming)
    emit('next')
  }
}
</script>

<style scoped>
.game-settings {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.settings-section {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--spotify-gray);
}

.settings-section h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-green);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--spotify-white);
}

.form-group input[type="number"] {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--spotify-gray);
  border: 1px solid var(--spotify-light-gray);
  border-radius: var(--border-radius-md);
  color: var(--spotify-white);
  font-size: var(--font-size-base);
}

.form-group input[type="number"]:focus {
  border-color: var(--spotify-green);
  outline: none;
}

.form-group small {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--spotify-light-gray);
  font-size: var(--font-size-sm);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  margin-bottom: 0 !important;
}

.checkbox-label input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--spotify-light-gray);
  border-radius: var(--border-radius-sm);
  background: var(--spotify-gray);
  cursor: pointer;
  position: relative;
  transition: var(--transition-base);
}

.checkbox-label input[type="checkbox"]:checked {
  background: var(--spotify-green);
  border-color: var(--spotify-green);
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--spotify-black);
  font-weight: bold;
  font-size: 12px;
}

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
  .game-settings {
    padding: var(--spacing-lg);
  }
  
  .settings-actions {
    flex-direction: column;
  }
  
  .settings-actions .btn {
    max-width: none;
  }
}
</style>