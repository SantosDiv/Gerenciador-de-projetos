<script lang="ts" setup>
  import {ref, onMounted, onUnmounted, nextTick } from 'vue';
  import backwardHistory from '@/assets/icons/backward-history.svg';
  import { useProjectsStore } from '@/stores/projects.store';
  import { useToast } from 'vue-toastification';
  import { useRouter, useRoute } from 'vue-router';

  const store = useProjectsStore();
  const localSearchQuery = ref(store.searchTerm);
  const searchSection = ref<HTMLElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();

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
    
    if (term.length < 3) {
      if (router.currentRoute.value.path === '/search') {
        store.$reset();
        router.push('/');
      }
      return;
    }

    searchTimeout = window.setTimeout(async () => {
      if (term.length >= 3) {
        try {
          await store.searchByTerm(term);
          if (router.currentRoute.value.path !== '/search') {
            await router.push('/search');
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
    }, 300);
  };

  onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    localSearchQuery.value = store.searchTerm;
    
    if (route.path === '/search') {
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
    class="absolute top-0 w-full flex flex-col justify-center items-center bg-white border-2 border-secondary rounded-2xl p-4 shadow-lg"
  >
    <div class="flex items-center gap-2 w-full">
      <v-icon name="ri-search-line" class="w-6 h-6 cursor-pointer text-secondary" />
      <input
        ref="inputRef"
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
