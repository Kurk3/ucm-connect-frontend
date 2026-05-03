<template>
  <div class="flex flex-col h-full">
    <section
      class="mx-auto mb-0 lg:mx-0 bg-white/70 dark:bg-black/50 backdrop-blur-sm p-3 sm:p-6 gap-4 rounded-2xl flex flex-col w-full">

      <Message v-if="errorMessage" severity="error" class="text-gray-900 dark:text-gray-300">{{ errorMessage }}
      </Message>

      <!-- Spinner počas načítania -->
      <div v-if="loading" class="flex justify-center items-center h-40">
        <ProgressSpinner style="width:50px; height:50px;" strokeWidth="4" />
      </div>

      <!-- Zobraz príspevky až po načítaní -->
      <template v-else>
        <h2 v-if="!subject && !userId" class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Najnovšie príspevky
        </h2>


        <div v-if="apiPosts.length === 0" class="placeholder-content flex flex-col items-center justify-center py-16 px-6 text-center h-full">
          <div class="mb-4 text-5xl opacity-50">📭</div>
          <h2 class="text-xl font-medium text-gray-800 dark:text-gray-100 mb-2">
            Žiadne príspevky
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-md">
            V tejto kategórii zatiaľ nie sú žiadne príspevky.
          </p>
        </div>

        <PostCard v-else v-for="post in visiblePosts" :key="post.id" :post="post" :liked-post-ids="likedPostIds" />

        <!-- Load more button -->
        <div v-if="visibleCount < apiPosts.length" class="flex flex-col items-center mt-3 gap-4">
          <PrimaryButton :text="btnText"
            :disabled="loadingMore" @click="loadMore" />
          <div v-if="loadingMore" class="mt-2 flex justify-center">
            <ProgressSpinner style="width:30px; height:30px;" strokeWidth="4" />
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import Message from 'primevue/message';
import PostCard from './PostCard.vue';
import PrimaryButton from "@/components/PrimaryButton.vue";
import ProgressSpinner from 'primevue/progressspinner'
import { PostsApi, LikesApi } from '@/services/api';
import type { SubjectDTO, PostDTO } from '@/types/api';

const props = defineProps({
  subject: {
    type: Object as PropType<SubjectDTO>,
    required: false
  },
  userId: {
    type: String,
    required: false
  }
});

const btnText = 'Načítať viac príspevkov';
const apiPosts = ref<PostDTO[]>([]);
const errorMessage = ref<string | null>(null);
const visibleCount = ref(3);
const loading = ref(true);
const loadingMore = ref(false);
const likedPostIds = ref<Set<string>>(new Set());

const sortedPosts = computed(() => {
  return apiPosts.value
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const visiblePosts = computed(() => {
  return sortedPosts.value.slice(0, visibleCount.value);
});

const loadMore = async () => {
  loadingMore.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));
  visibleCount.value = Math.min(
    visibleCount.value + 3,
    apiPosts.value.length
  );
  loadingMore.value = false;
};

const fetchPosts = async (subjectId: string | null = null) => {
  try {
    loading.value = true;
    errorMessage.value = null;

    const filters: any = {};
    if (subjectId) filters.subjectId = subjectId;
    if (props.userId) filters.userId = props.userId;

    apiPosts.value = await PostsApi.fetchPosts(1, 100, filters);

  } catch (error) {
    errorMessage.value = 'Chyba pri načítaní príspevkov: ' + (error as Error).message;
    console.error('Chyba pri načítaní príspevkov:', error);
  } finally {
    loading.value = false;
  }
};

const fetchMyLikes = async () => {
  try {
    const myLikes = await LikesApi.getMyLikes();
    likedPostIds.value = new Set(
      myLikes
        .filter(like => like.postId)
        .map(like => like.postId as string)
    );
  } catch (error) {
    // Silently fail - likes just won't show as liked
  }
};

onMounted(async () => {
  await Promise.all([
    fetchPosts(props.subject ? props.subject.id : null),
    fetchMyLikes()
  ]);
});

watch(() => props.subject, async (newSubject) => {
  await fetchPosts(newSubject ? newSubject.id : null);
}, { deep: true });

defineExpose({
  fetchPosts
});
</script>
