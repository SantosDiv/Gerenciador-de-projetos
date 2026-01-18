<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const projectId = route.params.id

const projectName = ref('')
const projectDescription = ref('')

onMounted(() => {
  // Logic to load project data based on ID
  console.log('Loading project with ID:', projectId)
  // Simulate loading data
  projectName.value = `Projeto ${projectId}`
  projectDescription.value = 'Descrição do projeto carregada...'
})

const handleUpdate = () => {
  // Logic to update project
  console.log('Updating project with ID:', projectId)
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Editar Projeto</h1>
    <p class="text-gray-600 mb-4">ID do Projeto: {{ projectId }}</p>
    
    <div class="max-w-md">
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">
            Nome do Projeto
          </label>
          <input 
            type="text" 
            id="projectName"
            v-model="projectName"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o nome do projeto"
          />
        </div>
        <div>
          <label for="projectDescription" class="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea 
            id="projectDescription"
            v-model="projectDescription"
            rows="4"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite a descrição do projeto"
          ></textarea>
        </div>
        <button 
          type="submit"
          class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Atualizar Projeto
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
