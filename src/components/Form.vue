<template>
  <section class="flex justify-center rounded-lg border border-gray-light-200 p-13">
    <form @submit.prevent="handleSubmit" class="space-y-4 w-176 max-w-176">
      <div>
        <Input
          :ref="(el) => formRefs.projectName = el"
          label="Nome do Projeto"
          v-model="formData.projectName" 
          required
          class="w-full"
          :validationFn="validateProjectName"
          @validation-change="(isValid:boolean) => handleInputValidation('projectName', isValid)"
          :validate-on-input="true"
          :validate-on-blur="true"
        />
      </div>
      <div>
        <Input
          :ref="(el) => formRefs.clientName = el"
          label="Cliente"
          v-model="formData.clientName" 
          required
          class="w-full"
          :validationFn="validateClientName"
          @validation-change="(isValid: boolean) => handleInputValidation('clientName', isValid)"
          :validate-on-input="true"
          :validate-on-blur="true"
        />
      </div>
      <section class="flex gap-4">
        <InputDate
          :ref="(el) => formRefs.startDate = el"
          v-model="formData.startDate"
          label="Data de Início"
          placeholder="Selecione a data de início"
          required
          class="w-full"
          :min-date="new Date().toISOString().split('T')[0]"
          @change="handleDateValidation('startDate')"
          @blur="handleDateValidation('startDate')"
        > 
          <template #icon="{ hasError }">
            <img :src="hasError ? dateIcons.startDate.error : dateIcons.startDate.normal" alt="Ícone de calendário" class="h-5 w-5"/>
          </template>
        </InputDate>

        <InputDate
          :ref="(el) => formRefs.endDate = el"
          v-model="formData.endDate"
          label="Data Final"
          placeholder="Selecione a data final"
          required
          class="w-full"
          :min-date="minEndDate"
          @change="handleDateValidation('endDate')"
          @blur="handleDateValidation('endDate')"
        > 
          <template #icon="{ hasError }">
            <img :src="hasError ? dateIcons.endDate.error : dateIcons.endDate.normal" alt="Ícone de calendário" class="h-5 w-5"/>
          </template>
        </InputDate>
      </section>
      <InputFile
        :ref="(el) => formRefs.projectImage = el"
        label="Capa do Projeto"
        v-model="formData.projectImage"
        class="w-full"
      />
      <button 
        type="submit"
        :disabled="!isFormValid"
        :class="[
          'w-full py-2 px-4 rounded-full transition-colors font-medium bg-secondary text-white',
          isFormValid 
            ? 'hover:bg-primary cursor-pointer' 
            : 'opacity-50 cursor-not-allowed'
        ]"
      >
        Salvar Projeto
      </button>
    </form>
  </section>
</template>
<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { v4 as uuidv4 } from 'uuid';

import Input from '@/components/ui/input.vue';
import InputDate from '@/components/ui/inputDate.vue';
import calendarDayLight from '@/assets/icons/calendar-day-light.svg';
import calendarDayLightRed from '@/assets/icons/calendar-day-light-red.svg';
import calendarCheckDayLight from '@/assets/icons/calendar-check-light.svg';
import calendarCheckDayLightRed from '@/assets/icons/calendar-check-light-red.svg';
import InputFile from '@/components/ui/inputFile.vue';

import projectApi from '@/api/projectApi';

import { base64ToFile, convertFileToBase64 } from '@/helpers/convertFiles';

import type { IProject } from '@/interfaces/project.interface';

const props = withDefaults(defineProps<{
  projectData?: IProject | null;
  action?: 'create' | 'edit';
}>(), {
  projectData: null,
  action: 'create'
});

const router = useRouter();

const formData = ref({
  projectName: '',
  clientName: '',
  startDate: '',
  endDate: '',
  projectImage: null as FileList | File[] | null
});

const formRefs = ref({
  projectName: null as any,
  clientName: null as any,
  startDate: null as any,
  endDate: null as any,
  projectImage: null as any
});

const formValidation = ref({
  projectName: false,
  clientName: false,
  startDate: false,
  endDate: false
});

const dateIcons = {
  startDate: { normal: calendarDayLight, error: calendarDayLightRed },
  endDate: { normal: calendarCheckDayLight, error: calendarCheckDayLightRed }
};

const isFormValid = computed(() => {
  const allFieldsHaveValue = Object.entries(formData.value).every(item => {
    const [key, value] = item;
    if(key === 'projectImage') {
      return true;
    }

    if(typeof value !== 'string') {
      return value && value?.length > 0;
    }

    return value && value.trim() !== '';
  });
  
  const allFieldsValid = Object.values(formValidation.value).every(isValid => {
    return isValid;
  });
  
  return allFieldsHaveValue && allFieldsValid;
});

