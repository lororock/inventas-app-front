<script lang="ts" setup>
import { ref, onMounted } from "vue";
import useCrudStore from "../../store/crud.store.ts";
import EntityConfig from "../../interface/entity.config.ts";
const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
});

const crudStore = useCrudStore(props.config)();
const itemsPerPage = ref(10);
const headers = ref(props.config.columns);
const search = ref("");
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

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
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="serverItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
  ></v-data-table-server>
</template>
