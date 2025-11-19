<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Variables CSS avec la palette Spotify */
:root {
  /* Couleurs principales */
  --spotify-green: #1ED760;
  --spotify-green-light: #1fdf64;
  --spotify-green-dark: #1db954;
  
  /* Couleurs neutres */
  --spotify-black: #121212;
  --spotify-dark-gray: #191414;
  --spotify-gray: #282828;
  --spotify-light-gray: #b3b3b3;
  --spotify-white: #ffffff;
  
  /* Couleurs d'état */
  --color-success: var(--spotify-green);
  --color-warning: #ffa726;
  --color-error: #f44336;
  --color-info: #2196f3;
  
  /* Typographie */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Bordures */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-full: 9999px;
  
  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* Reset CSS et styles de base */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--spotify-white);
  background-color: var(--spotify-black);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  width: 100%;
}

/* Reset des éléments de liste */
ul,
ol {
  list-style: none;
}

/* Reset des liens */
a {
  color: inherit;
  text-decoration: none;
  transition: var(--transition-base);
}

a:hover {
  color: var(--spotify-green);
}

/* Reset des boutons */
button {
  border: none;
  background: none;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition-base);
}

/* Reset des inputs */
input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
  background-color: var(--spotify-gray);
  border: 1px solid var(--spotify-light-gray);
  color: var(--spotify-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--spotify-green);
}

/* Classes utilitaires communes */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-full);
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
  cursor: pointer;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background-color: var(--spotify-green);
  color: var(--spotify-black);
}

.btn-primary:hover {
  background-color: var(--spotify-green-light);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--spotify-white);
  border: 1px solid var(--spotify-light-gray);
}

.btn-secondary:hover {
  border-color: var(--spotify-green);
  color: var(--spotify-green);
}

.btn-disabled {
  background-color: var(--spotify-gray);
  color: var(--spotify-light-gray);
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none;
}

/* Classes de texte */
.text-green {
  color: var(--spotify-green);
}

.text-gray {
  color: var(--spotify-light-gray);
}

.text-center {
  text-align: center;
}

/* Classes de conteneur */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section {
  padding: var(--spacing-3xl) 0;
}
</style>