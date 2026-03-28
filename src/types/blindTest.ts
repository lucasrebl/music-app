import type { DeezerTrack, DeezerPlaylist } from '@/services/deezerService'

// Configuration du jeu
export interface GameSettings {
  targetScore: number
  maxTracks: number
  trackDuration: number
  validateTitle: boolean 
  validateArtist: boolean
  exactMatch: boolean
  showAnswerDelay: number
  nextTrackDelay: number
}

// État du jeu
export type GameState = 
  | 'settings'
  | 'playlist_selection' 
  | 'playing'
  | 'show_answer'
  | 'paused'
  | 'finished'

// Raison de fin de partie
export type GameEndReason = 
  | 'target_score_reached'
  | 'all_tracks_played' 
  | 'player_stopped'

// Résultat d'une piste
export interface TrackResult {
  track: DeezerTrack
  playerAnswer: string
  isCorrect: boolean
  points: number
  timeToAnswer: number
  correctAnswer: {
    title: string
    artist: string
  }
  attempts: string[]
}

// État d'une partie en cours
export interface GameSession {
  settings: GameSettings
  playlist: DeezerPlaylist
  tracks: DeezerTrack[]
  currentTrackIndex: number
  currentTrack: DeezerTrack | null
  score: number
  results: TrackResult[]
  state: GameState
  timeRemaining: number
  startTime: number | null
  endReason: GameEndReason | null
  isMuted: boolean
}

// Options de validation des réponses
export interface AnswerValidation {
  validateTitle: boolean
  validateArtist: boolean
  exactMatch: boolean
}

// Résultat de validation d'une réponse
export interface ValidationResult {
  isCorrect: boolean
  titleMatch: boolean
  artistMatch: boolean
  similarity: number
}

// Paramètres par défaut du jeu
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  targetScore: 50,
  maxTracks: 20,
  trackDuration: 30,
  validateTitle: true,
  validateArtist: true,
  exactMatch: false,
  showAnswerDelay: 3,
  nextTrackDelay: 5
}

// Calcul des points basé sur la rapidité (1-10 points)
export function calculatePoints(timeToAnswer: number, maxTime: number): number {
  if (timeToAnswer >= maxTime) return 1
  
  const ratio = 1 - (timeToAnswer / maxTime)
  return Math.max(1, Math.min(10, Math.round(1 + (ratio * 9))))
}

// Normalisation des chaînes pour comparaison
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    // Enlever le texte entre parenthèses, crochets ou accolades
    .replace(/\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g, '')
    // Supprime la ponctuation restante
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ') // Normalise les espaces
    .trim()
}

// Calcul de similarité entre deux chaînes (algorithme de Levenshtein simplifié)
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1)
  const s2 = normalizeString(str2)
  
  if (s1 === s2) return 1
  
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1
  
  if (longer.length === 0) return 1
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  
  const matrix: number[][] = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0))
  
  for (let i = 0; i <= len2; i++) {
    matrix[i]![0] = i
  }
  
  for (let j = 0; j <= len1; j++) {
    matrix[0]![j] = j
  }
  
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j]! + 1
        )
      }
    }
  }
  
  return matrix[len2]![len1]!
}

// Validation d'une réponse
export function validateAnswer(
  userAnswer: string,
  track: DeezerTrack,
  validation: AnswerValidation
): ValidationResult {
  const titleSimilarity = calculateSimilarity(userAnswer, track.title)
  const artistSimilarity = calculateSimilarity(userAnswer, track.artist.name)
  
  const threshold = validation.exactMatch ? 1 : 0.7
  
  const titleMatch = validation.validateTitle && titleSimilarity >= threshold
  const artistMatch = validation.validateArtist && artistSimilarity >= threshold
  
  let isCorrect = false
  if (validation.validateTitle && validation.validateArtist) {
    isCorrect = titleMatch || artistMatch
  } else if (validation.validateTitle) {
    isCorrect = titleMatch
  } else if (validation.validateArtist) {
    isCorrect = artistMatch
  }
  
  return {
    isCorrect,
    titleMatch,
    artistMatch,
    similarity: Math.max(titleSimilarity, artistSimilarity)
  }
}