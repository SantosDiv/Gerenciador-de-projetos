<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-md font-medium text-primary mb-2 transition-colors"
      :class="{ 'text-custom-red!': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-primary text-sm font-normal!" :class="{ 'text-custom-red!': hasError }">(Obrigatório)</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        type="date"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        class="w-full px-4 py-3 pr-12 border border-gray rounded-lg bg-white text-primary placeholder-gray-light-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
        :class="{
          'border-custom-red! focus:ring-custom-red!': hasError,
          'opacity-50 cursor-not-allowed': disabled,
          'text-custom-red!': hasError
        }"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        :min="minDate"
      />
      
      <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <slot name="icon" :hasError="hasError">
          <svg 
            class="h-5 w-5 text-gray transition-colors"
            :class="{ 'text-custom-red': hasError }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </slot>
      </div>
    </div>
    
    <!-- Mensagem de erro -->
    <transition 
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <p 
        v-if="errorMessage" 
        class="mt-2 text-sm text-custom-red"
      >
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import moment from 'moment'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  errorMessage?: string
  minDate?: string // Data mínima permitida (formato YYYY-MM-DD)
  maxDate?: string // Data máxima permitida (formato YYYY-MM-DD)
  allowPastDates?: boolean // Por padrão false (não permite datas passadas)
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Selecione uma data',
  required: false,
  disabled: false,
  readonly: false,
  allowPastDates: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'change': [value: string]
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const internalError = ref<string>('')

// Computed
const inputId = computed(() => 
  `input-date-${Math.random().toString(36).substring(2, 15)}`
)

const hasError = computed(() => 
  Boolean(props.errorMessage || internalError.value)
)

const errorMessage = computed(() => 
  props.errorMessage || internalError.value
)

// Methods
const validateDate = (dateValue: string): string => {
  if (!dateValue) {
    if (props.required) {
      return 'Este campo é obrigatório'
    }
    return ''
  }

  // Verifica se a data é válida
  const date = moment(dateValue, 'YYYY-MM-DD', true)
  if (!date.isValid()) {
    return 'Data inválida'
  }

  const today = moment().startOf('day')
  const selectedDate = moment(dateValue).startOf('day')

  // Verifica se não permite datas passadas
  if (!props.allowPastDates && selectedDate.isBefore(today)) {
    return 'Selecione uma data válida'
  }

  // Verifica data mínima
  if (props.minDate) {
    const minDate = moment(props.minDate).startOf('day')
    if (selectedDate.isBefore(minDate)) {
      return `A data deve ser posterior a ${minDate.format('DD/MM/YYYY')}`
    }
  }

  // Verifica data máxima
  if (props.maxDate) {
    const maxDate = moment(props.maxDate).startOf('day')
    if (selectedDate.isAfter(maxDate)) {
      return `A data deve ser anterior a ${maxDate.format('DD/MM/YYYY')}`
    }
  }

  return ''
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  emit('update:modelValue', value)
  
  // Validação em tempo real
  internalError.value = validateDate(value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  internalError.value = validateDate(value)
  emit('change', value)
}

const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  internalError.value = validateDate(value)
  emit('blur', event)
}

// Watch para validar quando o valor muda externamente
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    internalError.value = validateDate(newValue)
  }
})

// Métodos públicos
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const validate = () => {
  internalError.value = validateDate(props.modelValue || '')
  return !hasError.value
}

defineExpose({
  focus,
  blur,
  validate,
  hasError,
  errorMessage
})
</script>

<style scoped>
/* Customização do input date */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 40px;
  height: 100%;
  cursor: pointer;
}

input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="date"] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
}
</style>