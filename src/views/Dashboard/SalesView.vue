<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "Sale",
  path: "sales",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Total pagado", key: "totalAmount", sortable: false },
    { title: "Estado venta", key: "status", sortable: false },
    { title: "Fecha venta", key: "createdAt", sortable: false },
  ],
  formComponent: null,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
