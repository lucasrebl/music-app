<template>
  <div class="timer">{{ timeRemaining }}s</div>
</template>

<script setup lang="ts">
interface Props {
  timeRemaining: number
}

defineProps<Props>()
</script>

<style scoped>
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

/* Responsive */
@media (max-width: 768px) {
  .timer {
    width: 100px;
    height: 100px;
    font-size: var(--font-size-4xl);
  }
}
</style>