const validateMinWords = (value: string, minWords: number, message: string): string | null => {
  const words = value.trim().split(/\s+/);
  return words.length >= minWords ? null : message;
};

const validateProjectName = (value: string) => validateMinWords(value, 2, 'Por favor, digite ao menos duas palavras');
const validateClientName = (value: string) => validateMinWords(value, 1, 'Por favor, digite ao menos uma palavra');

const handleInputValidation = (fieldName: keyof typeof formValidation.value, isValid: boolean) => {
  formValidation.value[fieldName] = isValid;
};

const handleDateValidation = (fieldName: keyof typeof formValidation.value) => {
  return () => {
    nextTick(() => {
      const ref = formRefs.value[fieldName];
      const hasError = ref?.hasError;
      const hasValue = formData.value[fieldName].trim() !== '';
      
      if(fieldName === 'startDate' && hasValue) {
        const endDateRef = formRefs.value.endDate;
        endDateRef?.validate?.();
      }

      const isValid = !hasError && hasValue;
      formValidation.value[fieldName] = isValid;
    });
  };
};

watch(() => formData.value.startDate, () => {
  handleDateValidation('startDate')();
});

watch(() => formData.value.endDate, () => {
  handleDateValidation('endDate')();
});

const setInitialData = () => {
  if (props.projectData) {
    formData.value.projectName = props.projectData.name;
    formData.value.clientName = props.projectData.client;
    formData.value.startDate = props.projectData.startDate;
    formData.value.endDate = props.projectData.endDate;
    formData.value.projectImage = null;
  }
};

const setExistingImage = async () => {
  if (props.projectData?.imageUrl && formRefs.value.projectImage) {
    try {
      const file = base64ToFile(props.projectData.imageUrl);
      const fileArray = [file];
      
      if (formRefs.value.projectImage?.setFiles) {
        formRefs.value.projectImage.setFiles(fileArray);
      }
      
      formData.value.projectImage = fileArray;
    } catch (error) {
      console.error('Erro ao carregar imagem existente:', error);
    }
  }
};

watch([() => formData.value.projectName, () => formData.value.clientName], () => {
  if (formData.value.projectName.trim() === '') {
    formValidation.value.projectName = false;
  } else {
    nextTick(() => {
      formRefs.value.projectName?.validate?.();
    });
  }
  
  if (formData.value.clientName.trim() === '') {
    formValidation.value.clientName = false;
  } else {
    nextTick(() => {
      formRefs.value.clientName?.validate?.();
    });
  }
});

watch(() => props.projectData, (newProjectData) => {
  if (newProjectData && Object.keys(newProjectData).length > 0) {
    setInitialData();
    nextTick(() => {
      setExistingImage();
    });
  }
}, { immediate: true, deep: true });

const handleSubmit = async () => {
  const validations = Object.values(formValidation.value).map(field => !!field);

  if (!validations.every(valid => valid)) {
    useToast().error('Formulário contém erros. Corrija os campos antes de continuar.');
    return;
  }

  if (!isFormValid.value) {
    useToast().error('Formulário inválido. Preencha todos os campos corretamente.');
    return;
  }

  let imageBase64: string | null = null;
  if (formData.value.projectImage && formData.value.projectImage.length > 0) {
    try {
      const file = formData.value.projectImage[0] as File;
      imageBase64 = await convertFileToBase64(file);
    } catch (error) {
      useToast().error('Erro ao processar a imagem. Tente novamente.');
      console.error('Error converting image:', error);
      return;
    }
  }

  const params = {
    id: uuidv4(),
    name: formData.value.projectName,
    client: formData.value.clientName,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    imageUrl: imageBase64,
    favorited: false,
  } as IProject;

  try {
    if (props.action === 'edit' && props.projectData) {
      params.id = props.projectData.id;
      params.favorited = props.projectData.favorited;

      if (!imageBase64 && props.projectData.imageUrl) {
        params.imageUrl = props.projectData.imageUrl;
      }
      await projectApi.updateProject(params);
      useToast().success('Projeto atualizado com sucesso!');
      return;
    }
    await projectApi.saveProject(params);
    useToast().success('Projeto criado com sucesso!');
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (error) {
    useToast().error('Ocorreu um erro ao salvar o projeto. Tente novamente.');
    console.error('Error saving project:', error);
  }

  
};

const minEndDate = computed(() => {
  return formData.value.startDate || new Date().toISOString().split('T')[0];
});

onMounted(() => {
  Object.keys(formValidation.value).forEach(key => {
    const fieldKey = key as keyof typeof formValidation.value;
    formValidation.value[fieldKey] = false;
  });
  setInitialData();
  nextTick(() => {
    if (props.projectData?.imageUrl) {
      setExistingImage();
    }
  });
});
</script>