<script setup lang="ts">
import { ref } from "vue";

const formData = ref({
  name: "",
  email: "",
  documentType: null,
  documentNumber: "",
});
const submitForm = () => {
  console.log("Form Data:", formData.value);
};
</script>

<template>
  <div class="bg-gray-700">
    <div class="max-w-2xl p-4 mx-auto">
      <div class="text-gray-50 text-3xl pb-5">Formulario registro empresa</div>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-200"
            >Nombre</label
          >
          <input
            type="text"
            v-model="formData.name"
            id="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-200"
            >Email</label
          >
          <input
            type="text"
            v-model="formData.email"
            id="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <!-- Repetir para otros campos... -->

        <div>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
