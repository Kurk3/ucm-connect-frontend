<template>
  <main class="flex flex-col flex-1 gap-8">
    <QuickPostForm @post-created="refreshFeed" />
    <MainContent ref="mainContentRef" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuickPostForm from "@/components/QuickPostForm.vue";
import MainContent from '../components/MainContent.vue';

const mainContentRef = ref();

const refreshFeed = () => {
  if (mainContentRef.value) {
    mainContentRef.value.fetchPosts();
  }
};
</script>