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
import useSoundStore from "../../../store/sound.store.ts";
import router from "../../../router";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const configStore = useConfigStore();

const crudStore = useCrudStore(props.config)();
const resourceStore = useResourceStore();
const soundStore = useSoundStore();

const salesTypes = ref(resourceStore.saleTypes);

const emit = defineEmits(["item-created"]);

const sale = ref<any>({ type: 0 });

const status = ref<{ value: number; name: string; props: any }[]>([
  {
    value: 2,
    name: "Activa",
    props: { disabled: false },
  },
  {
    value: 3,
    name: "Inactiva",
    props: { disabled: false },
  },
]);

const clients = ref<{ documentNumber: string; documentType: number }[]>([]);
const barcodeTemp = ref<string>("");

const headersProductsSelected = ref<any[]>([
  { title: "Eliminar", key: "action", sortable: false },
  { title: "Producto", key: "name", sortable: false },
  { title: "precio unitario", key: "salePrice", sortable: false },
  { title: "Cantidad", key: "quantity", sortable: false },
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
  | {
      id: string;
      name: string;
      barcode: string;
      attrs?: any;
      salePrice: number;
    }[]
  | any
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
  } catch (error: any) {
    dialog.value = false;
    await Swal.fire({
      title: "Error al registrar venta",
      html: error.response.data.message,
      icon: "error",
      showConfirmButton: false,
      timer: 3000,
    });
    dialog.value = true;
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
  products.value =
    productInventories &&
    productInventories.map(({ product }: any) => ({
      ...product,
    }));
};

const foundProductByBarcode = async () => {
  const foundProduct = products.value.find(
    ({ barcode }: any) => barcode === barcodeTemp.value,
  );
  barcodeTemp.value = "";
  if (!foundProduct) {
    await Swal.fire({
      position: "top-end",
      timer: 1500,
      toast: true,
      showConfirmButton: false,
      title: "Producto no encontrado",
      icon: "error",
    });
    await soundStore().playError();
  } else {
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

const removeProduct = (idSelected: string) => {
  productsSelected.value = productsSelected.value.filter(
    ({ id }) => id !== idSelected,
  );
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
      salePrice: +unitPrice,
    }),
  );
};

const changeStatus = async () => {
  loading.value = true;
  dialog.value = false;
  const { isConfirmed } = await Swal.fire({
    title: "¿Quieres cambiar el estado de la venta?",
    confirmButtonText: `Si, ${
      sale.value.status === 3 ? "rechazar venta" : "activar venta"
    }`,
    denyButtonText: "No",
    showDenyButton: true,
    showCancelButton: false,
    allowOutsideClick: false,
    icon: "info",
  });
  if (isConfirmed) {
    const { isConfirmed } = await Swal.fire({
      title: "¿Esta operación afecta al inventario?",
      html:
        sale.value.status === 2
          ? "Estás activando una venta. ¿Deseas restar los ítems vendidos del inventario? <br/>" +
            "<b>Si no cuentas con la cantidad minima en el inventario no se podra realizar la activación</b>"
          : "Estás cancelando una venta. ¿Deseas restaurar los ítems vendidos al inventario?",
      confirmButtonText:
        sale.value.status === 3 ? "Si, restaurar items" : "Si, restar items",
      denyButtonText: `${
        sale.value.status === 2
          ? "No, solo activar venta"
          : "No, solo rechazar venta"
      }`,
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      icon: "warning",
    });
    try {
      await crudStore.changeStatus(props.id, {
        status: sale.value.status,
        id: configStore.inventoryId,
        restore: isConfirmed,
      });
    } catch (error: any) {
      await Swal.fire({
        title: "Oops",
        text: error.response.data.message,
        icon: "error",
      });
    }
  }
  loading.value = false;
  dialog.value = false;
  router.go(0);
};

const loadData = async () => {
  loading.value = true;
  await configStore.validateInventoryChecked();
  await findClients();
  await findProducts();
  if (props.mode !== 2) {
    await findSaleById();
  }
  loading.value = false;
};
</script>

<template>
  <v-row justify="center">
    <LoadInProgress v-if="loading" />
    <v-dialog v-model="dialog" :persistent="true" max-width="1200">
      <LoadInProgress v-if="loading" />
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
          size="small"
          color="success"
          icon="mdi-printer-pos-plus"
          variant="outlined"
          @click="loadData"
          v-bind="props"
          v-else
        />
      </template>
      <v-card title="Factura de venta">
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
              <v-col cols="6" v-if="mode === 2">
                <v-autocomplete
                  density="compact"
                  label="Productos"
                  variant="outlined"
                  v-model.number="productsSelected"
                  :items="products"
                  item-title="name"
                  item-value="id"
                  color="success"
                  :multiple="true"
                  :chips="true"
                  closable-chips
                  item-color="success"
                  :creatable="false"
                  :return-object="true"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-if="mode !== 2"
                  label="Estado de la venta"
                  v-model="sale.status"
                  :items="status"
                  variant="outlined"
                  density="compact"
                  item-title="name"
                  item-disabled="disable"
                  :color="sale.status === 2 ? 'success' : 'red'"
                  @update:model-value="changeStatus"
                  :disabled="sale.status === 3"
                >
                  <template #prepend>
                    <v-icon
                      v-if="sale.status === 2"
                      icon="mdi-check-circle-outline"
                      variant="outlined"
                      color="success"
                    />
                    <v-icon
                      v-if="sale.status === 3"
                      icon="mdi-close-circle-outline"
                      variant="outlined"
                      color="red"
                    />
                  </template>
                </v-select>
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
                  <template v-slot:item.action="{ item }">
                    <v-btn
                      :disabled="mode !== 2"
                      size="x-small"
                      color="red"
                      icon="mdi-trash-can"
                      @click="removeProduct(item.id)"
                    />
                  </template>
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
                      :max-value="100"
                      :variant="mode !== 2 ? 'plain' : 'outlined'"
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
