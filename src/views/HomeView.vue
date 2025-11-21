<template>
  <main class="home">
    <HeroSection
      title="🎵 Music App"
      subtitle="Découvrez la musique autrement avec nos jeux et services interactifs"
      description="Une application musicale qui vous propose des expériences uniques pour tester et découvrir vos connaissances musicales. Connectez-vous avec Spotify et plongez dans l'univers de vos artistes préférés !"
    />

    <ServicesSection
      title="Nos Services"
      :services="services"
    />

    <AboutSection
      title="À propos"
      description="Music App utilise l'API Spotify pour vous offrir une expérience musicale riche et personnalisée. Nos services sont conçus pour les passionnés de musique qui souhaitent explorer, découvrir et s'amuser avec leur bibliothèque musicale."
      :features="features"
    />
  </main>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'

// Data pour les services
const services = [
  {
    id: 'blind-test',
    icon: '🎯',
    title: 'Blind Test',
    description: 'Testez vos connaissances musicales avec notre jeu de blind test connecté à Spotify. Devinez les artistes, albums et titres de vos playlists préférées !',
    route: '/blind-test',
    isAvailable: true,
    buttonText: 'Jouer maintenant'
  },
  {
    id: 'statistics',
    icon: '📊',
    title: 'Statistiques Musicales',
    description: 'Analysez vos habitudes d\'écoute, découvrez vos genres préférés et obtenez des insights détaillés sur votre profil musical.',
    isAvailable: false,
    buttonText: 'Bientôt disponible'
  },
  {
    id: 'playlist-generator',
    icon: '🎲',
    title: 'Générateur de Playlists',
    description: 'Créez des playlists personnalisées basées sur votre humeur, l\'occasion ou vos préférences musicales du moment.',
    isAvailable: false,
    buttonText: 'Bientôt disponible'
  },
  {
    id: 'challenges',
    icon: '🏆',
    title: 'Défis Musicaux',
    description: 'Participez à des défis quotidiens et hebdomadaires, affrontez vos amis et grimpez dans les classements !',
    isAvailable: false,
    buttonText: 'Bientôt disponible'
  }
]

// Data pour les fonctionnalités
const features = [
  {
    id: 'spotify',
    icon: '🔗',
    text: 'Connexion Spotify'
  },
  {
    id: 'games',
    icon: '🎮',
    text: 'Jeux interactifs'
  },
  {
    id: 'modern',
    icon: '📱',
    text: 'Interface moderne'
  },
  {
    id: 'evolution',
    icon: '🚀',
    text: 'Évolution continue'
  }
]
</script>

<style scoped>
.home {
  min-height: 100vh;
}
</style>
