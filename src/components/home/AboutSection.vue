<template>
  <section class="about section">
    <div class="container">
      <div class="about-content">
        <h2>{{ title }}</h2>
        <p class="about-description">{{ description }}</p>
        
        <div class="features">
          <div 
            v-for="feature in features"
            :key="feature.id"
            class="feature"
          >
            <span class="feature-icon">{{ feature.icon }}</span>
            <span class="feature-text">{{ feature.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  id: string
  icon: string
  text: string
}

interface Props {
  title: string
  description: string
  features: Feature[]
}

defineProps<Props>()
</script>

<style scoped>
.about {
  background: var(--spotify-dark-gray);
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about h2 {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-xl);
  color: var(--spotify-white);
  font-weight: 700;
}

.about-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  color: var(--spotify-light-gray);
  margin-bottom: var(--spacing-3xl);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
}

.feature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  color: var(--spotify-white);
  padding: var(--spacing-lg);
  background: var(--spotify-gray);
  border-radius: var(--border-radius-lg);
  transition: var(--transition-base);
}

.feature:hover {
  background: var(--spotify-light-gray);
  color: var(--spotify-black);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: var(--font-size-2xl);
}

.feature-text {
  font-size: var(--font-size-base);
}

/* Responsive Design */
@media (max-width: 768px) {
  .about h2 {
    font-size: var(--font-size-3xl);
  }
  
  .features {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .about h2 {
    font-size: var(--font-size-2xl);
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .feature {
    padding: var(--spacing-md);
  }
}
</style>