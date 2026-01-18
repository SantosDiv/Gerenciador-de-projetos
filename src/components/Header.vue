<script lang="ts" setup>
  import { ref } from 'vue';
  import SearchBar from './SearchBar.vue';
  import logo from '@/assets/logo.svg';

  const showSearchBar = ref(false);

  function toggleSearchBar() {
    showSearchBar.value = !showSearchBar.value;
  }
 </script>
 
 <template>
  <header class="bg-primary text-white py-1 flex items-center justify-center shadow-lg">
    <img :src="logo" alt="Logo com título: 'gerenciador de projetos'" class="h-16" />

    <span class="absolute right-16" @click="toggleSearchBar" data-search-trigger>
      <v-icon name="ri-search-line" class="w-6 h-6 cursor-pointer" />
    </span>
    <SearchBar v-if="showSearchBar" @close="toggleSearchBar" />
  </header>
 </template>
