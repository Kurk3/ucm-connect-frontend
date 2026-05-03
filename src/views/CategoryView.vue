<template>
  <main class="flex flex-col flex-1 gap-4 p-6 lg:p-8 bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-2xl mb-20">
     <h1 class="text-3xl">Predmety</h1>

    <CustomSelect
        v-model="vybranyPredmet"
        :options="subjects"
        optionLabel="name"
        placeholder="Vyber predmet"
        class="mb-2"
    />

    <!-- Tabs -->
    <div v-if="vybranyPredmet" class="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 w-full">
      <button
        @click="activeTab = 'diskusia'"
        :class="activeTab === 'diskusia' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        class="px-4 py-3 sm:py-2 text-base sm:text-lg transition-colors w-full sm:w-auto text-left sm:text-center flex flex-row items-center justify-start sm:justify-center"
      >
        <i class="pi pi-comments mr-2"></i>Diskusia
      </button>
      <button
        @click="activeTab = 'navody'"
        :class="activeTab === 'navody' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        class="px-4 py-3 sm:py-2 text-base sm:text-lg transition-colors w-full sm:w-auto text-left sm:text-center flex flex-row items-center justify-start sm:justify-center"
      >
        <i class="pi pi-info-circle mr-2"></i>Informácie a Návody
      </button>
    </div>

    <!-- Content for Návody -->
    <section v-if="activeTab === 'navody' && vybranyPredmet">
      <div v-if="currentNavod" class="subject-details text-gray-700 dark:text-gray-200">
        <SubjectContent :content="currentNavod.content" />
      </div>
      <div v-else class="placeholder-content flex flex-col items-center justify-center py-16 px-6 text-center">
        <div class="mb-4 text-5xl opacity-50">📖</div>
        <h2 class="text-xl font-medium text-gray-800 dark:text-gray-100 mb-2">
          Žiadne návody
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-md">
          Pre tento predmet zatiaľ nemáme spracované podrobné informácie a návody. Môžeš sa však spýtať v diskusii.
        </p>
      </div>
    </section>

    <!-- Content for Diskusia (Posts) -->
    <MainContent 
      v-if="activeTab === 'diskusia' && vybranyPredmet"
      :subject="vybranyPredmet as SubjectDTO" 
    />
    
    <section v-if="!vybranyPredmet" class="placeholder-content flex flex-col items-center justify-center py-16 px-6 text-center mt-8 md:mt-12 pointer-events-none">
          <div class="mb-4 text-5xl opacity-50">📚</div>
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Vyber si predmet
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-md">
            Začni výberom predmetu. Následne si môžeš prečítať návody alebo prezerať príspevky od študentov.
          </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainContent from '@/components/MainContent.vue';
import type { SubjectDTO } from '@/types/api';
import CustomSelect from '@/components/CustomSelect.vue';
import SubjectContent from '@/components/SubjectContent.vue';
import { navodyKuPredmetom } from '@/stores/navodyKuPredmetom';
import { SubjectsApi } from '@/services/api';

const route = useRoute();

const activeTab = ref<'navody' | 'diskusia'>('diskusia');
const vybranyPredmet = ref<SubjectDTO | null>(null);
const subjects = ref<SubjectDTO[]>([]);

const currentNavod = computed(() => {
  if (!vybranyPredmet.value) return null;
  return navodyKuPredmetom.predmety.find(p => p.nazov.toLowerCase() === vybranyPredmet.value!.name.toLowerCase()) || null;
});

const fetchSubjects = async () => {
  try {
    subjects.value = await SubjectsApi.fetchSubjects();
  } catch (error) {
    console.error('Error fetching subjects:', error);
  }
};

const checkAndSelectSubjectFromQuery = () => {
  const subjectName = route.query.subject;
  if (subjectName && typeof subjectName === 'string') {
    const found = subjects.value.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
    vybranyPredmet.value = found || null;
  } else {
    vybranyPredmet.value = null;
  }
};

onMounted(async () => {
  await fetchSubjects();
  checkAndSelectSubjectFromQuery();
});

watch(() => route.query.subject, () => {
  checkAndSelectSubjectFromQuery();
});
</script>
