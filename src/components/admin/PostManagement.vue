<template>
  <div class="flex flex-col gap-4">
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <div v-else>
      <DataTable
        :value="posts"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        responsiveLayout="scroll"
        class="p-datatable-sm"
        :globalFilterFields="['title', 'userName', 'subjectName']"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">Vsetky prispevky ({{ posts.length }})</span>
          </div>
        </template>

        <Column field="title" header="Nazov" sortable style="max-width: 300px">
          <template #body="{ data }">
            <span class="font-medium truncate block" :title="data.title">{{ data.title }}</span>
          </template>
        </Column>

        <Column field="userName" header="Autor" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar icon="pi pi-user" size="normal" shape="circle" />
              <span>{{ data.userName || 'N/A' }}</span>
            </div>
          </template>
        </Column>

        <Column field="subjectName" header="Predmet" sortable></Column>

        <Column field="numberOfComments" header="Komentare" sortable style="width: 100px">
          <template #body="{ data }">
            <span class="flex items-center gap-1">
              <i class="pi pi-comments text-sm"></i>
              {{ data.numberOfComments || 0 }}
            </span>
          </template>
        </Column>

        <Column field="numberOfLikes" header="Lajky" sortable style="width: 80px">
          <template #body="{ data }">
            <span class="flex items-center gap-1">
              <i class="pi pi-heart text-sm"></i>
              {{ data.numberOfLikes || 0 }}
            </span>
          </template>
        </Column>

        <Column field="createdAt" header="Datum" sortable style="width: 120px">
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }}
          </template>
        </Column>

        <Column header="Akcie" style="width: 100px">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="confirmDelete(data)"
              :loading="deletingId === data.id"
              v-tooltip.top="'Zmazat prispevok'"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="showDeleteDialog" header="Zmazat prispevok" :modal="true" :style="{ width: '450px' }">
      <div class="flex items-center gap-3 mb-4">
        <i class="pi pi-exclamation-triangle text-3xl text-orange-500"></i>
        <span>Naozaj chcete zmazat prispevok <strong>{{ postToDelete?.title }}</strong>? Tato akcia sa neda vratit.</span>
      </div>
      <template #footer>
        <Button label="Zrusit" text @click="showDeleteDialog = false" />
        <Button label="Zmazat" severity="danger" @click="deletePost" :loading="deletingId !== null" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { AdminApi } from '@/services/api'

const toast = useToast()

const posts = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const showDeleteDialog = ref(false)
const postToDelete = ref<any>(null)

const fetchPosts = async () => {
  try {
    loading.value = true
    const response = await AdminApi.getAllPosts(0, 100)
    posts.value = response.content || response.posts || response || []
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Nepodarilo sa nacitat prispevky'
  } finally {
    loading.value = false
  }
}

const confirmDelete = (post: any) => {
  postToDelete.value = post
  showDeleteDialog.value = true
}

const deletePost = async () => {
  if (!postToDelete.value) return
  try {
    deletingId.value = postToDelete.value.id
    await AdminApi.deletePost(postToDelete.value.id)
    posts.value = posts.value.filter(p => p.id !== postToDelete.value.id)
    toast.add({ severity: 'success', summary: 'Uspech', detail: 'Prispevok bol zmazany', life: 3000 })
    showDeleteDialog.value = false
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa zmazat prispevok', life: 5000 })
  } finally {
    deletingId.value = null
    postToDelete.value = null
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('sk-SK', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => { fetchPosts() })
</script>
