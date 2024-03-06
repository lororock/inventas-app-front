<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "User",
  path: "users",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Nombre completo", key: "fulname", sortable: false },
  ],
  formComponent: null,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
