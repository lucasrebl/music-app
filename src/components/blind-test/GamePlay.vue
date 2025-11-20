<template>
  <div class="game-play">
    <!-- Header du jeu -->
    <div class="game-header">
      <div class="game-info">
        <span class="track-counter">{{ currentTrackIndex + 1 }}/{{ totalTracks }}</span>
        <span class="score">{{ score }}/{{ props.settings.targetScore }}</span>
      </div>
      
      <div class="game-controls">
        <button @click="toggleMute" class="control-btn">
          {{ isMuted ? '🔇' : '🔊' }}
        </button>
        <button @click="stopGame" class="control-btn stop-btn">
          ⏹️
        </button>
      </div>
    </div>

    <!-- Zone de jeu -->
    <div class="game-main">
      <!-- En cours de jeu -->
      <div v-if="gameState === 'playing'" class="playing-state">
        <div class="timer">{{ timeRemaining }}s</div>
        
        <div class="answer-section">
          <h3>Quel est ce titre ?</h3>
          <input
            v-model="playerAnswer"
            type="text"
            placeholder="Tapez le titre ou l'artiste..."
            class="answer-input"
            @keyup.enter="() => submitAnswer()"
            ref="answerInput"
          />
          <p v-if="feedbackMessage" class="feedback">{{ feedbackMessage }}</p>
          <div v-if="attempts.length" class="attempts">
            <small>Essais: {{ attempts.join(', ') }}</small>
          </div>
          <button 
            class="btn btn-primary"
            @click="() => submitAnswer()"
            :disabled="!playerAnswer.trim()"
          >
            Valider
          </button>
        </div>
      </div>

      <!-- Affichage réponse -->
      <div v-else-if="gameState === 'show_answer'" class="answer-state">
        <div class="result-icon">
          {{ lastResult?.isCorrect ? '✅' : '❌' }}
        </div>
        
        <div class="correct-answer">
          <h3>{{ lastResult?.isCorrect ? 'Bravo !' : 'Réponse correcte :' }}</h3>
          <h4>{{ currentTrack?.title }}</h4>
          <p>{{ currentTrack?.artist.name }}</p>
        </div>
        
        <div v-if="lastResult?.isCorrect" class="points-earned">
          +{{ lastResult?.points }} points
        </div>
        
        <div class="countdown">
          Piste suivante dans {{ showAnswerCountdown }}s
        </div>
      </div>
    </div>

    <!-- Lecteur audio caché -->
    <audio
      ref="audioPlayer"
      :src="currentTrack?.preview"
      @loadeddata="onAudioLoaded"
      @ended="onAudioEnded"
      :muted="isMuted"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import type { GameSettings, GameState, TrackResult, GameEndReason } from '@/types/blindTest'
import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'
import { calculatePoints, validateAnswer } from '@/types/blindTest'

interface Props {
  settings: GameSettings
  tracks: DeezerTrack[]
  playlist: DeezerPlaylist
}

