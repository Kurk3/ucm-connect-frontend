<template>
  <section class="text-gray-700 dark:text-gray-200">
    <div class="max-w-3xl space-y-6">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        {{ content.title }}
      </h2>

      <!-- Render content blocks -->
      <template v-for="(block, index) in content.blocks" :key="index">
        <!-- Paragraph -->
        <p v-if="block.type === 'paragraph'" 
        class="text-gray-700 dark:text-gray-200" :class="block.class || 'mb-4'">
          <span v-html="formatText(block.text || '')"></span>
        </p>

        <!-- Heading -->
        <h3 v-else-if="block.type === 'heading'" 
            :class="block.level === 3 ? 'text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3' : 'text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2'">
          {{ block.text }}
        </h3>

        <!-- List -->
        <ul v-else-if="block.type === 'list'" 
            :class="block.ordered ? 'list-decimal' : 'list-disc'"
            class="pl-6 space-y-2 text-gray-700 dark:text-gray-200 mb-6">
          <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
            <template v-if="typeof item === 'string'">
              <span v-html="formatText(item)"></span>
            </template>
            <template v-else>
              <strong v-if="item.title">{{ item.title }}</strong>
              <p v-if="item.text" class="mt-1">
                <span v-html="formatText(item.text)"></span>
              </p>
              <ul v-if="item.items" class="list-disc list-inside space-y-2 mt-2">
                <li v-for="(subItem, subIndex) in item.items" :key="subIndex">
                  <span v-html="formatText(subItem)"></span>
                </li>
              </ul>
            </template>
          </li>
        </ul>

        <!-- Section with subsections -->
        <div v-else-if="block.type === 'section'" 
        class="space-y-6">
          <div v-for="(subsection, subIndex) in block.subsections" :key="subIndex" class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
              {{ subsection.title }}
            </h4>
            <p v-if="subsection.text" class="text-gray-700 dark:text-gray-200">
              <span v-html="formatText(subsection.text)"></span>
            </p>
            <ul v-if="subsection.items" class="list-disc list-inside space-y-2">
              <li v-for="(item, itemIdx) in subsection.items" :key="itemIdx">
                <span v-html="formatText(item)"></span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SubjectContent } from '@/stores/navodyKuPredmetom';

defineProps<{
  content: SubjectContent;
}>();

// Format text with special styling (bold, code, etc.)
const formatText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<span class="font-mono text-blue-500 dark:text-blue-400">$1</span>')
    .replace(/\[(.*?)\]/g, '<span class="font-semibold">$1</span>');
};
</script>

