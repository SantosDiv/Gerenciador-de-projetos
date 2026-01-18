<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NotFoundProjects from '../components/NotFoundProjects.vue';
import ProjectCard from '../components/ProjectCard/index.vue';
import Select from '../components/ui/select.vue';
import Button from '../components/ui/button.vue';
import Toggle from '../components/ui/toggle.vue';

import projectApi from '@/api/projectApi';

import type { IProject } from '@/interfaces/project';

const projects = ref<IProject[]>([]);

const orderOptions = [
  { label: 'Ordem alfabética', value: 'alphabetical' },
  { label: 'Iniciados mais recentes', value: 'most_recent' },
  { label: 'Prazo mais próximo', value: 'nearest_deadline' }
];

const selectedOrder = ref('alphabetical');

const handleOrderChange = (option: { label: string, value: string | number } | null) => {
  if (option) {
    console.log('Ordem selecionada:', option);
  }
};

async function fetchProjects() {
  try {
    projects.value = await projectApi.getProjects();
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
  }
}

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <NotFoundProjects v-if="!projects.length" />
  <div v-else class="flex flex-col">
    <header class="px-10 pt-15 pb-4 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-blue flex items-center gap-2">
        Projetos <span class="font-normal! text-[17px]">({{ projects.length }})</span>
      </h1>
      <div class="flex items-center justify-around gap-4">
        <div class="flex items-center gap-2 min-w-45">
          <Toggle />
          <span class="text-primary">Apenas favoritos</span>
        </div>
        <Select 
          :options="orderOptions"
          v-model="selectedOrder"
          placeholder="Selecione a ordenação"
          @change="handleOrderChange"
        />
        <Button label="Novo Projeto" class="w-full px-6! py-2!" @click="$router.push('/new')">
          <template #icon>
            <v-icon name="bi-plus-circle" class="w-6 h-6" />
          </template>
        </Button>
      </div>
    </header>
    <main class="px-10 pb-10 flex gap-8 justify-start flex-wrap">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </main>
  </div> 
</template>
