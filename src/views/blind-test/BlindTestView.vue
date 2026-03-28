<template>
  <main class="blind-test">
    <div class="blind-test-home">
      <section class="hero-section">
        <div class="hero-icon">🎵</div>
        <h1>Blind Test Musical</h1>
        <p class="hero-subtitle">Testez vos connaissances musicales avec des extraits de vos playlists préférées</p>
      </section>

      <section class="primary-cta">
        <router-link to="/blind-test/settings" class="play-button">
          <span class="play-icon">🎮</span>
          <span class="play-text">
            <span class="play-title">Commencer à jouer</span>
            <span class="play-subtitle">Configurez votre partie</span>
          </span>
        </router-link>
      </section>

      <section class="import-section">
        <h2>Voir les résultats d'une partie précédente</h2>
        <ImportResults
          @import-success="handleImportSuccess"
        />
      </section>

      <section class="game-info">
        <div class="info-container">
          <div class="info-column">
            <h2>Le Gameplay</h2>
            <div class="info-list">
              <div class="info-item">
                <span class="info-icon">🎯</span>
                <div class="info-content">
                  <h4>Devinez les chansons</h4>
                  <p>Écoutez et identifiez le titre ou l'artiste</p>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">⏱️</span>
                <div class="info-content">
                  <h4>Contre la montre</h4>
                  <p>30 secondes par titre pour répondre</p>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">🏆</span>
                <div class="info-content">
                  <h4>Gagnez des points</h4>
                  <p>Plus vite vous répondez, plus vous gagnez (1-10 points)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="info-column">
            <h2>Vos Avantages</h2>
            <div class="info-list">
              <div class="info-item">
                <span class="info-icon">✨</span>
                <div class="info-content">
                  <h4>Vos playlists</h4>
                  <p>Jouez avec vos morceaux préférés</p>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">🎲</span>
                <div class="info-content">
                  <h4>Ordre aléatoire</h4>
                  <p>Toujours du nouveau à chaque partie</p>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📊</span>
                <div class="info-content">
                  <h4>Statistiques</h4>
                  <p>Suivez vos performances et progressez</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="footer-actions">
        <router-link to="/" class="back-link">
          <span class="back-icon">🏠</span>
          <span>Retour à l'accueil</span>
        </router-link>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ImportResults from '@/components/blind-test/ImportResults.vue'
import type { TrackResult, GameEndReason, GameSettings } from '@/types/blindTest'
import type { DeezerPlaylist, DeezerArtist } from '@/services/deezerService'

const router = useRouter()

interface GameData {
  metadata: {
    exportDate: string
    gameVersion: string
    appName: string
  }
  gameSettings: GameSettings
  gameResults: {
    finalScore: number
    endReason: GameEndReason
    results: TrackResult[]
  }
  sources: {
    playlists: DeezerPlaylist[]
    artists: DeezerArtist[]
  }
}

function handleImportSuccess(data: GameData) {
  // Sauvegarder les données importées dans localStorage
  localStorage.setItem('blindTestResults', JSON.stringify(data.gameResults))
  localStorage.setItem('blindTestSettings', JSON.stringify(data.gameSettings))
  localStorage.setItem('blindTestSources', JSON.stringify(data.sources))
  
  // Rediriger vers la page de résumé
  router.push('/blind-test/summary')
}
</script>

<style scoped>
.blind-test {
  min-height: 100vh;
  background: var(--spotify-black);
  color: var(--spotify-white);
}

.blind-test-home {
  max-width: 1000px;
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

.primary-cta {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-2xl) 0;
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

.import-section {
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-2xl);
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-lg);
}

.import-section h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-green);
  text-align: center;
}

.game-info {
  margin-bottom: var(--spacing-3xl);
}

.info-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-2xl);
}

.info-column h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--spotify-green);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(29, 185, 84, 0.3);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.01);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(29, 185, 84, 0.15);
  transform: translateX(4px);
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-content {
  flex: 1;
}

.info-content h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--spotify-white);
}

.info-content p {
  font-size: var(--font-size-sm);
  color: var(--spotify-light-gray);
  line-height: 1.4;
}

.footer-actions {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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

@media (max-width: 768px) {
  .blind-test-home {
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .hero-section {
    margin-bottom: var(--spacing-2xl);
    padding-bottom: var(--spacing-lg);
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

  .primary-cta {
    margin-bottom: var(--spacing-2xl);
    padding: var(--spacing-lg) 0;
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

  .import-section {
    margin-bottom: var(--spacing-2xl);
    padding: var(--spacing-lg);
  }

  .info-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .info-column h2 {
    font-size: var(--font-size-lg);
  }

  .info-item {
    padding: var(--spacing-sm) var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .info-icon {
    font-size: 1.2rem;
  }

  .info-content h4 {
    font-size: var(--font-size-sm);
  }

  .info-content p {
    font-size: var(--font-size-xs);
  }
}
</style>