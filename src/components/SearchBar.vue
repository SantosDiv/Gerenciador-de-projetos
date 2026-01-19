<script lang="ts" setup>
  import {ref, onMounted, onUnmounted } from 'vue';
  import backwardHistory from '@/assets/icons/backward-history.svg';
  import { useProjectsStore } from '@/stores/projects.store';
  import { useToast } from 'vue-toastification';
  import { useRouter } from 'vue-router';

  const store = useProjectsStore();
  const localSearchQuery = ref(store.searchTerm);
  const searchSection = ref<HTMLElement | null>(null);
  const toast = useToast();
  const router = useRouter();

  // Debounce timeout
  let searchTimeout: number;

  const emit = defineEmits<{
    close: []
  }>();

  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    
    if (target.closest('[data-search-trigger]')) {
      return;
    }
    
    if (searchSection.value && !searchSection.value.contains(target)) {
      emit('close');
    }
  };

  const handleSearchInput = () => {
    store.searchTerm = localSearchQuery.value;
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const term = localSearchQuery.value.trim();
    
    if (!term) {
      if (router.currentRoute.value.path === '/search') {
        router.push('/');
      }
      return;
    }

    searchTimeout = window.setTimeout(async () => {
      if (term.length >= 3) {
        try {
          await store.searchByTerm(term);
          if (router.currentRoute.value.path !== '/search') {
            router.push('/search');
          }
        } catch (error) {
          toast.error('Erro ao buscar projetos. Por favor, tente novamente mais tarde.');
          console.error('Erro ao buscar projetos:', error);
        }
      }
    }, 300);
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    localSearchQuery.value = store.searchTerm;
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  });

</script>

<template>
  <section 
    ref="searchSection"
    class="absolute top-0 w-full flex flex-col justify-center items-center bg-white border-2 border-secondary rounded-2xl p-4 shadow-lg"
  >
    <div class="flex items-center gap-2 w-full">
      <v-icon name="ri-search-line" class="w-6 h-6 cursor-pointer text-secondary" />
      <input
        type="text"
        placeholder="Digite o nome do projeto..."
        class="rounded-md p-2 w-full focus:outline-none text-gray"
        v-model="localSearchQuery"
        @input="handleSearchInput"
      />
    </div>
    <ul class="w-full">
      <li class="flex items-center justify-between text-gray border-t border-secondary-light p-2 mt-2">
        <div class="flex items-center gap-4">
          <img :src="backwardHistory" alt="Ícone de histórico de navegação para trás" class="h-4 cursor-pointer text-secondary" />
          <span>Pesquisa 1</span>
        </div>
        <v-icon name="md-close-round" class="w-6 h-6 cursor-pointer text-gray" />
      </li>
    </ul>
  </section>
</template>
