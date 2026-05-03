/**
 * Comments API Module
 * Handles all comment-related API calls
 */

import ApiService from '../api-service'
import type {
  CommentDTO,
  CommentDetailDTO,
  CommentListResponse,
  CreateCommentRequest,
  UpdateCommentRequest
} from '@/types/api'

export const CommentsApi = {
  /**
   * Fetch comments for a specific post
   * @param postId - Post UUID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 50, max: 100)
   * @returns Promise with array of CommentDTO
   */
  async fetchComments(
    postId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<CommentDTO[]> {
    const params = { page, limit }
    const response = await ApiService.get<CommentListResponse>(`/posts/${postId}/comments`, { params })
    return response.comments || []
  },

  /**
   * Get detailed information about a specific comment
   * @param id - Comment UUID
   * @returns Promise with CommentDetailDTO
   */
  async getComment(id: string): Promise<CommentDetailDTO> {
    return ApiService.get<CommentDetailDTO>(`/comments/${id}`)
  },

  /**
   * Create a new comment on a post
   * Backend extracts userId from JWT token automatically
   * @param postId - Post UUID
   * @param data - Comment data (content)
   * @returns Promise with created CommentDTO
   */
  async createComment(
    postId: string,
    data: CreateCommentRequest
  ): Promise<CommentDTO> {
    return ApiService.post<CommentDTO>(`/posts/${postId}/comments`, data)
  },

  /**
   * Update an existing comment
   * Backend extracts userId from JWT token automatically
   * @param id - Comment UUID
   * @param data - Updated comment data (content)
   * @returns Promise with updated CommentDTO
   */
  async updateComment(
    id: string,
    data: UpdateCommentRequest
  ): Promise<CommentDTO> {
    return ApiService.put<CommentDTO>(`/comments/${id}`, data)
  },

  /**
   * Delete a comment
   * Backend extracts userId from JWT token automatically
   * @param id - Comment UUID
   * @returns Promise<void>
   */
  async deleteComment(id: string): Promise<void> {
    return ApiService.delete<void>(`/comments/${id}`)
  }
}
