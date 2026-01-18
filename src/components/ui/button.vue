<template>
  <button
    :class="{
      'cursor-pointer flex items-center justify-center gap-4 rounded-full py-3.5 px-10 transition-colors': true,
      'bg-secondary text-white hover:bg-primary': !outline,
      'bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-white': outline,
    }">
    <slot name="icon"/>
    {{label}}
  </button>
</template>
<script lang="ts" setup>
  const props = withDefaults(defineProps<{
    label?: string;
    outline?: boolean;
  }>(), {
    label: 'Novo Projeto',
    outline: false,
  });
</script>