<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import useResourceStore from "../../../store/resources.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";

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

const sale = ref<any>({});
const clients = ref<{ documentNumber: string; documentType: number }[]>([]);
const products = ref<{ name: string; barcode: string; attrs?: any }[]>([]);
const barcodeTemp = ref<string>("");

const isReadOnly = computed(() => props.mode === 0);

const submit = async () => {
  loading.value = !loading.value;
  try {
    emit("item-created");
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
  console.log();

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
    //emitir sonido de no encontrado
  } else {
    //emitir sonido de no encontrado
  }
};

const focused = ref<boolean>(false);
const dialog = ref<boolean>(false);
const loading = ref(false);

onMounted(async () => {
  await findClients();
  await findProducts();
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
                <v-combobox
                  density="compact"
                  variant="outlined"
                  v-model="sale.clientId"
                  label="Clientes"
                  :items="clients"
                  item-title="fullName"
                  :disabled="isReadOnly"
                  :chips="true"
                  item-color="info"
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
                </v-combobox>
              </v-col>
              <v-col cols="4">
                <v-select
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
          >
            Registrar
          </v-btn>
          <v-btn color="red-darken-1" variant="tonal" @click="dialog = !dialog">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
