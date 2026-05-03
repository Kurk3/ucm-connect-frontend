<template>
  <div class="flex flex-col max-w-screen-xl mx-auto">
    <transition name="fade" mode="out-in">
      <Header v-if="!$route.meta.hideLayout" />
    </transition>
    <!-- Mobile Toggle Button (Bottom Left, Floating) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <button
        v-if="!$route.meta.hideLayout && !isSidebarOpen"
        @click="toggleSidebar"
        class="lg:hidden fixed bottom-6 left-6 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Open sidebar"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>
    </Transition>

    <div class="flex lg:flex-row flex-col-reverse gap-0 lg:gap-4">
      <!-- Sidebar: Fixed width on desktop, doesn't grow -->
      <!-- Mobile: Fullscreen Modal -->
      <!-- Mobile: Fullscreen Modal with Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!$route.meta.hideLayout && isMobile && isSidebarOpen"
          @click="closeSidebar"
          class="fixed inset-0 bg-black/50 z-30 lg:hidden"
        ></div>
      </Transition>

      <!-- Sidebar Container -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div 
          v-if="!$route.meta.hideLayout && isSidebarOpen"
          class="fixed top-0 left-0 bottom-0 w-80 z-40 lg:hidden"
        >
          <Sidebar />
        </div>
      </Transition>

      <!-- Desktop Sidebar (Always visible - collapsed or expanded) -->
      <div 
        v-if="!$route.meta.hideLayout"
        class="hidden lg:block lg:flex-shrink-0"
        :class="isSidebarOpen ? 'w-full lg:max-w-80 xl:w-96' : 'w-auto'"
      >
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <!-- Expanded Sidebar -->
          <Sidebar v-if="isSidebarOpen" key="expanded" />
          
          <!-- Collapsed Sidebar Button -->
          <div v-else key="collapsed" class="flex flex-col gap-4">
            <button
              @click="openSidebar"
              class="w-14 h-14 flex items-center justify-center rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Open sidebar"
            >
              <i class="pi pi-bars text-xl text-gray-700 dark:text-gray-200"></i>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Main content: Grows to fill remaining space -->
      <div class="flex-1 min-w-0 transition-all duration-300 ease-out">
        <!-- <h1 v-if="pageTitle" class="mx-5 underline text-2xl lg:text-3xl py-2 text-gray-900 dark:text-white">{{ pageTitle }}</h1> -->
        <router-view v-slot="{ Component, route }">
          <transition :name="typeof route.meta.transition === 'string' ? route.meta.transition : 'fade'" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </div>

    <Footer v-if="!$route.meta.hideLayout" />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";
import { Transition } from "vue";
import { useSidebar } from "@/composables/useSidebar";

const props = defineProps({
  hideLayout: Boolean
});

const { isSidebarOpen, isMobile, toggleSidebar, closeSidebar, openSidebar } = useSidebar();

</script>

<style scoped>
/* Fade transition (pre väčšinu stránok) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition (pre /login) */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
