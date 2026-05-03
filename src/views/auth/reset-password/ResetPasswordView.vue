<template>
  <div class="mx-auto flex flex-col items-center justify-center h-dvh gap-10 overflow-hidden">
    <img class="w-3/4 md:w-1/4" src="@/assets/img/ucm-connect-logo-white.png" alt="UCM Connect Logo">
    <AuthCard>
      <AuthHeader :title="step === 'email' ? 'Obnova hesla' : 'Nové heslo'" />

      <div class="flex flex-col items-center justify-center flex-grow">
        <Message v-if="error" severity="error" class="w-full max-w-lg mb-4">{{ error }}</Message>

        <!-- Step 1: Enter email -->
        <form v-if="step === 'email'" @submit.prevent="handleForgotPassword" class="w-full max-w-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Zadajte emailovú adresu, na ktorú vám pošleme overovací kód pre obnovu hesla.
          </p>

          <div class="my-4">
            <FormInput
              id="email"
              :label="t('auth.form.email.label')"
              type="email"
              v-model="email"
              :placeholder="t('auth.form.email.placeholder')"
              :disabled="loading"
              required
            />
          </div>

          <div class="flex flex-col items-end gap-4 mb-6 w-full">
            <div class="flex flex-row items-center justify-start w-full">
              <router-link to="/login" class="text-sm text-blue-600 hover:underline">
                Späť na prihlásenie
              </router-link>
            </div>
            <PrimaryButton
              type="submit"
              icon="pi pi-envelope"
              :text="loading ? 'Odosielam...' : 'Odoslať kód'"
              :disabled="loading"
            />
          </div>
        </form>

        <!-- Step 2: Enter code + new password -->
        <form v-else @submit.prevent="handleResetPassword" class="w-full max-w-lg">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Zadajte overovací kód z emailu a nové heslo.
          </p>

          <div class="my-4">
            <FormInput
              id="confirmationCode"
              label="Overovací kód"
              v-model="confirmationCode"
              placeholder="Zadajte 6-miestny kód"
              :disabled="loading"
              required
            />
          </div>

          <div class="mb-6">
            <PasswordInput
              id="password"
              :label="t('auth.form.password.label')"
              v-model="password"
              :placeholder="t('auth.form.password.placeholder')"
              :disabled="loading"
              required
            />
          </div>

          <!-- Password requirements checklist -->
          <ul v-if="password.length > 0" class="mb-4 space-y-1 text-sm px-1">
            <li
              v-for="req in passwordRequirements"
              :key="req.key"
              class="flex items-center gap-2"
              :class="req.met ? 'text-green-600' : 'text-red-500'"
            >
              <i :class="req.met ? 'pi pi-check-circle' : 'pi pi-times-circle'" class="text-xs" />
              {{ req.label }}
            </li>
          </ul>

          <div class="mb-6">
            <PasswordInput
              id="confirmPassword"
              :label="t('auth.form.confirmPassword.label')"
              v-model="confirmPassword"
              :placeholder="t('auth.form.confirmPassword.placeholder')"
              :disabled="loading"
              required
            />
          </div>

          <div class="flex flex-col items-end gap-4 mb-6 w-full">
            <div class="flex flex-row items-center justify-start w-full">
              <router-link to="/login" class="text-sm text-blue-600 hover:underline">
                Späť na prihlásenie
              </router-link>
            </div>
            <PrimaryButton
              type="submit"
              icon="pi pi-check"
              :text="loading ? 'Mením heslo...' : 'Zmeniť heslo'"
              :disabled="loading"
            />
          </div>
        </form>

        <AuthLegalText />
      </div>

      <AuthFooter />
    </AuthCard>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import AuthCard from '../components/AuthCard.vue'
import AuthFooter from '../components/AuthFooter.vue'
import AuthHeader from '../components/AuthHeader.vue'
import AuthLegalText from '../components/AuthLegalText.vue'
import FormInput from '../components/FormInput.vue'
import PasswordInput from '../components/PasswordInput.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useTranslations } from '@/i18n'
import { useResetPassword } from './use-reset-password'

const { t } = useTranslations()

const {
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
} = useResetPassword()
</script>
