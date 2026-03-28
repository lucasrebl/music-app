<template>
  <section class="services section">
    <div class="container">
      <h2 class="services-title">{{ title }}</h2>
      
      <div class="services-grid">
        <ServiceCard
          v-for="service in services"
          :key="service.id"
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :route="service.route"
          :is-available="service.isAvailable"
          :button-text="service.buttonText"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ServiceCard from './ServiceCard.vue'

interface Service {
  id: string
  icon: string
  title: string
  description: string
  route?: string
  isAvailable: boolean
  buttonText: string
}

interface Props {
  title: string
  services: Service[]
}

defineProps<Props>()
</script>

<style scoped>
.services {
  background: var(--spotify-black);
}

.services-title {
  text-align: center;
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-3xl);
  color: var(--spotify-white);
  font-weight: 700;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

@media (max-width: 768px) {
  .services-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-2xl);
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .services-title {
    font-size: var(--font-size-2xl);
  }
}
</style>