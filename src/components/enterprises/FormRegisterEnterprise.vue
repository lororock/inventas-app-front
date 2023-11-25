<script setup lang="ts">
import { ref } from "vue";
import EnterpriseForm from "./EnterpriseForm.vue";
import EnterpriseOwnerForm from "./EnterpriseOwnerForm.vue";
import useEnterpriseStore from "../../store/useEnterpriseStore.ts";
import Swal from "sweetalert2";
import {useAuthStore} from "../../store/auth.store.ts";
const enterpriseStore = useEnterpriseStore();
const authStore = useAuthStore()

const currentStep = ref(1);
const steps = ref(2);

const formData = ref({
  name: "",
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
    await Swal.fire({
      title: "Empresa creada con exito",
      text: `Registro exitoso, al cliente ${formData.value.user.email} le llegarán la credenciales`,
      icon: "success",
      timer: 10000,
    });
  } catch (error: any) {
    await Swal.fire({
      title: "Error al crear empresa",
      text: `${error.response.data.message}`,
      icon: "error",
    });
  }
};
</script>

<template>
  <v-btn @click="authStore.logout()">Cerrar Sesión</v-btn>
  <div class="mx-auto max-w-2xl">
    <v-stepper
      v-model="currentStep"
      :items="['Datos de la empresa', 'Datos del responsable']"
    >
      <template v-slot:actions>
        <v-col v-if="currentStep === steps" cols="12">
          <v-btn @click="submitForm" color="success" block>Registrar</v-btn>
        </v-col>
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
