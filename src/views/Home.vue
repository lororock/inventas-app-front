<script setup lang="ts">
import { ref } from "vue";
import authStore from "../store/auth.store.ts";

const email = ref("ernesto.employee@mail.com");
const password = ref("7423102Ca");
const store = authStore();

const submitLogin = async () => await store.login(email.value, password.value);
</script>

<template>
  <h1>Login</h1>
  <form @submit.prevent="submitLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</template>
