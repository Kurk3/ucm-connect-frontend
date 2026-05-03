<template>
  <div class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50">
    <h3 class="font-bold text-gray-900 dark:text-white mb-2">Theme Debug</h3>
    <div class="space-y-2 text-sm">
      <p class="text-gray-700 dark:text-gray-200">
        Current: <span class="font-semibold">{{ isDark ? '🌙 Dark' : '☀️ Light' }}</span>
      </p>
      <button 
        @click="toggleTheme"
        class="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
      >
        Toggle Theme
      </button>
      <button 
        @click="clearStorage"
        class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-xs"
      >
        Clear Storage
      </button>
      <div class="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
        <p>Storage: {{ savedTheme || 'none' }}</p>
        <p>Classes: {{ htmlClasses }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { ref, onMounted } from 'vue'

const { isDark, toggleTheme } = useTheme()

const savedTheme = ref('')
const htmlClasses = ref('')

const updateDebugInfo = () => {
  savedTheme.value = localStorage.getItem('theme') || 'none'
  htmlClasses.value = document.documentElement.className || 'none'
}

const clearStorage = () => {
  localStorage.removeItem('theme')
  location.reload()
}

onMounted(() => {
  updateDebugInfo()
  // Update debug info every second
  setInterval(updateDebugInfo, 1000)
})
</script>

