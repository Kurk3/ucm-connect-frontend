<template>
  <article class="w-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-2xl transition-all bg-white/50 dark:bg-black/20 backdrop-blur-sm flex flex-col">
    <!-- Header section -->
    <div class="p-5 pb-0 flex flex-row items-center gap-3">
      <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 border border-solid border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-300">
        <i class="pi pi-user text-xl"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ post.userName }}
        </span>
        <div class="text-base lg:text-lg text-gray-900 dark:text-white font-semibold leading-tight">{{ post.title }}</div>
      </div>
    </div>

    <!-- Content section -->
    <div class="px-5 pb-0 pt-4 flex-1">
      <div class="flex">
        <!-- Vertical layout divider mimicking primevue Divider -->
        <div class="w-px bg-gray-300 dark:bg-gray-700 mr-4 self-stretch"></div>
        <p :class="[
          'm-0 text-base lg:text-lg leading-6 text-gray-700 dark:text-gray-200 whitespace-pre-line',
          { 'line-clamp-4': !isDetailPage }
        ]">{{ post.description }}</p>
      </div>

      <!-- Attachments Section (only on detail page) -->
      <div v-if="hasAttachments" class="mt-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="(attachment, index) in attachments" :key="index"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <i :class="[attachment.icon, 'text-indigo-600 dark:text-indigo-400 text-xl']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate m-0">
                  {{ attachment.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 m-0 mt-0.5">
                  {{ attachment.size }}
                </p>
              </div>
            </div>
            <button
              :disabled="downloadingFile === attachment.name"
              class="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-auto"
              @click.stop="downloadAttachment(attachment)"
            >
              <i :class="downloadingFile === attachment.name ? 'pi pi-spin pi-spinner' : 'pi pi-download'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Image Gallery Modal -->
      <CustomGallery
        v-model:visible="displayBasic"
        :images="images"
        :circular="true"
      />
    </div>

    <!-- Footer section -->
    <div class="px-5 pb-3 pt-0 mt-auto">
      <div class="flex flex-wrap sm:gap-4 gap-1 mt-2">
        <button
          class="bg-transparent text-gray-500 dark:text-gray-400 border-none group flex justify-center items-center p-2 -ml-2 gap-2 rounded-md text-sm lg:text-base cursor-pointer hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
          @click.stop="addLike"
        >
          <i :class="[
            'pi',
            isLiked ? 'pi-heart-fill text-red-500' : 'pi-heart text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-500',
            'text-lg'
          ]"></i>
          <span class="group-hover:text-blue-500 dark:group-hover:text-blue-500 flex flex-row gap-2">{{ likeNum }} <span class="sm:block hidden">Páči sa mi</span></span>
        </button>

        <button
          class="bg-transparent text-gray-500 dark:text-gray-400 border-none hover:text-blue-500 dark:hover:text-blue-500 flex justify-center items-center p-2 gap-2 rounded-md whitespace-nowrap text-sm lg:text-base cursor-pointer transition-colors"
          @click.stop="goToDetail"
        >
          <i class="pi pi-comment text-lg"></i>
          <span class="sm:block hidden">Komentovať</span>
        </button>

        <button v-if="images.length > 0"
          class="bg-transparent text-gray-500 dark:text-gray-400 border-none hover:text-blue-500 dark:hover:text-blue-500 flex justify-center items-center p-2 gap-2 rounded-md whitespace-nowrap text-sm lg:text-base cursor-pointer transition-colors"
          @click.stop="displayBasic = true"
        >
          <i class="pi pi-image text-lg"></i>
          <span>Zobraziť obrázky ({{ images.length }})</span>
        </button>

        <!-- Secondary Button (if needed) -->
        <router-link v-if="!isDetailPage" :to="{ name: 'post-detail', params: { id: post.id } }" class="ml-auto mt-0.5">
          <SecondaryButton :text="btnText" />
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import SecondaryButton from "@/components/SecondaryButton.vue";
import CustomGallery from '@/components/CustomGallery.vue';
import { useRouter, useRoute } from 'vue-router';
import type { PostDTO } from '@/types/post';
import { FilesApi, LikesApi } from '@/services/api';
import type { FileDTO } from '@/services/api/files-api';

// Types
interface ImageItem {
  itemImageSrc: string;
  thumbnailImageSrc: string;
}

interface Attachment {
  name: string;
  size: string;
  icon: string;
  url: string;
  fileType: string;
}

// Props
const props = defineProps<{
  post: PostDTO
  likedPostIds?: Set<string>
}>();

const router = useRouter();
const route = useRoute();

const isDetailPage = computed(() => route.path === `/posts/${props.post.id}`);

// Image gallery setup
const images = ref<ImageItem[]>([]);
const displayBasic = ref(false);

// Files setup
const files = ref<FileDTO[]>([]);
const filesLoading = ref(false);

// Attachments from fetched files
const attachments = computed(() => {
  const fileIcons: Record<string, string> = {
    pdf: 'pi pi-file-pdf',
    PDF: 'pi pi-file-pdf',
    image: 'pi pi-image',
    IMAGE: 'pi pi-image',
    zip: 'pi pi-file',
    ZIP: 'pi pi-file',
    doc: 'pi pi-file-word',
    docx: 'pi pi-file-word'
  };

  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return 'Unknown size';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return files.value.map(file => ({
    name: file.fileName,
    size: formatFileSize(file.fileSize),
    icon: fileIcons[file.fileType] || 'pi pi-file',
    url: file.url || FilesApi.getDownloadUrl(file.id),
    fileType: file.fileType
  }));
});

const hasAttachments = computed(() => attachments.value.length > 0);
const downloadingFile = ref<string | null>(null);

const downloadAttachment = async (attachment: Attachment) => {
  try {
    downloadingFile.value = attachment.name;
    window.open(attachment.url, '_blank');
  } catch (error) {
    console.error('Error downloading file:', error);
  } finally {
    setTimeout(() => {
      downloadingFile.value = null;
    }, 1000);
  }
};

// Likes - use likedPostIds from parent if available, otherwise fetch
const isLiked = ref(false);
const likeNum = ref(props.post.numberOfLikes);
const btnText = "Čítať celý post";

const initLikeStatus = () => {
  if (props.likedPostIds) {
    isLiked.value = props.likedPostIds.has(props.post.id);
  }
};

const fetchLikeStatus = async () => {
  // Only fetch if parent didn't provide likedPostIds (e.g. on detail page)
  if (props.likedPostIds) return;
  try {
    const myLikes = await LikesApi.getMyLikes();
    isLiked.value = myLikes.some(like => like.postId === props.post.id);
  } catch (error) {
    // Silently fail
  }
};

const fetchFiles = async () => {
  try {
    filesLoading.value = true;
    files.value = await FilesApi.getPostFiles(props.post.id);

    files.value.forEach(file => {
      if (file.fileType === 'image' || file.fileType === 'IMAGE') {
        const url = file.url || FilesApi.getDownloadUrl(file.id);
        images.value.push({
          itemImageSrc: url,
          thumbnailImageSrc: url
        });
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
  } finally {
    filesLoading.value = false;
  }
};

const addLike = async () => {
  try {
    if (isLiked.value) {
      await LikesApi.unlikePost(props.post.id);
      isLiked.value = false;
      likeNum.value -= 1;
    } else {
      await LikesApi.likePost(props.post.id);
      isLiked.value = true;
      likeNum.value += 1;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

const goToDetail = () => {
  router.push({
    name: 'post-detail',
    params: { id: props.post.id }
  });
};

onMounted(() => {
  initLikeStatus();
  // Only fetch likes from API if parent didn't provide likedPostIds (detail page)
  if (!props.likedPostIds) {
    fetchLikeStatus();
  }
  // Only fetch files on detail page to avoid N+1
  if (isDetailPage.value) {
    fetchFiles();
  }
});
</script>
