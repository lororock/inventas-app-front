<script setup lang="ts">
import { ref } from "vue";
import EnterpriseForm from "./EnterpriseForm.vue";
import EnterpriseOwnerForm from "./EnterpriseOwnerForm.vue";
import useEnterpriseStore from "../../store/useEnterpriseStore.ts";
import Swal from "sweetalert2";
const enterpriseStore = useEnterpriseStore();

const currentStep = ref(1); // Iniciar en el primer pas

const formData = ref({
  name: "",
  email: "",
  documentType: null,
  documentNumber: "",
  user: {
    email: "",
    firstName: "",
    lastName: "",
    documentType: null,
    documentNumber: "",
    phone: "",
    gender: null,
    birthdate: "",
  },
});

const goToNextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
};

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    // Asegúrate de no ir por debajo del primer paso
    currentStep.value--;
  }
};

const submitForm = async () => {
  try {
    await enterpriseStore.createEnterprise(formData.value);
  } catch (error: any) {
    console.log(error);
    await Swal.fire({
      title: "Error al crear empresa",
      html: `<h1>Verifique los datos</h1>
            <hr/>
            ${error.response.data.message}`,
    });
  }
};
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <v-stepper
      v-model="currentStep"
      :items="['Datos de la empresa', 'Datos del responsable']"
    >
      <template v-slot:item.1>
        <EnterpriseForm />
      </template>

      <template v-slot:item.2>
        <EnterpriseOwnerForm :formData="formData" />
      </template>

      <template v-slot:actions>
        <v-btn @click="goToPreviousStep" class="ma-2"> Anterior </v-btn>
        <v-btn @click="goToNextStep">Siguiente</v-btn>
      </template>
    </v-stepper>
  </div>
</template>
