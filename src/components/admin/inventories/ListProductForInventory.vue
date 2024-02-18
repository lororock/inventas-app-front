<script setup lang="ts">
import { ref } from "vue";
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import InputOnlyNumbers from "../../general/InputOnlyNumbers.vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  inventoryId: { type: String, required: true },
});
const dialog = ref<boolean>(false);
const inventory = ref<any>();
const loading = ref(false);

const headers = ref([
  { title: "Detalles", key: "id", sortable: false },
  { title: "Cantidad", key: "quantity", sortable: false },
  { title: "Acciones", key: "actions", sortable: false },
]);

const crudStore = useCrudStore(props.config)();

const findInventory = async () => {
  loading.value = !loading.value;
  const result = await crudStore.findById(props.inventoryId);
  result.productInventories = result.productInventories.map(
    ({ product, quantity }: any) => ({
      id: product.id,
      name: product.name,
      quantity,
    }),
  );
  inventory.value = result;
  loading.value = !loading.value;
};

const validateNumberInput = (event: any, item: any) => {
  event.preventDefault();
  const { value } = event.target;
  console.log(value);

  if (isNaN(+value)) item.quantity = 0;
  else item.quantity = value;
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" :persistent="true" max-width="600">
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
            <template v-slot:item.id="{ item }">
              <v-btn color="info" variant="text" @click="console.log(item.id)">
                {{ item.name }} <v-icon icon="mdi-open-in-new" />
              </v-btn>
            </template>
            <template v-slot:item.quantity="{ item }">
              <InputOnlyNumbers
                :model-value="item.quantity"
                :format-thousands="false"
                icon="mdi-cash"
              />
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                color="red"
                icon="mdi-minus"
                @click="item.quantity = item.quantity - 1"
                size="x-small"
              />
              <v-btn
                color="info"
                icon="mdi-plus"
                @click="item.quantity = item.quantity + 1"
                size="x-small"
              />
            </template>
          </v-data-table>
        </v-card-item>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="tonal"> Guardar cambios </v-btn>
          <v-btn color="red-darken-1" variant="tonal" @click="dialog = !dialog">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>