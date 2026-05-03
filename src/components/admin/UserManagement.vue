<template>
  <div class="flex flex-col gap-4">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- Error -->
    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <!-- Users Table -->
    <div v-else>
      <DataTable
        :value="users"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20]"
        stripedRows
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <Column field="name" header="Meno" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar icon="pi pi-user" size="normal" shape="circle" />
              <span class="font-medium">{{ data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="email" header="Email" sortable></Column>

        <Column field="role" header="Rola" sortable>
          <template #body="{ data }">
            <RoleBadge :role="data.role" />
          </template>
        </Column>

        <Column field="emailVerified" header="Overeny">
          <template #body="{ data }">
            <i :class="data.emailVerified ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"></i>
          </template>
        </Column>

        <Column field="createdAt" header="Vytvoreny" sortable>
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }}
          </template>
        </Column>

        <Column header="Akcie" style="width: 200px">
          <template #body="{ data }">
            <Select
              v-model="data.role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Zmen rolu"
              class="w-full"
              @change="updateRole(data.id, data.role)"
              :disabled="updatingUserId === data.id"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Select from 'primevue/select'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { AdminApi } from '@/services/api'
import type { UserDTO } from '@/types/api'
import type { UserRole } from '@/types/user'
import RoleBadge from '@/components/RoleBadge.vue'

const toast = useToast()

const users = ref<UserDTO[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const updatingUserId = ref<string | null>(null)

const roleOptions = [
  { label: 'User', value: 'USER' as UserRole },
  { label: 'Moderator', value: 'MODERATOR' as UserRole },
  { label: 'Admin', value: 'ADMIN' as UserRole }
]

const fetchUsers = async () => {
  try {
    loading.value = true
    users.value = await AdminApi.getAllUsers()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Nepodarilo sa nacitat pouzivatelov'
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const updateRole = async (userId: string, newRole: UserRole) => {
  try {
    updatingUserId.value = userId
    await AdminApi.updateUserRole(userId, { role: newRole })
    toast.add({
      severity: 'success',
      summary: 'Uspech',
      detail: 'Rola bola uspesne zmenena',
      life: 3000
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Nepodarilo sa zmenit rolu'
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Nepodarilo sa zmenit rolu',
      life: 5000
    })
    // Refresh to restore original role
    await fetchUsers()
  } finally {
    updatingUserId.value = null
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
  fetchUsers()
})
</script>
