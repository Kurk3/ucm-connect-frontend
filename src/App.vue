<script setup lang="ts">
import MainView from "@/views/MainView.vue";
import { useTheme } from "@/composables/useTheme";
import { useAuthStore } from "@/stores/auth";
import { UsersApi } from "@/services/api/users-api";
import { onMounted } from 'vue';

const { initTheme } = useTheme();
const authStore = useAuthStore();

onMounted(async () => {
  initTheme();
  
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      const user = await UsersApi.getMe();
      authStore.setUser(user);
    } catch (e) {
      console.error("Failed to restore user session", e);
    }
  }
});
</script>

<template>
  <MainView class="p-5"/>
</template>