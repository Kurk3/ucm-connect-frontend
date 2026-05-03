<template>
  <div>
    <!-- Tagline -->
    <div class="flex items-center justify-center mx-4 sm:mx-10">
      <h2 class="text-xl sm:text-2xl font-semibold dark:text-white text-gray-600 text-center">
        {{ t('auth.tagline') }}
      </h2>
    </div>

    <!-- Title -->
    <h1 class="text-2xl font-medium dark:text-white text-gray-800 mb-4 sm:mb-8 text-center mt-4 sm:mt-8">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from '@/i18n'

interface Props {
  title: string
}

defineProps<Props>()

const { t } = useTranslations()
</script>