<template>
  <main class="home">
    <div class="home-container">
      <section class="hero-section">
        <div class="hero-icon">🎵</div>
        <h1>Music App</h1>
        <p class="hero-subtitle">Découvrez la musique autrement avec nos services interactifs</p>
      </section>

      <section class="services-section">
        <div class="services-grid">
          <div class="service-card available">
            <div class="card-header">
              <div class="card-icon">🎯</div>
              <span class="status-badge available">Disponible</span>
            </div>
            <h2 class="card-title">Blind Test</h2>
            <p class="card-description">Testez vos connaissances musicales avec notre jeu de blind test connecté à Deezer. Devinez les artistes, albums et titres de vos playlists préférées !</p>
            <router-link to="/blind-test" class="card-button btn-primary">
              <span>Jouer maintenant</span>
              <span class="button-icon">→</span>
            </router-link>
          </div>

          <div class="service-card coming-soon">
            <div class="card-header">
              <div class="card-icon">✨</div>
              <span class="status-badge coming-soon">Bientôt</span>
            </div>
            <h2 class="card-title">Autres Fonctionnalités</h2>
            <p class="card-description">De nouvelles expériences musicales arrivent bientôt. Restez connectés pour découvrir les prochaines fonctionnalités de Music App !</p>
            <button class="card-button btn-disabled" disabled>
              <span>En développement</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.hero-section {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  padding-bottom: var(--spacing-2xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.hero-icon {
  font-size: 3.5rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 0 20px rgba(29, 185, 84, 0.4));
}

.hero-section h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--spotify-white) 0%, var(--spotify-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-base);
  color: var(--spotify-light-gray);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.services-section {
  margin-bottom: var(--spacing-3xl);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-2xl);
}

.service-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2xl);
  background: var(--spotify-dark-gray);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(29, 185, 84, 0.1) 50%, transparent 100%);
  transition: left 0.5s ease;
  pointer-events: none;
}

.service-card.available:hover::before {
  left: 100%;
}

.service-card.available {
  border-color: rgba(29, 185, 84, 0.2);
}

.service-card.available:hover {
  border-color: rgba(29, 185, 84, 0.4);
  box-shadow: 
    0 8px 32px rgba(29, 185, 84, 0.15),
    0 0 0 1px rgba(29, 185, 84, 0.1) inset;
  transform: translateY(-4px);
}

.service-card.coming-soon {
  opacity: 0.7;
  border-color: rgba(255, 167, 38, 0.1);
}

.service-card.coming-soon:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 167, 38, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.card-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-badge.available {
  background: rgba(30, 215, 96, 0.2);
  color: var(--spotify-green);
}

.status-badge.coming-soon {
  background: rgba(255, 167, 38, 0.2);
  color: #ffa726;
}

.card-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-white);
  position: relative;
  z-index: 1;
}

.card-description {
  font-size: var(--font-size-base);
  color: var(--spotify-light-gray);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

.card-button {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, var(--spotify-green) 0%, #22c55e 100%);
  color: var(--spotify-black);
  box-shadow: 
    0 8px 24px rgba(29, 185, 84, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transition: left 0.5s ease;
  pointer-events: none;
}

.btn-primary:hover::after {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 32px rgba(29, 185, 84, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.btn-disabled {
  background: rgba(255, 255, 255, 0.05);
  color: var(--spotify-light-gray);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none;
  box-shadow: none;
}

.button-icon {
  transition: transform var(--transition-base);
}

.btn-primary:hover .button-icon {
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .home-container {
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .hero-icon {
    font-size: 2.5rem;
  }

  .hero-section h1 {
    font-size: var(--font-size-3xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-sm);
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .service-card {
    padding: var(--spacing-lg);
  }

  .card-title {
    font-size: var(--font-size-xl);
  }

  .card-icon {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: var(--font-size-2xl);
  }

  .card-title {
    font-size: var(--font-size-lg);
  }
}
</style>
