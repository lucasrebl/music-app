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
  </main>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'

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
</script>

<style scoped>
.home {
  min-height: 100vh;
}
</style>
