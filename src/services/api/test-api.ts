/**
 * Test API Module
 * Handles test endpoints for development, debugging, and data seeding
 */

import ApiService from '../api-service'

/**
 * Generic test response
 */
export interface TestResponse {
  message: string
  timestamp?: string
  authenticated?: boolean
  userId?: string
}

/**
 * Seed data response
 */
export interface SeedDataResponse {
  message: string
  success: boolean
  recordsCreated?: {
    users?: number
    posts?: number
    comments?: number
    likes?: number
    subjects?: number
  }
}

export const TestApi = {
  /**
   * Test public endpoint (no authentication required)
   * @returns Promise with TestResponse
   */
  async testPublic(): Promise<TestResponse> {
    return ApiService.get<TestResponse>('/test/public')
  },

  /**
   * Test protected endpoint (authentication required)
   * @returns Promise with TestResponse
   */
  async testProtected(): Promise<TestResponse> {
    return ApiService.get<TestResponse>('/test/protected')
  },

  /**
   * Verify security configuration endpoint
   * @returns Promise with TestResponse
   */
  async verifyProtected(): Promise<TestResponse> {
    return ApiService.get<TestResponse>('/protected')
  },

  /**
   * Simple hello endpoint
   * @returns Promise with TestResponse
   */
  async hello(): Promise<TestResponse> {
    return ApiService.get<TestResponse>('/hello')
  },

  /**
   * Seed database with test data
   * @returns Promise with SeedDataResponse
   */
  async seedData(): Promise<SeedDataResponse> {
    return ApiService.post<SeedDataResponse>('/test/seed')
  },

  /**
   * Get current seed data status
   * @returns Promise with SeedDataResponse
   */
  async getSeedStatus(): Promise<SeedDataResponse> {
    return ApiService.get<SeedDataResponse>('/test/seed')
  },

  /**
   * Delete all seed data
   * @returns Promise with SeedDataResponse
   */
  async deleteSeedData(): Promise<SeedDataResponse> {
    return ApiService.delete<SeedDataResponse>('/test/seed')
  }
}

