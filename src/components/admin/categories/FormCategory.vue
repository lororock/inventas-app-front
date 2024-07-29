<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref, computed } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const category = ref<any>({
  name: "",
  description: "",
  subcategories: [],
  status: undefined,
});

const crudStore = useCrudStore(props.config)();
const emit = defineEmits(["item-created"]);

const isReadOnly = computed(() => props.mode === 0);

const submit = async () => {
  loading.value = !loading.value;
  const data = category.value;
  try {
    if (props.mode === 2) {
      await crudStore.create(data);
      dialog.value = false;
    } else {
      await crudStore.update(props.id, {
        ...data,
        status: category.value.status === 2 ? 2 : 3,
      });
      dialog.value = false;
    }
    emit("item-created");
    category.value = {
      name: "",
      description: "",
      subcategories: [],
      status: undefined,
    }
  } catch (error) {
    await Swal.fire("Oops", error.response.data.message, "error");
    console.error(error);
  } finally {
    loading.value = !loading.value;
  }
};

const findCategoryById = async (id: string) => {
  loading.value = true;
  try {
    const result = await crudStore.findById(id);
    category.value = result;
    delete category.value.id;
    if (result.subcategories && result.subcategories.length > 0)
      category.value.subcategories = result.subcategories.map(
        (sub: any) => sub.name,
      );
  } catch (error) {
  } finally {
    loading.value = false;
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
          @click="findCategoryById(id)"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="findCategoryById(id)"
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="small"
          color="success"
          icon="mdi-shape-plus"
          variant="outlined"
          v-bind="props"
          v-else
        />
      </template>
      <v-card title="Datos categoría">
        <v-container>
          <v-form>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="category.name"
              label="Nombre de la categoría"
              :disabled="isReadOnly"
            />
            <v-textarea
              variant="outlined"
              density="comfortable"
              v-model="category.description"
              label="Descripción de la categoría"
              :disabled="isReadOnly"
            />
            <v-combobox
              density="compact"
              label="Subcategorias"
              variant="outlined"
              :chips="true"
              :multiple="true"
              v-model="category.subcategories"
              :disabled="isReadOnly"
            />
            <v-switch
              v-if="mode === 1"
              v-model="category.status"
              :value="2"
              :label="`Categoria ${
                category.status === 2 ? 'activa' : 'inactiva'
              }`"
              :color="category.status === 2 ? 'success' : 'red'"
              hide-details
            />
          </v-form>
        </v-container>
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
