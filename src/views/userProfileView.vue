<template>
  <div class="w-full mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" />
    </div>

    <template v-else-if="user">
      <!-- Header Card -->
      <div class="bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-6">
        <!-- Cover Image -->
        <div class="h-32 sm:h-48 bg-gradient-to-r from-blue-700/70 to-purple-700/80 relative -z-10 mb-3">
        </div>

        <!-- Profile Info -->
        <div class="px-6 pb-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
            <!-- Avatar -->
            <div class="relative group">
              <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <i class="pi pi-user text-5xl text-blue-700 dark:text-blue-300"></i>
              </div>
            </div>

            <!-- User Info -->
            <div class="flex-1 text-center sm:text-left mt-4 sm:mt-0 sm:ml-4">
              <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ user.name }}</h1>
              <p class="text-gray-200 mt-1">@{{ user.nickName }}</p>

              <!-- Role Badge -->
              <span :class="roleBadgeClass" class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold">
                {{ roleLabel }}
              </span>
            </div>

            <!-- Edit Button -->
            <button
              v-if="!isEditing"
              @click="isEditing = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg sm:mb-4 cursor-pointer"
            >
              <i class="pi pi-pencil mr-2"></i>
              Upraviť profil
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Personal Info -->
        <div class="lg:col-span-1 space-y-6">
          <!-- About Card -->
          <div class="bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="pi pi-info-circle text-blue-600"></i>
              O mne
            </h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <i class="pi pi-envelope text-gray-500 dark:text-gray-400 mt-1"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ user.email }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i class="pi pi-verified text-gray-500 dark:text-gray-400 mt-1"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Email overený</p>
                  <p class="text-sm text-gray-900 dark:text-white">
                    <span v-if="user.emailVerified" class="text-green-600 dark:text-green-400">Áno</span>
                    <span v-else class="text-red-600 dark:text-red-400">Nie</span>
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i class="pi pi-shield text-gray-500 dark:text-gray-400 mt-1"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Rola</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ roleLabel }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i class="pi pi-calendar text-gray-500 dark:text-gray-400 mt-1"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Registrovaný</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ formattedDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Edit Profile Form -->
          <div v-if="isEditing" class="bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <i class="pi pi-user-edit text-blue-600"></i>
              Upraviť osobné údaje
            </h2>

            <form class="space-y-6" @submit.prevent="saveProfile">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meno
                </label>
                <input
                  type="text"
                  v-model="editForm.name"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <!-- Email (read only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span class="text-xs text-gray-400">(nie je možné zmeniť)</span>
                </label>
                <input
                  type="email"
                  :value="user.email"
                  disabled
                  class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
                >
                  <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-check'" class="mr-2"></i>
                  {{ saving ? 'Ukladám...' : 'Uložiť zmeny' }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all cursor-pointer"
                >
                  <i class="pi pi-times mr-2"></i>
                  Zrušiť
                </button>
              </div>
            </form>
          </div>

          <!-- User's Posts -->
          <div class="bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <i class="pi pi-file-edit text-blue-600"></i>
              Moje príspevky
            </h2>

            <div v-if="postsLoading" class="flex justify-center py-8">
              <ProgressSpinner style="width:40px;height:40px" strokeWidth="4" />
            </div>

            <div v-else-if="userPosts.length > 0" class="flex flex-col gap-4">
              <PostCard v-for="post in userPosts" :key="post.id" :post="post" />
            </div>

            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <i class="pi pi-inbox text-4xl mb-3 block opacity-50"></i>
              <p>Zatiaľ si nepridali žiadny príspevok.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Error -->
    <div v-else class="text-center py-16">
      <i class="pi pi-exclamation-circle text-4xl text-red-500 mb-4 block"></i>
      <p class="text-gray-600 dark:text-gray-400">Nepodarilo sa načítať profil.</p>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import PostCard from '@/components/PostCard.vue'
import type { UserDTO } from '@/types/user'
import type { PostDTO } from '@/types/post'
import { UsersApi, PostsApi } from '@/services/api'

const toast = useToast()

// State
const user = ref<UserDTO | null>(null)
const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)
const userPosts = ref<PostDTO[]>([])
const postsLoading = ref(true)

// Edit form
const editForm = ref({
  name: ''
})

// Computed
const roleLabel = computed(() => {
  const roles: Record<string, string> = {
    ADMIN: 'Administrátor',
    MODERATOR: 'Moderátor',
    USER: 'Študent'
  }
  return roles[user.value?.role || 'USER'] || 'Študent'
})

const roleBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    MODERATOR: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    USER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  }
  return classes[user.value?.role || 'USER'] || classes.USER
})

const formattedDate = computed(() => {
  if (!user.value?.createdAt) return ''
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString('sk-SK', { year: 'numeric', month: 'long', day: 'numeric' })
})

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    user.value = await UsersApi.getMe()
    editForm.value.name = user.value.name
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
}

const fetchUserPosts = async () => {
  if (!user.value) return
  try {
    postsLoading.value = true
    userPosts.value = await PostsApi.fetchPosts(1, 100, { userId: user.value.id })
  } catch (error) {
    console.error('Error fetching user posts:', error)
  } finally {
    postsLoading.value = false
  }
}

const saveProfile = async () => {
  if (!editForm.value.name.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Meno nemôže byť prázdne',
      life: 3000
    })
    return
  }

  try {
    saving.value = true
    user.value = await UsersApi.updateMe({ name: editForm.value.name })
    isEditing.value = false
    toast.add({
      severity: 'success',
      summary: 'Úspech',
      detail: 'Profil bol úspešne aktualizovaný',
      life: 3000
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Nepodarilo sa aktualizovať profil',
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  if (user.value) {
    editForm.value.name = user.value.name
  }
  isEditing.value = false
}

onMounted(async () => {
  await fetchProfile()
  fetchUserPosts()
})
</script>

<style scoped>
button, a, input, textarea {
  transition: all 0.2s ease-in-out;
}
</style>
