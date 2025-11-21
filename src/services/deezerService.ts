// Types pour l'API Deezer
export interface DeezerTrack {
  id: number
  title: string
  duration: number
  preview: string
  artist: {
    id: number
    name: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
  }
  album: {
    id: number
    title: string
    cover: string
    cover_small: string
    cover_medium: string
    cover_big: string
  }
}

export interface DeezerPlaylist {
  id: number
  title: string
  description: string
  duration: number
  public: boolean
  nb_tracks: number
  picture: string
  picture_small: string
  picture_medium: string
  picture_big: string
  creator: {
    id: number
    name: string
  }
  tracks?: {
    data: DeezerTrack[]
  }
}

export interface DeezerArtist {
  id: number
  name: string
  picture: string
  picture_small: string
  picture_medium: string
  picture_big: string
  nb_album: number
  nb_fan: number
}

export interface DeezerSearchResponse<T> {
  data: T[]
  total: number
  next?: string
}

class DeezerService {
  // During development we proxy requests through Vite dev server at /api/deezer
  // which forwards to https://api.deezer.com to avoid CORS issues.
  private readonly baseUrl = '/api/deezer'

  /**
   * Recherche d'artistes
   */
  async searchArtists(query: string): Promise<DeezerArtist[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/artist?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`Erreur API Deezer: ${response.status}`)
      }
      const data: DeezerSearchResponse<DeezerArtist> = await response.json()
      return data.data
    } catch (error) {
      console.error('Erreur lors de la recherche d\'artistes:', error)
      throw error
    }
  }

  /**
   * Recherche de playlists publiques
   */
  async searchPlaylists(query: string): Promise<DeezerPlaylist[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/playlist?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`Erreur API Deezer: ${response.status}`)
      }
      const data: DeezerSearchResponse<DeezerPlaylist> = await response.json()
      return data.data.filter(playlist => playlist.public)
    } catch (error) {
      console.error('Erreur lors de la recherche de playlists:', error)
      throw error
    }
  }

  /**
   * Récupération d'une playlist par ID
   */
  async getPlaylist(playlistId: number): Promise<DeezerPlaylist> {
    try {
      const response = await fetch(`${this.baseUrl}/playlist/${playlistId}`)
      if (!response.ok) {
        throw new Error(`Erreur API Deezer: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération de la playlist:', error)
      throw error
    }
  }

  /**
   * Récupération des tracks d'une playlist
   */
  async getPlaylistTracks(playlistId: number): Promise<DeezerTrack[]> {
    try {
      // Request a larger limit to retrieve more tracks in a single call
      const response = await fetch(`${this.baseUrl}/playlist/${playlistId}/tracks?limit=100`)
      if (!response.ok) {
        throw new Error(`Erreur API Deezer: ${response.status}`)
      }
      const data: DeezerSearchResponse<DeezerTrack> = await response.json()
      return data.data.filter(track => track.preview) // Filtre seulement les tracks avec preview
    } catch (error) {
      console.error('Erreur lors de la récupération des tracks:', error)
      throw error
    }
  }

  /**
   * Récupération des top tracks d'un artiste
   */
  async getArtistTopTracks(artistId: number): Promise<DeezerTrack[]> {
    try {
      // Request more top tracks (use limit) to provide a larger virtual playlist
      const response = await fetch(`${this.baseUrl}/artist/${artistId}/top?limit=50`)
      if (!response.ok) {
        throw new Error(`Erreur API Deezer: ${response.status}`)
      }
      const data: DeezerSearchResponse<DeezerTrack> = await response.json()
      return data.data.filter(track => track.preview) // Filtre seulement les tracks avec preview
    } catch (error) {
      console.error('Erreur lors de la récupération des top tracks:', error)
      throw error
    }
  }

  /**
   * Parse une URL de playlist Deezer pour extraire l'ID
   */
  parsePlaylistUrl(url: string): number | null {
    const match = url.match(/playlist\/(\d+)/)
    return match && match[1] ? parseInt(match[1], 10) : null
  }

  /**
   * Validation d'une URL de playlist Deezer
   */
  isValidPlaylistUrl(url: string): boolean {
    return /https?:\/\/(?:www\.)?deezer\.com\/[a-z]{2}\/playlist\/\d+/.test(url)
  }
}

export const deezerService = new DeezerService()