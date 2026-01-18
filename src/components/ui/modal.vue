<script setup lang="ts">
  import Button from './button.vue';

  const props = withDefaults(defineProps<{
    loading?: boolean
  }>(), {
    loading: false
  })

  const emit = defineEmits<{
    cancel: []
    confirm: []
  }>()

  const handleCancel = () => {
    emit('cancel')
  }

  const handleConfirm = () => {
    emit('confirm')
  }

  const handleBackdropClick = () => {
    emit('cancel')
  }
</script>

<template>
  <div 
    class="fixed inset-0 bg-custom-gray-900/90 backdrop-blur flex items-center justify-center z-1000" 
    @click="handleBackdropClick"
  >
    <div 
      class="bg-white rounded-xl shadow-2xl max-w-lg w-[90%] max-h-[90vh] overflow-hidden flex flex-col px-8" 
      @click.stop
    >
      <div class="px-6 pt-6 pb-4 border-b border-gray-light-300 flex justify-center">
        <slot name="title">
          <h2 class="text-2xl font-semibold text-blue m-0">Modal</h2>
        </slot>
      </div>
      
      <div class="px-6 py-6 flex-1 overflow-y-auto text-center">
        <slot name="body">
          <p class="text-gray-700">Conteúdo do modal</p>
        </slot>
      </div>
      
      <div class="pb-8 flex gap-8 justify-center">
        <Button label="Cancelar" outline @click="handleCancel" class="px-15 py-3! flex-1" />
        <Button label="Confirmar" @click="handleConfirm" class="flex-2 py-3! px-15" :disabled="loading" />
      </div>
    </div>
  </div>
</template>

