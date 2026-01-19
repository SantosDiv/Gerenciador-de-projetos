<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import dayjs from 'dayjs';
  import placeholderImage from '@/assets/placeholderImage.jpg';
  import favoriteIcon from '@/assets/icons/favorite.svg';
  import favoritedIcon from '@/assets/icons/favorited-icon.svg';
  import CalendarDayLight from '@/assets/icons/calendar-day-light.svg';
  import CalendarCheckLight from '@/assets/icons/calendar-check-light.svg';
  import Dropdown from './dropdown.vue';
  import Modal from '@/components/ui/modal.vue';
  import HighlightText from '@/components/ui/highlightText.vue';
  import { useProjectsStore } from '@/stores/projects.store';

  import projectApi from '@/api/projectApi';

  import type { IProject } from '@/interfaces/project.interface';

  const formatDatePtBr = (dateString: string): string => {
    return dayjs(dateString).format('D [de] MMMM [de] YYYY');
  };

  const props = defineProps<{
    project: IProject;
  }>();

  const router = useRouter();
  const toast = useToast();
  const store = useProjectsStore();

  const openedDropdown = ref(false);
  const openRemoveModal = ref(false);
  const loading = ref(false);

  function toggleDropdown() {
    openedDropdown.value = !openedDropdown.value;
  }

  function showRemoveModal() {
    openRemoveModal.value = true;
    openedDropdown.value = false;
  }

  async function deleteProject() {
    try {
      loading.value = true;
      await projectApi.deleteProject(props.project.id);
      toast.success('Projeto removido com sucesso!');
      setTimeout(() => {
        loading.value = false;
        openRemoveModal.value = false;
        router.go(0);
      }, 2000);
    } catch (error) {
      toast.error('Erro ao remover o projeto. Tente novamente mais tarde.');
    }
  }

  async function toggleFavorite() {
    try {
      const updatedProject = { ...props.project, favorited: !props.project.favorited };
      await projectApi.updateProject(updatedProject);
      props.project.favorited = updatedProject.favorited;
    } catch (error) {
      toast.error('Erro ao atualizar o status de favorito. Tente novamente mais tarde.');
      console.error('Erro ao atualizar favorito:', error);
    }
  }

</script>
<template>
  <Modal v-if="openRemoveModal" @cancel="openRemoveModal = false" @confirm="deleteProject" :loading="loading">
    <template #title>
      <h2 class="text-[22px] font-semibold text-blue m-0">Remover Projeto</h2>
    </template>
    <template #body>
      <p class="text-gray">Esta ação removerá definitivamente o projeto:</p>
      <p class="text-primary text-2xl font-bold mt-2">{{ project.name }}</p>
    </template>
  </Modal>

  <article class="w-86 bg-white rounded-2xl border border-gray-light-200 overflow-hidden">
    <header class="h-58 rounded-t-2xl relative" :style="{
      background: project.imageUrl && typeof project.imageUrl === 'string' && project.imageUrl.trim() !== '' 
        ? `url(${project.imageUrl})` 
        : `url(${placeholderImage})`, 
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }">
      <div class="flex gap-6 items-center absolute bottom-4 right-4">
        <dropdown v-if="openedDropdown" :project-id="project.id" @remove="showRemoveModal" />
        <button class="cursor-pointer" @click="toggleFavorite">
          <img v-if="project.favorited" :src="favoritedIcon" alt="Ícone de favoritar projeto">
          <img v-else :src="favoriteIcon" alt="Ícone de favoritar projeto">
        </button>
        <button @click="toggleDropdown" class="cursor-pointer shadow-md w-8 h-8 bg-white rounded-full text-secondary">
          <v-icon name="bi-three-dots" />
        </button>
      </div>
    </header>
    
    <main class="p-6">
      <h1 class="font-bold text-blue text-xl">
        <HighlightText :text="project.name" :highlight="store.searchTerm" />
      </h1>
      <h2 class="text-gray text-md mb-4"><span class="font-bold">Cliente:</span> {{ project.client }}</h2>

      <div class="space-y-4 border-t border-gray-light-100 pt-4 text-gray">
        <div class="flex gap-4 items-center">
          <img :src="CalendarDayLight" alt="Ícone de Calendário indicando o dia de início do projeto">
          <p>{{ formatDatePtBr(project.startDate) }}</p>
        </div>
        <div class="flex gap-4 items-center">
          <img :src="CalendarCheckLight" alt="Ícone de Calendário indicando a data de término do projeto">
          <p>{{ formatDatePtBr(project.endDate) }}</p>
        </div>
      </div>

    </main>
  </article>
</template>