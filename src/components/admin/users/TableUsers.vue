<script setup>
import { ref } from 'vue';
import useUserStore from '../../../store/useUserStore';
import { employeeColumnsName } from '../../../assets/tables.columns.name.ts';
import LoadInProgress from "../../general/LoadInProgress.vue";

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
    <div v-else-if="error">Error: {{ error.message }}</div>
    <v-data-table-virtual
        v-else
        :headers="employeeColumnsName"
        :items="items"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn variant="text" size="small" color="orange-lighten-2" icon="mdi-pencil" />
        <v-btn variant="text" size="small" color="red" icon="mdi-trash-can" />
      </template>
    </v-data-table-virtual>
  </v-container>
</template>
