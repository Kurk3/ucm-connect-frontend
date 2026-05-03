<template>
  <div class="custom-select" ref="selectRef">
    <button
      @click="toggleDropdown"
      class="select-trigger w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-black/50 text-gray-900 dark:text-white hover:bg-white/90 dark:hover:bg-black/70 transition-colors flex items-center justify-between"
      :class="{ 'ring-2 ring-blue-500': isOpen }"
    >
      <span v-if="selectedOption" class="truncate">
        {{ getOptionLabel(selectedOption) }}
      </span>
      <span v-else class="text-gray-500 dark:text-gray-400">
        {{ placeholder }}
      </span>
      <i
        class="pi pi-chevron-up ml-2 transition-transform duration-200 text-gray-500 dark:text-gray-400"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="select-dropdown absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
      >
        <!-- Search input -->
        <div class="p-2 border-b border-gray-200 dark:border-gray-700">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            :placeholder="filterPlaceholder"
            class="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <ul class="py-1 max-h-60 overflow-auto">
          <li
            v-for="(option, index) in filteredOptions"
            :key="index"
            @click="selectOption(option)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            :class="{
              'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': isSelected(option)
            }"
          >
            {{ getOptionLabel(option) }}
          </li>
          <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500 text-center">
            Ziadne vysledky
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

interface Props {
  modelValue: any;
  options: any[];
  optionLabel?: string;
  placeholder?: string;
  filterPlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  optionLabel: 'label',
  placeholder: 'Select an option',
  filterPlaceholder: 'Hladaj predmet...'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');

const selectedOption = computed(() => props.modelValue);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(option => {
    const label = getOptionLabel(option).toLowerCase();
    return label.includes(query);
  });
});

const getOptionLabel = (option: any): string => {
  if (!option) return '';
  if (typeof option === 'string') return option;
  return option[props.optionLabel] || '';
};

const isSelected = (option: any): boolean => {
  return selectedOption.value === option;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};

const selectOption = (option: any) => {
  emit('update:modelValue', option);
  isOpen.value = false;
  searchQuery.value = '';
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    searchQuery.value = '';
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-select {
  position: relative;
  min-width: 200px;
  width: min-content;
}

.select-dropdown {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.select-dropdown::-webkit-scrollbar {
  width: 6px;
}

.select-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.select-dropdown::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.select-dropdown::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>
