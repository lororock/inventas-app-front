<script setup lang="ts">
import ITable from "../../components/general/ITable.vue";
import EntityConfig from "../../interface/entity.config.ts";
import FormPayment from "../../components/admin/payments/FormPayment.vue";
const configTable: EntityConfig = {
  name: "PaymentsCredits",
  path: "payments/find/all/credits",
  columns: [
    { title: "Número de documento", key: "documentNumber", sortable: false },
    { title: "Nombre completo", key: "fullname", sortable: false },
    { title: "Crédito acumulado", key: "totalCredits", sortable: false },
    { title: "Pagos relizados", key: "totalPayments", sortable: false },
    { title: "% Abono", key: "percentage", sortable: false },
    { title: "% Pendiente", key: "inversePercentage", sortable: false },
    { title: "Pendiente por pagar", key: "diff", sortable: false },
  ],
  formComponent: FormPayment,
};
</script>

<template>
  <ITable :config="configTable" />
</template>
