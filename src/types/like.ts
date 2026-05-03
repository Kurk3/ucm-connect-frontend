/**
 * Like-related types
 * Based on LikeDTO.java
 */

/**
 * Like DTO (response only)
 */
export interface LikeDTO {
  id: string // UUID
  userId: string // UUID
  postId?: string // UUID (if like is on a post)
  commentId?: string // UUID (if like is on a comment)
  createdAt: string // ISO 8601
}
