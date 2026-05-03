/**
 * Comment-related types
 * Based on CommentDTO.java and CommentDetailDTO.java
 */

import type { AuthorDTO, StatsDTO } from './post'

/**
 * Basic comment DTO (used in lists)
 */
export interface CommentDTO {
  id: string // UUID
  postId: string // UUID
  userId: string // UUID
  userName: string
  content: string
  numberOfLikes: number
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

/**
 * Detailed comment DTO with nested structure
 */
export interface CommentDetailDTO {
  id: string // UUID
  postId: string // UUID
  author: AuthorDTO
  content: string
  stats: StatsDTO
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

/**
 * Response wrapper for paginated list of comments
 */
export interface CommentListResponse {
  comments: CommentDTO[]
  total: number
  page: number
  limit: number
}

/**
 * Request to create a new comment
 */
export interface CreateCommentRequest {
  content: string
}

/**
 * Request to update an existing comment
 */
export interface UpdateCommentRequest {
  content: string
}
