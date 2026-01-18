<template>
  <div class="flex flex-col gap-1">
    <label 
      v-if="label" 
      :for="inputId"
      :class="[
        'text-lg font-medium',
        hasError ? 'text-red-600' : 'text-gray-600'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-sm font-normal">(Obrigatório)</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      :class="[
        'px-3 py-2 text-md rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50',
        hasError 
          ? 'border-custom-red text-custom-red focus:border-custom-red focus:ring-red-500' 
          : 'border-gray text-primary bg-white focus:border-blue focus:ring-blue',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      ]"
    />

    <div 
      v-if="hasError" 
      class="text-sm text-custom-red mt-1"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type ValidationFunction = (value: string) => string | null

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readonly?: boolean
  validationFn?: ValidationFunction
  validateOnBlur?: boolean
  validateOnInput?: boolean
  required?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string): void
  (event: 'input', value: string): void
  (event: 'blur', e: FocusEvent): void
  (event: 'focus', e: FocusEvent): void
  (event: 'validation-change', isValid: boolean, errorMessage: string | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  validateOnBlur: true,
  validateOnInput: false,
  required: false
})

const emit = defineEmits<Emits>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const errorMessage = ref<string | null>(null)
const hasBeenBlurred = ref(false)

const hasError = computed(() => {
  return errorMessage.value !== null && errorMessage.value !== ''
})

const validateInput = (value: string): string | null => {
  if (props.required && (!value || value.trim() === '')) {
    return 'Este campo é obrigatório'
  }

  if (props.validationFn && value) {
    return props.validationFn(value)
  }

  return null
}

const runValidation = (value: string) => {
  const error = validateInput(value)
  errorMessage.value = error
  emit('validation-change', !error, error)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  emit('update:modelValue', value)
  emit('input', value)

  if (props.validateOnInput || hasBeenBlurred.value) {
    runValidation(value)
  }
}

const handleBlur = (event: FocusEvent) => {
  hasBeenBlurred.value = true
  emit('blur', event)
  
  if (props.validateOnBlur) {
    runValidation(props.modelValue)
  }
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

watch(() => props.modelValue, (newValue) => {
  if (hasBeenBlurred.value && (props.validateOnInput || props.validateOnBlur)) {
    runValidation(newValue)
  }
})

watch(() => props.validationFn, () => {
  if (hasBeenBlurred.value) {
    runValidation(props.modelValue)
  }
})

defineExpose({
  validate: () => runValidation(props.modelValue),
  clearError: () => {
    errorMessage.value = null
    emit('validation-change', true, null)
  }
})
</script>