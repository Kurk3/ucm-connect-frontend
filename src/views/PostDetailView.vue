<template>
  <section class="flex flex-col flex-1 p-6 gap-4 bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl mb-20">

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" />
    </div>

    <!-- Error -->
    <div v-else-if="error">
      <Message severity="error">{{ error }}</Message>
    </div>

    <!-- Post Content -->
    <div v-else-if="post">

      <!-- Breadcrumb -->
      <div class="card flex justify-between items-center w-full max-w-full overflow-hidden pb-4">
        <Breadcrumb :home="home" :model="items" class="p-0 bg-transparent flex-wrap md:flex-nowrap">
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate" :title="typeof item.label === 'string' ? item.label : ''" class="max-w-[120px] sm:max-w-[180px] md:max-w-[300px]">
                <span :class="[item.icon, 'text-color']" />
                <span class="text-primary font-semibold text-sm lg:text-base hover:text-indigo-600 truncate inline-block align-bottom w-full">{{ item.label }}</span>
              </a>
            </router-link>
            <a v-else v-bind="props.action" :title="typeof item.label === 'string' ? item.label : ''" class="max-w-[120px] sm:max-w-[180px] md:max-w-[300px]">
              <span class="text-surface-700 dark:text-surface-0 text-sm lg:text-base truncate inline-block align-bottom w-full">{{ item.label }}</span>
            </a>
          </template>
        </Breadcrumb>

        <SecondaryButton
          v-if="canDeletePost"
          class="!text-red-600 dark:!text-red-400 !border-red-600 dark:!border-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/30 lg:hidden"
          text="Zmazať príspevok"
          icon="pi pi-trash"
          @click="deletePost"
        />
        <SecondaryButton
          v-if="canDeletePost"
          class="!text-red-600 dark:!text-red-400 !border-red-600 dark:!border-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/30 hidden lg:flex"
          text="Zmazať príspevok"
          icon="pi pi-trash"
          @click="deletePost"
        />
      </div>


      <PostCard :post="post" />
      <FloatLabel variant="on" class="mt-6">
          <Textarea autoResize id="comment_label" v-model="comment" rows="2" cols="10"
            :pt="{
              root: {
                class: 'w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white'
              }
            }"
          />
          <label for="comment_label" class="text-gray-500 dark:text-gray-300 font-normal">Pridaj svoj komentár</label>
        </FloatLabel>
        <PrimaryButton text="Odoslať" icon="pi pi-send" @click="addComment" class="justify-self-end mt-3"/>
    </div>

    <!-- Not found -->
    <div v-else>
      <p class="text-gray-500 dark:text-gray-200 text-center font-normal">Príspevok sa nenašiel.</p>
    </div>

    <!-- Comments section (len ak máme post) -->
    <div v-if="post" class="flex flex-col gap-4 mt-4">
      <h1 class="mx-5 text-3xl underline text-gray-900 dark:text-white">Komentáre</h1>

      <div v-if="commentsLoading" class="text-center py-4">
        <ProgressSpinner style="width:40px;height:40px" strokeWidth="4" />
      </div>

      <div v-else>
        <div v-if="displayedComments.length > 0" class="flex flex-col gap-4">
          <CommentCard
            v-for="comment in displayedComments"
            :key="comment.id"
            :comment-id="comment.id"
            :author="comment.userName"
            :userId="comment.userId"
            :content="comment.content"
            :likes="comment.numberOfLikes || 0"
            :can-delete="canDeleteComment(comment)"
            :liked-comment-ids="likedCommentIds"
            @delete="deleteComment(comment.id)"
          />
        </div>
        <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>Zatiaľ tu nie sú žiadne komentáre. Buď prvý!</p>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreComments" class="flex justify-center mt-8">
          <primary-button text="Načítať viac komentárov" @click="loadMoreComments" />
        </div>
      </div>
    </div>
    <Toast />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PostCard from '@/components/PostCard.vue'
