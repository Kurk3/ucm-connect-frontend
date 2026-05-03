<template>
  <section class="flex flex-col flex-1 gap-4">
    <!-- Content card -->
    <div class="w-full bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 border border-solid border-red-400 dark:border-red-500 text-red-700 dark:text-red-300">
          <i class="pi pi-cog text-xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Sprava pouzivatelov, prispevkov a komentarov</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin-panel">
        <TabView>
          <TabPanel value="users">
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-users"></i>
                <span>Pouzivatelia</span>
              </div>
            </template>
            <div class="mt-4">
              <UserManagement />
            </div>
          </TabPanel>

          <TabPanel value="subjects">
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-book"></i>
                <span>Predmety</span>
              </div>
            </template>
            <div class="mt-4">
              <SubjectManagement />
            </div>
          </TabPanel>

          <TabPanel value="posts">
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-file"></i>
                <span>Prispevky</span>
              </div>
            </template>
            <div class="mt-4">
              <PostManagement />
            </div>
          </TabPanel>

          <TabPanel value="comments">
            <template #header>
              <div class="flex items-center gap-2">
                <i class="pi pi-comments"></i>
                <span>Komentare</span>
              </div>
            </template>
            <div class="mt-4">
              <CommentManagement />
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <Toast />
    <ConfirmDialog />
  </section>
</template>

<script setup lang="ts">
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import UserManagement from '@/components/admin/UserManagement.vue'
import SubjectManagement from '@/components/admin/SubjectManagement.vue'
import PostManagement from '@/components/admin/PostManagement.vue'
import CommentManagement from '@/components/admin/CommentManagement.vue'
</script>

<style scoped>
.admin-panel :deep(.p-tabview-panels),
.admin-panel :deep(.p-tabview-nav),
.admin-panel :deep(.p-datatable),
.admin-panel :deep(.p-paginator),
.admin-panel :deep(.p-datatable-thead > tr > th),
.admin-panel :deep(.p-datatable-tbody > tr > td),
.admin-panel :deep(.p-datatable-tbody > tr),
.admin-panel :deep(.p-datatable-table),
.admin-panel :deep(.p-datatable-header),
.admin-panel :deep(.p-select),
.admin-panel :deep(.p-tabview-nav-link),
.admin-panel :deep(.p-tabview-nav-container),
.admin-panel :deep(.p-tabview-nav-content),
.admin-panel :deep(.p-tab),
.admin-panel :deep(.p-tabs),
.admin-panel :deep(.p-tablist),
.admin-panel :deep([data-pc-section="nav"]),
.admin-panel :deep([data-pc-section="tablist"]),
.admin-panel :deep([role="tablist"]) {
  background: transparent !important;
}
</style>
