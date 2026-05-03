/**
 * Subject-related types
 * Based on SubjectDTO.java and SubjectListResponse.java
 */

/**
 * Subject DTO
 */
export interface SubjectDTO {
  id: string // UUID
  name: string
  description?: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

/**
 * Response wrapper for list of subjects
 */
export interface SubjectListResponse {
  subjects: SubjectDTO[]
  total: number
}

/**
 * Request to create a new subject
 */
export interface CreateSubjectRequest {
  name: string
  description?: string
}

/**
 * Request to update an existing subject
 */
export interface UpdateSubjectRequest {
  name?: string
  description?: string
}
