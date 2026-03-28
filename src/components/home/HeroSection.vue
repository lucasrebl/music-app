<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
        <p class="hero-description">{{ description }}</p>
        <slot name="actions"></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  description: string
}

defineProps<Props>()
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--spotify-green) 0%, var(--spotify-green-dark) 100%);
  color: var(--spotify-black);
  padding: var(--spacing-3xl) 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  font-weight: 500;
}

.hero-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-4xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-size-xl);
  }
  
  .hero {
    padding: var(--spacing-2xl) 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-size-lg);
  }
}
</style>