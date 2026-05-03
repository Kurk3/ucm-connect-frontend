/**
 * Post-related types
 * Based on PostDTO.java, PostDetailDTO.java, and nested DTOs
 */

/**
 * Author information (nested in PostDetailDTO)
 */
export interface AuthorDTO {
  id: string // UUID
  name: string
  email: string
}

/**
 * Subject information (nested in PostDetailDTO)
 */
export interface SubjectInfoDTO {
  id: string // UUID
  name: string
  description?: string
}

/**
 * File information (nested in PostDetailDTO)
 */
export interface FileInfoDTO {
  type: 'pdf' | 'image' | 'zip'
  url: string
  size: number
  downloadUrl?: string // Pre-signed URL (temporary)
}

/**
 * Engagement statistics (nested in PostDetailDTO)
 */
export interface StatsDTO {
  likes: number
  comments: number
  views: number
}

/**
 * Basic post DTO (used in lists)
 */
export interface PostDTO {
  id: string // UUID
  title: string
  description?: string
  userId: string // UUID
  userName: string
  subjectId?: string // UUID
  subjectName?: string
  fileType?: 'pdf' | 'image' | 'zip'
  fileUrl?: string
  fileSize?: number
  numberOfLikes: number
  numberOfComments: number
  isPublished: boolean
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

/**
 * Detailed post DTO with nested structure (used for single post retrieval)
 */
export interface PostDetailDTO {
  id: string // UUID
  title: string
  description?: string
  author: AuthorDTO
  subject?: SubjectInfoDTO
  file?: FileInfoDTO
  stats: StatsDTO
  isPublished: boolean
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

/**
 * Response wrapper for paginated list of posts
 */
export interface PostListResponse {
  posts: PostDTO[]
  total: number
  page: number
  limit: number
}

/**
 * Request to create a new post
 */
export interface CreatePostRequest {
  title: string
  description?: string
  subjectId?: string // UUID
  // file is handled separately as FormData
}

/**
 * Request to update an existing post
 */
export interface UpdatePostRequest {
  title?: string
  description?: string
  subjectId?: string // UUID
}

/**
 * Filters for fetching posts
 */
export interface PostFilters {
  subjectId?: string // UUID
  userId?: string // UUID
}
