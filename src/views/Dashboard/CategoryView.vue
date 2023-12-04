<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "Category",
  path: "categories",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Nombres", key: "name" },
    { title: "Descripción", key: "description", align: "start" },
    { title: "Acciones", key: "actions", sortable: false },
  ],
};
</script>

<template>
  <ITable :config="configTable" />
</template>
