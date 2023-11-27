<script setup lang="ts">

import {recommendationsFormDashboard} from "../../assets/list.items.ts";
</script>

<template>
  <v-card class="mt-2" title="Bienvenido!" subtitle="Inventas-App | Plataforma para la gestion de tu negocio">
    <v-card-item>
      Recomendaciones de la plataforma
      <v-list>
        <v-list-item v-for="(rec, index) in recommendationsFormDashboard">{{1 + index}}. {{rec}}</v-list-item>
      </v-list>
    </v-card-item>
  </v-card>
</template>