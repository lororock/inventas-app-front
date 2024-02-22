<script setup lang="ts">
import { onMounted, ref } from "vue";
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";

onMounted(async () => {
  await listAllProducts();
});

const productsFound = ref<any>([]);

const configTable: EntityConfig = {
  name: "inventory",
  path: "inventories",
  columns: [
    { title: "Nombre", key: "status", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: null,
};

const items = ref<any>([]);

const crudStore = useCrudStore(configTable)();

const listAllProducts = async () => {
  productsFound.value = await crudStore.customRequest({
    method: "GET",
    path: "products/find/all",
  });
};

const submit = async () => {
  loading.value = !loading.value;
  dialog.value = !dialog.value;
};

const dialog = ref<boolean>(false);
const loading = ref(false);
</script>

<template>
  <v-dialog v-model="dialog" :persistent="true" max-width="600">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="success">
        <v-icon icon="mdi-format-list-bulleted-type" />
      </v-btn>
    </template>
    <v-card title="Datos inventario" :loading="loading" :disabled="loading">
      <v-container>
        <v-form>
          <v-autocomplete
            density="compact"
            label="Productos"
            variant="outlined"
            :items="productsFound"
            item-title="name"
            color="success"
            :multiple="true"
            :chips="true"
          />
          <v-table fixed-header height="300px">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.status }}</td>
                <td>{{ item.actions }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-form>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn color="indigo" variant="tonal" @click="submit">
          Guardar cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
