<script setup lang="ts">
import EntityConfig from "../../interface/entity.config.ts";
import useCrudStore from "../../store/crud.store.ts";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
});

const crudStore = useCrudStore(props.config)();

const listItem = async () => {
  try {
    const result = await crudStore.findAll();
    console.log(result);
  } catch (error) {
    console.error();
  }
};

(async () => {
  await listItem();
})();
</script>

<template>
  <v-container>
    <v-card>{{ config }}</v-card>
  </v-container>
</template>
