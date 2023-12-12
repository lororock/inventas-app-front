<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormProduct from "../../components/admin/products/FormProduct.vue";
const configTable: EntityConfig = {
  name: "Product",
  path: "products",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Nombre", key: "name" },
    { title: "Código de barras", key: "barcode" },
    { title: "Precio de compra", key: "costPrice" },
    { title: "Precio de venta", key: "salePrice" },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: FormProduct,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
