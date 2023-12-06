<script lang="ts" setup>
import { ref, onMounted } from "vue";
import useCrudStore from "../../store/crud.store.ts";
import EntityConfig, { columnTable } from "../../interface/entity.config.ts";
const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  formComponent: Object,
});

const crudStore = useCrudStore(props.config)();

const itemsPerPage = ref<number>(10);
const headers = ref<columnTable[]>(props.config.columns);
const search = ref<string>("");
const serverItems = ref<{ id: string; status: number }[]>([]);
const loading = ref<boolean>(true);
const totalItems = ref<number>(0);

const listItems = async ({
  page,
  itemsPerPage,
}: {
  page: number;
  itemsPerPage: number;
}) => {
  loading.value = true;
  try {
    const result = await crudStore.findAll({ page, limit: itemsPerPage });
    serverItems.value = result.items;
    totalItems.value = result.meta.totalItems;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  listItems({ page: 1, itemsPerPage: itemsPerPage.value });
});
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="9">
            <v-text-field
              :disabled="true"
              v-model="search"
              placeholder="Buscar"
              density="compact"
              variant="outlined"
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1">
            <component
              class="mt-2"
              :is="config.formComponent"
              :config="config"
              :mode="2"
              @item-created="listItems({ page: 1, itemsPerPage })"
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-item>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items-length="totalItems"
          :items="serverItems"
          :loading="loading"
          :search="search"
          item-value="name"
          @update:options="listItems"
        >
          <template v-slot:item.id="{ item }">
            <component
              :is="config.formComponent"
              :config="config"
              :mode="0"
              :id="item.id"
              @item-created="listItems({ page: 1, itemsPerPage })"
            />
          </template>
          <template v-slot:item.actions="{ item }">
            <component
              :is="config.formComponent"
              :config="config"
              :mode="1"
              :id="item.id"
              @item-created="listItems({ page: 1, itemsPerPage })"
            />
          </template>
          <template v-slot:item.status="{ item }">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-if="item.status === 0"
                  color="amber"
                  icon="mdi-clock"
                  v-bind="props"
                />
                <v-icon
                  v-else-if="item.status === 1"
                  color="amber"
                  icon="mdi-account-clock"
                  v-bind="props"
                />
                <v-icon
                  v-else-if="item.status === 2"
                  color="success"
                  icon="mdi-check-circle-outline"
                  v-bind="props"
                />
                <v-icon v-else color="red" icon="mdi-cancel" v-bind="props" />
              </template>
              <span v-if="item.status === 0">Pendiente aprobación</span>
              <span v-else-if="item.status === 1">
                Pendiente confirmación
              </span>
              <span v-else-if="item.status === 2"> Activo </span>
              <span v-else> Inactivo </span>
            </v-tooltip>
          </template>
        </v-data-table-server>
      </v-card-item>
    </v-card>
  </v-container>
</template>
