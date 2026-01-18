<script setup lang="ts">
// New project logic here
const handleSubmit = () => {
  // Logic to create new project
  console.log('Creating new project...')
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Novo Projeto</h1>
    <div class="max-w-md">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">
            Nome do Projeto
          </label>
          <input 
            type="text" 
            id="projectName"
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
            rows="4"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite a descrição do projeto"
          ></textarea>
        </div>
        <button 
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Criar Projeto
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
