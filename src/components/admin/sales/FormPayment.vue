<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref } from "vue";
import Swal from "sweetalert2";
import InputCurrency from "../../general/InputCurrency.vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});
const crudStore = useCrudStore(props.config)();

const dialog = ref<boolean>(false);
const loading = ref(false);

const clients = ref<any[]>([]);
const payment = ref<{ clientId: string | null; totalAmount: number }>({
  totalAmount: 0,
  clientId: null,
});

const emit = defineEmits(["item-created"]);

const submit = async () => {
  debugger;
  loading.value = true;
  try {
    emit("item-created");
    console.log("alv");
    handleClose();
  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      toast: true,
      timer: 2500,
    });
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  dialog.value = false;
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

const loadData = async () => {
  await findClients();
};
</script>

<template>
  <v-row justify="center">
    <LoadInProgress v-if="loading" />
    <v-dialog v-model="dialog" :persistent="true" max-width="600">
      <template v-slot:activator="{ props }">
        <v-btn
          type="icon"
          color="success"
          icon="mdi-account-plus"
          variant="outlined"
          @click="loadData"
          v-bind="props"
        />
      </template>
      <v-card title="Factura de pago" :disabled="loading" :loading="loading">
        <v-container>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  v-model="payment.clientId"
                  label="Clientes"
                  :items="clients"
                  item-title="fullName"
                  :disabled="mode !== 2"
                  :chips="true"
                  item-color="info"
                  :return-object="true"
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
              <v-col cols="12">
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
            </v-row>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="mode === 2"
            color="success"
            variant="tonal"
            @click="submit()"
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
