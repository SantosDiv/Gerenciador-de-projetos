<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Header from './components/Header.vue';

  const route = useRoute();

  const shouldShowHeader = computed(() => {
    return route.meta?.showHeader !== false;
  });
</script>

<template>
  <div>
    <Header v-if="shouldShowHeader" />
    <router-view />
  </div>
</template>

<style scoped>

</style>
