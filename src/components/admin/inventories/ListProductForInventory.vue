<script setup lang="ts">
import { ref } from "vue";
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import InputCurrency from "../../general/InputCurrency.vue";
import FormAddProductToInventory from "./FormAddProductToInventory.vue";
import { format } from "@formkit/tempo";
const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  inventoryId: { type: String, required: true },
});
const emit = defineEmits(["item-created"]);
interface inventoryInterface {
  id: string;
  name: string;
  location: string;
  productInventories: [
    {
      id: string;
      quantity: number;
      name: string;
      product: {
        id: string;
        name: string;
      };
      createdAt: Date;
      updatedAt: Date;
    },
  ];
}
const dialog = ref<boolean>(false);
const inventory = ref<inventoryInterface>();
const loading = ref(false);

const headers = ref([
  { title: "Producto", key: "id", sortable: false },
  { title: "Cantidad existentes", key: "quantity", sortable: false },
  { title: "Creado", key: "createdAt", sortable: false },
  { title: "Actualizado", key: "updatedAt", sortable: false },
]);

const crudStore = useCrudStore(props.config)();

const findInventory = async () => {
  loading.value = !loading.value;
  const result = await crudStore.findById(props.inventoryId);
  result.productInventories = result.productInventories.map(
    ({ product, quantity, createdAt, updatedAt }: any) => ({
      id: product.id,
      name: product.name,
      quantity,
      createdAt,
      updatedAt,
    }),
  );
  inventory.value = result;
  loading.value = !loading.value;
};

const updateInventory = async () => {
  await findInventory();
  emit("item-created");
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" :persistent="true" max-width="1200">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          @click="findInventory()"
          color="teal-lighten-2"
          size="small"
        >
          Actualizar inventario <v-icon icon="mdi-list-status" />
        </v-btn>
      </template>

      <v-card v-if="inventory" :loading="loading" :title="inventory?.location">
        <v-card-item>
          <v-data-table
            :headers="headers"
            :items="inventory?.productInventories"
          >
            <template #top>
              <v-row>
                <v-col cols="10" />
                <v-col cols="1">
                  <FormAddProductToInventory
                    :inventoryId="inventoryId"
                    @inventory-updated="updateInventory()"
                  />
                </v-col>
              </v-row>
            </template>
            <template v-slot:item.id="{ item }">
              {{ item.name }}
            </template>
            <template v-slot:item.quantity="{ item }">
              <InputCurrency
                v-model="item.quantity"
                currency="CAN"
                :show-buttons="false"
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
          </v-data-table>
        </v-card-item>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red-darken-1" variant="tonal" @click="dialog = !dialog">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
