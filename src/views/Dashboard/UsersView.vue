<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import UserForm from "../../components/admin/users/UserForm.vue";
const configTable: EntityConfig = {
  name: "User",
  path: "users",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Nombre completo", key: "fulname", sortable: false },
    { title: "Documento", key: "documentNumber", sortable: false },
    { title: "Correo eléctonico", key: "email", sortable: false },
    { title: "Télefono", key: "phone", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: UserForm,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
