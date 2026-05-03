<template>
  <div class="custom-accordion">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="accordion-item"
    >
      <!-- Header -->
      <button
        @click="toggleItem(index)"
        class="w-full flex items-center gap-2 py-2 text-left group transition-colors duration-150"
        :aria-expanded="openItems.includes(index)"
      >
        <i
          class="pi pi-chevron-right text-[10px] transition-transform duration-200 text-gray-800 dark:text-gray-200"
          :class="{ 'rotate-90': openItems.includes(index) }"
        ></i>
        <slot name="header" :item="item" :index="index">
          <span class="text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ item.header || item.title }}
          </span>
        </slot>
      </button>

      <!-- Content -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[1000px] opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="max-h-[1000px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-if="openItems.includes(index)"
          class="accordion-content overflow-hidden"
        >
          <div class="pl-5 pb-1">
            <slot name="content" :item="item" :index="index" :is-animating="isAnimating">
              <div v-html="item.content"></div>
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface AccordionItem {
  header?: string;
  title?: string;
  content?: string;
  [key: string]: any;
}

interface Props {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  defaultOpen: () => []
});

const openItems = ref<number[]>([...props.defaultOpen]);
const isAnimating = ref(false);

const toggleItem = (index: number) => {
  const isOpen = openItems.value.includes(index);

  if (props.multiple) {
    if (isOpen) {
      openItems.value = openItems.value.filter(i => i !== index);
    } else {
      openItems.value.push(index);
    }
  } else {
    if (isOpen) {
      openItems.value = [];
    } else {
      openItems.value = [index];
    }
  }
};

const onEnter = () => {
  isAnimating.value = true;
};

const onLeave = () => {
  isAnimating.value = false;
};

watch(() => props.items, () => {
  openItems.value = openItems.value.filter(i => i < props.items.length);
});
</script>

<style scoped>
.accordion-content {
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
}

.accordion-content :deep(ul li) {
  opacity: 0;
  transform: translateY(-4px);
  animation: fadeIn 0.25s ease-out forwards;
}

.accordion-content :deep(ul li:nth-child(1)) { animation-delay: 0.03s; }
.accordion-content :deep(ul li:nth-child(2)) { animation-delay: 0.06s; }
.accordion-content :deep(ul li:nth-child(3)) { animation-delay: 0.09s; }
.accordion-content :deep(ul li:nth-child(4)) { animation-delay: 0.12s; }
.accordion-content :deep(ul li:nth-child(5)) { animation-delay: 0.15s; }
.accordion-content :deep(ul li:nth-child(6)) { animation-delay: 0.18s; }
.accordion-content :deep(ul li:nth-child(7)) { animation-delay: 0.21s; }
.accordion-content :deep(ul li:nth-child(8)) { animation-delay: 0.24s; }
.accordion-content :deep(ul li:nth-child(9)) { animation-delay: 0.27s; }
.accordion-content :deep(ul li:nth-child(10)) { animation-delay: 0.3s; }
.accordion-content :deep(ul li:nth-child(n+11)) { animation-delay: 0.33s; }

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
