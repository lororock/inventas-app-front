<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormProduct from "../../components/admin/products/FormProduct.vue";
const configTable: EntityConfig = {
  name: "Product",
  path: "products",
  columns: [
    { title: "Estado", key: "status", sortable: false },
    { title: "Nombre", key: "name", sortable: false },
    { title: "Código de barras", key: "barcode", sortable: false },
    { title: "Precio de compra", key: "costPrice", sortable: false },
    { title: "Precio de venta", key: "salePrice", sortable: false },
    { title: "Requiere inventario", key: "requiresInventory", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ],
  formComponent: FormProduct,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
