<script setup>
import { ref } from 'vue';
import useUserStore from '../../../store/useUserStore';
import { employeeColumnsName } from '../../../assets/tables.columns.name.ts';

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
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <v-data-table-virtual
        v-else
        :headers="employeeColumnsName"
        :items="items"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
            color="orange-lighten-2"
            size="small"
            class="me-2"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            color="red"
            size="small"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-virtual>
  </v-container>
</template>
