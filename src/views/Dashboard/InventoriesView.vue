<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormInventory from "../../components/admin/inventories/FormInventory.vue";
const configTable: EntityConfig = {
  name: "Inventory",
  path: "inventories",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Nombre", key: "name", sortable: false },
    { title: "Numero de items", key: "total", sortable: false },
    {
      title: "Acciones",
      key: "update-inventory",
      sortable: false,
    },
  ],
  formComponent: FormInventory,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
