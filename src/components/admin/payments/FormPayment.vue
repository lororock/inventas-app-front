<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref } from "vue";
import Swal from "sweetalert2";
import InputCurrency from "../../general/InputCurrency.vue";
import { format } from "@formkit/tempo";
import router from "../../../router";
import useConfigStore from "../../../store/use.config.store.ts";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});
const crudStore = useCrudStore(props.config)();
const configStore = useConfigStore();

const dialog = ref<boolean>(false);
const loading = ref(false);

const clients = ref<any[]>([]);
const payment = ref<{ clientId: string | null; totalAmount: number }>({
  totalAmount: 10,
  clientId: null,
});

const status = ref<{ value: number; name: string; props: any }[]>([
  {
    value: 2,
    name: "Activo",
    props: { disabled: false },
  },
  {
    value: 3,
    name: "Inactivo",
    props: { disabled: false },
  },
]);

const payments = ref<
  {
    id: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
  }[]
>([]);

const client = ref<{
  id: string;
  names: string;
  surnames: string;
  documentNumber: string;
}>();

const headers = ref<{ title: string; key: string; sortable: boolean }[]>([
  { title: "Pago total", key: "totalAmount", sortable: false },
  { title: "Fecha de creación", key: "createdAt", sortable: false },
  { title: "Fecha de actualización", key: "updatedAt", sortable: false },
  { title: "Estado", key: "status", sortable: false },
]);

const emit = defineEmits(["item-created"]);

const submit = async () => {
  loading.value = true;
  dialog.value = false;
  const { isDenied } = await Swal.fire({
    title: "¿Deseas registrar el pago?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Si",
    denyButtonText: "No",
  });
  if (isDenied) {
    loading.value = false;
    dialog.value = true;
    return;
  }
  try {
    await crudStore.customRequest({
      method: "POST",
      path: "payments",
      body: { ...payment.value, inventoryId: configStore.inventoryId },
    });
    emit("item-created");
    handleClose();
  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response.data.message,
      toast: true,
      timer: 4000,
      position: "top-end",
      showConfirmButton: false,
      timerProgressBar: true,
    });
    handleClose();
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  dialog.value = false;
  payment.value = { clientId: null, totalAmount: 10 };
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

const changeStatus = async (item: any) => {
  console.log(item);
  loading.value = true;
  dialog.value = false;
  const { isConfirmed } = await Swal.fire({
    title: "¿Quieres cambiar el estado del pago?",
    showCancelButton: true,
    confirmButtonText: "Si",
    allowOutsideClick: false,
  });
  if (isConfirmed) {
    try {
      await crudStore.customRequest({
        method: "PUT",
        path: `payments/status/${item.id}`,
        body: { status: item.status },
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
  router.go(0);
};

const findSalesByClientId = async () => {
  const paymentsFound = await crudStore.customRequest({
    method: "GET",
    path: `payments/client/${props.id}`,
  });

  client.value = await crudStore.customRequest({
    method: "GET",
    path: `clients/${props.id}`,
  });

  payments.value = paymentsFound.map(({ totalAmount, ...restData }: any) => ({
    totalAmount: +totalAmount,
    ...restData,
  }));
};

const loadData = async () => {
  const inventories = await crudStore.customRequest({
    method: "GET",
    path: `inventories/find/all`,
  });

  await configStore.validateInventoryChecked(inventories);
  await findClients();
  if (props.mode !== 2) {
    await findSalesByClientId();
  }
};
</script>

<template>
  <v-row justify="center">
    <LoadInProgress v-if="loading" />
    <v-dialog v-model="dialog" :persistent="true" max-width="1200">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="mode === 1"
          type="icon"
          size="small"
          color="primary"
          icon="mdi-text-account"
          variant="outlined"
          @click="loadData"
          v-bind="props"
        />
        <v-btn
          v-else
          type="icon"
          size="small"
          color="success"
          icon="mdi-cash-plus"
          variant="outlined"
          @click="loadData"
          v-bind="props"
        />
      </template>
      <v-card
        :title="mode === 2 ? 'Factura de pago' : 'Pagos'"
        :disabled="loading"
        :loading="loading"
      >
        <v-container>
          <v-form @submit.prevent="submit">
            <v-row>
              <v-col cols="12" v-if="mode === 2">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  v-model="payment.clientId"
                  label="Clientes"
                  :items="clients"
                  item-title="fullName"
                  item-value="id"
                  :disabled="mode !== 2"
                  :chips="true"
                  item-color="info"
                  :clearable="true"
                  append-icon="mdi-magnify"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.documentNumber"
                    />
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" v-if="mode === 2">
                <InputCurrency
                  v-model="payment.totalAmount"
                  label="Cantidad a abonar"
                  :show-buttons="false"
                  :min-value="10"
                  :max-value="1000000"
                  persistent-hint
                  icon="mdi-cash"
                />
              </v-col>
              <v-col cols="12" v-if="mode === 1">
                <v-chip>
                  {{
                    client &&
                    client.documentNumber +
                      " - " +
                      client.names +
                      " " +
                      client.surnames
                  }}
                </v-chip>
              </v-col>
              <v-col cols="12" v-if="mode === 1">
                <v-data-table-virtual :headers="headers" :items="payments">
                  <template v-slot:item.totalAmount="{ item }">
                    <InputCurrency
                      v-model="item.totalAmount"
                      :readonly="true"
                      variant="plain"
                    />
                  </template>
                  <template v-slot:item.createdAt="{ item }">
                    <v-chip color="success" variant="outlined">
                      {{
                        format({
                          date: `${item.createdAt}`,
                          format: "YYYY-MM-D h:mm a",
                        })
                      }}
                    </v-chip>
                  </template>
                  <template v-slot:item.updatedAt="{ item }">
                    <v-chip color="primary" variant="outlined">
                      {{
                        format({
                          date: `${item.updatedAt}`,
                          format: "YYYY-MM-D h:mm a",
                        })
                      }}
                    </v-chip>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-select
                      v-model="item.status"
                      :items="status"
                      variant="outlined"
                      density="compact"
                      item-title="name"
                      item-disabled="disable"
                      :bg-color="
                        item.status === 2
                          ? 'success'
                          : item.status === 1
                            ? 'amber'
                            : 'red'
                      "
                      @update:model-value="changeStatus(item)"
                      :disabled="item.status === 3"
                    />
                  </template>
                </v-data-table-virtual>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="mode === 2"
            color="success"
            variant="tonal"
            @click="submit"
          >
            Registrar pago
          </v-btn>
          <v-btn color="red-darken-1" variant="tonal" @click="handleClose">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
