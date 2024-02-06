<script setup lang="ts">
import { ref } from "vue";
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  inventoryId: { type: String, required: true },
});
const dialog = ref<boolean>(false);
const inventory = ref<any>(undefined);
const loading = ref(false);

const crudStore = useCrudStore(props.config)();

const findInventory = async () => {
  loading.value = !loading.value;
  inventory.value = await crudStore.findById(props.inventoryId);
  loading.value = !loading.value;
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
      <v-card :loading="loading" :title="inventory && inventory.location">
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
