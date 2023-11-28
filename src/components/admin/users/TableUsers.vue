<script setup lang="ts">

</script>

<template>
  <v-data-table-virtual
      :headers="headers"
      :items="virtualBoats"
      height="400"
      item-value="name"
  />
</template>

<style scoped>

</style>