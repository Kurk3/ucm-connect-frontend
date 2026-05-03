<template>
  <div class="flex flex-col gap-4">
    <!-- Toolbar -->
    <div class="flex justify-end">
      <PrimaryButton text="Pridat predmet" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- Error -->
    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <!-- Subjects Table -->
    <div v-else>
      <DataTable
        :value="subjects"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        stripedRows
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column field="name" header="Nazov" sortable>
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </Column>

        <Column field="description" header="Popis">
          <template #body="{ data }">
            <span class="text-gray-600 dark:text-gray-400">{{ data.description || '-' }}</span>
          </template>
        </Column>

        <Column field="createdAt" header="Vytvoreny" sortable>
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }}
          </template>
        </Column>

        <Column header="Akcie" style="width: 150px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <button
                type="button"
                title="Upravit"
                class="w-8 h-8 flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors bg-transparent border-none cursor-pointer"
                @click="openEditDialog(data)"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                type="button"
                title="Zmazat"
                class="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors bg-transparent border-none cursor-pointer"
                @click="confirmDelete(data)"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="isEditing ? 'Upravit predmet' : 'Pridat predmet'"
      modal
      :style="{ width: '450px' }"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium">Nazov *</label>
          <InputText
            id="name"
            v-model="formData.name"
            placeholder="Nazov predmetu"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="description" class="font-medium">Popis</label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Popis predmetu (volitelne)"
            rows="3"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <SecondaryButton text="Zrusit" @click="dialogVisible = false" />
        <PrimaryButton
          :text="isEditing ? 'Ulozit' : 'Pridat'"
          @click="saveSubject"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import { SubjectsApi } from '@/services/api'
import type { SubjectDTO } from '@/types/api'

const toast = useToast()
const confirm = useConfirm()

const subjects = ref<SubjectDTO[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)

// Dialog state
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const formData = ref({
  name: '',
  description: ''
})

const fetchSubjects = async () => {
  try {
    loading.value = true
    subjects.value = await SubjectsApi.fetchSubjects()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Nepodarilo sa nacitat predmety'
    console.error('Error fetching subjects:', err)
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { name: '', description: '' }
  dialogVisible.value = true
}

const openEditDialog = (subject: SubjectDTO) => {
  isEditing.value = true
  editingId.value = subject.id
  formData.value = {
    name: subject.name,
    description: subject.description || ''
  }
  dialogVisible.value = true
}

const saveSubject = async () => {
  if (!formData.value.name.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Upozornenie',
      detail: 'Nazov je povinny',
      life: 3000
    })
    return
  }

  try {
    saving.value = true

    if (isEditing.value && editingId.value) {
      await SubjectsApi.updateSubject(editingId.value, formData.value)
      toast.add({
        severity: 'success',
        summary: 'Uspech',
        detail: 'Predmet bol uspesne upraveny',
        life: 3000
      })
    } else {
      await SubjectsApi.createSubject(formData.value)
      toast.add({
        severity: 'success',
        summary: 'Uspech',
        detail: 'Predmet bol uspesne vytvoreny',
        life: 3000
      })
    }

    dialogVisible.value = false
    await fetchSubjects()
  } catch (err: any) {
    const message = err.response?.data?.message || 'Nepodarilo sa ulozit predmet'
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: message,
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (subject: SubjectDTO) => {
  confirm.require({
    message: `Naozaj chcete zmazat predmet "${subject.name}"?`,
    header: 'Potvrdit zmazanie',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteSubject(subject.id),
    reject: () => {}
  })
}

const deleteSubject = async (id: string) => {
  try {
    await SubjectsApi.deleteSubject(id)
    toast.add({
      severity: 'success',
      summary: 'Uspech',
      detail: 'Predmet bol uspesne zmazany',
      life: 3000
    })
    await fetchSubjects()
  } catch (err: any) {
    const message = err.response?.data?.message || 'Nepodarilo sa zmazat predmet'
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: message,
      life: 5000
    })
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchSubjects()
})
</script>
