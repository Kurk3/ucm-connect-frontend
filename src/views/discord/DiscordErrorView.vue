<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
    <div class="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-sm max-w-md w-full text-center">
      <i class="pi pi-times-circle text-5xl text-red-500"></i>
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Discord chyba</h2>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        Nepodarilo sa autorizovať s Discordom. Skúste to znova.
      </p>
      <button @click="$router.push('/')"
        class="mt-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-md hover:shadow-lg">
        Späť na domovskú stránku
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
