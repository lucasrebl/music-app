<template>
  <div class="answer-section">
    <h3>Quel est ce titre ?</h3>
    <input
      v-model="localAnswer"
      type="text"
      placeholder="Tapez le titre ou l'artiste..."
      class="answer-input"
      @keyup.enter="submitAnswer"
      ref="answerInput"
    />
    <p v-if="feedbackMessage" class="feedback">{{ feedbackMessage }}</p>
    <div v-if="attempts.length" class="attempts">
      <small>Essais: {{ attempts.join(', ') }}</small>
    </div>
    <button 
      class="btn btn-primary"
      @click="submitAnswer"
      :disabled="!localAnswer.trim()"
    >
      Valider
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

interface Props {
  playerAnswer: string
  feedbackMessage: string
  attempts: string[]
}

interface Emits {
  (e: 'update:playerAnswer', value: string): void
  (e: 'submit-answer'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localAnswer = ref(props.playerAnswer)
const answerInput = ref<HTMLInputElement>()

// Sync avec le parent
watch(localAnswer, (newValue) => {
  emit('update:playerAnswer', newValue)
})

watch(() => props.playerAnswer, (newValue) => {
  localAnswer.value = newValue
})

function submitAnswer() {
  emit('submit-answer')
}

// Focus automatique
onMounted(() => {
  nextTick(() => answerInput.value?.focus())
})

// Exposer la méthode de focus pour le parent
defineExpose({
  focus: () => {
    nextTick(() => answerInput.value?.focus())
  }
})
</script>

<style scoped>
.answer-section h3 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xl);
  color: var(--spotify-white);
}

.answer-input {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-lg);
  font-size: var(--font-size-lg);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  background: var(--spotify-gray);
  border: 2px solid var(--spotify-light-gray);
  border-radius: var(--border-radius-lg);
  color: var(--spotify-white);
}

.answer-input:focus {
  border-color: var(--spotify-green);
  outline: none;
}

.feedback {
  color: var(--color-error);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.attempts {
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-light-gray);
}
</style>