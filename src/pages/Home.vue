<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import NotFoundProjects from '@/components/NotFoundProjects.vue';
import ProjectCard from '@/components/ProjectCard/index.vue';
import Select from '@/components/ui/select.vue';
import Button from '@/components/ui/button.vue';
import Toggle from '@/components/ui/toggle.vue';

import projectApi from '@/api/projectApi';

import type { IProject, orderByOptions } from '@/interfaces/project.interface';

const projects = ref<IProject[]>([]);

const toast = useToast();

const orderOptions = [
  { label: 'Ordem alfabética', value: 'name' },
  { label: 'Iniciados mais recentes', value: 'startDate' },
  { label: 'Prazo mais próximo', value: 'endDate' }
];

const filters = ref({
  favorited: undefined as boolean | undefined,
  orderBy: 'name' as orderByOptions
});

const toggleFavorited = async (isFavorited: boolean) => {
  filters.value.favorited = isFavorited ? true : undefined;
  await fetchProjects();
};

async function fetchProjects() {
  try {
    projects.value = await projectApi.getProjects(filters.value);
  } catch (error) {
    toast.error('Erro ao carregar projetos. Por favor, tente novamente mais tarde.');
    console.error('Erro ao buscar projetos:', error);
  }
}

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <NotFoundProjects v-if="!projects.length && !filters.favorited" />
  <div v-else class="flex flex-col">
    <header class="px-10 pt-15 pb-4 flex flex-wrap justify-between items-center">
      <h1 class="text-2xl font-semibold text-blue flex items-center gap-2">
        Projetos <span class="font-normal! text-[17px]">({{ projects.length }})</span>
      </h1>
      <div class="flex flex-wrap md:flex-nowrap items-center justify-around gap-4 mt-4 md:mt-0">
        <div class="flex items-center gap-2 min-w-45">
          <Toggle @change="toggleFavorited" v-model="filters.favorited" />
          <span class="text-primary">Apenas favoritos</span>
        </div>
        <Select 
          :options="orderOptions"
          v-model="filters.orderBy"
          placeholder="Selecione a ordenação"
          @change="fetchProjects"
        />
        <Button label="Novo Projeto" class="w-full px-6! py-2!" @click="$router.push('/new')">
          <template #icon>
            <v-icon name="bi-plus-circle" class="w-6 h-6" />
          </template>
        </Button>
      </div>
    </header>
    <main class="md:px-10 pb-10 flex gap-6 justify-center md:justify-start flex-wrap">
      <section v-if="!projects.length && filters.favorited" class="pt-6 flex flex-col items-center justify-center w-full gap-4">
        <v-icon name="ri-star-smile-fill" class="w-12 h-12 text-gray-light-300" />
        <p class="text-primary text-lg">Nenhum projeto marcado como favorito. <span class="text-sm font-normal">(ainda ;D)</span></p>
      </section>
      <ProjectCard v-else v-for="project in projects" :key="project.id" :project="project" />
    </main>
  </div> 
</template>
