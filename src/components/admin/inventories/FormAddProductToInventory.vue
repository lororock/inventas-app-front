<script setup lang="ts">
import { onMounted, ref } from "vue";
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import InputCurrency from "../../general/InputCurrency.vue";
import Swal from "sweetalert2";

onMounted(async () => {
  await listAllProducts();
});

const props = defineProps({
  inventoryId: { type: String, required: true },
});

const emit = defineEmits(["inventory-updated"]);

const productsFound = ref<any>([]);
const productsSelected = ref<any>([]);

const configTable: EntityConfig = {
  name: "inventory",
  path: "inventories",
  columns: [
    { title: "Nombre", key: "status", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: null,
};

const crudStore = useCrudStore(configTable)();

const listAllProducts = async () => {
  productsFound.value = await crudStore.customRequest({
    method: "GET",
    path: "products/find/all",
  });
};

const validateProductsSelected = async () => {
  if (productsSelected.value.length === 0) {
    await Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Debes seleccionar por lo menos un producto",
      toast: true,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return false;
  }
  for (const productSelected of productsSelected.value) {
    if (
      productSelected.quantity === undefined ||
      isNaN(+productSelected.quantity) ||
      productSelected.quantity === 0
    ) {
      await Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error en los productos",
        html: `El producto ${productSelected.name} no tiene una cantidad valida`,
        toast: true,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }
  }
  return true;
};

const transformProducts = () =>
  productsSelected.value.map(({ id, quantity }: any) => ({ id, quantity }));

const submit = async () => {
  loading.value = !loading.value;
  try {
    const isValid = await validateProductsSelected();
    if (isValid) {
      await crudStore.customRequest({
        method: "PUT",
        path: `inventories/${props.inventoryId}`,
        body: transformProducts(),
      });
      await handleClose();
      loading.value = !loading.value;
      emit("inventory-updated");
    }
  } catch (error: any) {
    await Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Error al registrar inventario",
      toast: true,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    loading.value = false;
  }
};

const dialog = ref<boolean>(false);
const loading = ref(false);

const handleClose = async () => {
  productsSelected.value = [];
  dialog.value = !dialog.value;
};
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
          <v-combobox
            v-model="productsSelected"
            density="compact"
            label="Productos"
            variant="outlined"
            :items="productsFound"
            item-title="name"
            color="success"
            :multiple="true"
            :chips="true"
            closable-chips
            item-color="success"
          />
          <v-table fixed-header height="300px">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in productsSelected" :key="index">
                <td>{{ product.name }}</td>
                <td>
                  <InputCurrency
                    v-model="product.quantity"
                    currency="CAN"
                    :min-value="-100"
                    :max-value="800"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-form>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" variant="tonal" @click="handleClose">
          Cancelar
        </v-btn>
        <v-btn color="indigo" variant="tonal" @click="submit">
          Guardar cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
