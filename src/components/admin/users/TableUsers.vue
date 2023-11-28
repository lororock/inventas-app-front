<script setup>
import { ref } from "vue";
import useUserStore from "../../../store/useUserStore";
import { employeeColumnsName } from "../../../assets/tables.columns.name.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import UserDetails from "./UserForm.vue";

const userStore = useUserStore();
const items = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchEmployees() {
  loading.value = true;
  error.value = null;
  try {
    const response = await userStore.listEmployees();
    items.value = response.items;
  } catch (e) {
    console.error(e);
    error.value = e;
  } finally {
    loading.value = false;
  }
}

fetchEmployees();
</script>

<template>
  <v-container>
    <LoadInProgress v-if="loading" />
    <v-alert v-else-if="error" color="red" type="error" v-if="error">
      {{ error }}
    </v-alert>
    <v-card v-else title="Usuarios">
      <v-card-subtitle>
        <v-row>
          <v-col cols="9">
            <v-text-field
              placeholder="Buscar"
              density="compact"
              variant="outlined"
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1">
            <UserDetails :mode="2" />
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-data-table :headers="employeeColumnsName" :items="items">
        <template v-slot:item.id="{ item }">
          <UserDetails :id="item.id" :mode="0" />
        </template>
        <template v-slot:item.actions="{ item }">
          <UserDetails :id="item.id" :mode="1" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
