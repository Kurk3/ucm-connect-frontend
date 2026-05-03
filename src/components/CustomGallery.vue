<template>
  <!-- Gallery Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
        @click.self="closeGallery"
      >
        <!-- Close Button -->
        <button
          @click="closeGallery"
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close gallery"
        >
          <i class="pi pi-times text-xl"></i>
        </button>

        <!-- Image Counter -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <!-- Main Image Container -->
        <div class="flex items-center justify-center h-full px-4 pb-24 md:pb-32 pt-16">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="currentImage" :key="currentIndex" class="relative w-full h-full flex items-center justify-center">
              <img
                :src="currentImage.itemImageSrc"
                :alt="`Image ${currentIndex + 1}`"
                class="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                @click.stop
              />
            </div>
          </Transition>
        </div>

        <!-- Navigation Arrows -->
        <button
          v-if="images.length > 1"
          @click="previousImage"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentIndex === 0 && !circular"
          aria-label="Previous image"
        >
          <i class="pi pi-chevron-left text-2xl"></i>
        </button>

        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentIndex === images.length - 1 && !circular"
          aria-label="Next image"
        >
          <i class="pi pi-chevron-right text-2xl"></i>
        </button>

        <!-- Thumbnail Scroller -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4"
        >
          <div class="container mx-auto px-4">
            <div class="relative">
              <!-- Thumbnail Container -->
              <div
                ref="thumbnailContainer"
                class="flex gap-2 md:gap-3 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2"
              >
                <button
                  v-for="(image, index) in images"
                  :key="index"
                  @click="goToImage(index)"
                  class="flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-200"
                  :class="[
                    currentIndex === index
                      ? 'ring-2 ring-blue-500 scale-110'
                      : 'ring-1 ring-white/20 hover:ring-white/40 hover:scale-105'
                  ]"
                >
                  <img
                    :src="image.thumbnailImageSrc"
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-16 h-16 md:w-20 md:h-20 object-cover"
                  />
                  <!-- Active Indicator -->
                  <div
                    v-if="currentIndex === index"
                    class="absolute inset-0 bg-blue-500/20"
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

interface ImageItem {
  itemImageSrc: string;
  thumbnailImageSrc: string;
}

interface Props {
  visible: boolean;
  images: ImageItem[];
  circular?: boolean;
  startIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  circular: true,
  startIndex: 0
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const currentIndex = ref(props.startIndex);
const thumbnailContainer = ref<HTMLElement | null>(null);

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const currentImage = computed(() => props.images[currentIndex.value]);

const closeGallery = () => {
  isVisible.value = false;
};

const nextImage = () => {
  if (props.circular) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  } else if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const previousImage = () => {
  if (props.circular) {
    currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
  } else if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const goToImage = (index: number) => {
  currentIndex.value = index;
};

// Scroll thumbnail into view when current index changes
watch(currentIndex, async () => {
  await nextTick();
  if (thumbnailContainer.value) {
    const thumbnails = thumbnailContainer.value.children;
    const currentThumbnail = thumbnails[currentIndex.value] as HTMLElement;
    if (currentThumbnail) {
      currentThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }
});

// Prevent body scroll when modal is open
const lockBodyScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
  }
};

const unlockBodyScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
};

// Calculate scrollbar width to prevent layout shift
const getScrollbarWidth = (): number => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth - document.documentElement.clientWidth;
};

// Reset index and lock/unlock scroll when visibility changes
watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentIndex.value = props.startIndex;
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
});

// Keyboard navigation
const handleKeyboard = (event: KeyboardEvent) => {
  if (!isVisible.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      previousImage();
      break;
    case 'ArrowRight':
      event.preventDefault();
      nextImage();
      break;
    case 'Escape':
      event.preventDefault();
      closeGallery();
      break;
  }
};

// Add keyboard listener when component mounts
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeyboard);
}

// Clean up on unmount
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyboard);
    unlockBodyScroll(); // Ensure scroll is unlocked on unmount
  }
});
</script>

<style scoped>
/* Custom scrollbar for thumbnail container */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply bg-white/20 rounded-full;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  @apply bg-white/30;
}
</style>

