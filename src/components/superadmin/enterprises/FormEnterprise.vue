<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref, computed } from "vue";
import { documentTypes, genders } from "../../../assets/list.items.ts";
import Swal from "sweetalert2";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const enterprise = ref<any>({
  name: "",
  email: "",
  address: "",
});

const client = ref<any>({
  firstName: "",
  lastName: "",
  documentNumber: "",
  documentType: null,
  phone: "",
  email: "",
  gender: true,
  birthdate: null,
});

const crudStore = useCrudStore(props.config)();
const emit = defineEmits(["item-created"]);

const isReadOnly = computed(() => props.mode === 0);

const dialog = ref<boolean>(false);
const loading = ref(false);

const findEnterpriseById = async () => {
  loading.value = true;
  try {
    const enterpriseFound = await crudStore.findById(props.id);
    enterprise.value = { ...enterpriseFound, user: undefined };
    client.value = { ...enterpriseFound.user };
  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  }
  loading.value = false;
};

const submit = async () => {
  loading.value = true;

  try {
    if (props.mode === 2) {
      const { title, message } = await crudStore.create({
        ...enterprise.value,
        user: client.value,
      });

      dialog.value = false;
      await Swal.fire({
        title,
        html: message,
        icon: "success",
        timer: 10000,
        toast: true,
      });
      dialog.value = true;
    } else {
      delete client.value.id;
      await crudStore.update(props.id, {
        ...client.value,
        status: client.value.status === 2 ? 2 : 3,
      });
    }
    emit("item-created");
    dialog.value = false;
  } catch (error) {
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
          @click="findEnterpriseById"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="findEnterpriseById"
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="small"
          color="success"
          icon="mdi-office-building-plus"
          variant="outlined"
          v-bind="props"
          v-else
        />
      </template>
      <v-card :readonly="loading" :loading="loading">
        <v-container>
          <v-form :readonly="loading" @submit.prevent="">
            <v-alert-title>Datos de la empresa</v-alert-title>
            <br />
            <hr />
            <br />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="enterprise.name"
              label="Nombre de la empresa"
              :readonly="isReadOnly"
              prepend-inner-icon="mdi-domain"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="enterprise.email"
              label="Correo electrónico para recepción reportes"
              :readonly="isReadOnly"
              prepend-inner-icon="mdi-email"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="enterprise.address"
              label="Dirección de la empresa"
              :readonly="isReadOnly"
              prepend-inner-icon="mdi-map-marker"
            />
            <v-alert-title>Datos del cliente</v-alert-title>
            <br />
            <hr />
            <br />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="client.firstName"
              label="Nombres"
              :readonly="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="client.lastName"
              label="Apellidos"
              :readonly="isReadOnly"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="client.documentNumber"
              label="Número de documento"
              :readonly="isReadOnly"
            />
            <v-select
              density="compact"
              variant="outlined"
              v-model="client.documentType"
              label="Tipo de documento"
              :items="documentTypes"
              item-title="label"
              :readonly="isReadOnly"
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
              :readonly="isReadOnly"
            />
            <v-text-field
              label="Numero de celular"
              variant="outlined"
              density="compact"
              v-model="client.phone"
              :readonly="isReadOnly"
            />
            <v-switch
              v-if="mode === 1"
              v-model="client.status"
              :value="2"
              :label="`Cliente ${client.status === 2 ? 'activo' : 'inactivo'}`"
              :color="client.status === 2 ? 'success' : 'info'"
              hide-details
            />
            <v-select
              density="compact"
              variant="outlined"
              label="Géneros"
              :items="genders"
              item-title="label"
              item-value="value"
              v-model="client.gender"
              :readonly="isReadOnly"
            />
            <v-text-field
              density="compact"
              variant="outlined"
              v-model="client.birthdate"
              label="Fecha de nacimiento"
              type="date"
              :readonly="isReadOnly"
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
