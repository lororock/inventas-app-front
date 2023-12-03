<script setup lang="ts">
import { computed, ref } from "vue";
import useUserStore from "../../../store/useUserStore.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { documentTypes, genders, roles } from "../../../assets/list.items.ts";
const userStore = useUserStore();

const dialog = ref<boolean>(false);
const loading = ref(false);
const user = ref<any>({});

const props = defineProps({
  id: { type: String, default: "" },
  mode: { type: Number, required: true }, //0 - view, 1 - edit, 2 - create
});

const emit = defineEmits(["user-created"]);

const isReadOnly = computed(() => props.mode === 0);

const findUserById = async (id: string) => {
  loading.value = true;
  try {
    user.value = await userStore.findUserById(id);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  const data = user.value;
  try {
    if (props.mode === 2)
      await userStore.createUser({
        ...data,
        roles: data.roles.map((rol: any) => rol.value),
      });
    else
      await userStore.updateUserById(
        {
          roles: data.roles.map((rol: any) => rol.value),
        },
        props.id,
      );
    emit("user-created");
    dialog.value = !dialog.value;
  } catch (error) {
    throw error;
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
          @click="findUserById(id)"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="findUserById(id)"
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
      <v-card>
        <v-card-title class="text-h5"> Datos usuario</v-card-title>
        <v-card-item>
          <v-form>
            <v-text-field
              label="Correo electrónico"
              variant="outlined"
              density="compact"
              v-model="user.email"
              :readonly="isReadOnly"
            />
            <v-text-field
              label="Nombres"
              variant="outlined"
              density="compact"
              v-model="user.firstName"
              :readonly="isReadOnly"
            />
            <v-text-field
              label="Apellidos"
              variant="outlined"
              density="compact"
              v-model="user.lastName"
              :readonly="isReadOnly"
            />
            <v-select
              density="compact"
              variant="outlined"
              v-model="user.documentType"
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
              label="Numero de documento"
              variant="outlined"
              density="compact"
              v-model="user.documentNumber"
              :readonly="isReadOnly"
            />
            <v-text-field
              label="Numero de celular"
              variant="outlined"
              density="compact"
              v-model="user.phone"
              :readonly="isReadOnly"
            />
            <v-select
              density="compact"
              label="Géneros"
              variant="outlined"
              :items="genders"
              item-title="label"
              item-value="value"
              v-model="user.gender"
              :readonly="isReadOnly"
            />
            <v-text-field
              label="Fecha de nacimiento"
              type="date"
              variant="outlined"
              density="compact"
              v-model="user.birthdate"
              :readonly="isReadOnly"
            />
            <v-combobox
              density="compact"
              label="Roles"
              variant="outlined"
              :items="roles"
              item-title="label"
              item-value="value"
              :chips="true"
              :multiple="true"
              v-model="user.roles"
              :readonly="isReadOnly"
            />
          </v-form>
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
