<template>
  <v-app-bar color="teal-darken-2" prominent>
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="nav = !nav"
    ></v-app-bar-nav-icon>

    <v-toolbar-title @click="loadItems()">Opciones</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-magnify" />

    <v-btn variant="text" icon="mdi-filter" />

    <v-btn variant="text" icon="mdi-logout" @click="authStore.logout()" />
  </v-app-bar>
  <v-navigation-drawer color="teal-lighten-5" v-model="nav" relative app>
    <v-alert
      variant="plain"
      :color="'teal-darken-5'"
      :title="item.title"
      density="compact"
      v-for="(item, index) of listItems"
      :key="index"
    >
      <v-list v-for="(subItem, subIndex) of item.items" :key="subIndex" link>
        <v-btn
          variant="text"
          size="small"
          :prepend-icon="subItem.icon"
          @click="router.push(subItem.path)"
          ><strong>{{ subItem.title }}</strong></v-btn
        >
      </v-list>
    </v-alert>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "../../store/auth.store.ts";
import useResourceStore from "../../store/resources.store.ts";

import router from "../../router";
const authStore = useAuthStore();
const resourceStore = useResourceStore();

const listItems = ref(resourceStore.functionsDashboard);
const nav = ref(true);
const currentUser = ref<any>(null);

const loadItems = async () => {
  authStore.loadUser();
  currentUser.value = authStore.user;
  const userRoles = currentUser.value.roles;
  listItems.value = listItems.value.filter((module) => {
    module.items = module.items.filter((item) =>
      item.roles.some((role) => userRoles.includes(role)),
    );
    return module.items.length > 0;
  });
};

onMounted(() => {
  loadItems();
});

watch(nav, (newVal) => {
  if (newVal) {
    loadItems();
  }
});
</script>
