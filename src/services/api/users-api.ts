/**
 * Users API Module
 * Handles all user-related API calls
 *
 * Available endpoints:
 *   GET    /users/me  - Get current user profile
 *   PUT    /users/me  - Update current user profile (only 'name' field)
 *   DELETE /users/me  - Delete current user
 *
 * Note: There is no public /users/{userId} endpoint.
 * Admin-only endpoint exists at /admin/users/{userId}.
 */

import ApiService from '../api-service'
import type { UserDTO, UpdateUserRequest } from '@/types/api'

export const UsersApi = {
  /**
   * Get current user profile (me)
   * @returns Promise with UserDTO
   */
  async getMe(): Promise<UserDTO> {
    return ApiService.get<UserDTO>('/users/me')
  },

  /**
   * Update current user profile
   * @param data - Updated user data (only name field is supported by backend)
   * @returns Promise with updated UserDTO
   */
  async updateMe(data: UpdateUserRequest): Promise<UserDTO> {
    const updateData = { name: data.name }
    return ApiService.put<UserDTO>('/users/me', updateData)
  }
}
