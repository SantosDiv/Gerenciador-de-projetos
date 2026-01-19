<template>
  <div>
    <div class="flex items-center gap-2 max-w-20 text-secondary cursor-pointer" @click="$router.back()">
      <v-icon name="hi-arrow-sm-left" scale="1.3" />
      <span class="text-md">{{label}}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = withDefaults(defineProps<{
    label?: string
  }>(), {
    label: 'Voltar'
  });
</script>