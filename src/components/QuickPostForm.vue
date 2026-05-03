<template>
  <section
    class="lg:mx-0 bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl shadow p-6 min-w-[300px] w-full">
    <div class="flex flex-col gap-5">
      <div class="flex items-center gap-4">
        <Avatar icon="pi pi-user" size="large"
          shape="circle" class="bg-blue-50 dark:bg-blue-900/30 border border-solid border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-300" />
        <InputText id="title" v-model="title" placeholder="Nadpis"
          class="flex-1 w-fill p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />
      </div>

      <Textarea autoResize id="description" v-model="description" placeholder="Chceš sa niečo spýtať alebo napísať?"
        rows="4"
        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-black/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500" />

        <div class="w-full flex md:flex-row flex-col items-center gap-4">
      <Select v-model="selectedSubject" :options="subjects" optionLabel="name" placeholder="Vyber predmet"
        :disabled="!!subject" filter filterPlaceholder="Hladaj predmet..." class="w-full" :pt="{
          root: { class: 'w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-black/50' },
          label: { class: 'text-gray-900 dark:text-white p-3' },
          item: { class: 'p-3' }
        }" />

      <!-- File Upload Area -->
      <div class="w-full">
        <input ref="fileInput" type="file" multiple accept="image/*,.pdf,.doc,.docx" @change="handleFileSelect"
          class="hidden" />
        <button type="button" @click="triggerFileInput"
          class="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 bg-white/70 dark:bg-black/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group cursor-pointer bg-transparent"
        >
          <div
            class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <i class="pi pi-cloud-upload text-xl"></i>
            <span class="text-sm font-medium">Pridať súbory (obrázky, PDF, dokumenty)</span>
          </div>
        </button>
        
      </div>
      </div>

      <div v-if="selectedFiles.length > 0" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="(file, index) in selectedFiles" :key="index"
            class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 group">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div
                class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30">
                <i :class="[getFileIcon(file.name), 'text-blue-600 dark:text-blue-400 text-sm']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>
            <button type="button" title="Odstrániť" @click="removeFile(index)"
              class="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 bg-transparent border-none rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>

      <div class="flex justify-end">
        <PrimaryButton :text="isLoading ? 'Odosielam...' : 'Odoslať'" icon="pi pi-send"
          class="w-full sm:w-auto justify-center" @click="createPost" :disabled="isLoading" />
      </div>
    </div>
    <Toast />
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import PrimaryButton from "@/components/PrimaryButton.vue"
import Avatar from "primevue/avatar"
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { PostsApi, SubjectsApi } from '@/services/api'
import type { SubjectDTO, CreatePostRequest } from '@/types/api'
import { FilesApi } from '@/services/api/files-api'

// Define props
const props = defineProps<{
  subject?: SubjectDTO
}>()

// Define emits
const emit = defineEmits(['post-created'])

// Toast setup
const toast = useToast()

// Reactive state
const title = ref<string>('')
const description = ref<string>('')
const selectedSubject = ref<SubjectDTO | null>(null)
const subjects = ref<SubjectDTO[]>([])
const isLoading = ref<boolean>(false)
const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// File handling methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Max file size: 50MB (same as backend)
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB in bytes

  // Allowed extensions (same as backend)
  const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'zip']

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Súbor ${file.name} je príliš veľký (max 50MB)`
    }
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Súbor ${file.name} má nepovolený formát (povolené: PDF, PNG, JPG, ZIP)`
    }
  }

  return { valid: true }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)

    // Validate each file
    const validFiles: File[] = []
    for (const file of newFiles) {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else if (validation.error) {
        toast.add({
          severity: 'error',
          summary: 'Neplatný súbor',
          detail: validation.error,
          life: 5000
        })
      }
    }

    // Add valid files to selection
    if (validFiles.length > 0) {
      selectedFiles.value = [...selectedFiles.value, ...validFiles]
    }

    // Reset input to allow selecting the same file again
    target.value = ''
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const getFileIcon = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return 'pi pi-file-pdf'
    case 'doc':
    case 'docx':
      return 'pi pi-file-word'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'pi pi-image'
    default:
      return 'pi pi-file'
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Methods
const fetchSubjects = async () => {
  // Don't fetch if a subject is passed as a prop
  if (props.subject) {
    return;
  }
  try {
    subjects.value = await SubjectsApi.fetchSubjects();
  } catch (error) {
    errorToast((error as Error).message + ' - Nepodarilo sa načítať kategórie');
    console.error('Error fetching subjects:', error);
  }
};

const errorToast = (toastErrorMessage: string) => {
  toast.add({
    severity: 'error',
    summary: 'Chyba',
    detail: toastErrorMessage,
    life: 5000
  })
}

const createPost = async () => {
  if (!title.value || !description.value || !selectedSubject.value) {
    errorToast('Prosím, vyplňte všetky polia')
    return
  }

  isLoading.value = true

  try {
    const postData: CreatePostRequest = {
      title: title.value,
      description: description.value,
      subjectId: selectedSubject.value.id,
    };

    const newPost = await PostsApi.createPost(postData);

    if (newPost) {
      // Upload files in parallel if any
      if (selectedFiles.value.length > 0) {
        const totalFiles = selectedFiles.value.length

        // Show uploading toast
        toast.add({
          severity: 'info',
          summary: 'Nahrávam súbory',
          detail: `Nahrávam ${totalFiles} súborov...`,
          life: 3000
        })

        // Upload all files in parallel using Promise.allSettled
        const uploadResults = await Promise.allSettled(
          selectedFiles.value.map(file => FilesApi.uploadFile(newPost.id, file))
        )

        // Count successful uploads
        const successCount = uploadResults.filter(result => result.status === 'fulfilled').length
        const failedFiles = uploadResults
          .map((result, index) => ({
            result,
            file: selectedFiles.value[index]
          }))
          .filter(({ result, file }) => result.status === 'rejected' && file !== undefined)

        // Show failed uploads
        failedFiles.forEach(({ file }) => {
          if (file) {
            toast.add({
              severity: 'warn',
              summary: 'Chyba nahrávania',
              detail: `Nepodarilo sa nahrať súbor ${file.name}`,
              life: 5000
            })
          }
        })

        // Show success toast if all uploaded successfully
        if (successCount === totalFiles) {
          toast.add({
            severity: 'success',
            summary: 'Súbory nahrané',
            detail: 'Všetky súbory boli úspešne nahrané',
            life: 3000
          })
        } else if (successCount > 0) {
          toast.add({
            severity: 'warn',
            summary: 'Čiastočne nahrané',
            detail: `${successCount} z ${totalFiles} súborov bolo úspešne nahraných`,
            life: 3000
          })
        }
      }

      title.value = ''
      description.value = ''
      if (!props.subject) {
        selectedSubject.value = null
      }
      selectedFiles.value = []

      emit('post-created')
      toast.add({ severity: 'success', summary: 'Úspech', detail: 'Príspevok bol úspešne vytvorený!', life: 3000 });
    }
  } catch (error) {
    const err = error as any;
    if (err.response?.status === 401) {
      errorToast('Pre vytvorenie príspevku sa musíte najprv prihlásiť')
      return
    }
    errorToast(err.response?.data?.message || err.message || 'Nastala chyba pri vytváraní príspevku')
    console.error('Create post error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.subject) {
    selectedSubject.value = props.subject;
    subjects.value = [props.subject];
  } else {
    fetchSubjects();
  }
});

// Watch for changes in the subject prop
watch(() => props.subject, (newSubject) => {
  if (newSubject) {
    selectedSubject.value = newSubject;
    subjects.value = [newSubject];
  }
});
</script>