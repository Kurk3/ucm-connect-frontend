/**
 * Files API Module
 * Handles all file-related API calls for posts
 *
 * Backend extracts userId from JWT token automatically.
 * Files are stored in AWS S3 with pre-signed URLs (valid 1 hour).
 */

import ApiService from '../api-service'

/**
 * File metadata response from backend
 */
export interface FileDTO {
  id: string
  postId: string
  userId?: string
  userName?: string
  fileName: string
  fileType: string
  fileSize: number
  mimeType?: string
  url?: string
  createdAt: string
}

/**
 * File download response from backend
 * GET /files/{fileId}/download returns JSON with pre-signed URL
 */
export interface FileDownloadResponse {
  id: string
  fileName: string
  downloadUrl: string
  expiresIn: string
}

/**
 * File upload response from backend
 */
export interface FileUploadResponse {
  id: string
  postId: string
  fileName: string
  fileType: string
  fileSize: number
  mimeType: string
  createdAt: string
  message: string
}

export const FilesApi = {
  /**
   * Get all files for a specific post
   * @param postId - Post UUID
   * @returns Promise with array of FileDTO
   */
  async getPostFiles(postId: string): Promise<FileDTO[]> {
    return ApiService.get<FileDTO[]>(`/posts/${postId}/files`)
  },

  /**
   * Upload a file to a post
   * Backend extracts userId from JWT token automatically
   * @param postId - Post UUID
   * @param file - File to upload
   * @returns Promise with FileUploadResponse
   */
  async uploadFile(postId: string, file: File): Promise<FileUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    return ApiService.post<FileUploadResponse>(`/posts/${postId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Get file count for a specific post
   * Backend returns a plain Long number, not a JSON object
   * @param postId - Post UUID
   * @returns Promise with file count number
   */
  async getFileCount(postId: string): Promise<number> {
    return ApiService.get<number>(`/posts/${postId}/files/count`)
  },

  /**
   * Get file metadata by file ID
   * @param fileId - File UUID
   * @returns Promise with FileDTO
   */
  async getFile(fileId: string): Promise<FileDTO> {
    return ApiService.get<FileDTO>(`/files/${fileId}`)
  },

  /**
   * Get download info for a file (pre-signed S3 URL)
   * Backend returns JSON with downloadUrl, not a blob
   * @param fileId - File UUID
   * @returns Promise with FileDownloadResponse containing pre-signed URL
   */
  async downloadFile(fileId: string): Promise<FileDownloadResponse> {
    return ApiService.get<FileDownloadResponse>(`/files/${fileId}/download`)
  },

  /**
   * Delete a file
   * Backend extracts userId from JWT token automatically
   * @param fileId - File UUID
   * @returns Promise<void>
   */
  async deleteFile(fileId: string): Promise<void> {
    return ApiService.delete<void>(`/files/${fileId}`)
  },

  /**
   * Get download URL for a file
   * @param fileId - File UUID
   * @returns Download URL string
   */
  getDownloadUrl(fileId: string): string {
    return `${ApiService.apiURL}/files/${fileId}/download`
  }
}
