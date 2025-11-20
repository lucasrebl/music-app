<template>
  <audio
    ref="audioElement"
    :src="trackUrl"
    @loadeddata="$emit('audio-loaded')"
    @ended="$emit('audio-ended')"
    :muted="isMuted"
  ></audio>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  trackUrl?: string
  isMuted: boolean
}

interface Emits {
  (e: 'audio-loaded'): void
  (e: 'audio-ended'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const audioElement = ref<HTMLAudioElement>()

// Méthodes exposées pour le contrôle externe
defineExpose({
  play: () => audioElement.value?.play(),
  pause: () => audioElement.value?.pause(),
  load: () => audioElement.value?.load(),
  stop: () => {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
    }
  },
  reset: () => {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
      audioElement.value.src = ''
      audioElement.value.load()
    }
  }
})

// Rechargement automatique quand l'URL change
watch(() => props.trackUrl, () => {
  if (audioElement.value) {
    audioElement.value.load()
  }
})
</script>

<style scoped>
/* L'élément audio est caché */
audio {
  display: none;
}
</style>