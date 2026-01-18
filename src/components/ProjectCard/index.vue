<script lang="ts" setup>
  import { ref } from 'vue';
  import Image1 from '../../assets/image-1.jpg';
  import favoriteIcon from '../../assets/icons/favorite.svg';
  import favoritedIcon from '../../assets/icons/favorited-icon.svg';
  import CalendarDayLight from '../../assets/icons/calendar-day-light.svg';
  import CalendarCheckLight from '../../assets/icons/calendar-check-light.svg';
  import Dropdown from './dropdown.vue';
  import Modal from '../ui/modal.vue';

  const props = defineProps<{
    project: {
      id: number;
      name: string;
      client: string;
      startAt: string;
      endAt: string;
      thumb: string;
      favorited: boolean;
    };
  }>();

  const openedDropdown = ref(false);
  const openRemoveModal = ref(false);

  function toggleDropdown() {
    openedDropdown.value = !openedDropdown.value;
  }

  function showRemoveModal() {
    openRemoveModal.value = true;
    openedDropdown.value = false;
  }

  function deleteProject() {
    // Lógica para deletar o projeto
  }

</script>
<template>
  <Modal v-if="openRemoveModal" @cancel="openRemoveModal = false" @confirm="deleteProject">
    <template #title>
      <h2 class="text-[22px] font-semibold text-blue m-0">Remover Projeto</h2>
    </template>
    <template #body>
      <p class="text-gray">Esta ação removerá definitivamente o projeto:</p>
      <p class="text-primary text-2xl font-bold mt-2">{{ project.name }}</p>
    </template>
  </Modal>

  <article class="w-86 bg-white rounded-2xl border border-gray-light-200 overflow-hidden">
    <header class="h-58 rounded-t-2xl relative" :style="{background: `url(${Image1})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}">
      <div class="flex gap-6 items-center absolute bottom-4 right-4">
        <dropdown v-if="openedDropdown" :project-id="project.id" @remove="showRemoveModal" />
        <button class="cursor-pointer">
          <img v-if="false" :src="favoritedIcon" alt="Ícone de favoritar projeto">
          <img v-else :src="favoriteIcon" alt="Ícone de favoritar projeto">
        </button>
        <button @click="toggleDropdown" class="cursor-pointer w-8 h-8 bg-white rounded-full text-secondary">
          <v-icon name="bi-three-dots" />
        </button>
      </div>
    </header>
    
    <main class="p-6">
      <h1 class="font-bold text-blue text-xl">{{project.name}}</h1>
      <h2 class="text-gray text-md mb-4"><span class="font-bold">Cliente:</span> {{ project.client }}</h2>

      <div class="space-y-4 border-t border-gray-light-100 pt-4 text-gray">
        <div class="flex gap-4 items-center">
          <img :src="CalendarDayLight" alt="Ícone de Calendário indicando o dia de início do projeto">
          <p>{{ project.startAt }}</p>
        </div>
        <div class="flex gap-4 items-center">
          <img :src="CalendarCheckLight" alt="Ícone de Calendário indicando a data de término do projeto">
          <p>{{ project.endAt }}</p>
        </div>
      </div>

    </main>
  </article>
</template>