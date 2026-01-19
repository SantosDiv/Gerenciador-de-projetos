<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import SearchBar from './SearchBar.vue';
  import logo from '@/assets/logo.svg';
  import { useRoute } from 'vue-router';

  const showSearchBar = ref(false);
  const route = useRoute();

  function toggleSearchBar() {
    showSearchBar.value = !showSearchBar.value;
  }

  const shouldShowSearchIcon = computed(() => {
    return route.meta?.showSearchIcon !== false;
  });

 </script>
 
 <template>
  <header class="bg-primary text-white py-1 flex items-center justify-center shadow-lg">
    <img :src="logo" alt="Logo com título: 'gerenciador de projetos'" class="h-16 cursor-pointer" @click="$router.push('/')"/>

    <span v-if="shouldShowSearchIcon" class="absolute right-4 md:right-16" @click="toggleSearchBar" data-search-trigger>
      <v-icon name="ri-search-line" class="w-6 h-6 cursor-pointer" />
    </span>
    <SearchBar v-if="showSearchBar" @close="toggleSearchBar" />
  </header>
 </template>
