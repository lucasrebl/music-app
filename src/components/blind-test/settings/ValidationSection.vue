<template>
  <div class="settings-section">
    <h3>✅ Validation des réponses</h3>
    
    <div class="form-group">
      <div class="checkbox-group">
        <label class="checkbox-label">
          <input
            v-model="localValidateTitle"
            type="checkbox"
          />
          <span class="checkmark"></span>
          Valider le titre
        </label>
        
        <label class="checkbox-label">
          <input
            v-model="localValidateArtist"
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
          v-model="localExactMatch"
          type="checkbox"
        />
        <span class="checkmark"></span>
        Correspondance exacte
      </label>
      <small>
        {{ localExactMatch 
          ? 'La réponse doit être identique au titre/artiste de Deezer' 
          : 'Réponses approximatives acceptées (70% de similarité)' 
        }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  validateTitle: boolean
  validateArtist: boolean
  exactMatch: boolean
}

interface Emits {
  (e: 'update:validateTitle', value: boolean): void
  (e: 'update:validateArtist', value: boolean): void
  (e: 'update:exactMatch', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValidateTitle = ref(props.validateTitle)
const localValidateArtist = ref(props.validateArtist)
const localExactMatch = ref(props.exactMatch)

// Sync avec le parent
watch(localValidateTitle, (newValue) => {
  emit('update:validateTitle', newValue)
})

watch(localValidateArtist, (newValue) => {
  emit('update:validateArtist', newValue)
})

watch(localExactMatch, (newValue) => {
  emit('update:exactMatch', newValue)
})

// Sync avec les props
watch(() => props.validateTitle, (newValue) => {
  localValidateTitle.value = newValue
})

watch(() => props.validateArtist, (newValue) => {
  localValidateArtist.value = newValue
})

watch(() => props.exactMatch, (newValue) => {
  localExactMatch.value = newValue
})
</script>

<style scoped>
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
</style>