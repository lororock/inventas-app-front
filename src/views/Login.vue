<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "../store/auth.store.ts";
import router from "../router";

const schema = yup.object({
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("Debe ser un correo válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "Debe tener máximo de 50 caracteres")
    .matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      "El password debería tener una mayúscula, una minúscula y un numero",
    ),
});

const { meta } = useForm({
  validationSchema: schema,
});
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const authStore = useAuthStore();
const submitLogin = async () => {
  if (typeof email.value === "string")
    if (typeof password.value === "string")
      await authStore.login(email.value, password.value);
};

(async () => {
  const isAuth = await authStore.validTokenRefresh();
  if (isAuth) await router.push("/form");
})();
</script>

<template>
  <v-card class="max-w-2xl mx-auto mt-20">
    <v-form @submit.prevent="submitLogin">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              density="compact"
              v-model="email"
              :error-messages="emailError"
              label="Correo"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              density="compact"
              v-model="password"
              :error-messages="passwordError"
              label="Contraseña"
              required
              type="password"
            />
          </v-col>
        </v-row>
        <v-btn :disabled="!meta.valid" block type="submit" class="bg-green">
          Iniciar Sesión
        </v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>
