<script setup>
import { ref } from 'vue';
import useUserStore from '../../../store/useUserStore';
import { employeeColumnsName } from '../../../assets/tables.columns.name.ts';
import LoadInProgress from "../../general/LoadInProgress.vue";

const userStore = useUserStore();
const items = ref([]);
const loading = ref(false);
const error = ref(null);
const search = ref("");

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
    <v-alert v-else-if="error" color="red" type="error" v-if="error">{{error}}</v-alert>
    <v-card
        v-else
        flat=""
        title="Nutrition"
    >
      <template v-slot:text>
        <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            single-line
            density="compact"
            variant="outlined"
            hide-details
        />
      </template>
      <v-data-table
          :headers="employeeColumnsName"
          :items="items"
          :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn variant="text" size="small" color="indigo" icon="mdi-eye" />
          <v-btn variant="text" size="small" color="orange-lighten-2" icon="mdi-pencil" />
          <v-btn variant="text" size="small" color="red" icon="mdi-trash-can" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
