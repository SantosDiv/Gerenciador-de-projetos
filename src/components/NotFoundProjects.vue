<script lang="ts" setup>
  import Button from '@/components/ui/button.vue';
</script>
<template>
  <div class="py-15 px-10">
    <section class="bg-white w-full h-[calc(100vh-192px)] flex flex-col justify-center items-center">
      <div class="flex flex-col items-center gap-8">
        <div class="flex flex-col items-center gap-6">
          <h2 class="text-2xl font-bold text-blue">Nenhum projeto</h2>
          <p class="text-gray-700">Clique no botão abaixo para criar o primeiro e gerenciá-lo.</p>
        </div>
        <Button label="Novo Projeto" @click="$router.push('/new')">
          <template #icon>
            <v-icon name="bi-plus-circle" class="w-6 h-6" />
          </template>
        </Button>
      </div>
    </section>
  </div>
</template>