<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { computed, ref } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const inventory = ref({
  id: undefined,
  name: "",
  city: null,
  state: null,
  zipCode: null,
  country: null,
  address: null,
  status: undefined,
});

const crudStore = useCrudStore(props.config)();
const emit = defineEmits(["item-created"]);

const isReadOnly = computed(() => props.mode === 0);

const submit = async () => {
  loading.value = !loading.value;
  const data = inventory.value;
  try {
    if (props.mode === 2) {
      data.id = undefined;
      data.status = undefined;
      await crudStore.create(data);
      dialog.value = false;
    } else {
      await crudStore.update(props.id, {
        ...data,
        status: inventory.value.status === 2 ? 2 : 3,
      });
      dialog.value = false;
    }
    emit("item-created");
    inventory.value = {
      id: undefined,
      name: "",
      city: null,
      state: null,
      zipCode: null,
      country: null,
      address: null,
      status: undefined,
    };
  } catch (error: any) {
    await Swal.fire({
      title: "Oops",
      html: error.response.data.message,
      icon: "error",
      toast: true,
      position: "top-right",
    });
    console.error(error);
  } finally {
    loading.value = !loading.value;
  }
};

const findInventoryById = async (id: string) => {
  loading.value = true;
  try {
    inventory.value = await crudStore.findById(id);
    inventory.value.id = undefined;
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
          @click="findInventoryById(id)"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="findInventoryById(id)"
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="small"
          color="success"
          icon="mdi-office-building-plus-outline"
          variant="outlined"
          v-bind="props"
          v-else
        />
      </template>
      <v-card title="Datos inventario">
        <v-container>
          <v-form>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="inventory.name"
              label="Nombre del inventario"
              :disabled="isReadOnly"
            />
            <v-alert
              type="warning"
              text="Campos opcionales"
              variant="tonal"
              density="compact"
            />
            <br />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="inventory.country"
              label="País"
              :disabled="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="inventory.state"
              label="Departamento, estado o provincia"
              :disabled="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="inventory.city"
              label="Ciudad"
              :disabled="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="inventory.address"
              label="Dirección"
              :disabled="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="inventory.zipCode"
              label="Código Postal o Zip"
              :disabled="isReadOnly"
            />
            <v-alert
              v-if="mode === 2"
              type="info"
              text="Una vez guardado no se puede modificar por seguridad"
              variant="tonal"
              density="compact"
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
