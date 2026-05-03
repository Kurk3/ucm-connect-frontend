/**
 * Subjects API Module
 * Handles all subject-related API calls
 */

import ApiService from '../api-service'
import type {
  SubjectDTO,
  SubjectListResponse,
  CreateSubjectRequest,
  UpdateSubjectRequest
} from '@/types/api'

export const SubjectsApi = {
  /**
   * Fetch all subjects
   * @returns Promise with array of SubjectDTO
   */
  async fetchSubjects(): Promise<SubjectDTO[]> {
    const response = await ApiService.get<SubjectListResponse>('/subjects')
    return response.subjects || []
  },

  /**
   * Get subject by ID
   * @param id - Subject UUID
   * @returns Promise with SubjectDTO
   */
  async getSubject(id: string): Promise<SubjectDTO> {
    return ApiService.get<SubjectDTO>(`/subjects/${id}`)
  },

  /**
   * Create a new subject
   * @param data - Subject data (name, description)
   * @returns Promise with created SubjectDTO
   */
  async createSubject(data: CreateSubjectRequest): Promise<SubjectDTO> {
    return ApiService.post<SubjectDTO>('/subjects', data)
  },

  /**
   * Update an existing subject
   * @param id - Subject UUID
   * @param data - Updated subject data (name, description)
   * @returns Promise with updated SubjectDTO
   */
  async updateSubject(id: string, data: UpdateSubjectRequest): Promise<SubjectDTO> {
    return ApiService.put<SubjectDTO>(`/subjects/${id}`, data)
  },

  /**
   * Delete a subject
   * @param id - Subject UUID
   * @returns Promise<void>
   */
  async deleteSubject(id: string): Promise<void> {
    return ApiService.delete<void>(`/subjects/${id}`)
  },

  /**
   * Fetch subject by name
   * @param name - Subject name
   * @returns Promise with SubjectDTO or null if not found
   */
  async fetchSubjectByName(name: string): Promise<SubjectDTO | null> {
    const subjects = await this.fetchSubjects();
    return subjects.find(subject => subject.name === name) || null;
  }
}
