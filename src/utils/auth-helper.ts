/**
 * Authentication Helper Functions
 * Provides utilities for checking authentication status
 */

import ApiService from '@/services/api-service'
import { isTokenExpired } from './jwt-decoder'

/**
 * Check if user is authenticated
 * @returns true if user has valid token, false otherwise
 */
export function isAuthenticated(): boolean {
  const token = ApiService.getAuthToken()

  if (!token) {
    return false
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    // Clear expired token
    ApiService.setAuthToken(null)
    ApiService.setUserId(null)
    localStorage.removeItem('idToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return false
  }

  return true
}

/**
 * Get current user from localStorage
 * @returns User object or null
 */
export function getCurrentUser(): any {
  const userStr = localStorage.getItem('user')

  if (!userStr) {
    return null
  }

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
  ApiService.setAuthToken(null)
  ApiService.setUserId(null)
  localStorage.removeItem('idToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

/**
 * Get authentication headers for API requests
 * @returns Headers object with authorization
 */
export function getAuthHeaders(): Record<string, string> {
  const token = ApiService.getAuthToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`
  }
}