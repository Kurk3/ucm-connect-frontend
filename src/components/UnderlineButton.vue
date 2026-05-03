<template>
  <button
      class="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap text-sm lg:text-base bg-transparent p-0 cursor-pointer outline-none underline border-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
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

