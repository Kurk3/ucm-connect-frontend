/**
 * Admin API Module
 * Handles admin-only API calls for user and role management
 */

import ApiService from '../api-service'
import type { UserDTO } from '@/types/api'
import type { UserRole } from '@/types/user'

/**
 * Request to update user role
 */
export interface UpdateRoleRequest {
  role: UserRole
}

export const AdminApi = {
  /**
   * Get all users (admin only)
   * @returns Promise with array of UserDTO
   */
  async getAllUsers(): Promise<UserDTO[]> {
    return ApiService.get<UserDTO[]>('/admin/users')
  },

  /**
   * Get user by ID (admin only)
   * @param userId - User UUID
   * @returns Promise with UserDTO
   */
  async getUserById(userId: string): Promise<UserDTO> {
    return ApiService.get<UserDTO>(`/admin/users/${userId}`)
  },

  /**
   * Update user role (admin only)
   * @param userId - User UUID
   * @param data - New role
   * @returns Promise with updated UserDTO
   */
  async updateUserRole(userId: string, data: UpdateRoleRequest): Promise<UserDTO> {
    return ApiService.put<UserDTO>(`/admin/users/${userId}/role`, data)
  },

  async deleteUser(userId: string): Promise<void> {
    return ApiService.delete<void>(`/admin/users/${userId}`)
  },

  async deletePost(postId: string): Promise<void> {
    return ApiService.delete<void>(`/admin/posts/${postId}`)
  },

  async deleteComment(commentId: string): Promise<void> {
    return ApiService.delete<void>(`/admin/comments/${commentId}`)
  },

  async getAllPosts(page: number = 0, size: number = 20): Promise<any> {
    return ApiService.get<any>(`/posts?page=${page}&size=${size}`)
  },

  async getCommentsByPost(postId: string): Promise<any> {
    return ApiService.get<any>(`/posts/${postId}/comments`)
  }
}
