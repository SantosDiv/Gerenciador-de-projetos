<template>
  <div class="flex items-center gap-2">
    
    <button
      @click="toggleSwitch"
      class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :style="{ backgroundColor: isEnabled ? enabledColor : disabledColor }"
      :aria-pressed="isEnabled"
      type="button"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
        :class="{ 'translate-x-7': isEnabled, 'translate-x-1': !isEnabled }"
      ></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  label?: string
  modelValue?: boolean
  enabledColor?: string
  disabledColor?: string
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  enabledColor: '#FFB23D',
  disabledColor: '#717171'
})

const emit = defineEmits<Emits>()

const isEnabled = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isEnabled.value = newValue
})

watch(isEnabled, (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
})

const toggleSwitch = () => {
  isEnabled.value = !isEnabled.value
}
</script>