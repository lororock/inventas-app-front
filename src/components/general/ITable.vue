<script lang="ts" setup>
import { ref, onMounted } from "vue";
import useCrudStore from "../../store/crud.store.ts";
import EntityConfig, { columnTable } from "../../interface/entity.config.ts";
import ListProductForInventory from "../admin/inventories/ListProductForInventory.vue";
import Swal from "sweetalert2";
import { format } from "@formkit/tempo";
import InputCurrency from "./InputCurrency.vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  formComponent: Object,
});

const crudStore = useCrudStore(props.config)();

const status = ref<{ value: number; name: string; props: any }[]>([
  {
    value: 1,
    name: "Pendiente activar",
    props: { disabled: true },
  },
  {
    value: 2,
    name: "Activo",
    props: { disabled: false },
  },
  {
    value: 3,
    name: "Inactivo",
    props: { disabled: false },
  },
]);

const itemsPerPage = ref<number>(10);
const headers = ref<columnTable[]>(props.config.columns);
const search = ref<string>("");
const serverItems = ref<
  {
    id: string;
    status: number;
    createdAt: Date | string | null;
    totalAmount: number;
    diff: number;
    totalCredits: number;
    totalPayments: number;
    firstName: string;
    lastName: string;
    names: string;
    surnames: string;
    fulname: string;
    fullname: string;
    percentage: number;
    inversePercentage: number;
  }[]
>([]);
const loading = ref<boolean>(true);
const totalItems = ref<number>(0);

const listItems = async ({
  page,
  itemsPerPage,
}: {
  page: number;
  itemsPerPage: number;
}) => {
  loading.value = true;
  try {
    const result = await crudStore.findAll({ page, limit: itemsPerPage });
    serverItems.value = result.items.map((i: any) => ({
      ...i,
      totalAmount: +i.totalAmount,
    }));
    totalItems.value = result.meta.totalItems;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const submitted = async ({
  page,
  itemsPerPage,
}: {
  page: number;
  itemsPerPage: number;
}) => {
  await listItems({
    page,
    itemsPerPage,
  });
  await Swal.fire({
    title: "Operación exitosa",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    icon: "success",
    timer: 3000,
  });
};

onMounted(() => {
  listItems({ page: 1, itemsPerPage: itemsPerPage.value });
});
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="9">
            <v-text-field
              :disabled="true"
              v-model="search"
              placeholder="Buscar"
              density="compact"
              variant="outlined"
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="1">
            <component
              class="mt-2"
              :is="config.formComponent"
              :config="config"
              :mode="2"
              @item-created="submitted({ page: 1, itemsPerPage })"
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-item>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items-length="totalItems"
          :items="serverItems"
          :loading="loading"
          :search="search"
          item-value="name"
          @update:options="listItems"
        >
          <template v-slot:item.id="{ item }">
            <component
              :is="config.formComponent"
              :config="config"
              :mode="0"
              :id="item.id"
              @item-created="submitted({ page: 1, itemsPerPage })"
            />
          </template>
          <template v-slot:item.actions="{ item }">
            <component
              :is="config.formComponent"
              :config="config"
              :mode="1"
              :id="item.id"
              @item-created="submitted({ page: 1, itemsPerPage })"
            />
          </template>
          <template v-slot:item.status="{ item }">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-if="item.status === 0"
                  color="amber"
                  icon="mdi-clock"
                  v-bind="props"
                />
                <v-icon
                  v-else-if="item.status === 1"
                  color="amber"
                  icon="mdi-account-clock"
                  v-bind="props"
                />
                <v-icon
                  v-else-if="item.status === 2"
                  color="success"
                  icon="mdi-check-circle-outline"
                  v-bind="props"
                />
                <v-icon v-else color="red" icon="mdi-cancel" v-bind="props" />
              </template>
              <span v-if="item.status === 0">Pendiente aprobación</span>
              <span v-else-if="item.status === 1">
                Pendiente confirmación
              </span>
              <span v-else-if="item.status === 2"> Activo </span>
              <span v-else> Inactivo </span>
            </v-tooltip>
          </template>
          <template v-slot:item.update-inventory="{ item }">
            <ListProductForInventory
              :config="config"
              :inventory-id="item.id"
              @item-created="submitted({ page: 1, itemsPerPage })"
            />
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{
              format({
                date: `${item.createdAt}`,
                format: "MMMM D, YYYY h:mm a",
              })
            }}
          </template>
          <template v-slot:item.billedMonth="{ item }">
            {{
              format({
                date: `${item.createdAt}`,
                format: "MMMM",
              })
            }}
          </template>
          <template v-slot:item.totalAmount="{ item }">
            <InputCurrency
              v-model="item.totalAmount"
              variant="plain"
              :show-buttons="false"
            />
          </template>
          <template v-slot:item.diff="{ item }">
            <InputCurrency
              readonly
              v-model="item.diff"
              icon="mdi-cash"
              :show-buttons="false"
              bg-color="amber-lighten-4"
            />
          </template>
          <template v-slot:item.totalCredits="{ item }">
            <InputCurrency
              readonly
              v-model="item.totalCredits"
              variant="plain"
              :show-buttons="false"
            />
          </template>
          <template v-slot:item.totalPayments="{ item }">
            <InputCurrency
              readonly
              v-model="item.totalPayments"
              variant="plain"
              :show-buttons="false"
            />
          </template>
          <template v-slot:item.fullname="{ item }">
            {{ item.names }} {{ item.surnames }}
          </template>
          <template v-slot:item.fulname="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
          <template v-slot:item.percentage="{ item }">
            <v-chip color="green-accent-4"> {{ item.percentage }}% </v-chip>
          </template>
          <template v-slot:item.inversePercentage="{ item }">
            <v-chip color="red-accent-4">
              {{ item.inversePercentage }}%
            </v-chip>
          </template>
          <template v-slot:item.statusActions="{ item }">
            <v-select
              v-model="item.status"
              :items="status"
              variant="outlined"
              density="compact"
              item-title="name"
              item-disabled="disable"
              :bg-color="
                item.status === 2
                  ? 'success'
                  : item.status === 1
                    ? 'amber'
                    : 'red'
              "
            />
          </template>
        </v-data-table-server>
      </v-card-item>
    </v-card>
  </v-container>
</template>
