<template>
  <Tag :value="roleLabel" :severity="severity" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import type { UserRole } from '@/types/user'

const props = defineProps<{
  role: UserRole
}>()

const roleLabel = computed(() => {
  switch (props.role) {
    case 'ADMIN':
      return 'Admin'
    case 'MODERATOR':
      return 'Moderator'
    case 'USER':
    default:
      return 'User'
  }
})

const severity = computed(() => {
  switch (props.role) {
    case 'ADMIN':
      return 'danger'
    case 'MODERATOR':
      return 'info'
    case 'USER':
    default:
      return 'secondary'
  }
})
</script>
