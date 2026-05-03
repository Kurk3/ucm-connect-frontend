/**
 * Common types shared across the API
 */

/**
 * Standard error response from the API
 */
export interface ErrorResponse {
  error: string
  message: string
  details?: Record<string, string>
}

/**
 * Pagination metadata for list responses
 */
export interface Pagination {
  total: number
  page: number
  limit: number
}

/**
 * File information (nested in PostDetailDTO)
 */
export interface FileInfo {
  type: 'pdf' | 'image' | 'zip'
  url: string
  size: number
}

/**
 * Statistics (nested in PostDetailDTO)
 * Matches backend StatsDTO: likes, comments, views
 */
export interface Stats {
  likes: number
  comments: number
  views: number
}

/**
 * Generic list response with pagination
 */
export interface ListResponse<T> {
  total: number
  page: number
  limit: number
  data: T[]
}
