<script setup lang="ts">
import EntityConfig from "../../interface/entity.config.ts";
import useCrudStore from "../../store/crud.store.ts";
import { ref } from "vue";
import LoadInProgress from "./LoadInProgress.vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
});

const crudStore = useCrudStore(props.config)();

const items = ref<any>([]);
const loading = ref(false);

const listItem = async () => {
  loading.value = true;
  try {
    const result = await crudStore.findAll();
    items.value = result.items;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

(async () => {
  await listItem();
})();
</script>

<template>
  <v-container>
    <LoadInProgress v-if="loading" />
    <v-card v-else>{{ items }}</v-card>
  </v-container>
</template>
