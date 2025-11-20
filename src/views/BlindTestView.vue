<template>
  <main class="blind-test">
    <!-- Page d'accueil Blind Test -->
    <div class="blind-test-home">
      <div class="hero-section">
        <div class="hero-icon">🎵</div>
        <h1>Blind Test Musical</h1>
        <p class="hero-subtitle">Testez vos connaissances musicales avec des extraits de vos playlists préférées</p>
      </div>

      <div class="game-explanation">
        <h2>Comment jouer ?</h2>
        <div class="rules-grid">
          <div class="rule-card">
            <div class="rule-icon">🎯</div>
            <h3>Objectif</h3>
            <p>Devinez le titre ou l'artiste des morceaux qui passent pour gagner des points</p>
          </div>
          <div class="rule-card">
            <div class="rule-icon">⏱️</div>
            <h3>Temps limité</h3>
            <p>Vous avez 30 secondes par titre pour donner votre réponse</p>
          </div>
          <div class="rule-card">
            <div class="rule-icon">🏆</div>
            <h3>Points</h3>
            <p>Plus vous répondez vite, plus vous gagnez de points (1 à 10 points par bonne réponse)</p>
          </div>
          <div class="rule-card">
            <div class="rule-icon">🎼</div>
            <h3>Sources</h3>
            <p>Choisissez parmi vos playlists Deezer favorites ou sélectionnez des artistes spécifiques</p>
          </div>
        </div>
      </div>

      <div class="game-features">
        <h2>Fonctionnalités</h2>
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">✨</span>
            <span>Sélection multiple de playlists et d'artistes</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎲</span>
            <span>Ordre aléatoire des titres à chaque partie</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span>Statistiques détaillées en fin de partie</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⚙️</span>
            <span>Paramètres personnalisables (durée, nombre de titres, validation)</span>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <div class="cta-buttons">
          <router-link to="/blind-test/settings" class="play-button">
            <span class="play-icon">🎮</span>
            <span class="play-text">
              <span class="play-title">Commencer à jouer</span>
              <span class="play-subtitle">Configurez votre partie</span>
            </span>
          </router-link>
          
          <div class="secondary-actions">
            <router-link to="/" class="back-link">
              <span class="back-icon">🏠</span>
              <span>Retour à l'accueil</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Simple landing page for Blind Test game mode
</script>

<style scoped>
.blind-test {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.blind-test-home {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.hero-section {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  filter: drop-shadow(0 0 20px rgba(29, 185, 84, 0.4));
}

.hero-section h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--spotify-white) 0%, var(--spotify-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--spotify-light-gray);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.game-explanation {
  margin-bottom: var(--spacing-4xl);
}

.game-explanation h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  color: var(--spotify-green);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.rule-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
}

.rule-card:hover {
  transform: translateY(-4px);
  border-color: rgba(29, 185, 84, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.rule-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  display: block;
}

.rule-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--spotify-white);
}

.rule-card p {
  color: var(--spotify-light-gray);
  line-height: 1.5;
  font-size: var(--font-size-sm);
}

.game-features {
  margin-bottom: var(--spacing-5xl);
}

.game-features h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  color: var(--spotify-green);
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.01);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(29, 185, 84, 0.1);
}

.feature-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.cta-section {
  text-align: center;
  margin-top: var(--spacing-5xl);
  padding: var(--spacing-2xl);
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.play-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl) var(--spacing-3xl);
  background: linear-gradient(135deg, var(--spotify-green) 0%, #22c55e 100%);
  color: var(--spotify-black);
  border-radius: var(--border-radius-xl);
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px rgba(29, 185, 84, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  overflow: hidden;
}

.play-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transition: left 0.5s ease;
}

.play-button:hover::before {
  left: 100%;
}

.play-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 16px 48px rgba(29, 185, 84, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

.play-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.play-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.play-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  line-height: 1.2;
}

.play-subtitle {
  font-size: var(--font-size-sm);
  font-weight: 500;
  opacity: 0.8;
  line-height: 1.2;
}

.secondary-actions {
  display: flex;
  justify-content: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  width: 100%;
  max-width: 300px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--spotify-light-gray);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--border-radius-full);
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid transparent;
}

.back-link:hover {
  color: var(--spotify-white);
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.back-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .blind-test-home {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
  
  .hero-section h1 {
    font-size: var(--font-size-3xl);
  }
  
  .rules-grid {
    grid-template-columns: 1fr;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .cta-section {
    padding: var(--spacing-lg);
  }
  
  .play-button {
    padding: var(--spacing-lg) var(--spacing-2xl);
    gap: var(--spacing-md);
  }
  
  .play-text {
    align-items: center;
  }
  
  .play-title {
    font-size: var(--font-size-base);
  }
  
  .play-subtitle {
    font-size: var(--font-size-xs);
  }
}
</style>