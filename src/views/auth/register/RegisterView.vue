<template>
  <div class="mx-auto flex flex-col items-center justify-center h-dvh gap-10 overflow-hidden">
    <img class="w-1/4" src="@/assets/img/ucm-connect-logo-white.png" alt="UCM Connect Logo">
    <AuthCard>
      <AuthHeader :title="t('auth.register.title')" />
      <AuthForm
        formType="register"
        v-model:email="email"
        v-model:password="password"
        v-model:confirmPassword="confirmPassword"
        :loading="loading"
        :error="error"
        :passwordRequirements="passwordRequirements"
        @submit="handleRegister"
      />
      <AuthFooter />
    </AuthCard>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import AuthCard from '../components/AuthCard.vue'
import AuthFooter from '../components/AuthFooter.vue'
import AuthHeader from '../components/AuthHeader.vue'
import AuthForm from '../components/AuthForm.vue'
import Toast from 'primevue/toast'
import { useRegister } from './use-register'
import { useTranslations } from '@/i18n'

// Use the register composable
const { email, password, confirmPassword, error, loading, passwordRequirements, handleRegister } = useRegister()

// Use translations
const { t } = useTranslations()
</script>