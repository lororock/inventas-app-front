<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";

const props = defineProps({
  modelValue: Number,
  icon: { type: String, default: "" },
  showButtons: { type: Boolean, default: true },
  currency: { type: String, default: "COP" },
  minValue: { type: Number },
  maxValue: { type: Number },
});

const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: props.currency,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  precision: 0,
  valueRange: {
    min: props.minValue || undefined,
    max: props.maxValue || undefined,
  },
});

watch(
  () => props.modelValue,
  (value: any) => {
    setValue(value);
  },
);
</script>

<template>
  <v-textField
    v-model="formattedValue"
    density="compact"
    variant="outlined"
    ref="inputRef"
    :prepend-inner-icon="icon"
    :hint="
      (minValue ? `min: ${minValue}` : '') +
      ' ' +
      (maxValue ? `max: ${maxValue}` : '')
    "
  >
    <!--    <template #prepend v-if="showButtons">-->
    <!--      <v-btn size="x-small" icon @click="setValue(&#45;&#45;modelValue)">➖</v-btn>-->
    <!--    </template>-->
    <!--    <template #append v-if="showButtons">-->
    <!--      <v-btn size="x-small" icon @click="setValue(++numberValue)">➕</v-btn>-->
    <!--    </template>-->
  </v-textField>
</template>
