<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "Category",
  path: "categories",
};
</script>

<template>
  <ITable :config="configTable" />
</template>
