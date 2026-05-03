<template>
  <div class="mx-auto flex flex-col items-center justify-center h-dvh gap-5 sm:gap-10 overflow-hidden px-4 sm:px-0">
    <img class="w-3/4 md:w-1/4" src="@/assets/img/ucm-connect-logo-white.png" alt="UCM Connect Logo">
    <AuthCard>
      <Message v-if="unauthorizedMessage" severity="warn" :closable="false" class="mb-4">
        {{ unauthorizedMessage }}
      </Message>
      <AuthHeader :title="t('auth.login.title')" />
      <AuthForm
        formType="login"
        v-model:email="email"
        v-model:password="password"
        :loading="loading"
        :error="error"
        @submit="handleLogin"
      />
      <AuthFooter />
    </AuthCard>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthCard from '../components/AuthCard.vue'
import AuthFooter from '../components/AuthFooter.vue'
import AuthHeader from '../components/AuthHeader.vue'
import AuthForm from '../components/AuthForm.vue'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useLogin } from './use-login'
import { useTranslations } from '@/i18n'

const route = useRoute()

// Use the login composable
const { email, password, error, loading, handleLogin } = useLogin()

// Use translations
const { t } = useTranslations()

const unauthorizedMessage = ref<string | null>(null)

onMounted(() => {
  if (route.query.reason === 'unauthorized') {
    unauthorizedMessage.value = 'Vaša relácia vypršala. Prosím, prihláste sa znova.'
  }
})
</script>