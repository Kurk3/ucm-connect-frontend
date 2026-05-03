<template>
  <main class="flex flex-col flex-1 gap-4 p-6 lg:p-8 bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl mb-20 min-h-screen">
    <h1 class="text-3xl text-gray-900 dark:text-white">Moje príspevky</h1>
    <div v-if="authStore.user">
      <MainContent :userId="authStore.user.id" />
    </div>
    <div v-else class="flex justify-center items-center h-40">
      <ProgressSpinner style="width:50px; height:50px;" strokeWidth="4" />
    </div>
  </main>
</template>

<script setup lang="ts">
import MainContent from '@/components/MainContent.vue';
import { useAuthStore } from '@/stores/auth';
import ProgressSpinner from 'primevue/progressspinner';

const authStore = useAuthStore();
</script>
