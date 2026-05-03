import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

/**
 * Get API base URL from environment variable
 * Defaults to localhost:8080 for development
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

/**
 * API Service Interface
 */
interface ApiServiceType {
  apiURL: string
  init(customApiURL?: string | null): void
  setBaseURL(): void
  setDefaultConfig(): void
  setupInterceptors(): void
  setAuthToken(token: string | null): void
  setUserId(userId: string | null): void
  getAuthToken(): string | null
  getUserId(): string | null
  get<T = any>(resource: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(resource: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(resource: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(resource: string, data?: any, config?: AxiosRequestConfig): Promise<T>
}

/**
 * Core API Service
 * Handles all HTTP requests to the backend API
 */
const ApiService: ApiServiceType = {
  apiURL: API_BASE_URL,

  /**
   * Initialize the API service
   * @param customApiURL - Optional custom API URL
   */
  init(customApiURL: string | null = null): void {
    this.apiURL = customApiURL || API_BASE_URL

    this.setBaseURL()
    this.setDefaultConfig()
    this.setupInterceptors()
  },

  /**
   * Set Axios base URL
   */
  setBaseURL(): void {
    axios.defaults.baseURL = this.apiURL
  },

  /**
   * Configure default Axios settings
   */
  setDefaultConfig(): void {
    axios.defaults.withCredentials = true
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.timeout = 30000 // 30 seconds timeout
  },

  /**
   * Set authentication token
   * @param token - JWT access token from AWS Cognito login or null to clear
   */
  setAuthToken(token: string | null): void {
    if (token) {
      localStorage.setItem('authToken', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('authToken')
      delete axios.defaults.headers.common['Authorization']
    }
  },

  /**
   * Set current user ID
   * @param userId - User UUID or null to clear
   */
  setUserId(userId: string | null): void {
    if (userId) {
      localStorage.setItem('userId', userId)
    } else {
      localStorage.removeItem('userId')
    }
  },

  /**
   * Get current auth token
   * @returns JWT token or null
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  },

  /**
   * Get current user ID
   * @returns User UUID or null
   */
  getUserId(): string | null {
    return localStorage.getItem('userId')
  },

  /**
   * Setup Axios request/response interceptors
   */
  setupInterceptors(): void {
    // Request interceptor - add auth token
    axios.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken()
        if (token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        config.withCredentials = true
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle common errors
    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error)

        // Handle timeout errors
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          console.error('Request timeout - please try again')
          return Promise.reject(error)
        }

        // Handle network errors
        if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || !error.response) {
          console.error('Network error - check your connection or backend server')
          return Promise.reject(error)
        }

        // Handle HTTP errors
        if (error.response) {
          const status = error.response.status

          if (status === 401) {
            // Unauthorized - clear auth data and redirect to login
            console.error('Unauthorized (401) - clearing auth and redirecting to login')
            const authStore = useAuthStore()
            authStore.clearAuth()
            if (router.currentRoute.value.path !== '/login') {
              router.push({ path: '/login', query: { reason: 'unauthorized' } }).catch((err: Error) => {
                console.error('Redirect failed:', err)
              })
            }
          } else if (status === 403) {
            console.error('Forbidden (403) - insufficient permissions')
          } else if (status === 404) {
            console.error('Not Found (404) - resource does not exist')
          } else if (status === 429) {
            console.warn('Rate limit hit (429) - too many requests')
          } else if (status >= 500) {
            console.error(`Server Error (${status}) - backend error`)
          } else {
            console.error(`HTTP Error (${status})`)
          }
        }

        return Promise.reject(error)
      }
    )
  },

  /**
   * GET request
   * @param resource - API endpoint
   * @param config - Axios request config
   * @returns Promise with typed response data
   */
  async get<T = any>(resource: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(resource, {
        ...config,
        withCredentials: true
      })
      return response.data
    } catch (error) {
      // Additional client-side error handling
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401 && router.currentRoute.value.path !== '/login') {
        await router.push('/login')
      }
      throw error
    }
  },

  /**
   * POST request
   * @param resource - API endpoint
   * @param data - Request body data
   * @param config - Axios request config
   * @returns Promise with typed response data
   */
  async post<T = any>(resource: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(resource, data, {
        ...config,
        withCredentials: true,
        headers: {
          ...config.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401 && router.currentRoute.value.path !== '/login') {
        await router.push('/login')
      }
      throw error
    }
  },

  /**
   * PUT request
   * @param resource - API endpoint
   * @param data - Request body data
   * @param config - Axios request config
   * @returns Promise with typed response data
   */
  async put<T = any>(resource: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put(resource, data, {
        ...config,
        withCredentials: true,
        headers: {
          ...config.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401 && router.currentRoute.value.path !== '/login') {
        await router.push('/login')
      }
      throw error
    }
  },

  /**
   * DELETE request
   * @param resource - API endpoint
   * @param data - Optional request body data (for DELETE with body)
   * @param config - Axios request config
   * @returns Promise with typed response data
   */
  async delete<T = any>(resource: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(resource, {
        data,
        ...config,
        withCredentials: true,
        headers: {
          ...config.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401 && router.currentRoute.value.path !== '/login') {
        await router.push('/login')
      }
      throw error
    }
  }
}

// Initialize API service on load
ApiService.init()

// Restore auth token if it exists
const existingToken = localStorage.getItem('authToken')
if (existingToken) {
  ApiService.setAuthToken(existingToken)
}

export default ApiService
