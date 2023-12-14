<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormInvetory from "../../components/admin/inventories/FormInvetory.vue";
const configTable: EntityConfig = {
  name: "Inventory",
  path: "inventories",
  columns: [
    { title: "Detalles", key: "id", sortable: false },
    { title: "Localización", key: "location", sortable: false },
  ],
  formComponent: FormInvetory,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
