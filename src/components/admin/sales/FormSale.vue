<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import useResourceStore from "../../../store/resources.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import InputCurrency from "../../general/InputCurrency.vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const crudStore = useCrudStore(props.config)();
const resourceStore = useResourceStore();

const salesTypes = ref(resourceStore.saleTypes);

const emit = defineEmits(["item-created"]);

const sale = ref<any>({ type: 0 });
const clients = ref<{ documentNumber: string; documentType: number }[]>([]);
const inventories = ref<{ id: string; location: string }[]>([]);
const products = ref<
  {
    id: string;
    name: string;
    barcode: string;
    attrs?: any;
    salePrice: number;
  }[]
>([]);
const barcodeTemp = ref<string>("");

const headersProductsSelected = ref<any[]>([
  { title: "Producto", key: "name", sortable: false },
  { title: "precio unitario", key: "salePrice", sortable: false },
  { title: "#", key: "quantity", sortable: false },
  { title: "Subtotal", key: "subtotal", sortable: false },
]);
const productsSelected = ref<
  {
    id: string;
    name: string;
    subtotal: number;
    quantity: number;
    salePrice: number;
  }[]
>([]);

const totalQuantity = computed<number>(() => {
  return +productsSelected.value.reduce(
    (acc, product) => acc + product.quantity,
    0,
  );
});

const totalSum = computed<number>(() => {
  return +productsSelected.value.reduce(
    (acc, product) => acc + product.subtotal,
    0,
  );
});

const isReadOnly = computed(() => props.mode === 0);

const submit = async () => {
  loading.value = !loading.value;
  try {
    const data = {
      ...sale.value,
      clientId: sale.value.clientId.id,
      inventoryId: sale.value.inventoryId.id,
    };
    console.log(data);
    emit("item-created");
    handleClose();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = !loading.value;
  }
};

const findInventories = async () => {
  const foundInventories = await crudStore.customRequest({
    method: "GET",
    path: "inventories/find/all",
  });
  inventories.value = foundInventories.map(
    ({ location, id }: { location: string; id: string }) => ({
      id,
      location,
    }),
  );
};

const findClients = async () => {
  const foundClients = await crudStore.customRequest({
    method: "GET",
    path: "clients/find/all",
  });

  clients.value = foundClients.map(
    ({
      id,
      names,
      surnames,
      documentNumber,
    }: {
      id: string;
      names: string;
      surnames: string;
      documentNumber: string;
    }) => ({
      id,
      fullName: `${names} ${surnames} - ${documentNumber}`,
    }),
  );
};

const findProducts = async () => {
  products.value = await crudStore.customRequest({
    method: "GET",
    path: "products/find/all",
  });
};

const foundProductByBarcode = () => {
  const foundProduct = products.value.find(
    ({ barcode }) => barcode === barcodeTemp.value,
  );
  barcodeTemp.value = "";
  if (!foundProduct) {
    Swal.fire({
      position: "top-end",
      timer: 1500,
      toast: true,
      showConfirmButton: false,
      title: "Producto no encontrado",
      icon: "error",
    });
    //TODO emitir sonido de no encontrado
  } else {
    //TODO emitir sonido de no encontrado
    const productSelected = productsSelected.value.find(
      (product) => product.id === foundProduct.id,
    );
    if (productSelected) {
      productSelected.quantity = +productSelected.quantity + 1;
      productSelected.subtotal =
        +productSelected.quantity * +productSelected.salePrice;
    } else {
      productsSelected.value.push({
        id: foundProduct.id,
        name: foundProduct.name,
        salePrice: +foundProduct.salePrice,
        subtotal: +foundProduct.salePrice,
        quantity: 1,
      });
    }
  }
};

const calculateSubtotal = (id: string) => {
  const productSelected = productsSelected.value.find(
    (product) => product.id === id,
  );
  if (productSelected) {
    productSelected.subtotal =
      +productSelected.quantity * +productSelected.salePrice;
  }
};

const focused = ref<boolean>(false);
const dialog = ref<boolean>(false);
const loading = ref(false);

const handleClose = () => {
  productsSelected.value = [];
  dialog.value = false;
  sale.value = { type: 0 };
};

