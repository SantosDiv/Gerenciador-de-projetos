<script lang="ts" setup>
  import {ref, onMounted, onUnmounted, nextTick } from 'vue';
  import { useProjectsStore } from '@/stores/projects.store';
  import { useToast } from 'vue-toastification';
  import { useRouter, useRoute } from 'vue-router';
  import SearchHistory from './SearchHistory.vue';
  import { PATHS } from '@/utils/costs';

  const store = useProjectsStore();
  const localSearchQuery = ref(store.searchTerm);
  const searchSection = ref<HTMLElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();

  // Debounce timeout
  let searchTimeout: number;
  let lastSavedTerm = '';

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
    
    if (term.length < 3) {
      if (router.currentRoute.value.path === PATHS.search) {
        store.$reset();
        router.push('/');
      }
      return;
    }

    searchTimeout = window.setTimeout(async () => {
      if (term.length >= 3) {
        try {
          const shouldSaveToHistory = term !== lastSavedTerm && term.length >= 3;
          
          await store.searchByTerm(term, shouldSaveToHistory);
          
          if (shouldSaveToHistory) {
            lastSavedTerm = term;
          }
          
          if (router.currentRoute.value.path !== PATHS.search) {
            if(route.path !== PATHS.search) {
              await router.push(PATHS.search);
            }
            await nextTick();
            if (inputRef.value) {
              inputRef.value.focus();
            }
          }
        } catch (error) {
          toast.error('Erro ao buscar projetos. Por favor, tente novamente mais tarde.');
          console.error('Erro ao buscar projetos:', error);
        }
      }
    }, 500);
  };

  const handleEnterKey = async () => {
    const term = localSearchQuery.value.trim();
    if (term.length >= 3) {

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      try {
        
        await store.searchByTerm(term, true);
        lastSavedTerm = term;
        
        if (router.currentRoute.value.path !== PATHS.search) {
          if(route.path !== PATHS.search) {
            await router.push(PATHS.search);
          }
          await nextTick();
          if (inputRef.value) {
            inputRef.value.focus();
          }
        }
      } catch (error) {
        toast.error('Erro ao buscar projetos. Por favor, tente novamente mais tarde.');
        console.error('Erro ao buscar projetos:', error);
      }
    }
  };

  onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    localSearchQuery.value = store.searchTerm;
    lastSavedTerm = store.searchTerm;
    
    if (route.path === PATHS.search) {
      await nextTick();
      if (inputRef.value) {
        inputRef.value.focus();
      }
    }
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
    class="absolute z-10 top-0 w-full flex flex-col justify-center items-center bg-white border-2 border-secondary rounded-2xl p-4 shadow-lg"
  >
    <div class="flex items-center gap-2 w-full">
      <v-icon name="ri-search-line" class="w-6 h-6 cursor-pointer text-secondary" />
      <input
        ref="inputRef"
        type="text"
        placeholder="Digite o nome do projeto..."
        class="rounded-md p-2 w-full focus:outline-none text-primary text-lg"
        v-model="localSearchQuery"
        @input="handleSearchInput"
        @keydown.enter="handleEnterKey"
      />
    </div>
    <search-history />
  </section>
</template>
