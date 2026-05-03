/**
 * Authentication API Module
 * Handles user registration, login, and email verification
 */

import ApiService from '../api-service'
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from '@/types/auth'
import { extractUserFromToken } from '@/utils/jwt-decoder'

export const AuthApi = {
  /**
   * Register a new user
   * @param data - Registration data (email, password, name, nickName)
   * @returns Promise with RegisterResponse
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return ApiService.post<RegisterResponse>('/auth/register', data)
  },

  /**
   * Login user
   * @param data - Login credentials (email, password)
   * @returns Promise with LoginResponse with user data
   */
  async login(data: LoginRequest): Promise<LoginResponse & { user?: any }> {
    // Clear any existing token before login to prevent sending invalid Authorization header
    ApiService.setAuthToken(null)

    const response = await ApiService.post<LoginResponse>('/auth/login', data)

    // Store tokens after successful login
    if (response.accessToken) {
      ApiService.setAuthToken(response.accessToken)
    }

    // Store refresh token
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken)
    }

    // Store ID token and extract user info
    if (response.idToken) {
      localStorage.setItem('idToken', response.idToken)

      // Extract user information from ID token
      const user = extractUserFromToken(response.idToken)
      if (user) {
        ApiService.setUserId(user.id)
        localStorage.setItem('user', JSON.stringify(user))
        return { ...response, user }
      }
    }

    return response
  },

  /**
   * Verify email address with code
   * @param data - Email and verification code
   * @returns Promise with VerifyEmailResponse
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return ApiService.post<VerifyEmailResponse>('/auth/verify-email', data)
  },

  /**
   * Logout user (if backend supports it)
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    // Clear all auth data
    ApiService.setAuthToken(null)
    ApiService.setUserId(null)
    localStorage.removeItem('idToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    // Optional: Call backend logout if it exists
    try {
      await ApiService.post('/auth/logout')
    } catch (error) {
      // Backend might not have logout endpoint, that's OK
      // Backend might not have logout endpoint, that's OK
    }
  },

  /**
   * Request password reset code
   * @param data - Email address
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return ApiService.post<ForgotPasswordResponse>('/auth/forgot-password', data)
  },

  /**
   * Reset password with verification code
   * @param data - Email, confirmation code, and new password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return ApiService.post<ResetPasswordResponse>('/auth/reset-password', data)
  },

  /**
   * Get current user from localStorage
   * @returns User object or null
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user')

    if (!userStr) {
      return null
    }

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  /**
   * Check if user is authenticated
   * @returns true if user has valid token
   */
  isAuthenticated(): boolean {
    return !!ApiService.getAuthToken()
  }
}