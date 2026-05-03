import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthApi } from '@/services/api/auth-api'
import { useToast } from 'primevue/usetoast'
import type { Ref, ComputedRef } from 'vue'
import { PASSWORD_REQUIREMENTS, validatePassword, parseBackendErrors } from '@/utils/password-validation'
import type { PasswordRequirementStatus } from '@/views/auth/register/use-register'

export interface UseResetPasswordReturn {
  email: Ref<string>
  confirmationCode: Ref<string>
  password: Ref<string>
  confirmPassword: Ref<string>
  error: Ref<string | null>
  loading: Ref<boolean>
  step: Ref<'email' | 'reset'>
  passwordRequirements: ComputedRef<PasswordRequirementStatus[]>
  handleForgotPassword: () => Promise<void>
  handleResetPassword: () => Promise<void>
}

export function useResetPassword(): UseResetPasswordReturn {
  const router = useRouter()
  const toast = useToast()

  const email = ref('')
  const confirmationCode = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)
  const step = ref<'email' | 'reset'>('email')

  const passwordRequirements = computed<PasswordRequirementStatus[]>(() =>
    PASSWORD_REQUIREMENTS.map((req) => ({
      key: req.key,
      label: req.label,
      met: password.value.length > 0 ? req.test(password.value) : false
    }))
  )

  const handleForgotPassword = async () => {
    error.value = null

    if (!email.value) {
      error.value = 'Prosím vyplňte email'
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      error.value = 'Prosím zadajte platný email'
      return
    }

    loading.value = true

    try {
      await AuthApi.forgotPassword({ email: email.value })

      toast.add({
        severity: 'success',
        summary: 'Kód odoslaný',
        detail: 'Overovací kód bol odoslaný na váš email.',
        life: 4000
      })

      step.value = 'reset'
    } catch (err: any) {
      if (err.response?.status === 400) {
        error.value = parseBackendErrors(err.response?.data) || 'Neplatné údaje'
      } else if (err.code === 'ECONNREFUSED') {
        error.value = 'Nie je možné pripojiť sa k serveru.'
      } else {
        error.value = 'Nastala chyba. Skúste to prosím neskôr.'
      }
    } finally {
      loading.value = false
    }
  }

  const handleResetPassword = async () => {
    error.value = null

    if (!confirmationCode.value) {
      error.value = 'Prosím zadajte overovací kód'
      return
    }

    if (!password.value || !confirmPassword.value) {
      error.value = 'Prosím vyplňte heslo'
      return
    }

    const passwordError = validatePassword(password.value)
    if (passwordError) {
      error.value = passwordError
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Heslá sa nezhodujú'
      return
    }

    loading.value = true

    try {
      await AuthApi.resetPassword({
        email: email.value,
        confirmationCode: confirmationCode.value,
        newPassword: password.value
      })

      toast.add({
        severity: 'success',
        summary: 'Heslo zmenené',
        detail: 'Vaše heslo bolo úspešne zmenené. Môžete sa prihlásiť.',
        life: 4000
      })

      await router.push('/login')
    } catch (err: any) {
      if (err.response?.status === 400) {
        error.value = parseBackendErrors(err.response?.data) || 'Neplatný kód alebo heslo'
      } else if (err.code === 'ECONNREFUSED') {
        error.value = 'Nie je možné pripojiť sa k serveru.'
      } else {
        error.value = 'Nastala chyba pri zmene hesla. Skúste to prosím neskôr.'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    email,
    confirmationCode,
    password,
    confirmPassword,
    error,
    loading,
    step,
    passwordRequirements,
    handleForgotPassword,
    handleResetPassword
  }
}
