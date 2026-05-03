/**
 * User-related types
 * Based on UserDTO.java
 */

/**
 * User roles for ACL
 */
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

/**
 * User profile information
 */
export interface UserDTO {
  id: string // UUID mapped to string
  name: string
  nickName: string
  email: string
  cognitoUserId?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  role: UserRole // User role for ACL
  createdAt: string // LocalDateTime as ISO 8601 string
  updatedAt: string // LocalDateTime as ISO 8601 string
}

/**
 * Request to update user profile
 */
export interface UpdateUserRequest {
  name?: string
  nickName?: string
}
