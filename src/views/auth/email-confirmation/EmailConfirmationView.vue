<template>
  <div class="mx-auto flex flex-col items-center justify-center h-dvh gap-10">
    <img class="w-1/4" src="@/assets/img/ucm-connect-logo-white.png" alt="UCM Connect Logo">
    <AuthCard>
      <div class="flex flex-col items-center justify-center p-10 gap-6">
        <!-- Success Icon -->
        <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <i class="pi pi-check text-4xl text-green-600 dark:text-green-400"></i>
        </div>

        <!-- Message -->
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
          {{ t('auth.emailConfirmation.title') }}
        </h1>

        <p class="text-center text-gray-600 dark:text-gray-300 max-w-md">
          {{ t('auth.emailConfirmation.description', { email }) }}
        </p>

        <!-- Verification Code Input -->
        <div class="w-full max-w-md">
          <label for="verificationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('auth.emailConfirmation.verificationCode.label') }}
          </label>
          <FormInput
            id="verificationCode"
            v-model="verificationCode"
            :placeholder="t('auth.emailConfirmation.verificationCode.placeholder')"
            :disabled="verifying"
            class="text-center text-sm font-mono"
            maxlength="6"
            pattern="[0-9]{6}"
          />
          <p v-if="verificationError" class="text-red-500 text-sm mt-2">{{ verificationError }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3 w-full max-w-md">
          <PrimaryButton
            :text="t('auth.emailConfirmation.buttons.verify')"
            icon="pi pi-check"
            @click="verifyEmail"
            :disabled="!verificationCode || verificationCode.length !== 6 || verifying"
          />

          <PrimaryButton
            :text="t('auth.emailConfirmation.buttons.goToLogin')"
            icon="pi pi-sign-in"
            @click="goToLogin"
            severity="secondary"
          />

          <button
            @click="resendEmail"
            :disabled="isResendDisabled"
            class="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ resendButtonText }}
          </button>
        </div>
      </div>
      <AuthFooter />
    </AuthCard>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthApi } from '@/services/api/auth-api'
import AuthCard from '../components/AuthCard.vue'
import AuthFooter from '../components/AuthFooter.vue'
import FormInput from '../components/FormInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useTranslations } from '@/i18n'

const { t } = useTranslations()
const toast = useToast()

const router = useRouter()
const route = useRoute()

const email = ref('')
const verificationCode = ref('')
const verificationError = ref('')
const verifying = ref(false)
const resendCooldown = ref(0)
const resendLoading = ref(false)

onMounted(() => {
  // Get email from query params
  email.value = route.query.email as string || ''

  // If no email, redirect to register
  if (!email.value) {
    router.push('/register')
  }
})

const isResendDisabled = computed(() => {
  return resendCooldown.value > 0 || resendLoading.value
})

const resendButtonText = computed(() => {
  if (resendCooldown.value > 0) {
    return t('auth.emailConfirmation.resend.cooldown', { seconds: resendCooldown.value })
  }
  if (resendLoading.value) {
    return t('auth.emailConfirmation.resend.sending')
  }
  return t('auth.emailConfirmation.resend.default')
})

const goToLogin = () => {
  router.push('/login')
}

const verifyEmail = async () => {
  verificationError.value = ''

  if (!verificationCode.value || verificationCode.value.length !== 6) {
    verificationError.value = t('auth.emailConfirmation.errors.invalidCode')
    return
  }

  verifying.value = true

  try {
    await AuthApi.verifyEmail({
      email: email.value,
      verificationCode: verificationCode.value
    })

    toast.add({
      severity: 'success',
      summary: 'Email overený',
      detail: t('auth.emailConfirmation.success.verified'),
      life: 3000
    })

    // Redirect to login after a short delay
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error: any) {
    if (error.response?.status === 400) {
      verificationError.value = t('auth.emailConfirmation.errors.verificationFailed')
    } else {
      verificationError.value = t('auth.emailConfirmation.errors.genericError')
    }
    
    toast.add({
      severity: 'error',
      summary: 'Chyba overenia',
      detail: verificationError.value,
      life: 5000
    })
  } finally {
    verifying.value = false
  }
}

const resendEmail = async () => {
  if (isResendDisabled.value) return

  resendLoading.value = true

  try {
    // TODO: Implement resend API call when backend supports it

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Set cooldown
    resendCooldown.value = 60

    // Countdown timer
    const timer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    toast.add({
      severity: 'success',
      summary: 'Email odoslaný',
      detail: t('auth.emailConfirmation.success.resent'),
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: t('auth.emailConfirmation.errors.resendFailed'),
      life: 5000
    })
  } finally {
    resendLoading.value = false
  }
}
</script>