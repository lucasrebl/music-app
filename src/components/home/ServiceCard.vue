<template>
  <div :class="['service-card', statusClass]">
    <div class="card-status">
      <span :class="['status-badge', statusClass]">{{ statusText }}</span>
    </div>
    
    <div class="card-icon">{{ icon }}</div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
    
    <component 
      :is="isAvailable ? 'router-link' : 'button'"
      :to="isAvailable ? route : undefined"
      :class="['card-button', buttonClass]"
      :disabled="!isAvailable"
    >
      {{ buttonText }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  description: string
  route?: string
  isAvailable: boolean
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Découvrir'
})

const statusClass = computed(() => 
  props.isAvailable ? 'available' : 'coming-soon'
)

const statusText = computed(() => 
  props.isAvailable ? 'Disponible' : 'Prochainement'
)

const buttonClass = computed(() => 
  props.isAvailable ? 'btn-primary' : 'btn-disabled'
)
</script>

<style scoped>
.service-card {
  background: var(--spotify-dark-gray);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--spotify-gray);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--spotify-light-gray);
}

.service-card.coming-soon {
  opacity: 0.7;
}

.service-card.coming-soon:hover {
  transform: translateY(-2px);
}

.card-status {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.available {
  background: rgba(30, 215, 96, 0.2);
  color: var(--spotify-green);
}

.status-badge.coming-soon {
  background: rgba(255, 167, 38, 0.2);
  color: #ffa726;
}

.card-icon {
  font-size: var(--font-size-5xl);
  margin-bottom: var(--spacing-lg);
}

.card-title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-white);
  font-weight: 600;
}

.card-description {
  color: var(--spotify-light-gray);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.card-button {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
}

@media (max-width: 768px) {
  .service-card {
    padding: var(--spacing-lg);
  }
  
  .card-icon {
    font-size: var(--font-size-4xl);
  }
  
  .card-title {
    font-size: var(--font-size-xl);
  }
}
</style>