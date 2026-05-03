import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ApiService from '@/services/api-service'
import { AuthApi } from '@/services/api/auth-api'
import type { UserDTO } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserDTO | null>(null)
  const token = ref(ApiService.getAuthToken())
  const isAuthenticated = computed(() => !!token.value)

  // Role-based access control helpers
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isModerator = computed(() => user.value?.role === 'MODERATOR')
  const isAdminOrModerator = computed(() =>
    user.value?.role === 'ADMIN' || user.value?.role === 'MODERATOR'
  )

  function setToken(newToken: string) {
    token.value = newToken
    ApiService.setAuthToken(newToken)
  }

  function setUser(newUser: UserDTO) {
    user.value = newUser
    ApiService.setUserId(newUser.id)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    ApiService.setAuthToken(null)
    ApiService.setUserId(null)
    localStorage.removeItem('user')
  }

  async function logout() {
    try {
      await AuthApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      // Optional: Redirect to login or handle post-logout logic
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isModerator,
    isAdminOrModerator,
    setToken,
    setUser,
    clearAuth,
    logout
  }
})
