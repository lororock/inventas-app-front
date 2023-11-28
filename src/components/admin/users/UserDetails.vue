<script setup lang="ts">
import {ref} from "vue";

const dialog = ref<boolean>(false)
defineProps({
  id: { type: String, required: true },
});

const findUserById = (id: string) => {
  console.log(id)
}
</script>

<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        :persistent="true"
        width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            type="icon" size="small" variant="outlined" color="primary" icon="mdi-eye"
            v-bind="props" @click="findUserById(id)"
        />
      </template>
      <v-card>
        <v-card-title class="text-h5">
          {{id}}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="red-darken-1"
              variant="outlined"
              @click="dialog = !dialog"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>