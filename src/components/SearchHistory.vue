<template>
  <ul class="w-full">
    <li
      v-for="(term, index) in historyData"
      :key="index"
      @click.stop="searchByTerm(term)"
      class="cursor-pointer flex items-center justify-between text-gray border-t border-secondary-light p-2 mt-2 hover:bg-gray-100 transition-colors duration-150"
    >
      <div class="flex items-center gap-4">
        <img :src="backwardHistory" alt="Ícone de histórico de navegação para trás" class="h-4 cursor-pointer text-secondary" />
        <span>{{ term }}</span>
      </div>
      <v-icon name="md-close-round" class="w-6 h-6 cursor-pointer text-gray hover:text-primary" @click.stop="removeHistoryTerm(term)" />
    </li>
  </ul>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import backwardHistory from '@/assets/icons/backward-history.svg';
  import { useProjectsStore } from '@/stores/projects.store';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  const historyData = ref<string[]>([]);
  const store = useProjectsStore();
  const router = useRouter();
  const toast = useToast();

  const getHistoryData = () => {
    const data = localStorage.getItem('searchHistory');
    if (data) {
      historyData.value = JSON.parse(data);
    }
  }

  const removeHistoryTerm = (term: string) => {
    const indexTerm = historyData.value.indexOf(term);
    if (indexTerm === -1) return;
    historyData.value.splice(indexTerm, 1);
    localStorage.setItem('searchHistory', JSON.stringify(historyData.value));
  }

  const searchByTerm = async (term: string) => {
    try {
      await store.searchByTerm(term, true);
      if (router.currentRoute.value.path !== '/search') {
        await router.push('/search');
      }
    } catch (error) {
      toast.error('Erro ao buscar projetos. Por favor, tente novamente mais tarde.');
      console.error('Erro ao buscar projetos:', error);
    }
  }

  onMounted(() => {
    getHistoryData();
  })
</script>