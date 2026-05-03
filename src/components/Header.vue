<template>
  <header 
    id="header" 
    class="relative top-5 z-10 lg:mb-20 mb-12 scale-100"
  >
    <nav class="flex items-center justify-between gap-2 sm:gap-8">
      <!-- Start: Logo (Always visible) -->
      <router-link to="/" class="flex-shrink-0">
        <img 
          src="../assets/img/ucm-connect-logo-white.png" 
          alt="UCM Connect" 
          class="sm:h-10 h-6 w-auto min-w-[100px]"
        />
      </router-link>

      <!-- Center: Navigation with Sliding Bubble (Desktop only) -->
      <div class="hidden lg:flex flex-1 justify-center">
        <nav class="relative inline-flex items-center gap-0 p-2 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm shadow-sm">
          <!-- Sliding Bubble Background -->
          <div 
            class="absolute h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-700 dark:to-blue-700 transition-all duration-300 ease-out shadow-md"
            :style="bubbleStyle"
          ></div>

          <!-- Menu Items -->
          <router-link
            v-for="(item, index) in items"
            :key="item.label"
            :to="item.route || '/'"
            :ref="el => { if (el) itemRefs[index] = el as any }"
            @click="updateBubblePosition(index)"
            class="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            :class="isActive(item.route) 
              ? 'text-white' 
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500'"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </div>

      <!-- End: Action Buttons (Desktop only) -->
      <div class="hidden lg:flex items-center gap-2 flex-shrink-0 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm shadow-sm p-2">
        <ThemeToggle />

        <button
          @click="handleLogout"
          class="p-3 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
          aria-label="Odhlásiť sa"
        >
          <i class="pi pi-sign-out text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500"></i>
        </button>
      </div>

      <!-- Mobile/Tablet: Icon Navigation -->
      <div class="lg:hidden flex items-center gap-2 bg-white/70 dark:bg-black/50 backdrop-blur-sm shadow-sm p-1.5 px-3 rounded-full shrink-0">
        <ThemeToggle class="origin-center" />

        <div class="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>

        <button
          @click="handleLogout"
          class="p-1 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500"
          aria-label="Odhlásiť sa"
          title="Odhlásiť sa"
        >
          <i class="pi pi-sign-out text-[1.2rem]"></i>
        </button>
      </div>
    </nav>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from "@/components/ThemeToggle.vue";
import { AuthApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import type { UserDTO } from '@/types/user';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  url?: string;
  target?: string;
  items?: MenuItem[];
  separator?: boolean;
  command?: () => void;
}

const currentUser = ref<UserDTO | null>(null);

// Menu items for authenticated users only
// (unauthenticated users are redirected to login by router guard)
const items = ref<MenuItem[]>([
  { 
    label: 'Domov', 
    icon: 'pi pi-home', 
    route: '/' 
  },
  {
    label: 'Predmety',
    icon: 'pi pi-book',
    route: '/subjects'
  },
  { 
    label: 'Môj profil', 
    icon: 'pi pi-user', 
    route: '/users/me' 
  }
]);



// Sliding bubble state
const itemRefs = ref<any[]>([]);
const bubbleStyle = ref({
  width: '0px',
  left: '0px',
  opacity: '0'
});

const isActive = (itemRoute?: string): boolean => {
  if (!itemRoute) return false;
  return route.path === itemRoute;
};

const updateBubblePosition = async (index: number) => {
  await nextTick();
  const element = itemRefs.value[index];
  if (element && element.$el) {
    const el = element.$el as HTMLElement;
    const parent = el.parentElement;
    if (parent) {
      bubbleStyle.value = {
        width: `${el.offsetWidth}px`,
        left: `${el.offsetLeft}px`,
        opacity: '1'
      };
    }
  }
};

const initBubblePosition = async () => {
  await nextTick();
  const activeIndex = items.value.findIndex(item => isActive(item.route));
  if (activeIndex !== -1) {
    updateBubblePosition(activeIndex);
  } else {
    // Hide bubble if no active route is found
    bubbleStyle.value.opacity = '0';
  }
};

const checkLoginStatus = async (): Promise<void> => {
  // Get current user info if available
  const user = AuthApi.getCurrentUser();
  if (user) {
    currentUser.value = user;
  }
};

// Logout handler
const handleLogout = async () => {
  await authStore.logout();
  await router.push('/login');
};

// Watch route changes to update bubble position
watch(() => route.path, async () => {
  await initBubblePosition();
});

onMounted(async () => {
  checkLoginStatus();
  window.addEventListener('storage', checkLoginStatus);
  
  // Initialize bubble position
  await initBubblePosition();
  
  // Update on window resize
  window.addEventListener('resize', initBubblePosition);
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', checkLoginStatus);
  window.removeEventListener('resize', initBubblePosition);
})
</script>

<style scoped>
/* Smooth transition for header scaling */
#header {
  transition: transform 0.3s ease-in-out;
  transform-origin: top center;
}
</style>