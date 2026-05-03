/**
 * Cache API Module
 * Handles cache management operations (admin/debug functionality)
 */

import ApiService from '../api-service'

/**
 * Cache statistics response
 */
export interface CacheStatsResponse {
  [cacheName: string]: {
    size: number
    hitCount: number
    missCount: number
    evictionCount: number
  }
}

/**
 * Cache names response
 */
export interface CacheNamesResponse {
  cacheNames: string[]
}

/**
 * Generic success response
 */
export interface CacheOperationResponse {
  message: string
  success: boolean
}

export const CacheApi = {
  /**
   * Get cache statistics for all caches
   * @returns Promise with CacheStatsResponse
   */
  async getCacheStats(): Promise<CacheStatsResponse> {
    return ApiService.get<CacheStatsResponse>('/cache/stats')
  },

  /**
   * Get list of all cache names
   * @returns Promise with CacheNamesResponse
   */
  async getCacheNames(): Promise<CacheNamesResponse> {
    return ApiService.get<CacheNamesResponse>('/cache/names')
  },

  /**
   * Clear all caches
   * @returns Promise with CacheOperationResponse
   */
  async clearAllCaches(): Promise<CacheOperationResponse> {
    return ApiService.post<CacheOperationResponse>('/cache/clear')
  },

  /**
   * Clear a specific cache by name
   * @param cacheName - Name of the cache to clear
   * @returns Promise with CacheOperationResponse
   */
  async clearCache(cacheName: string): Promise<CacheOperationResponse> {
    return ApiService.post<CacheOperationResponse>(`/cache/clear/${cacheName}`)
  }
}

