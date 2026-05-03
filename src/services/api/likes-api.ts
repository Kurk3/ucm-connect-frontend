/**
 * Likes API Module
 * Handles all like-related API calls for posts and comments
 *
 * Backend extracts userId from JWT token automatically.
 * Available endpoints:
 *   POST   /posts/{postId}/likes     - Like a post
 *   DELETE /posts/{postId}/likes     - Unlike a post
 *   POST   /comments/{commentId}/likes - Like a comment
 *   DELETE /comments/{commentId}/likes - Unlike a comment
 *   GET    /users/me/likes           - Get current user's likes
 */

import ApiService from '../api-service'
import type { LikeDTO } from '@/types/api'

export const LikesApi = {
  /**
   * Like a post
   * @param postId - Post UUID to like
   * @returns Promise with created LikeDTO
   */
  async likePost(postId: string): Promise<LikeDTO> {
    return ApiService.post<LikeDTO>(`/posts/${postId}/likes`, {})
  },

  /**
   * Unlike a post
   * @param postId - Post UUID to unlike
   * @returns Promise<void>
   */
  async unlikePost(postId: string): Promise<void> {
    return ApiService.delete<void>(`/posts/${postId}/likes`)
  },

  /**
   * Like a comment
   * @param commentId - Comment UUID to like
   * @returns Promise with created LikeDTO
   */
  async likeComment(commentId: string): Promise<LikeDTO> {
    return ApiService.post<LikeDTO>(`/comments/${commentId}/likes`, {})
  },

  /**
   * Unlike a comment
   * @param commentId - Comment UUID to unlike
   * @returns Promise<void>
   */
  async unlikeComment(commentId: string): Promise<void> {
    return ApiService.delete<void>(`/comments/${commentId}/likes`)
  },

  /**
   * Get all likes for the current user
   * @returns Promise with array of LikeDTO
   */
  async getMyLikes(): Promise<LikeDTO[]> {
    return ApiService.get<LikeDTO[]>('/users/me/likes')
  },

  /**
   * Get likes for a specific post by filtering current user's likes.
   * Note: Backend has no dedicated /likes?postId= endpoint.
   * Uses /users/me/likes and filters by postId.
   * @param postId - Post UUID
   * @returns Promise with array of LikeDTO for this post
   */
  async getPostLikes(postId: string): Promise<LikeDTO[]> {
    const myLikes = await this.getMyLikes()
    return myLikes.filter(like => like.postId === postId)
  },

  /**
   * Get likes for a specific comment by filtering current user's likes.
   * Note: Backend has no dedicated /likes?commentId= endpoint.
   * Uses /users/me/likes and filters by commentId.
   * @param commentId - Comment UUID
   * @returns Promise with array of LikeDTO for this comment
   */
  async getCommentLikes(commentId: string): Promise<LikeDTO[]> {
    const myLikes = await this.getMyLikes()
    return myLikes.filter(like => like.commentId === commentId)
  }
}