interface Emits {
  (e: 'game-finished', data: { 
    score: number, 
    results: TrackResult[], 
    endReason: GameEndReason 
  }): void
  (e: 'game-stopped'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs
const audioPlayer = ref<HTMLAudioElement>()
const answerInput = ref<HTMLInputElement>()

// État du jeu
const gameState = ref<GameState>('playing')
const currentTrackIndex = ref(0)
const score = ref(0)
const results = ref<TrackResult[]>([])
const isMuted = ref(false)
const timeRemaining = ref(props.settings.trackDuration)
const showAnswerCountdown = ref(props.settings.nextTrackDelay)
const playerAnswer = ref('')
const lastResult = ref<TrackResult | null>(null)
// Tentatives pour la piste en cours (l'utilisateur peut réessayer plusieurs fois)
const attempts = ref<string[]>([])
const feedbackMessage = ref('')

// Timers
let gameTimer: number | null = null
let answerTimer: number | null = null

// Computed
const currentTrack = computed(() => props.tracks[currentTrackIndex.value])
const totalTracks = computed(() => Math.min(props.tracks.length, props.settings.maxTracks))

// Watchers
watch(currentTrackIndex, (newIndex) => {
  if (newIndex < totalTracks.value) {
    loadNextTrack()
  } else {
    finishGame('all_tracks_played')
  }
})

watch(score, (newScore) => {
  if (newScore >= props.settings.targetScore) {
    finishGame('target_score_reached')
  }
})

// Lifecycle
onMounted(() => {
  startGame()
})

// Nettoyer avant le démontage du composant
onBeforeUnmount(() => {
  cleanup()
})

onUnmounted(() => {
  cleanup()
})

// Méthodes
function startGame() {
  loadNextTrack()
}

async function loadNextTrack() {
  if (!currentTrack.value) return
  
  playerAnswer.value = ''
  attempts.value = []
  feedbackMessage.value = ''
  timeRemaining.value = props.settings.trackDuration
  gameState.value = 'playing'
  
  await nextTick()
  answerInput.value?.focus()
  
  if (audioPlayer.value) {
    audioPlayer.value.load()
  }
}

function onAudioLoaded() {
  if (audioPlayer.value && gameState.value === 'playing') {
    audioPlayer.value.play().catch(console.error)
    startTimer()
  }
}

function startTimer() {
  if (gameTimer) clearInterval(gameTimer)
  
  gameTimer = window.setInterval(() => {
    if (gameState.value !== 'playing') return
    
    timeRemaining.value--
    
    if (timeRemaining.value <= 0) {
      submitAnswer(true)
    }
  }, 1000)
}

function submitAnswer(timeUp = false) {
  if (gameState.value !== 'playing') return
  const timeToAnswer = (props.settings.trackDuration - timeRemaining.value) * 1000
  const answer = playerAnswer.value.trim()

  // Si c'est un submit déclenché par timeout (fin du temps)
  if (timeUp) {
    // Arrêter le timer et l'audio
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
    if (audioPlayer.value) {
      audioPlayer.value.pause()
    }

    // Créer le résultat final (échec)
    const lastAttempt = attempts.value.length ? attempts.value[attempts.value.length - 1] ?? '' : ''
    const result: TrackResult = {
      track: currentTrack.value!,
      playerAnswer: lastAttempt,
      isCorrect: false,
      points: 0,
      timeToAnswer: props.settings.trackDuration * 1000,
      correctAnswer: {
        title: currentTrack.value!.title,
        artist: currentTrack.value!.artist.name
      }
      ,
      attempts: attempts.value.slice()
    }

    results.value.push(result)
    lastResult.value = result
    showAnswer(false)
    return
  }

  // Validation d'une soumission utilisateur (pas encore temps écoulé)
  if (!answer) return

  const validation = validateAnswer(
    answer,
    currentTrack.value!,
    {
      validateTitle: props.settings.validateTitle,
      validateArtist: props.settings.validateArtist,
      exactMatch: props.settings.exactMatch
    }
  )

  // Si la réponse est correcte, finaliser la piste
  if (validation.isCorrect) {
    // Arrêter le timer et l'audio
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
    if (audioPlayer.value) {
      audioPlayer.value.pause()
    }

    const points = calculatePoints(timeToAnswer, props.settings.trackDuration * 1000)

    const result: TrackResult = {
      track: currentTrack.value!,
      playerAnswer: answer,
      isCorrect: true,
      points,
      timeToAnswer,
      correctAnswer: {
        title: currentTrack.value!.title,
        artist: currentTrack.value!.artist.name
      }
      ,
      attempts: attempts.value.slice()
    }

    score.value += points
    results.value.push(result)
    lastResult.value = result
    showAnswer(true)
    return
  }

  // Réponse incorrecte : enregistrer la tentative et laisser l'utilisateur réessayer
  attempts.value.push(answer)
  feedbackMessage.value = 'Incorrect — réessayez !'
  playerAnswer.value = ''
  // remettre le focus
  nextTick(() => answerInput.value?.focus())
}

function showAnswer(isCorrect: boolean) {
  gameState.value = 'show_answer'
  
  const delay = isCorrect 
    ? props.settings.showAnswerDelay 
    : props.settings.nextTrackDelay
  
  showAnswerCountdown.value = delay
  
  answerTimer = window.setInterval(() => {
    showAnswerCountdown.value--
    
    if (showAnswerCountdown.value <= 0) {
      if (answerTimer) {
        clearInterval(answerTimer)
        answerTimer = null
      }
      currentTrackIndex.value++
    }
  }, 1000)
}

function toggleMute() {
  isMuted.value = !isMuted.value
}

function stopGame() {
  cleanup()
  emit('game-stopped')
}

function finishGame(reason: GameEndReason) {
  cleanup()
  emit('game-finished', {
    score: score.value,
    results: results.value,
    endReason: reason
  })
}

function onAudioEnded() {
  if (gameState.value === 'playing' && timeRemaining.value > 0) {
    if (audioPlayer.value) {
      audioPlayer.value.currentTime = 0
      audioPlayer.value.play().catch(console.error)
    }
  }
}

function cleanup() {
  // Arrêter tous les timers
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
  if (answerTimer) {
    clearInterval(answerTimer)
    answerTimer = null
  }
  
  // Arrêter et nettoyer complètement l'audio
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
    audioPlayer.value.src = ''
    audioPlayer.value.load()
  }
  
  // Réinitialiser l'état du jeu
  gameState.value = 'paused'
}
</script>

<style scoped>
.game-play {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  min-height: 100vh;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--spotify-dark-gray);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
}

.game-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.track-counter {
  font-weight: 600;
  color: var(--spotify-white);
}

.score {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--spotify-green);
}

.game-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-full);
  background: var(--spotify-gray);
  color: var(--spotify-white);
  font-size: var(--font-size-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
}

.control-btn:hover {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
}

.stop-btn:hover {
  background: var(--color-error);
  color: white;
}

.game-main {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-3xl);
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playing-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3xl);
}

.timer {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  color: var(--spotify-green);
  background: var(--spotify-gray);
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--spotify-green);
}

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

.answer-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
}

.result-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.correct-answer h3 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-white);
}

.correct-answer h4 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--spotify-green);
  margin-bottom: var(--spacing-sm);
}

.correct-answer p {
  font-size: var(--font-size-xl);
  color: var(--spotify-light-gray);
}

.points-earned {
  background: var(--spotify-green);
  color: var(--spotify-black);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.countdown {
  font-size: var(--font-size-xl);
  color: var(--spotify-light-gray);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .game-play {
    padding: var(--spacing-md);
  }
  
  .game-header {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .game-main {
    padding: var(--spacing-xl);
  }
  
  .timer {
    width: 100px;
    height: 100px;
    font-size: var(--font-size-4xl);
  }
}
</style>