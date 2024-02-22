<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";

const props = defineProps({
  modelValue: Number,
  icon: { type: String, default: "" },
  showButtons: { type: Boolean, default: true },
  currency: { type: String, default: "COP" },
  color: { type: String, default: "" },
  minValue: { type: Number },
  maxValue: { type: Number },
});

const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput({
  currency: props.currency,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 0,
  valueRange: {
    min: props.minValue || undefined,
    max: props.minValue || undefined,
  },
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
    v-model="formattedValue"
    density="compact"
    variant="solo"
    ref="inputRef"
    :prepend-inner-icon="icon"
    :color="color"
  >
    <template #prepend>
      <v-btn size="x-small" icon @click="setValue(--numberValue)">➖</v-btn>
    </template>
    <template #append v-if="showButtons">
      <v-btn size="x-small" icon @click="setValue(++numberValue)">➕</v-btn>
    </template>
  </v-textField>
</template>
