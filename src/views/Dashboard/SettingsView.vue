<script setup lang="ts">
import useCrudStore from "../../store/crud.store.ts";
import { onMounted, ref } from "vue";
import useConfigStore from "../../store/use.config.store.ts";
const configStore = useConfigStore();

const crudStore = useCrudStore({
  name: "",
  columns: [],
  path: "",
  formComponent: null,
})();

const inventories = ref([]);
const listInventories = async () => {
  inventories.value = await crudStore.customRequest({
    method: "GET",
    path: "/inventories/find/all",
  });
};

onMounted(() => {
  listInventories();
});
</script>

<template>
  <v-container>
    <v-card class="mx-auto" max-width="600">
      <v-card-item>
        <v-list>
          <v-list-item title="Control de usuarios">
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-account-group"
              append-icon="mdi-open-in-new"
            >
              Usuarios/Empleados
            </v-btn>
          </v-list-item>
          <v-list-item title="Configuracion de inventario">
            <v-autocomplete
              color="primary"
              label="Selecciona el inventario que deseas usar"
              density="compact"
              variant="outlined"
              :items="inventories"
              v-model="configStore.inventoryId"
              item-title="location"
              item-value="id"
              @update:modelValue="configStore.saveInventoryId"
            />
          </v-list-item>
        </v-list>
      </v-card-item>
    </v-card>
  </v-container>
</template>
