<template>
  <div class="mx-auto flex flex-col items-center justify-center h-dvh gap-8 overflow-hidden px-6">
    <img class="w-3/4 md:w-1/4" src="@/assets/img/ucm-connect-logo-white.png" alt="UCM Connect Logo">

    <div class="flex flex-col items-center gap-6 p-8 md:p-12 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-sm max-w-md w-full text-center">
      <div class="text-7xl md:text-8xl font-bold text-gray-800 dark:text-white tracking-tight">
        404
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          Stránka nenájdená
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Stránka, ktorú hľadáte, neexistuje alebo bola presunutá.
        </p>
      </div>
      <button
        @click="$router.push('/')"
        class="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <i class="pi pi-home"></i>
        Späť na domovskú stránku
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
