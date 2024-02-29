<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import useResourceStore from "../../../store/resources.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { computed, ref } from "vue";
import Swal from "sweetalert2";
import InputCurrency from "../../general/InputCurrency.vue";
import useConfigStore from "../../../store/use.config.store.ts";
import { format } from "@formkit/tempo";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const configStore = useConfigStore();

const crudStore = useCrudStore(props.config)();
const resourceStore = useResourceStore();

const salesTypes = ref(resourceStore.saleTypes);

const emit = defineEmits(["item-created"]);

const sale = ref<any>({ type: 0 });
const clients = ref<{ documentNumber: string; documentType: number }[]>([]);
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

const products = ref<
  {
    id: string;
    name: string;
    barcode: string;
    attrs?: any;
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

const submit = async () => {
  loading.value = !loading.value;
  try {
    const data = {
      ...sale.value,
      clientId: sale.value.clientId?.id,
      inventoryId: configStore.inventoryId,
      productsIds: productsSelected.value.map(
        ({ id, quantity }: { id: string; quantity: number }) => ({
          id,
          quantity,
        }),
      ),
    };
    await crudStore.create(data);
    emit("item-created");
    handleClose();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = !loading.value;
  }
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
  const { productInventories } = await crudStore.customRequest({
    method: "GET",
    path: `inventories/${configStore.inventoryId}`,
  });
  products.value = productInventories.map(({ product }: any) => ({
    ...product,
  }));
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

const findSaleById = async () => {
  const saleFound = await crudStore.findById(props.id);
  sale.value = {
    ...sale.value,
    createdAt: saleFound.createdAt,
    status: saleFound.status,
  };
  productsSelected.value = saleFound.salesDetails.map(
    ({ id, product, quantity, subtotal, unitPrice }: any) => ({
      id,
      name: product.name,
      quantity,
      subtotal: +subtotal,
      unitPrice: +unitPrice,
    }),
  );
};

const loadData = async () => {
  await configStore.validateInventoryChecked();
  await findClients();
  await findProducts();
  if (props.mode !== 2) {
    await findSaleById();
  }
};
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
          @click="loadData"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="loadData"
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="success"
          icon="mdi-plus"
          variant="outlined"
          @click="loadData"
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
                  v-model="sale.clientId"
                  label="Clientes"
                  :items="clients"
                  item-title="fullName"
                  :disabled="mode !== 2"
                  :chips="true"
                  item-color="info"
                  :return-object="true"
                  :clearable="true"
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
                  :disabled="mode !== 2"
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
                  :disabled="mode !== 2"
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
              <v-col cols="6">
                <v-switch
                  :prepend-icon="sale.status === 2 ? 'mdi-check' : 'mdi-close'"
                  v-model="sale.status"
                  hide-details
                  :true-value="2"
                  :false-value="3"
                  :color="sale.status === 2 ? 'success' : 'red'"
                  :label="
                    sale.status === 2 ? 'Venta activa' : 'Venta rechazada'
                  "
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <hr />
                <v-data-table-virtual
                  :disabled="mode !== 2"
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
                      :readonly="mode !== 2"
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
                <v-text-field
                  density="compact"
                  :model-value="`Factura creada ${format({
                    date: sale.createdAt,
                    format: 'MMMM D, YYYY h:mm a',
                  })}`"
                  bg-color="primary"
                  v-if="mode !== 2"
                  :showButtons="false"
                />
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