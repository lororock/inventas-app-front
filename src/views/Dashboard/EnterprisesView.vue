<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "Enterprise",
  path: "enterprises",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Empresa", key: "name", sortable: false },
    { title: "Dirección", key: "address", sortable: false },
    { title: "Fecha de creacion", key: "createdAt", sortable: false },
  ],
  formComponent: null,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
