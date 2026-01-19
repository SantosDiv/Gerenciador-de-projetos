<template>
  <div>
    <header class="mb-17 flex justify-between items-center">
      <SearchBar class="relative rounded-none" />
    </header>
    <main class="px-11">
      <div class="flex items-center gap-2 max-w-20 text-secondary cursor-pointer" @click="goBack">
        <v-icon name="hi-arrow-sm-left" scale="1.3" />
        <span class="text-md">Voltar</span>
      </div>
      <h1 class="text-2xl font-semibold mt-2 mb-6 text-blue">
        Resultado da busca
      </h1>
      
      <section v-if="searchResults.length > 0" class="flex gap-8 justify-start flex-wrap">
        <ProjectCard
          v-for="project in searchResults"
          :key="project.id"
          :project="project"
        />
      </section>
      
      <NotFoundSearchResults v-else-if="store.searchTerm" />
    </main>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProjectsStore } from '@/stores/projects.store';

  import SearchBar from '@/components/SearchBar.vue';
  import ProjectCard from '@/components/ProjectCard/index.vue';
  import NotFoundSearchResults from '@/components/NotFoundSearchResults.vue';

  const store = useProjectsStore();
  const router = useRouter();
  const searchResults = computed(() => store.searchResults);
  
  const goBack = () => {
    store.$reset();
    router.push('/');
  };
</script>