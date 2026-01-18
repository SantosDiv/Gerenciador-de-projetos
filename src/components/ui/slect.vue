<template>
  <div class="relative w-full">
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus-within:border-secondary transition-colors duration-200"
      :class="{ 'border-secondary': isOpen }"
    >
      <span 
        class="text-gray-700 select-none"
        :class="{ 'text-gray-400': !selectedOption }"
      >
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      
      <div class="transition-transform duration-200" :class="{ 'rotate-180': isOpen }">
        <OhVueIcon 
          :name="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'" 
          scale="1.2" 
          fill="#695CCD"
        />
      </div>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
          :class="{ 
            'bg-secondary/10 text-secondary': selectedOption?.value === option.value,
            'text-gray-700': selectedOption?.value !== option.value
          }"
        >
          {{ option.label }}
        </div>
        
        <div 
          v-if="options.length === 0" 
          class="px-4 py-3 text-gray-500 text-center"
        >
          Nenhuma opção disponível
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'

interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  options: SelectOption[]
  modelValue?: string | number | null
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', option: SelectOption | null): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione uma opção',
  disabled: false,
  modelValue: null
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const selectedOption = ref<SelectOption | null>(null)

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option: SelectOption) => {
  selectedOption.value = option
  isOpen.value = false
  emit('update:modelValue', option.value)
  emit('change', option)
}

const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

// Inicializar valor selecionado baseado no modelValue
const initializeSelectedOption = () => {
  if (props.modelValue !== null && props.modelValue !== undefined) {
    const option = props.options.find(opt => opt.value === props.modelValue)
    if (option) {
      selectedOption.value = option
    }
  }
}

// Observar mudanças nas opções e modelValue
watch(() => props.modelValue, () => {
  initializeSelectedOption()
})

watch(() => props.options, () => {
  initializeSelectedOption()
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  initializeSelectedOption()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>