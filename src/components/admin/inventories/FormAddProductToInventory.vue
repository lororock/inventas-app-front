<script setup lang="ts">
import { onMounted, ref } from "vue";
import useCrudStore from "../../../store/crud.store.ts";
import FormProduct from "../products/FormProduct.vue";

onMounted(async () => {
  await listAllProducts();
});

const productsFound = ref<any>([]);

const crudStore = useCrudStore({
  name: "Product",
  path: "products",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Nombre", key: "name", sortable: false },
    { title: "Código de barras", key: "barcode", sortable: false },
    { title: "Precio de compra", key: "costPrice", sortable: false },
    { title: "Precio de venta", key: "salePrice", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: FormProduct,
})();

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
