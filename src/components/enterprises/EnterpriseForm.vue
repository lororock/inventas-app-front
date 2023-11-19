<script setup lang="ts">
defineProps({
  formData: Object,
});
</script>

<template>
  <div class="max-w-2xl p-4 mx-auto">
    <div class="text-gray-50 text-3xl pb-5">Datos de la empresa</div>
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

    <div>
      <label for="name" class="block text-sm font-medium text-gray-200"
        >Tipo de documento</label
      >
      <select v-model="formData.documentType">
        <option :value="0">C.C.</option>
        <option :value="1">C.E.</option>
        <option :value="2">Nit</option>
        <option :value="3">Otro</option>
      </select>
    </div>
  </div>
</template>
