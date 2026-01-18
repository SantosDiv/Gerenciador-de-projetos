<script lang="ts" setup>
  import editIcon from '../../assets/icons/edit.svg';
  import trashPurpleIcon from '../../assets/icons/trash-purple.svg';

  const props = defineProps<{
    projectId: string;
  }>();

  const emit = defineEmits<{
    (e: 'remove'): void;
  }>();

  function canRemove():void {
    emit('remove')
    return;
  }
</script>
<template>
  <div class="w-60 absolute bg-white shadow-md rounded-lg border border-gray-light-100 -bottom-27 right-0">
    <div class="dropdown-arrow"></div>
    <nav class="w-full">
      <ul class="w-full flex flex-col text-secondary text-md config-list">
        <li class="flex items-center gap-2 p-3 hover:bg-secondary-light cursor-pointer" @click="$router.push(`/edit/${projectId}`)">
          <img :src="editIcon" alt="Ícone de Editar" class="inline h-6"/>
          <span>Editar</span>
        </li>
        <li class="flex items-center gap-2 p-3 hover:bg-secondary-light hover:rounded-t-lg cursor-pointer" @click="canRemove">
          <img :src="trashPurpleIcon" alt="Ícone de Lixeira roxa" class="inline h-6"/>
          <span>Remover</span>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped>
  .config-list li:first-child:hover {
    border-radius: 8px 8px 0 0;
  }

  .config-list li:last-child:hover {
    border-radius: 0 0 8px 8px;
  }

  .config-list li:not(:last-child) {
    border-bottom: 1px solid var(--color-gray-light-200);
  }

  .dropdown-arrow {
    position: absolute;
    top: -8px;
    right: 8px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }

  .dropdown-arrow::before {
    content: '';
    position: absolute;
    top: 1px;
    right: -8px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }
</style>