/**
 * Main API types barrel export
 * Re-exports all type definitions for easy importing
 */

// Auth types
export type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  AuthErrorResponse
} from './auth'

// Common types
export type {
  ErrorResponse,
  Pagination,
  FileInfo,
  Stats,
  ListResponse
} from './common'

// User types
export type {
  UserDTO,
  UpdateUserRequest
} from './user'

// Post types
export type {
  AuthorDTO,
  SubjectInfoDTO,
  FileInfoDTO,
  StatsDTO,
  PostDTO,
  PostDetailDTO,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters
} from './post'

// Comment types
export type {
  CommentDTO,
  CommentDetailDTO,
  CommentListResponse,
  CreateCommentRequest,
  UpdateCommentRequest
} from './comment'

// Subject types
export type {
  SubjectDTO,
  SubjectListResponse,
  CreateSubjectRequest,
  UpdateSubjectRequest
} from './subject'

// Like types
export type {
  LikeDTO
} from './like'
