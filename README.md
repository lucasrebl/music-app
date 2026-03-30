# 🎵 Music App - Blind Test

Une application web interactive de blind test musical développée avec Vue.js 3 et TypeScript.

🚀 **[Essayer l'application en ligne](https://toolboxxx.netlify.app/)**

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.19+-339933?style=flat-square&logo=node.js&logoColor=white)

## 📖 Description

Music App est une application interactive qui permet de tester vos connaissances musicales à travers des blind tests. Devinez les chansons, artistes et albums en vous laissant guider uniquement par la musique. Importez vos propres playlists et créez des tests personnalisés pour une expérience unique.

## 🚧 Statut du Projet

⚠️ **Le projet est actuellement en cours de développement** 

De nombreuses nouvelles fonctionnalités sont prévues pour enrichir l'expérience utilisateur. Restez à l'écoute pour les mises à jour futures !

## ✨ Fonctionnalités

### 🎮 Gameplay
- **Lecture audio en aveugle** : Écoutez la musique sans voir les informations
- **Questions intelligentes** : Identifiez chanson, artiste, ou album selon la difficulté
- **Fin automatique** : Le test se termine en fonction du nombre de questions
- **Timer intégré** : Suivez votre temps de réponse avec un chronomètre préci

### 📋 Gestion de Playlists
- **Recherche Deezer** : Trouvez et importez des playlists directement
- **Recherche par artiste** : Sélectionnez des pistes spécifiques
- **Recherche par URL** : Importez des playlists via leurs liens
- **Sélection personnalisée** : Choisissez les sources musicales pour votre test

### 🏆 Niveaux de Difficulté
- **🌱 Facile** : Identifier chanson et artiste
- **⚡ Moyen** : Questions mélangées (chanson, artiste, album)
- **🔥 Difficile** : Challenge complet avec tous les éléments
- **💀 Hardcore** : Questions pièges et confirmations d'écoute

### 📊 Statistiques & Résultats
- **Score global** : Points gagnés selon la difficulté
- **Taux de réussite** : Pourcentage de bonnes réponses
- **Temps moyen** : Durée moyenne par question
- **Historique détaillé** : Revue de toutes les réponses et leurs corrections
- **Feedback personnalisé** : Messages motivants selon les performances

### 🎨 Interface Utilisateur
- **Design moderne** : Interface responsive et élégante avec thème cohérent
- **Navigation intuitive** : Flux clair de l'accueil aux résultats
- **Paramètres flexibles** : Configuration des objectifs avant le jeu
- **Affichage des sources** : Visualisez les playlists sélectionnées
- **Modal pour chaque étape** : Révélation des réponses après chaque question

## 🚀 Installation

### Prérequis
- **Node.js** : Version 20.19.0 ou supérieure
- **npm** : Gestionnaire de paquets

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/lucasrebl/music-app.git
cd music-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer en mode développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

## 🛠️ Scripts Disponibles

```bash
# Développement avec hot-reload
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Vérification TypeScript
npm run type-check

# Linting et correction automatique
npm run lint
```

## 🏗️ Architecture

### Structure du Projet
```
src/
├── components/              # Composants Vue réutilisables
│   ├── blind-test/
│   │   ├── GamePlay.vue     # Écran principal du jeu
│   │   ├── GameSettings.vue # Configuration du test
│   │   ├── GameSummary.vue  # Résultats finaux
│   │   ├── PlaylistSearch.vue # Recherche de playlists
│   │   ├── ImportResults.vue # Résultats d'import
│   │   ├── gameplay/        # Composants du gameplay
│   │   │   ├── AudioPlayer.vue
│   │   │   ├── AnswerInput.vue
│   │   │   ├── AnswerReveal.vue
│   │   │   ├── GameHeader.vue
│   │   │   └── GameTimer.vue
│   │   ├── playlist-search/ # Composants de recherche
│   │   │   ├── PlaylistSearchTab.vue
│   │   │   ├── ArtistSearch.vue
│   │   │   ├── UrlSearch.vue
│   │   │   ├── SelectedSources.vue
│   │   │   └── SearchTabs.vue
│   │   └── settings/        # Composants de paramètres
│   │       ├── ObjectivesSection.vue
│   │       ├── SettingsActions.vue
│   │       ├── ValidationSection.vue
│   │       └── SettingsHeader.vue
│   └── home/                # Composants de la page d'accueil
│       ├── HeroSection.vue
│       ├── ServiceCard.vue
│       └── ServicesSection.vue
├── services/                # Logique métier
│   └── deezerService.ts     # Intégration API Deezer
├── types/                   # Typage TypeScript
│   └── blindTest.ts
├── views/                   # Pages principales
│   ├── HomeView.vue
│   └── blind-test/
│       ├── BlindTestView.vue
│       ├── BlindTestSettingsView.vue
│       ├── BlindTestGameView.vue
│       └── BlindTestSummaryView.vue
└── router/                  # Configuration des routes
    └── index.ts
```

### Séparation des Responsabilités
- **Services** : Logique métier pure (appels API, intégration Deezer)
- **Components** : Interface utilisateur réutilisable et modulaire
- **Views** : Pages principales orientant le flux utilisateur
- **Types** : Interfaces TypeScript pour une typage fort
- **Router** : Navigation et gestion des routes

## 🎨 Technologies Utilisées

- **Frontend** : Vue.js 3 (Composition API)
- **Langage** : TypeScript pour la sécurité des types
- **Build Tool** : Vite pour le développement et la production
- **Router** : Vue Router 4 pour la navigation
- **API** : Deezer API pour récupérer les playlists et pistes
- **Styling** : CSS scoped et responsive design
- **Linting** : ESLint + Oxlint pour la qualité du code

## 🎮 Comment Jouer

1. **Accès à l'application** : Ouvri l'application sur la page d'accueil
2. **Démarrer un blind test** : Cliquez sur "Commencer" ou sélectionnez un mode
3. **Configurer le test** :
   - Recherchez et sélectionnez des playlists (Deezer, artiste, ou URL)
   - Définissez vos objectifs (nombre de questions, difficulté)
4. **Jouer** :
   - Écoutez la musique affichée
   - Répondez aux questions le plus rapidement possible
   - Validez votre réponse avant le délai imparti
5. **Voir les résultats** :
   - Consultez votre score et statistiques détaillées
   - Revoyez chaque question et réponse
6. **Recommencer** : Relancez un nouveau test avec d'autres paramètres

## 🏅 Conseils pour Améliorer

- Commencez par le niveau **facile** pour vous habituer
- Écoutez attentivement les **5 premières secondes** (souvent décisives)
- Entraînez votre **mémoire musicale** avec des tests réguliers
- Essayez des **genres variés** pour diversifier vos connaissances
- Progressez graduellement vers les niveaux **plus difficiles**

## 🔧 Configuration IDE Recommandée

**VS Code** + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Extensions utiles :
- **Vue.js devtools** pour navigateur
- **TypeScript Vue Plugin (Volar)**
- **ESLint** pour VS Code
- **Prettier** pour la formatage du code

## 📝 Licences Utilisées

Deezer API pour la récupération des données musicales.

---

**Développé avec ❤️ par [lucasrebl](https://github.com/lucasrebl)**
