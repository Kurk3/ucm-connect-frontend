<template>
  <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 whitespace-nowrap text-sm lg:text-base transition-all duration-300 ease-in-out text-white px-6 py-2 rounded flex gap-3 cursor-pointer outline-none border-none shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center"
  >
    <slot>{{ props.text }}</slot>
    <i v-if="props.icon" :class="props.icon"></i>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  text: String,
  icon: String
});
</script>