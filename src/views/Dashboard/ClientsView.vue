<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
const configTable: EntityConfig = {
  name: "Client",
  path: "clients",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Nombre", key: "names", sortable: false },
    { title: "Apellidos", key: "surnames", sortable: false },
    { title: "Telefono", key: "phone", sortable: false },
    { title: "Correo", key: "email", sortable: false },
  ],
  formComponent: null,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
