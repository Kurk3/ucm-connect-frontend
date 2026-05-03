/**
 * JWT Token Decoder Utility
 * Decodes JWT tokens without verification
 * NOTE: This is for client-side decoding only - verification happens server-side
 */

/**
 * Decode a JWT token and return the payload
 * @param token - JWT token string
 * @returns Decoded payload object or null if invalid
 */
export function decodeJWT(token: string): any {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // Decode the payload (middle part)
    const payload = parts[1]

    // Base64 decode and parse JSON
    // Replace URL-safe characters and add padding if needed
    const base64 = payload!.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
    const decoded = atob(padded)

    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Extract user information from Cognito ID token
 * @param idToken - Cognito ID token
 * @returns User information object
 */
export function extractUserFromToken(idToken: string): {
  id: string
  email: string
  name?: string
  nickname?: string
} | null {
  const payload = decodeJWT(idToken)

  if (!payload) {
    return null
  }

  // Extract relevant claims from Cognito ID token
  return {
    id: payload.sub || payload['cognito:username'], // Cognito user ID
    email: payload.email,
    name: payload.name,
    nickname: payload.nickname || payload['custom:nickName']
  }
}

/**
 * Check if a token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)

  if (!payload || !payload.exp) {
    return true
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()

  return currentTime >= expirationTime
}