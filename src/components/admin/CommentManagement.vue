<template>
  <div class="flex flex-col gap-4">
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <div v-else>
      <!-- Post selector -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Vyberte prispevok pre zobrazenie komentarov:</label>
        <Select
          v-model="selectedPost"
          :options="posts"
          optionLabel="title"
          optionValue="id"
          placeholder="Vyberte prispevok..."
          class="w-full"
          filter
          @change="fetchComments"
        />
      </div>

      <!-- Comments table -->
      <div v-if="selectedPost && !commentsLoading">
        <DataTable
          :value="comments"
          :paginator="comments.length > 10"
          :rows="10"
          stripedRows
          responsiveLayout="scroll"
          class="p-datatable-sm"
        >
          <template #header>
            <span class="text-lg font-semibold">Komentare ({{ comments.length }})</span>
          </template>

          <template #empty>
            <div class="text-center py-4 text-gray-500">Ziadne komentare k tomuto prispevku</div>
          </template>

          <Column field="userName" header="Autor" sortable style="width: 150px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Avatar icon="pi pi-user" size="normal" shape="circle" />
                <span>{{ data.userName || 'N/A' }}</span>
              </div>
            </template>
          </Column>

          <Column field="content" header="Obsah" sortable>
            <template #body="{ data }">
              <span class="block truncate" style="max-width: 400px" :title="data.content">{{ data.content }}</span>
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
                v-tooltip.top="'Zmazat komentar'"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <div v-else-if="commentsLoading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <i class="pi pi-comments text-4xl mb-2 block"></i>
        <p>Vyberte prispevok pre zobrazenie komentarov</p>
      </div>
    </div>

    <Dialog v-model:visible="showDeleteDialog" header="Zmazat komentar" :modal="true" :style="{ width: '450px' }">
      <div class="flex items-center gap-3 mb-4">
        <i class="pi pi-exclamation-triangle text-3xl text-orange-500"></i>
        <span>Naozaj chcete zmazat tento komentar? Tato akcia sa neda vratit.</span>
      </div>
      <div v-if="commentToDelete" class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm mb-4">
        <strong>{{ commentToDelete.userName }}:</strong> {{ commentToDelete.content }}
      </div>
      <template #footer>
        <Button label="Zrusit" text @click="showDeleteDialog = false" />
        <Button label="Zmazat" severity="danger" @click="deleteComment" :loading="deletingId !== null" />
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
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { AdminApi } from '@/services/api'

const toast = useToast()

const posts = ref<any[]>([])
const comments = ref<any[]>([])
const loading = ref(true)
const commentsLoading = ref(false)
const error = ref<string | null>(null)
const selectedPost = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const showDeleteDialog = ref(false)
const commentToDelete = ref<any>(null)

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

const fetchComments = async () => {
  if (!selectedPost.value) return
  try {
    commentsLoading.value = true
    const response = await AdminApi.getCommentsByPost(selectedPost.value)
    comments.value = response.content || response.comments || response || []
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa nacitat komentare', life: 5000 })
  } finally {
    commentsLoading.value = false
  }
}

const confirmDelete = (comment: any) => {
  commentToDelete.value = comment
  showDeleteDialog.value = true
}

const deleteComment = async () => {
  if (!commentToDelete.value) return
  try {
    deletingId.value = commentToDelete.value.id
    await AdminApi.deleteComment(commentToDelete.value.id)
    comments.value = comments.value.filter(c => c.id !== commentToDelete.value.id)
    toast.add({ severity: 'success', summary: 'Uspech', detail: 'Komentar bol zmazany', life: 3000 })
    showDeleteDialog.value = false
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa zmazat komentar', life: 5000 })
  } finally {
    deletingId.value = null
    commentToDelete.value = null
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('sk-SK', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => { fetchPosts() })
</script>
