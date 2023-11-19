<script setup lang="ts">
import { ref } from "vue";
import EnterpriseForm from "./EnterpriseForm.vue";

const currentStep = ref(1);
const totalSteps = 2;

const formData = ref({
  name: "",
  email: "",
  documentType: null,
  documentNumber: "",
  user: {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    documentType: null,
    documentNumber: "",
    phone: "",
    gender: null,
    birthdate: "",
    roles: [],
  },
});

const goToNextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
  // Aquí puedes agregar validación para cada paso si es necesario
};

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitForm = () => {
  console.log("Form Data:", formData.value);
};
</script>

<template>
  <div class="bg-gray-900 p-4">
    <div class="mx-auto max-w-2xl flex justify-between">
      <button
        type="button"
        @click="goToPreviousStep"
        class="bg-gray-700 text-white rounded py-2 px-4"
        :disabled="currentStep === 1"
      >
        Anterior
      </button>
      <button
        type="button"
        @click="goToNextStep"
        class="bg-gray-700 text-white rounded py-2 px-4"
        :disabled="currentStep === totalSteps"
      >
        Siguiente
      </button>
    </div>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div v-show="currentStep === 1">
        <EnterpriseForm :formData="formData" />
      </div>

      <div v-show="currentStep === 2">
        <!-- Campos para el Paso 2 -->
      </div>

      <div v-if="currentStep === totalSteps">
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<style>
/* Aquí puedes agregar estilos adicionales si es necesario */
</style>
