<script lang="ts" setup>
  import {ref, onMounted, onUnmounted} from 'vue';
  import backwardHistory from '@/assets/icons/backward-history.svg';

  const searchQuery = ref('');
  const searchSection = ref<HTMLElement | null>(null);
  
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

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
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
        v-model="searchQuery"
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
