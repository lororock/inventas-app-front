<script setup lang="ts">
import { ref } from "vue";
import EnterpriseForm from "./EnterpriseForm.vue";
import EnterpriseOwnerForm from "./EnterpriseOwnerForm.vue";
import useEnterpriseStore from "../../store/useEnterpriseStore.ts";
import Swal from "sweetalert2";
const enterpriseStore = useEnterpriseStore();

const currentStep = ref(1);
const steps = ref(2);

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
  if (currentStep.value < steps.value) {
    currentStep.value++;
  }
};

const goToPreviousStep = () => {
  if (currentStep.value >= steps.value) {
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
      <template v-slot:actions>
        <v-row class="ma-2">
          <v-col cols="auto">
            <v-btn :disabled="currentStep === 1" @click="goToPreviousStep">
              <v-icon icon="mdi-arrow-left" />
            </v-btn>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="auto">
            <v-btn :disabled="currentStep === steps" @click="goToNextStep">
              <v-icon icon="mdi-arrow-right" />
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.1>
        <EnterpriseForm :formData="formData" />
      </template>

      <template v-slot:item.2>
        <EnterpriseOwnerForm :formData="formData" />
      </template>
    </v-stepper>
  </div>
</template>
