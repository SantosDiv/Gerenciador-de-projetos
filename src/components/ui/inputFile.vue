<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-lg font-medium text-secondary mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-custom-red ml-1">*</span>
    </label>
    <div v-if="selectedFiles.length > 0" class="mt-4">
      <div 
        v-for="(file, index) in selectedFiles" 
        :key="index"
        class="relative max-w-175 mx-auto"
      >
        <div class="relative inline-block max-w-full">
          <img 
            :src="getImagePreview(file)"
            :alt="file.name"
            class="max-w-full h-auto max-h-100 object-contain rounded-lg shadow-md"
          />
          
          <button
            type="button"
            @click="removeFile(index)"
            class="absolute cursor-pointer top-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-light-100 transition-colors border border-gray-200"
          >
            <img 
              :src="trashIcon" 
              alt="Remover arquivo" 
              class="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="border border-dashed border-gray rounded-lg p-6 bg-transparent text-center">
      <div>
        <div class="mb-4 flex justify-center">
          <img :src="uploadIcon" alt="Upload Icon" class="h-6 w-6 text-gray-light-300" />
        </div>
        
        <h3 class="text-gray mb-4">
          Escolha uma imagem .jpg ou .png no seu dispositivo
        </h3>
  
        <input
          :id="inputId"
          ref="fileInput"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :required="required"
          :disabled="disabled"
          class="hidden"
          @change="handleFileChange"
        />
        
        <button
          type="button"
          :disabled="disabled"
          class="px-4 py-2 border border-secondary bg-white text-secondary rounded-full text-sm font-normal hover:bg-secondary-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="triggerFileInput"
        >
          Selecionar
        </button>
      </div>
    </div>
    
    <div 
      v-if="errorMessage" 
      class="mt-2 text-sm text-custom-red font-medium"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import uploadIcon from '../../assets/icons/upload-light.svg'
import trashIcon from '../../assets/icons/trash-purple.svg'

interface Props {
  modelValue?: FileList | File[] | null
  label?: string
  accept?: string
  multiple?: boolean
  required?: boolean
  disabled?: boolean
  maxFileSize?: number // em bytes
  maxFiles?: number
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.jpg,.jpeg,.png',
  multiple: false,
  required: false,
  disabled: false,
  maxFileSize: 5 * 1024 * 1024, // 5MB por padrão
  maxFiles: 1
})

const emit = defineEmits<{
  'update:modelValue': [files: FileList | File[] | null]
  'change': [files: FileList | File[] | null]
  'error': [message: string]
}>()

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const internalError = ref<string>('')

const inputId = computed(() => 
  `input-file-${Math.random().toString(36).substring(2, 15)}`
)

const hasError = computed(() => 
  Boolean(props.errorMessage || internalError.value)
)

const triggerFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

const validateFile = (file: File): string | null => {
  if (file.size > props.maxFileSize) {
    return `Arquivo "${file.name}" é muito grande. Máximo permitido: ${formatFileSize(props.maxFileSize)}`
  }
  
  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map(type => type.trim().toLowerCase())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const fileMimeType = file.type.toLowerCase()
    
    const isValidExtension = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type
      }
      return fileMimeType.startsWith(type.replace('*', ''))
    })
    
    if (!isValidExtension) {
      return `Arquivo "${file.name}" não é um tipo válido. Tipos aceitos: ${props.accept}`
    }
  }
  
  return null
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) {
    selectedFiles.value = []
    internalError.value = ''
    emit('update:modelValue', null)
    emit('change', null)
    return
  }
  
  if (files.length > props.maxFiles) {
    internalError.value = `Máximo de ${props.maxFiles} arquivo(s) permitido(s)`
    emit('error', internalError.value)
    return
  }
  
  const fileArray = Array.from(files)
  let hasValidationError = false
  
  for (const file of fileArray) {
    const error = validateFile(file)
    if (error) {
      internalError.value = error
      emit('error', error)
      hasValidationError = true
      break
    }
  }
  
  if (!hasValidationError) {
    selectedFiles.value = fileArray
    internalError.value = ''
    
    const result = props.multiple ? fileArray : files
    emit('update:modelValue', result)
    emit('change', result)
  }
}

const removeFile = (index: number) => {
  const file = selectedFiles.value[index]
  if (file) {
    const imageUrl = URL.createObjectURL(file)
    URL.revokeObjectURL(imageUrl)
  }
  
  selectedFiles.value.splice(index, 1)
  
  if (selectedFiles.value.length === 0) {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    emit('update:modelValue', null)
    emit('change', null)
  } else {
    const result = props.multiple ? selectedFiles.value : selectedFiles.value
    emit('update:modelValue', result)
    emit('change', result)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    selectedFiles.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})

const clearFiles = () => {
  // Limpa todas as URLs dos objetos para evitar vazamentos de memória
  selectedFiles.value.forEach(file => {
    const imageUrl = URL.createObjectURL(file)
    URL.revokeObjectURL(imageUrl)
  })
  
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  internalError.value = ''
  emit('update:modelValue', null)
  emit('change', null)
}

const validate = () => {
  if (props.required && selectedFiles.value.length === 0) {
    internalError.value = 'Este campo é obrigatório'
    return false
  }
  
  internalError.value = ''
  return true
}

defineExpose({
  clearFiles,
  validate,
  hasError: computed(() => hasError.value),
  selectedFiles: computed(() => selectedFiles.value)
})
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>