<template>
  <aside
    class="h-full lg:h-min flex flex-col w-full lg:max-w-80 border-gray-300 dark:border-gray-700 p-6 lg:rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-sm gap-8 lg:gap-10 overflow-y-auto relative">
    <!-- Mobile Header -->
    <div class="lg:hidden flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-2">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <i class="pi pi-bars"></i>
        Menu
      </h2>
      <button
        @click="closeSidebar"
        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Close sidebar"
      >
        <i class="pi pi-times text-gray-600 dark:text-gray-400"></i>
      </button>
    </div>

    <!-- Desktop Toggle Button (Top Right) -->
    <button
      @click="closeSidebar"
      class="hidden lg:flex absolute top-2 right-2 z-10 w-10 h-10 items-center justify-center rounded-full transition-all duration-300"
      aria-label="Close sidebar"
    >
      <i class="pi pi-times text-md text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500"></i>
    </button>
    <!-- Navigácia -->
    <div class="block w-full">
      <!-- <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
        <i class="pi pi-compass mr-2"></i> Navigácia
      </h3> -->
      <div class="space-y-3">
        <router-link to="/" @click="handleNavigation"
          class="flex lg:hidden items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
          <i class="pi pi-home text-xl"></i>
          <span>Domov</span>
        </router-link>
        <router-link to="/subjects" @click="handleNavigation"
          class="flex lg:hidden items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
          <i class="pi pi-book text-xl"></i>
          <span>Všetky predmety</span>
        </router-link>
        <router-link to="/favourites" @click="handleNavigation"
          class="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
          <i class="pi pi-heart text-xl"></i>
          <span>Obľúbené</span>
        </router-link>
        <router-link to="/my-posts" @click="handleNavigation"
          class="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
          <i class="pi pi-align-left text-xl"></i>
          <span>Moje príspevky</span>
        </router-link>
      </div>
    </div>

    <!-- Predmety podľa ročníkov -->
    <div class="block w-full border-t border-gray-600/30 dark:border-gray-400/30 pt-4 mt-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
        <i class="pi pi-book mr-2"></i> {{ t('sidebar.sections.subjectsByYear') }}
      </h3>
      <CustomAccordion :items="yearItems" :multiple="true">
        <template #header="{ item }">
          <span class="text-gray-800 dark:text-gray-200">{{ item.title }}</span>
        </template>
        <template #content="{ item }">
          <ul v-if="item.subjects.length > 0" class="space-y-0.5">
            <li v-for="subject in item.subjects" :key="subject.id">
              <router-link :to="{ path: '/subjects', query: { subject: subject.name } }" @click="handleNavigation"
                class="block py-1.5 text-[13px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors truncate">
                {{ subject.name }}
              </router-link>
            </li>
          </ul>
          <p v-else class="text-gray-400 dark:text-gray-500 text-xs py-1">
            {{ t('sidebar.noSubjects') }}
          </p>
        </template>
      </CustomAccordion>
    </div>

    <!-- Admin Panel (only for admins) -->
    <div v-if="authStore.isAdmin" class="block w-full border-t border-gray-600/30 dark:border-gray-400/30 pt-4 mt-4">
      <div class="space-y-3">
        <router-link to="/admin"
          class="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium">
          <i class="pi pi-cog text-xl"></i>
          <span>Admin Panel</span>
        </router-link>
      </div>
    </div>

    <!-- Discord link a Logout -->
    <div class="block w-full border-t border-gray-600/30 dark:border-gray-400/30 pt-4 mt-4">
      <div class="space-y-3">
        <a v-if="discordLinked" href="https://discord.gg/ucm-connect" target="_blank"
          class="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
          <i class="pi pi-discord text-xl"></i>
          <span>Discord prepojený</span>
        </a>
        <a v-else @click="connectDiscord"
          class="flex cursor-pointer items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
          <i class="pi pi-discord text-xl"></i>
          <span>{{ t('sidebar.discord') }}</span>
        </a>
        <a @click="handleLogout"
          class="flex cursor-pointer items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-500 transition-colors">
          <i class="pi pi-sign-out text-xl"></i>
          <span>{{ t('sidebar.logout') }}</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { SubjectDTO } from '@/types/subject'
import { useRouter } from 'vue-router'
import CustomAccordion from '@/components/CustomAccordion.vue'
import { useTranslations } from '@/i18n'
import { SubjectsApi, DiscordApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useSidebar } from '@/composables/useSidebar'

const { t } = useTranslations()
const router = useRouter()
const authStore = useAuthStore()
const { closeSidebar, isMobile } = useSidebar()
const subjects = ref<SubjectDTO[]>([])
const loadingSubjects = ref<boolean>(true)
const discordLinked = ref<boolean>(false)


// Helper function for year labels
const getYearLabel = (year: number): string => {
  const yearLabels = {
    1: t('sidebar.years.first'),
    2: t('sidebar.years.second'),
    3: t('sidebar.years.third'),
    4: t('sidebar.years.fourth')
  }
  return yearLabels[year as keyof typeof yearLabels] || `${year}. ročník`
}

// Filtrovať predmety podľa ročníka na základe popisu
const getSubjectsByYear = (year: number): SubjectDTO[] => {
  return subjects.value.filter(subject => {
    if (!subject.description) return false

    const description = subject.description.toLowerCase()
    const yearString = `${year}. ročník`

    // Check for exact year match
    if (description.includes(yearString)) {
      return true
    }

    // Handle ranges like "2.-3. ročník"
    // If year is 2, match "2.-3."
    // If year is 3, match "2.-3."
    if (year === 2 && (description.includes('2.-3.') || description.includes('1.-2.'))) return true
    if (year === 3 && (description.includes('2.-3.') || description.includes('3.-4.'))) return true
    if (year === 4 && description.includes('3.-4.')) return true

    return false
  })
}

// Prepare accordion items for years
const yearItems = computed(() => {
  return [1, 2, 3, 4].map(year => ({
    title: getYearLabel(year),
    subjects: getSubjectsByYear(year),
    year
  }))
})

// Logout handler
const handleLogout = async () => {
  if (isMobile.value) {
    closeSidebar()
  }
  await authStore.logout()
  await router.push('/login')
}

// Close sidebar on mobile when navigating
const handleNavigation = () => {
  if (isMobile.value) {
    closeSidebar()
  }
}

const connectDiscord = async () => {
  try {
    const { url } = await DiscordApi.getAuthUrl()
    window.location.href = url
  } catch (e) {
    console.error('Failed to get Discord auth URL', e)
  }
}

const checkDiscordStatus = async () => {
  try {
    const status = await DiscordApi.getStatus()
    discordLinked.value = status.linked
  } catch (e) {
    // Ignore - user may not have Discord linked
  }
}

const fetchSubjects = async (): Promise<void> => {
  try {
    loadingSubjects.value = true
    subjects.value = await SubjectsApi.fetchSubjects();
  } catch (error) {
    if ((error as any).response?.status === 401) {
      console.warn('Unauthorized: User not authenticated')
    }
    // Error fetching subjects
  } finally {
    loadingSubjects.value = false
  }
}

onMounted(() => {
  fetchSubjects()
  checkDiscordStatus()
})
</script>
