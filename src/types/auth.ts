/**
 * Authentication-related types
 * Based on backend AuthController endpoints
 */

/**
 * Request to register a new user
 */
export interface RegisterRequest {
  email: string
  password: string
  name: string
  nickName: string
}

/**
 * Request to verify email address
 */
export interface VerifyEmailRequest {
  email: string
  verificationCode: string
}

/**
 * Request to login
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Response from registration
 */
export interface RegisterResponse {
  message: string
  nickName: string
  email: string
  userSub: string // Cognito user ID
}

/**
 * Response from login (AWS Cognito authentication result)
 */
export interface LoginResponse {
  accessToken: string // JWT access token for API requests
  idToken: string // JWT ID token containing user claims
  refreshToken: string // Token for refreshing access token
  expiresIn: number // Token expiration time in seconds
  tokenType: string // Always "Bearer"
}

/**
 * Response from verify email
 */
export interface VerifyEmailResponse {
  message: string
}

/**
 * Request to initiate forgot password flow
 */
export interface ForgotPasswordRequest {
  email: string
}

/**
 * Response from forgot password
 */
export interface ForgotPasswordResponse {
  message: string
}

/**
 * Request to reset password with verification code
 */
export interface ResetPasswordRequest {
  email: string
  confirmationCode: string
  newPassword: string
}

/**
 * Response from reset password
 */
export interface ResetPasswordResponse {
  message: string
}

/**
 * Generic error response from auth endpoints
 */
export interface AuthErrorResponse {
  error: string
  message: string
  details?: Record<string, string>
}