<template>
  <v-text-field
    variant="outlined"
    density="compact"
    type="text"
    @keydown="checkDigit"
  />
</template>

<script setup lang="ts">
const checkDigit = (event: KeyboardEvent) => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault();
  }
};
</script>
