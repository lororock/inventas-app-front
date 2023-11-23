<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { watch } from "vue";
import { documentTypes, genders } from "../../assets/list.items.ts";

const schema = yup.object({
  firstName: yup.string().required("El nombre es obligatorio"),
  lastName: yup.string().required("El apellido es obligatorio"),
  email: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("Debe ser un correo válido"),
  documentType: yup.string().required("El tipo de documento es obligatorio"),
  documentNumber: yup
    .string()
    .required("El número de documento es obligatorio"),
  phone: yup.string().required("El número de celular es requerido"),
  gender: yup.boolean(),
  birthdate: yup.date().required(),
  roles: yup.array(),
});

useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: firstName, errorMessage: firstNameError } =
  useField("firstName");
const { value: lastName, errorMessage: lastNameError } = useField("lastName");
const { value: documentType, errorMessage: documentTypeError } =
  useField("documentType");
const { value: documentNumber, errorMessage: documentNumberError } =
  useField("documentNumber");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: gender, errorMessage: genderError } = useField("gender");
const { value: birthdate, errorMessage: birthdateError } =
  useField("birthdate");
const props = defineProps({
  formData: Object,
});

watch(
  [
    email,
    firstName,
    lastName,
    documentType,
    documentNumber,
    phone,
    gender,
    birthdate,
  ],
  () =>
    Object.assign(props.formData.user, {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      documentType: documentType.value,
      documentNumber: documentNumber.value,
      phone: phone.value,
      gender: gender.value,
      birthdate: birthdate.value,
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
            v-model="firstName"
            :error-messages="firstNameError"
            label="Nombres"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="lastName"
            :error-messages="lastNameError"
            label="Apellidos"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            density="compact"
            v-model="documentType"
            :error-messages="documentTypeError"
            label="Tipo de documento"
            :items="documentTypes"
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

        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="email"
            :error-messages="emailError"
            label="Correo electrónico"
            type="email"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="phone"
            :error-messages="phoneError"
            label="Número de celular"
            type="number"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            density="compact"
            label="Géneros"
            :items="genders"
            item-title="label"
            item-value="value"
            v-model="gender"
            :error-messages="genderError"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            density="compact"
            v-model="birthdate"
            :error-messages="birthdateError"
            label="Fecha de nacimiento"
            type="date"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