import PrimaryButton from "@/components/PrimaryButton.vue"
import Breadcrumb from 'primevue/breadcrumb'
// import InputText from 'primevue/inputtext'
import CommentCard from "@/components/CommentCard.vue"
import ProgressSpinner from "primevue/progressspinner"
import Message from "primevue/message"
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { CommentDTO, PostDTO } from '@/types/api'
import { PostsApi, CommentsApi, LikesApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()


const toast = useToast();
const errorToast = (toastErrorMessage: string) => {
  toast.add({
    severity: 'error',
    summary: 'Chyba',
    detail: toastErrorMessage,
    life: 5000
  })
}

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()

// Reactive state
const post = ref<PostDTO | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const allComments = ref<CommentDTO[]>([]) // Všetky načítané komentáre z API
const displayedCommentsCount = ref(0) // Počet momentálne zobrazených komentárov
const initialLoadCount = 3 // Počet komentárov pri prvom načítaní
const loadMoreCount = 3 // Počet komentárov pri kliknutí na "Load more"
const commentsLoading = ref(true)
const commentLoading = ref(false)
const comment = ref('')
const likedCommentIds = ref<Set<string>>(new Set())
const home = ref({
  icon: 'pi pi-home',
  route: '/'
})
const items = ref<Array<{ label: string; route?: any }>>([])

// Computed properties
const displayedComments = computed(() => {
  // Vráti len tie komentáre, ktoré sa majú zobraziť
  return allComments.value.slice(0, displayedCommentsCount.value)
})

const hasMoreComments = computed(() => {
  // Skontroluje, či sú ešte nejaké komentáre na načítanie
  return displayedCommentsCount.value < allComments.value.length
})

const canDeletePost = computed(() => {
  const userId = authStore.user?.id
  const isOwner = post.value && post.value.userId === userId
  return isOwner || authStore.isAdminOrModerator
})

// Methods
const fetchPost = async () => {
  try {
    const postData = await PostsApi.getPost(props.id)

    // Simple flat structure - no nested objects!
    post.value = postData

    // Build breadcrumb using flat data
    items.value = []
    if (postData.subjectName) {
        items.value.push({
            label: postData.subjectName,
            route: { path: '/subjects', query: { subject: postData.subjectName } }
        });
    }
    items.value.push({
        label: postData.title
    });

  } catch (err) {
    error.value = (err as Error).message
    console.error('Error fetching post details:', err)
  } finally {
    loading.value = false
  }
}

const fetchComments = async () => {
  try {
    allComments.value = await CommentsApi.fetchComments(props.id, 1, 100)
    // Zobraz prvé 3 komentáre
    displayedCommentsCount.value = Math.min(initialLoadCount, allComments.value.length)
  } catch (err) {
    console.error('Error fetching comments:', err)
  } finally {
    commentsLoading.value = false
  }
}

const canDeleteComment = (commentData: CommentDTO) => {
  const userId = authStore.user?.id
  const isOwner = commentData.userId === userId
  return isOwner || authStore.isAdminOrModerator
}

const loadMoreComments = () => {
  // Pridaj ďalšie 3 komentáre k zobrazeniu
  const newCount = displayedCommentsCount.value + loadMoreCount
  displayedCommentsCount.value = Math.min(newCount, allComments.value.length)
}

const addComment = async () => {
  try {
    commentLoading.value = true
    
    await CommentsApi.createComment(props.id, { content: comment.value })
    
    toast.add({
      severity: 'success',
      summary: 'Úspech',
      detail: 'Komentár bol úspešne pridaný',
      life: 3000
    })
    
    comment.value = ''
    await fetchComments()
  } catch (err) {
    console.error('Error adding comment:', err)
    errorToast('Nepodarilo sa pridať komentár')
  } finally {
    commentLoading.value = false
  }
}

const deletePost = async () => {
  if (!confirm('Naozaj chcete zmazať tento príspevok?')) {
    return
  }

  try {
    await PostsApi.deletePost(props.id)
    
    toast.add({
      severity: 'success',
      summary: 'Úspech',
      detail: 'Príspevok bol úspešne zmazaný',
      life: 3000
    })
    
    // Redirect to home after successful deletion
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err) {
    error.value = (err as Error).message
    console.error('Error deleting post:', err)
    errorToast('Nepodarilo sa zmazať príspevok')
  }
}

const deleteComment = async (commentId: string) => {
  if (!confirm('Naozaj chcete zmazať tento komentár?')) {
    return
  }

  try {
    await CommentsApi.deleteComment(commentId)
    
    toast.add({
      severity: 'success',
      summary: 'Úspech',
      detail: 'Komentár bol úspešne zmazaný',
      life: 3000
    })
    
    // Optimistically remove from local state for instant UI update
    allComments.value = allComments.value.filter(c => c.id !== commentId)
    displayedCommentsCount.value = Math.min(displayedCommentsCount.value, allComments.value.length)
  } catch (err) {
    console.error('Error deleting comment:', err)
    errorToast('Nepodarilo sa zmazať komentár')
  }
}

const fetchMyLikes = async () => {
  try {
    const myLikes = await LikesApi.getMyLikes()
    likedCommentIds.value = new Set(
      myLikes
        .filter(like => like.commentId)
        .map(like => like.commentId as string)
    )
  } catch (error) {
    // Silently fail
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchPost()
  fetchComments()
  fetchMyLikes()
})
</script>