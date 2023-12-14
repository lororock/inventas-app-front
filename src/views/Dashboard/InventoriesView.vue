<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "Inventory",
  path: "inventories",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Localización", key: "location", sortable: false },
    { title: "Estado", key: "status", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: null,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
