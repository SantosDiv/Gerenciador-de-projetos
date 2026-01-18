<script setup lang="ts">
import { ref } from 'vue';
import NotFoundProjects from '../components/NotFoundProjects.vue';
import ProjectCard from '../components/ProjectCard/index.vue';
import Select from '../components/ui/select.vue';
import Button from '../components/ui/button.vue';

const projects = ref([
  { id: 1, name: 'Projeto Alpha', client: 'Clicksig', startAt: '2024-06-01', endAt: '2024-12-31', thumb: '', favorited: false },
  { id: 2, name: 'Projeto Alpha', client: 'Clicksig', startAt: '2024-06-01', endAt: '2024-12-31', thumb: '', favorited: true },
  { id: 3, name: 'Projeto Alpha', client: 'Clicksig', startAt: '2024-06-01', endAt: '2024-12-31', thumb: '', favorited: false },
  { id: 4, name: 'Projeto Alpha', client: 'Clicksig', startAt: '2024-06-01', endAt: '2024-12-31', thumb: '', favorited: false },
  { id: 5, name: 'Projeto Alpha', client: 'Clicksig', startAt: '2024-06-01', endAt: '2024-12-31', thumb: '', favorited: false },
]);

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
</script>

<template>
  <NotFoundProjects v-if="!projects.length" />
  <div v-else class="flex flex-col">
    <header class="px-10 pt-15 pb-4 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-blue flex items-center gap-2">
        Projetos <span class="font-normal! text-[17px]">({{ projects.length }})</span>
      </h1>
      <div class="flex items-center justify-around gap-4">
        <div id="toggle"></div>
        <Select 
          :options="orderOptions"
          v-model="selectedOrder"
          placeholder="Selecione a ordenação"
          @change="handleOrderChange"
        />
        <Button label="Novo Projeto" class="w-full px-6! py-2!">
          <template #icon>
            <v-icon name="bi-plus-circle" class="w-6 h-6" />
          </template>
        </Button>
      </div>
    </header>
    <main class="flex gap-8 justify-center flex-wrap">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </main>
  </div> 
</template>
