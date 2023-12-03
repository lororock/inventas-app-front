<script setup lang="ts">
import EntityConfig from "../../interface/entity.config.ts";
import useCrudStore from "../../store/crud.store.ts";
import { ref } from "vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
});

const crudStore = useCrudStore(props.config)();

const items = ref<any>([1, 2, 3]);

const listItem = async () => {
  try {
    const result = await crudStore.findAll();
    items.value = result.items;
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await listItem();
})();
</script>

<template>
  <v-container>
    <v-card>{{ items }}</v-card>
  </v-container>
</template>
