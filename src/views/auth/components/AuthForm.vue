<template>
  <div class="flex flex-col items-center justify-center flex-grow">
    <form @submit.prevent="$emit('submit')" class="w-full max-w-lg px-4 sm:px-6">
      <!-- Error message -->
      <Message v-if="error" severity="error">{{ error }}</Message>

      <!-- Email input -->
      <div class="my-4">
        <FormInput
          id="email"
          :label="t('auth.form.email.label')"
          type="email"
          :modelValue="email"
          @update:modelValue="$emit('update:email', $event)"
          :placeholder="t('auth.form.email.placeholder')"
          :disabled="loading"
          required
        />
      </div>

      <!-- Password input -->
      <div class="mb-6">
        <PasswordInput
          id="password"
          :label="t('auth.form.password.label')"
          :modelValue="password"
          @update:modelValue="$emit('update:password', $event)"
          :placeholder="t('auth.form.password.placeholder')"
          :disabled="loading"
          required
        />
      </div>

      <!-- Password requirements checklist (only for register) -->
      <ul v-if="formType === 'register' && passwordRequirements && password.length > 0" class="mb-4 space-y-1 text-sm px-1">
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

      <!-- Confirm Password input (only for register) -->
      <div v-if="formType === 'register'" class="mb-6">
        <PasswordInput
          id="confirmPassword"
          :label="t('auth.form.confirmPassword.label')"
          :modelValue="confirmPassword ?? ''"
          @update:modelValue="$emit('update:confirmPassword', $event)"
          :placeholder="t('auth.form.confirmPassword.placeholder')"
          :disabled="loading"
          required
        />
      </div>

      <!-- Form actions -->
      <div class="flex flex-col items-end gap-4 mb-6 w-full">
        <!-- Login links -->
        <div v-if="formType === 'login'" class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-0 sm:justify-between w-full">
          <router-link to="/register" class="text-sm text-blue-600 hover:underline">
            {{ t('auth.form.links.noAccount') }}
          </router-link>
          <router-link to="/reset-password" class="text-sm text-blue-600 hover:underline">
            {{ t('auth.form.links.forgotPassword') }}
          </router-link>
        </div>

        <!-- Register link -->
        <div v-if="formType === 'register'" class="flex flex-row items-center justify-between w-full">
          <router-link to="/login" class="text-sm text-blue-600 hover:underline">
            {{ t('auth.form.links.hasAccount') }}
          </router-link>
        </div>

        <PrimaryButton
          type="submit"
          :icon="formType === 'login' ? 'pi pi-sign-in' : 'pi pi-user-plus'"
          :text="buttonText"
          :disabled="loading"
        />
      </div>
    </form>

    <!-- Legal text -->
    <AuthLegalText />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import PrimaryButton from '@/components/PrimaryButton.vue'
import FormInput from './FormInput.vue'
import PasswordInput from './PasswordInput.vue'
import AuthLegalText from './AuthLegalText.vue'
import { useTranslations } from '@/i18n'

const { t } = useTranslations()

interface PasswordRequirementStatus {
  key: string
  label: string
  met: boolean
}

interface Props {
  formType: 'login' | 'register'
  email: string
  password: string
  confirmPassword?: string
  loading: boolean
  error: string | null
  passwordRequirements?: PasswordRequirementStatus[]
}

const props = defineProps<Props>()

defineEmits<{
  'update:email': [value: string]
  'update:password': [value: string]
  'update:confirmPassword': [value: string]
  'submit': []
}>()

const buttonText = computed(() => {
  if (props.loading) {
    return props.formType === 'login' ? t('auth.login.buttonLoading') : t('auth.register.buttonLoading')
  }
  return props.formType === 'login' ? t('auth.login.button') : t('auth.register.button')
})
</script>