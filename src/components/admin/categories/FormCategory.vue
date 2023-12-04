<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref } from "vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const crudStore = useCrudStore(props.config)();
const emit = defineEmits(["item-created"]);

const submit = async () => {
  try {
    dialog.value = !dialog.value;
    emit("item-created");
  } catch (error) {
    console.error(error);
  } finally {
  }
};

const dialog = ref<boolean>(false);
const loading = ref(false);
</script>

<template>
  <v-row justify="center">
    <LoadInProgress v-if="loading" />
    <v-dialog v-model="dialog" :persistent="true" max-width="600">
      <template v-slot:activator="{ props }">
        <v-btn
          type="icon"
          size="x-small"
          variant="outlined"
          color="primary"
          icon="mdi-eye"
          v-bind="props"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
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
        <v-card-item>
          <v-form></v-form>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
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
