import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthApi } from '@/services/api/auth-api'
import { useToast } from 'primevue/usetoast'
import type { Ref, ComputedRef } from 'vue'
import { PASSWORD_REQUIREMENTS, validatePassword, parseBackendErrors } from '@/utils/password-validation'

export interface PasswordRequirementStatus {
  key: string
  label: string
  met: boolean
}

export interface UseRegisterReturn {
  email: Ref<string>
  password: Ref<string>
  confirmPassword: Ref<string>
  error: Ref<string | null>
  loading: Ref<boolean>
  passwordRequirements: ComputedRef<PasswordRequirementStatus[]>
  handleRegister: () => Promise<void>
  clearForm: () => void
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter()
  const toast = useToast()

  // Form state
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)

  const passwordRequirements = computed<PasswordRequirementStatus[]>(() =>
    PASSWORD_REQUIREMENTS.map((req) => ({
      key: req.key,
      label: req.label,
      met: password.value.length > 0 ? req.test(password.value) : false
    }))
  )

  /**
   * Clear form fields
   */
  const clearForm = () => {
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    error.value = null
  }

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    // Check if fields are filled
    if (!email.value || !password.value || !confirmPassword.value) {
      error.value = 'Prosím vyplňte všetky polia'
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      error.value = 'Prosím zadajte platný email'
      return false
    }

    // Password complexity validation
    const passwordError = validatePassword(password.value)
    if (passwordError) {
      error.value = passwordError
      return false
    }

    // Password match validation
    if (password.value !== confirmPassword.value) {
      error.value = 'Heslá sa nezhodujú'
      return false
    }

    return true
  }

  /**
   * Handle registration form submission
   */
  const handleRegister = async () => {
    error.value = null

    // Validate inputs
    if (!validateForm()) {
      return
    }

    loading.value = true

    try {
      // Generate name and nickname from email
      const name = email.value.split('@')[0] ?? email.value
      const nickName = name

      // Call AuthApi register method
      await AuthApi.register({
        email: email.value,
        password: password.value,
        name,
        nickName
      })

      // Registration successful
      // Store email before clearing form
      const registeredEmail = email.value

      // Show success toast
      toast.add({
        severity: 'success',
        summary: 'Úspešná registrácia',
        detail: 'Overovací kód bol odoslaný na váš email.',
        life: 4000
      })

      // Clear form
      clearForm()

      // Navigate to email confirmation page with email as query param
      await router.push({
        path: '/email-confirmation',
        query: { email: registeredEmail }
      })
    } catch (err: any) {
      // Handle different error types
      if (err.response?.status === 409) {
        error.value = 'Používateľ s týmto emailom už existuje'
      } else if (err.response?.status === 400) {
        error.value = parseBackendErrors(err.response?.data) || 'Neplatné údaje'
      } else if (err.code === 'ECONNREFUSED') {
        error.value = 'Nie je možné pripojiť sa k serveru. Skontrolujte či backend beží.'
      } else {
        error.value = 'Nastala chyba pri registrácii. Skúste to prosím neskôr.'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    email,
    password,
    confirmPassword,
    error,
    loading,
    passwordRequirements,
    handleRegister,
    clearForm
  }
}