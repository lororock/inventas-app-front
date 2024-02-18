<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";

const props = defineProps({
  modelValue: { type: String, required: true },
  label: { type: String, default: "" },
  icon: { type: String, default: "" },
  showButtons: { type: Boolean, default: true },
  currency: { type: String, default: "COP" },
  color: { type: String, default: "" },
});

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: props.currency,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 0,
  valueRange: { min: 0 },
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  },
);
</script>

<template>
  <v-textField
    :label="label"
    v-model="formattedValue"
    density="compact"
    variant="outlined"
    ref="inputRef"
    :prepend-inner-icon="icon"
    :color="color"
  >
    <template #prepend v-if="showButtons">
      <v-btn size="x-small" icon @click="setValue(--numberValue)">➖</v-btn>
    </template>
    <template #append v-if="showButtons">
      <v-btn size="x-small" icon @click="setValue(++numberValue)">➕</v-btn>
    </template>
  </v-textField>
</template>
