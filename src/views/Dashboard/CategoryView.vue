<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormCategory from "../../components/admin/categories/FormCategory.vue";
const configTable: EntityConfig = {
  name: "Category",
  path: "categories",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Nombres", key: "name" },
    { title: "Descripción", key: "description", align: "start" },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: FormCategory,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
