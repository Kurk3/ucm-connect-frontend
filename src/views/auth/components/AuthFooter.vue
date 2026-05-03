<template>
  <footer class="bg-white/60 dark:bg-white/10 w-full min-h-12 py-2 sm:py-0 sm:h-12 flex items-center justify-center">
    <ul class="flex justify-center flex-wrap gap-x-3 sm:gap-x-6 gap-y-1 text-gray-500 dark:text-gray-300 text-xs sm:text-sm w-full max-w-4xl px-3 sm:px-6">
      <li>
        <router-link to="#" class="hover:text-gray-900 dark:hover:text-white">{{ t('auth.footer.about') }}</router-link>
      </li>
      <li>
        <router-link to="#" class="hover:text-gray-900 dark:hover:text-white">{{ t('auth.footer.help') }}</router-link>
      </li>
      <li>
        <router-link to="#" class="hover:text-gray-900 dark:hover:text-white">{{ t('auth.footer.terms') }}</router-link>
      </li>
      <li>
        <router-link to="#" class="hover:text-gray-900 dark:hover:text-white">{{ t('auth.footer.privacy') }}</router-link>
      </li>
      <li>
        <router-link to="#" class="hover:text-gray-900 dark:hover:text-white">{{ t('auth.footer.cookies') }}</router-link>
      </li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import { useTranslations } from '@/i18n'

const { t } = useTranslations()
</script>