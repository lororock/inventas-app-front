<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth.store.ts";
import router from "../router";

const valid = ref<boolean>(true);
const email = ref<string>("admin.inventas@yopmail.com");
const password = ref<string>("7423102Ca");
const authStore = useAuthStore();

const submitLogin = async () =>
  await authStore.login(email.value, password.value);

(async () => {
  const isAuth = await authStore.validTokenRefresh();
  if (isAuth) return await router.push("/form");
})();
</script>

<template>
  <v-card class="max-w-2xl mx-auto mt-20">
    <v-form v-model="valid" @submit.prevent="submitLogin">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              density="compact"
              v-model="email"
              label="Correo"
              required
              hide-details
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              density="compact"
              v-model="password"
              label="Contraseña"
              required
            />
          </v-col>
        </v-row>
        <v-btn type="submit" class="bg-green"> Iniciar Sesión </v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>
