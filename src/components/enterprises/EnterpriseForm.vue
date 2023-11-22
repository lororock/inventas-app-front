<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { watch } from "vue";
import { documentTypes } from "../../assets/list.items.ts";

const schema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  documentType: yup.string().required("El tipo de documento es obligatorio"),
  documentNumber: yup
    .string()
    .required("El número de documento es obligatorio"),
});
const props = defineProps({
  formData: { type: Object, required: true },
});

const items = documentTypes;
useForm({
  validationSchema: schema,
});
const { value: name, errorMessage: nameError } = useField("name");
const { value: documentType, errorMessage: documentTypeError } =
  useField("documentType");
const { value: documentNumber, errorMessage: documentNumberError } =
  useField("documentNumber");

watch(
  [name, documentType, documentNumber],
  () =>
    Object.assign(props.formData, {
      name: name.value,
      documentType: documentType.value,
      documentNumber: documentNumber.value,
    }),
  { deep: true },
);
</script>

<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            density="compact"
            v-model="name"
            :error-messages="nameError"
            label="Nombre"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            density="compact"
            v-model="documentType"
            :error-messages="documentTypeError"
            label="Tipo de documento"
            :items="items"
            item-title="label"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.description" />
            </template>
          </v-select>
        </v-col>

        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="documentNumber"
            :error-messages="documentNumberError"
            label="Numero de documento"
            hint="Sin puntos ni guiones"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
