<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
    <div class="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-sm max-w-md w-full text-center">
      <template v-if="linking">
        <i class="pi pi-spin pi-spinner text-4xl text-indigo-500"></i>
        <p class="text-gray-600 dark:text-gray-400">Prepájam Discord účet...</p>
      </template>

      <template v-else-if="success">
        <i class="pi pi-check-circle text-5xl text-green-500"></i>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Discord prepojený!</h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Tvoj Discord účet <strong>{{ discordUsername }}</strong> bol úspešne prepojený.
        </p>
        <button @click="$router.push('/')"
          class="mt-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-md hover:shadow-lg">
          Späť na domovskú stránku
        </button>
      </template>

      <template v-else>
        <i class="pi pi-times-circle text-5xl text-red-500"></i>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Chyba prepojenia</h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">{{ errorMessage }}</p>
        <button @click="$router.push('/')"
          class="mt-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-md hover:shadow-lg">
          Späť na domovskú stránku
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { DiscordApi } from '@/services/api'

const route = useRoute()

const linking = ref(true)
const success = ref(false)
const errorMessage = ref('')
const discordUsername = ref('')

onMounted(async () => {
  const discordId = route.query.discord_id as string
  discordUsername.value = (route.query.discord_username as string) || ''

  if (!discordId) {
    linking.value = false
    errorMessage.value = 'Chýba Discord ID. Skúste to znova.'
    return
  }

  try {
    await DiscordApi.linkDiscord(discordId)
    success.value = true
  } catch (e: any) {
    errorMessage.value = 'Nepodarilo sa prepojiť Discord účet. Skúste to znova.'
  } finally {
    linking.value = false
  }
})
</script>
