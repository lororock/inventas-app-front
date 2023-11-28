<script setup lang="ts">
import { ref } from "vue";
import useEnterpriseStore from "../../../store/useUserStore.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { documentTypes, genders } from "../../../assets/list.items.ts";
const enterpriseStore = useEnterpriseStore();

const dialog = ref<boolean>(false);
const loading = ref(false);
const user = ref<any>({});

defineProps({
  id: { type: String, required: true },
});

const findUserById = async (id: string) => {
  loading.value = true;
  try {
    user.value = await enterpriseStore.findUserById(id);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error: ${error.message}`);
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
          size="small"
          variant="outlined"
          color="primary"
          icon="mdi-eye"
          v-bind="props"
          @click="findUserById(id)"
        />
      </template>
      <v-card>
        <v-card-title class="text-h5"> Datos usuario</v-card-title>
        <v-card-item>
          <v-form>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="user.email"
              :readonly="true"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="user.firstName"
              :readonly="true"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="user.lastName"
              :readonly="true"
            />
            <v-select
              density="compact"
              variant="outlined"
              v-model="user.documentType"
              label="Tipo de documento"
              :items="documentTypes"
              item-title="label"
              :readonly="true"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.description" />
              </template>
            </v-select>
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="user.documentNumber"
              :readonly="true"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="user.phone"
              :readonly="true"
            />
            <v-select
              density="compact"
              label="Géneros"
              variant="outlined"
              :items="genders"
              item-title="label"
              item-value="value"
              v-model="user.gender"
              :readonly="true"
            />
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="user.birthdate"
              :readonly="true"
            />
          </v-form>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red-darken-1"
            variant="outlined"
            @click="dialog = !dialog"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
