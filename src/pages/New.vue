<template>
  <div class="pt-18 px-10">
    <div class="flex items-center gap-2 max-w-20 text-secondary cursor-pointer" @click="$router.back()">
      <v-icon name="hi-arrow-sm-left" scale="1.3" />
      <span class="text-md">Voltar</span>
    </div>
    <h1 class="text-2xl font-semibold mt-2 mb-6 text-blue">Novo Projeto</h1>
    <Form />
  </div>
</template>

<script setup lang="ts">
  import Form from '@/components/Form.vue'
</script>