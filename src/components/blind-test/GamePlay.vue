<template>
  <div class="game-play">
    <!-- Header du jeu -->
    <GameHeader
      :current-track-index="currentTrackIndex"
      :total-tracks="totalTracks"
      :score="score"
      :target-score="props.settings.targetScore"
      :is-muted="isMuted"
      @toggle-mute="toggleMute"
      @stop-game="stopGame"
    />

    <!-- Zone de jeu -->
    <div class="game-main">
      <!-- En cours de jeu -->
      <div v-if="gameState === 'playing'" class="playing-state">
        <GameTimer :time-remaining="timeRemaining" />
        
        <AnswerInput
          v-model:player-answer="playerAnswer"
          :feedback-message="feedbackMessage"
          :attempts="attempts"
          @submit-answer="submitAnswer"
          ref="answerInputRef"
        />
      </div>

      <!-- Affichage réponse -->
      <div v-else-if="gameState === 'show_answer'" class="answer-reveal">
        <AnswerReveal
          :track="currentTrack || null"
          :is-correct="lastResult?.isCorrect || false"
          :points="lastResult?.points"
          :countdown="showAnswerCountdown"
        />
      </div>
    </div>

    <!-- Lecteur audio -->
    <AudioPlayer
      :track-url="currentTrack?.preview"
      :is-muted="isMuted"
      @audio-loaded="onAudioLoaded"
      @audio-ended="onAudioEnded"
      ref="audioPlayerRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import type { GameSettings, GameState, TrackResult, GameEndReason } from '@/types/blindTest'
import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'
import { calculatePoints, validateAnswer } from '@/types/blindTest'

// Composants
import GameHeader from './gameplay/GameHeader.vue'
import GameTimer from './gameplay/GameTimer.vue'
import AnswerInput from './gameplay/AnswerInput.vue'
import AnswerReveal from './gameplay/AnswerReveal.vue'
import AudioPlayer from './gameplay/AudioPlayer.vue'

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

// Refs des composants
const audioPlayerRef = ref<InstanceType<typeof AudioPlayer>>()
const answerInputRef = ref<InstanceType<typeof AnswerInput>>()

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
  answerInputRef.value?.focus()
  
  if (audioPlayerRef.value) {
    audioPlayerRef.value.load()
  }
}

function onAudioLoaded() {
  if (audioPlayerRef.value && gameState.value === 'playing') {
    audioPlayerRef.value.play()?.catch(console.error)
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
    if (audioPlayerRef.value) {
      audioPlayerRef.value.pause()
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
    if (audioPlayerRef.value) {
      audioPlayerRef.value.pause()
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
  nextTick(() => answerInputRef.value?.focus())
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
  finishGame('player_stopped')
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
    if (audioPlayerRef.value) {
      audioPlayerRef.value.stop()
      audioPlayerRef.value.play()?.catch(console.error)
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
  if (audioPlayerRef.value) {
    audioPlayerRef.value.reset()
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

.answer-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .game-play {
    padding: var(--spacing-md);
  }
  
  .game-main {
    padding: var(--spacing-xl);
  }
}
</style>