<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormSale from "../../components/admin/sales/FormSale.vue";
const configTable: EntityConfig = {
  name: "Sale",
  path: "sales",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Total pagado", key: "totalAmount", sortable: false },
    { title: "Fecha venta", key: "createdAt", sortable: false },
    { title: "Estado de la venta", key: "statusActions", sortable: false },
  ],
  formComponent: FormSale,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
