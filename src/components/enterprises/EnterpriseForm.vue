<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { watch } from "vue";

const schema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("Debe ser un correo válido"),
  documentType: yup.string().required("El tipo de documento es obligatorio"),
  documentNumber: yup
    .string()
    .required("El número de documento es obligatorio"),
});
const props = defineProps({
  formData: { type: Object, required: true },
});

const items = [
  {
    value: 0,
    label: "C.C.",
    description: "Cédula de ciudadanía",
  },
  {
    value: 1,
    label: "C.E.",
    description: "Cédula de extranjería",
  },
  {
    value: 2,
    label: "Nit",
    description: "Nit persona jurídica",
  },
  {
    value: 3,
    label: "Otro",
    description: "Otro tipo de documento",
  },
];
useForm({
  validationSchema: schema,
});
const { value: name, errorMessage: nameError } = useField("name");
const { value: email, errorMessage: emailError } = useField("email");
const { value: documentType, errorMessage: documentTypeError } =
  useField("documentType");
const { value: documentNumber, errorMessage: documentNumberError } =
  useField("documentNumber");

watch(
  [name, email, documentType, documentNumber],
  () =>
    Object.assign(props.formData, {
      name: name.value,
      email: email.value,
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
        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="name"
            :error-messages="nameError"
            label="Nombre"
            required
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="email"
            :error-messages="emailError"
            label="Correo electrónico"
            required
            type="email"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            density="compact"
            v-model="documentType"
            :error-messages="documentTypeError"
            label="Tipo de documento"
            required
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
            required
            type="number"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
