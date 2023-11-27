<template>
      <v-app-bar
          color="primary"
          prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="nav = !nav"></v-app-bar-nav-icon>

        <v-toolbar-title>Opciones</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn variant="text" icon="mdi-magnify" />

        <v-btn variant="text" icon="mdi-filter" />

        <v-btn variant="text" icon="mdi-logout" @click="authStore.logout()" />
      </v-app-bar>
      <v-navigation-drawer
          v-model="nav"
          relative
          app
      >
        <v-alert :title="item.title" density="compact" v-for="(item, index) of listItems" :key="index" :color="item.color">
          <v-list
              v-for="(subItem, subIndex) of item.items"
              :key="subIndex"
              link
          >
            <v-btn variant="text" size="small" :prepend-icon="subItem.icon">{{subItem.title}}</v-btn>
          </v-list>
        </v-alert>
      </v-navigation-drawer>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {functionsDashboard} from "../../assets/list.items.ts";
import {useAuthStore} from "../../store/auth.store.ts";
const authStore = useAuthStore()


const listItems = ref(functionsDashboard)
let nav = ref(true)
</script>