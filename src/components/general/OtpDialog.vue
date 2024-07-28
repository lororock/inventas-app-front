<script setup lang="ts">
import { ref } from "vue";
import axiosInstance from "../../services/axios.service.ts";
import Swal from "sweetalert2";

const dialog = ref<boolean>(false);
const otp = ref<string>("");

const emit = defineEmits(['confirm']);

const changeStatus = () => {
  dialog.value = !dialog.value;
}

const close = () => {
  otp.value = '';
  changeStatus();
}

const confirm = () => {
  emit('confirm', otp.value);
  close();
}

const generateOtp = async () => {
try {
  const {data} = await axiosInstance.post("auth/generate-otp")

  await Swal.fire({title: data.message, toast: true, showConfirmButton: false, timer: 2100, position: 'top-right', icon: "success"})
}
catch (error) {
  await Swal.fire({title: "Error", html: "No fue posible generar OTP", toast: true, showConfirmButton: false, timer: 2100})
  throw error
}
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="800" :persistent="true">
    <template v-slot:activator="{ props }">
      <v-btn
          v-bind="props"
          variant="tonal"
          color="primary"
          @click="generateOtp"
      >
        Confirmar acción
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Confirmar acción</v-card-title>
      <v-card-text>
        <p>¿Estás seguro de realizar esta acción?</p>
        <v-divider></v-divider>
        <h5>Ingresa el código OTP enviado a tu correo</h5>
        <v-otp-input v-model="otp"></v-otp-input>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="close" color="danger" variant="tonal">Cancelar</v-btn>
        <v-btn :disabled="otp.length < 6" color="primary" @click="confirm">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Añadir estilos si es necesario */
</style>
