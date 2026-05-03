<template>
  <button 
    @click="toggleTheme" 
    class="p-3 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500"></i>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

