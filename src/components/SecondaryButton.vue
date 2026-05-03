<template>
  <button
      class="bg-blue-50 dark:bg-blue-900/30 border border-solid border-blue-700 dark:border-blue-500 text-blue-700 dark:text-blue-300 px-4 py-2 rounded hover:cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/50 hover:text-blue-900 dark:hover:text-blue-100 whitespace-nowrap text-sm lg:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
  >
    <slot>{{ props.text }}</slot>
    <span v-if="props.icon" v-html="props.icon"></span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  text: String,
  icon: String
});
</script>