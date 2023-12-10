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
import router from "../../router";
import DashboardItem from "../../assets/interfaces/dashboard.items.interface.ts";
const authStore = useAuthStore();

const functionsDashboard: DashboardItem[] = [
  {
    roles: [0],
    title: "Módulo de empresas",
    items: [
      {
        id: 1,
        roles: [0],
        icon: "mdi-domain",
        title: "Adm. empresas",
        path: "form",
      },
    ],
  },
  {
    roles: [1],
    title: "Módulo de usuarios",
    items: [
      {
        id: 2,
        roles: [1],
        icon: "mdi-account-multiple",
        title: "Adm. usuarios",
        path: "employees",
      },
    ],
  },
  {
    roles: [1, 2, 3],
    title: "Módulo de recursos",
    items: [
      {
        id: 1,
        roles: [1, 2],
        icon: "mdi-shape",
        title: "Categorias productos",
        path: "categories",
      },
      {
        id: 1,
        roles: [1, 2, 3],
        icon: "mdi-basket",
        title: "Productos/Servicios",
        path: "products",
      },
      {
        id: 1,
        roles: [1, 2, 3],
        icon: "mdi-store-outline",
        title: "Inventario",
        path: "categories",
      },
    ],
  },
];

const listItems = ref(functionsDashboard);
const nav = ref(true);
const currentUser = ref<any>(null);

const loadItems = async () => {
  authStore.loadUser();
  currentUser.value = authStore.user;
  const userRoles = currentUser.value.roles;
  listItems.value = functionsDashboard.filter((module) => {
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
