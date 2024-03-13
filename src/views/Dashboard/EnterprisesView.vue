<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormEnterprise from "../../components/superadmin/enterprises/FormEnterprise.vue";
const configTable: EntityConfig = {
  name: "Enterprise",
  path: "enterprises",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Empresa", key: "name", sortable: false },
    { title: "Dirección", key: "address", sortable: false },
    { title: "Email de facturas", key: "email", sortable: false },
    { title: "Fecha de creacion", key: "createdAt", sortable: false },
    { title: "Detalles", key: "id", sortable: false },
    {
      title: "Estado de la empresa",
      key: "statusActions",
      sortable: false,
    },
  ],
  formComponent: FormEnterprise,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
