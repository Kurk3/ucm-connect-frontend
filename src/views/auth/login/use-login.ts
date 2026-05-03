import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthApi, UsersApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useTranslations } from '@/i18n'
import { useToast } from 'primevue/usetoast'
import type { Ref } from 'vue'

export interface UseLoginReturn {
  email: Ref<string>
  password: Ref<string>
  error: Ref<string | null>
  loading: Ref<boolean>
  handleLogin: () => Promise<void>
  clearForm: () => void
}

export function useLogin(): UseLoginReturn {
  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useTranslations()
  const toast = useToast()

  // Form state
  const email = ref('')
  const password = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)

  /**
   * Clear form fields
   */
  const clearForm = () => {
    email.value = ''
    password.value = ''
    error.value = null
  }

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    if (!email.value || !password.value) {
      error.value = t('auth.login.errors.required') || 'Prosím vyplňte email a heslo'
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      error.value = t('auth.login.errors.invalid_email') || 'Prosím zadajte platný email'
      return false
    }

    return true
  }

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    error.value = null

    // Validate inputs
    if (!validateForm()) {
      return
    }

    loading.value = true

    try {
      // Call AuthApi login method
      const response = await AuthApi.login({
        email: email.value,
        password: password.value
      })

      // Login successful
      if (response.accessToken) {
        // Update auth store
        authStore.setToken(response.accessToken)

        // Fetch user data
        const me = await UsersApi.getMe();
        authStore.setUser(me);

        // Show success toast
        toast.add({
          severity: 'success',
          summary: 'Úspešne prihlásený',
          detail: `Vitajte späť, ${me.name || me.email}!`,
          life: 3000
        })

        // Clear form
        clearForm()

        // Redirect to home page or intended url
        const redirectPath = router.currentRoute.value.query.redirect as string
        await router.push(redirectPath || '/')
      }
    } catch (err: any) {
      // Handle different error types
      if (err.response?.status === 401) {
        error.value = t('auth.login.errors.credentials') || 'Nesprávne prihlasovacie údaje'
      } else if (err.response?.status === 400) {
        error.value = err.response?.data?.message || t('auth.login.errors.invalid_data') || 'Neplatné údaje'
      } else if (err.code === 'ECONNREFUSED') {
        error.value = t('auth.login.errors.connection') || 'Nie je možné pripojiť sa k serveru. Skontrolujte či backend beží.'
      } else {
        error.value = t('auth.login.errors.general') || 'Nastala chyba pri prihlasovaní. Skúste to prosím neskôr.'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    email,
    password,
    error,
    loading,
    handleLogin,
    clearForm
  }
}