onMounted(async () => {
  await findClients();
  await findProducts();
  await findInventories();
});
</script>

<template>
  <v-row justify="center">
    <LoadInProgress v-if="loading" />
    <v-dialog v-model="dialog" :persistent="true" max-width="800">
      <template v-slot:activator="{ props }">
        <v-btn
          type="icon"
          size="x-small"
          variant="outlined"
          color="primary"
          icon="mdi-eye"
          v-bind="props"
          @click="
            () => {
              console.log('ok');
            }
          "
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="
            () => {
              console.log('ok');
            }
          "
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="success"
          icon="mdi-plus"
          variant="outlined"
          v-bind="props"
          v-else
        />
      </template>
      <v-card title="Datos categoría">
        <v-container>
          <v-form>
            <v-row>
              <v-col cols="8">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  v-model="sale.inventoryId"
                  label="Clientes"
                  :items="inventories"
                  item-title="location"
                  :disabled="isReadOnly"
                  :chips="true"
                  item-color="info"
                  :return-object="true"
                />
              </v-col>
              <v-col cols="8">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  v-model="sale.clientId"
                  label="Clientes"
                  :items="clients"
                  item-title="fullName"
                  :disabled="isReadOnly"
                  :chips="true"
                  item-color="info"
                  :return-object="true"
                >
                  <template #append>
                    <v-tooltip text="Crear cliente">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon="mdi-account-plus"
                          color="success"
                          v-bind="props"
                        />
                      </template>
                    </v-tooltip>
                  </template>
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.documentNumber"
                    />
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="sale.type"
                  label="Tipo de factura"
                  variant="outlined"
                  density="compact"
                  :items="salesTypes"
                  item-value="value"
                  item-title="label"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  :color="focused ? 'black' : 'red'"
                  :base-color="focused ? 'success' : 'red'"
                  label="Codigo de barras"
                  density="compact"
                  variant="outlined"
                  @focus="focused = true"
                  @focusout="focused = false"
                  @keydown.enter="foundProductByBarcode"
                  v-model="barcodeTemp"
                >
                  <template #append>
                    <v-tooltip
                      :text="
                        focused
                          ? 'Pistola posicionada'
                          : 'Pistola no posicionada'
                      "
                    >
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props">
                          <v-icon
                            icon="mdi-barcode-scan"
                            :color="focused ? 'success' : 'red'"
                          />
                        </v-chip>
                      </template>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <hr />
                <v-data-table-virtual
                  :headers="headersProductsSelected"
                  :items="productsSelected"
                  height="400"
                  item-value="name"
                >
                  <template v-slot:item.salePrice="{ item }">
                    <InputCurrency
                      v-model.number="item.salePrice"
                      variant="plain"
                      :readonly="true"
                      :showButtons="false"
                    />
                  </template>
                  <template v-slot:item.quantity="{ item }">
                    <InputCurrency
                      v-model.number="item.quantity"
                      currency="CAN"
                      :showButtons="false"
                      :min-value="1"
                      @input="calculateSubtotal(item.id)"
                    />
                  </template>
                  <template v-slot:item.subtotal="{ item }">
                    <InputCurrency
                      v-model.number="item.subtotal"
                      variant="plain"
                      :readonly="true"
                      :showButtons="false"
                    />
                  </template>
                </v-data-table-virtual>
              </v-col>
              <v-col cols="12">
                <hr />
                <InputCurrency
                  v-model.number="totalQuantity"
                  currency="CAN"
                  bg-color="green"
                  :readonly="true"
                  :showButtons="false"
                />
                <InputCurrency
                  v-model.number="totalSum"
                  bg-color="green-darken-1"
                  :readonly="true"
                  :showButtons="false"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="mode === 1"
            color="indigo"
            variant="tonal"
            @click="submit()"
          >
            Guardar cambios
          </v-btn>
          <v-btn
            v-if="mode === 2"
            color="success"
            variant="tonal"
            @click="submit()"
            :disabled="productsSelected.length === 0"
          >
            Registrar
          </v-btn>
          <v-btn color="red-darken-1" variant="tonal" @click="handleClose">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
