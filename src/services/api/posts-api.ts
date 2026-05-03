/**
 * Posts API Module
 * Handles all post-related API calls
 */

import ApiService from '../api-service'
import type {
  PostDTO,
  PostDetailDTO,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters
} from '@/types/api'

export const PostsApi = {
  /**
   * Fetch list of posts with pagination and optional filters
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20, max: 100)
   * @param filters - Optional filters (subjectId, userId)
   * @returns Promise with array of PostDTO
   */
  async fetchPosts(
    page: number = 1,
    limit: number = 20,
    filters?: PostFilters
  ): Promise<PostDTO[]> {
    const params: Record<string, any> = { page, limit }

    if (filters?.subjectId) {
      params.subjectId = filters.subjectId
    }
    if (filters?.userId) {
      params.userId = filters.userId
    }

    const response = await ApiService.get<PostListResponse>('/posts', { params })
    return response.posts || []
  },

  /**
   * Get detailed information about a specific post
   * @param id - Post UUID
   * @returns Promise with PostDTO (transformed from PostDetailDTO)
   */
  async getPost(id: string): Promise<PostDTO> {
    const response = await ApiService.get<PostDetailDTO>(`/posts/${id}`)
    
    // Transform PostDetailDTO to PostDTO for compatibility with PostCard
    const post: PostDTO = {
      id: response.id,
      title: response.title,
      userId: response.author?.id || (response as any).userId || (response as any).authorSub,
      userName: response.author?.name || (response as any).userName,
      numberOfLikes: response.stats?.likes || (response as any).numberOfLikes || 0,
      numberOfComments: response.stats?.comments || (response as any).numberOfComments || 0,
      isPublished: response.isPublished,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    }
    if (response.description != null) post.description = response.description
    if (response.subject?.id != null) post.subjectId = response.subject.id
    if (response.subject?.name != null) post.subjectName = response.subject.name
    if (response.file?.type != null) post.fileType = response.file.type
    if (response.file?.url != null) post.fileUrl = response.file.url
    if (response.file?.size != null) post.fileSize = response.file.size
    return post
  },

  /**
   * Create a new post (JSON body, no files).
   * Files are uploaded separately via FilesApi.uploadFile() after post creation.
   * @param data - Post data (title, description, subjectId)
   * @returns Promise with created PostDTO
   */
   async createPost(
    data: CreatePostRequest
  ): Promise<PostDTO> {
    return ApiService.post<PostDTO>('/posts', data)
  },

  /**
   * Update an existing post
   * @param id - Post UUID
   * @param data - Updated post data (title, description, subjectId)
   * @returns Promise with updated PostDTO
   */
  async updatePost(id: string, data: UpdatePostRequest): Promise<PostDTO> {
    return ApiService.put<PostDTO>(`/posts/${id}`, data)
  },

  /**
   * Delete a post
   * @param id - Post UUID
   * @returns Promise<void>
   */
  async deletePost(id: string): Promise<void> {
    return ApiService.delete<void>(`/posts/${id}`)
  }
}
