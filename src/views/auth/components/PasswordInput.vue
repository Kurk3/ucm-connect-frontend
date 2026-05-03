<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-2"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder ?? ''"
        :required="required"
        :disabled="disabled"
        class="block w-full px-4 py-2 dark:text-gray-300 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed pr-10"
      />
      <button
        type="button"
        @click="showPassword = !showPassword"
        class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        :disabled="disabled"
      >
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3C5.58 3 2.062 6.588 1.332 10c.73 3.412 4.248 7 8.668 7s7.938-3.588 8.668-7C17.938 6.588 14.42 3 10 3zm0 10a3 3 0 100-6 3 3 0 000 6z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3C5.58 3 2.062 6.588 1.332 10c.73 3.412 4.248 7 8.668 7s7.938-3.588 8.668-7C17.938 6.588 14.42 3 10 3zm0 10a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  id: string
  label?: string
  placeholder?: string
  modelValue: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
</script>