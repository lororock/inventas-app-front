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
const serverItems = ref<{ id: string }[]>([]);
const loading = ref<boolean>(true);
const totalItems = ref<number>(0);

const loadItems = async ({
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
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
});
</script>

<template>
  <v-container>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items-length="totalItems"
      :items="serverItems"
      :loading="loading"
      :search="search"
      item-value="name"
      @update:options="loadItems"
    >
      <template v-slot:item.id="{ item }">
        <component
          :is="config.formComponent"
          :config="config"
          :mode="0"
          :id="item.id"
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <component
          :is="config.formComponent"
          :config="config"
          :mode="1"
          :id="item.id"
        />
      </template>
    </v-data-table-server>
  </v-container>
</template>
