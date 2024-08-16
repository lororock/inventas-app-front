<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref, computed } from "vue";
import { documentTypes } from "../../../assets/list.items.ts";
import Swal from "sweetalert2";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const client = ref<any>({
  names: "",
  surnames: "",
  documentNumber: "",
  documentType: null,
  phone: "",
  email: "",
});

const crudStore = useCrudStore(props.config)();
const emit = defineEmits(["item-created"]);

const isReadOnly = computed(() => props.mode === 0);

const dialog = ref<boolean>(false);
const loading = ref(false);

// API

const findClientById = async () => {
  loading.value = true;
  client.value = await crudStore.findById(props.id);
  loading.value = false;
};

const submit = async () => {
  loading.value = true;
  try {
    if (props.mode === 2) {
      await crudStore.create(client.value);
    } else {
      delete client.value.id;
      await crudStore.update(props.id, {
        ...client.value,
        status: client.value.status === 2 ? 2 : 3,
      });
    }
    emit("item-created");
    dialog.value = false;
  } catch (error: any) {
    dialog.value = false;
    await Swal.fire({
      title: "Oops",
      html: error.response.data.message,
      icon: "error",
      toast: true,
      position: "top-end",
    });
    dialog.value = true;
    console.error(error);
  } finally {
    loading.value = false;
  }
};
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
          @click="findClientById()"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="findClientById()"
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="small"
          color="success"
          icon="mdi-account-plus"
          variant="outlined"
          v-bind="props"
          v-else
        />
      </template>
      <v-card title="Datos del cliente" :disabled="loading" :loading="loading">
        <v-container>
          <v-form :disabled="loading">
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="client.names"
              label="Nombres"
              :disabled="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="client.surnames"
              label="Apellidos"
              :disabled="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="client.documentNumber"
              label="Número de documento"
              :disabled="isReadOnly"
            />
            <v-select
              density="compact"
              variant="outlined"
              v-model="client.documentType"
              label="Tipo de documento"
              :items="documentTypes"
              item-title="label"
              :disabled="isReadOnly"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.description" />
              </template>
            </v-select>
            <v-text-field
              label="Correo electrónico"
              variant="outlined"
              density="compact"
              v-model="client.email"
              :disabled="isReadOnly"
            />
            <v-text-field
              label="Numero de celular"
              variant="outlined"
              density="compact"
              v-model="client.phone"
              :disabled="isReadOnly"
            />
            <v-switch
              v-if="mode === 1"
              v-model="client.status"
              :value="2"
              :label="`Cliente ${client.status === 2 ? 'activo' : 'inactivo'}`"
              :color="client.status === 2 ? 'success' : 'info'"
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
