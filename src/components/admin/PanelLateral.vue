<template>
      <v-navigation-drawer v-model="nav" relative app expand-on-hover>
        <v-alert :title="item.title" density="compact" v-for="(item, index) of listItems" :key="index" :color="item.color">
          <v-list
              v-for="(subItem, subIndex) of item.items"
              :key="subIndex"
              link
          >
            <v-btn variant="text" size="small" :prepend-icon="subItem.icon" >{{subItem.title}}</v-btn>
          </v-list>
        </v-alert>
      </v-navigation-drawer>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {functionsDashboard} from "../../assets/list.items.ts";

const listItems = ref(functionsDashboard)
let nav = ref(true)
</script>