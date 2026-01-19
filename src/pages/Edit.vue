<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Form from '@/components/Form.vue'
import type { IProject } from '@/interfaces/project.interface'
import projectApi from '@/api/projectApi'

const route = useRoute()
const projectId = route.params.id

const project = ref<IProject | null>(null)

async function fetchProject(): Promise<void> {
  project.value = await projectApi.getProjectById(projectId as string);
  return;
}

onMounted(() => {
  fetchProject();
})
</script>

<template>
  <div class="pt-18 px-10">
    <div class="flex items-center gap-2 max-w-20 text-secondary cursor-pointer" @click="$router.back()">
      <v-icon name="hi-arrow-sm-left" scale="1.3" />
      <span class="text-md">Voltar</span>
    </div>
    <h1 class="text-2xl font-semibold mt-2 mb-6 text-blue">Editar projeto</h1>
    <Form v-if="project" :project-data="project" action="edit" />
    <div v-else class="flex justify-center items-center py-10">
      <span class="text-gray-500">Carregando dados do projeto...</span>
    </div>
  </div>
</template>
