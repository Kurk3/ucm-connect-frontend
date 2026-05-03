<template>
  <Card class="w-fill border border-gray-200 dark:border-gray-700 border-solid border-1 shadow-sm hover:shadow-md dark:hover:shadow-2xl transition-all bg-white/20 dark:bg-black/20 backdrop-blur-sm">
    <template #title>
      <div class="flex flex-row items-center gap-4 justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 border border-solid border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-300">
            <i class="pi pi-user text-xl"></i>
          </div>



          
          <div class="flex flex-col">
            <div class="text-base lg:text-lg font-medium text-gray-900 dark:text-white">
              {{ author || 'Neznámy používateľ' }}
            </div>
          </div>
        </div>
        <!-- Delete button -->
        <button
          v-if="canDelete"
          title="Zmazať komentár"
          class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          @click="$emit('delete')"
        >
          <i class="pi pi-trash text-lg"></i>
        </button>
      </div>
    </template>

    <template #content>
      <div class="flex mt-2">
        <Divider layout="vertical" />
        <p class="m-0 text-base lg:text-lg leading-6 text-gray-700 dark:text-gray-200">{{ content }}</p>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-4 mt-2">
        <button
            class="bg-transparent text-gray-700 dark:text-gray-200 border-none group flex justify-center items-center p-1 gap-2 rounded-md text-sm lg:text-base cursor-pointer hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
            @click="addLike"
        >
          <i :class="[
            'pi',
            isLiked ? 'pi-heart-fill text-red-500' : 'pi-heart text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-500',
            'text-lg'
          ]"></i>
          <span class="group-hover:text-blue-500 dark:group-hover:text-blue-500">{{ likeNum }} Páči sa mi</span>
        </button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import { LikesApi } from '@/services/api';

interface Props {
  commentId: string;
  author?: string;
  userId?: string;
  content: string;
  likes?: number;
  canDelete?: boolean;
  likedCommentIds?: Set<string>;
}

const props = withDefaults(defineProps<Props>(), {
  likes: 0,
  canDelete: false
});

const emit = defineEmits<{
  delete: []
}>();

// Reactive state
const isLiked = ref(false);
const likeNum = ref(props.likes);

// Init like status from parent-provided set (no API call)
const initLikeStatus = () => {
  if (props.likedCommentIds) {
    isLiked.value = props.likedCommentIds.has(props.commentId);
  }
};

const addLike = async () => {
  try {
    if (isLiked.value) {
      await LikesApi.unlikeComment(props.commentId);
      isLiked.value = false;
      likeNum.value -= 1;
    } else {
      await LikesApi.likeComment(props.commentId);
      isLiked.value = true;
      likeNum.value += 1;
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
  }
};

// Lifecycle
onMounted(() => {
  initLikeStatus();
});
</script>
