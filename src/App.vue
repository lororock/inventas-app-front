<script setup lang="ts">
import { computed } from 'vue';
import PanelLateral from "./components/admin/PanelLateral.vue";
import {useAuthStore} from "./store/auth.store.ts";

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.token);
</script>

<template>
  <v-app>
    <PanelLateral v-if="isAuthenticated" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
