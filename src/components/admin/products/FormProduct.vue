<script setup lang="ts">
import useCrudStore from "../../../store/crud.store.ts";
import EntityConfig from "../../../interface/entity.config.ts";
import LoadInProgress from "../../general/LoadInProgress.vue";
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  config: { type: Object as () => EntityConfig, required: true },
  nameForm: { type: String, default: "" },
  id: { type: String, default: "" },
  mode: { type: Number, required: true },
});

const product = ref<any>({
  name: "",
  barcode: null,
  salePrice: 0,
  costPrice: 0,
  discountPercentage: 0,
  category: null,
  subcategory: null,
});

const categories = ref<any[]>([]);
const subcategories = ref<any[]>([]);

const crudStore = useCrudStore(props.config)();
const crudStoreCategories = useCrudStore({
  path: "categories",
  name: "Category",
  formComponent: null,
  columns: [],
})();
const emit = defineEmits(["item-created"]);

const isReadOnly = computed(() => props.mode === 0);

const submit = async () => {
  loading.value = !loading.value;
  const data = product.value;
  data.salePrice = +data.salePrice;
  data.costPrice = +data.costPrice;
  try {
    if (props.mode === 2) {
      console.log(data);
      await crudStore.create(data);
      dialog.value = false;
    } else {
      await crudStore.update(props.id, {
        ...data,
        status: product.value.status === 2 ? 2 : 3,
      });
      dialog.value = false;
    }
    emit("item-created");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = !loading.value;
  }
};

const findCategories = async () => {
  const result = await crudStoreCategories.findAll({ page: 1, limit: 999 });
  categories.value = result.items;
};

const findCategoryById = async () => {
  loading.value = true;
  try {
    subcategories.value = [];
    product.value.subcategory = null;
    let id = product.value.category;
    if (typeof id === "object") id = id.id;
    const result = await crudStoreCategories.findById(id);
    subcategories.value = result.subcategories;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const findProductById = async (id: string) => {
  try {
    const productFound = await crudStore.findById(id);
    delete productFound.createdAt;
    delete productFound.updatedAt;
    delete productFound.id;
    product.value = productFound;
    if (product.value.category) await findCategoryById();
  } catch (error: any) {
    throw new Error(error);
  }
};

const dialog = ref<boolean>(false);
const loading = ref(false);

onMounted(async () => {
  await findCategories();
});
</script>

<template>
  <v-row justify="center">
    <LoadInProgress v-if="loading" />
    <v-dialog v-model="dialog" :persistent="true" max-width="600">
      <template v-slot:activator="{ props }">
        <v-btn
          type="icon"
          size="x-small"
          variant="outlined"
          color="primary"
          icon="mdi-eye"
          v-bind="props"
          @click="findProductById(id)"
          v-if="mode === 0"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="orange-lighten-2"
          icon="mdi-pencil"
          variant="outlined"
          v-bind="props"
          @click="findProductById(id)"
          v-else-if="mode === 1"
        />
        <v-btn
          type="icon"
          size="x-small"
          color="success"
          icon="mdi-plus"
          variant="outlined"
          v-bind="props"
          v-else
        />
      </template>
      <v-card title="Datos producto">
        <v-container>
          <v-form>
            <v-text-field
              prepend-inner-icon="mdi-tag-edit-outline"
              variant="outlined"
              density="compact"
              v-model="product.name"
              label="Nombre del producto"
              :disabled="isReadOnly"
            />
            <v-text-field
              prepend-inner-icon="mdi-barcode"
              variant="outlined"
              density="comfortable"
              v-model="product.barcode"
              label="Código de barras"
              :disabled="isReadOnly"
            />
            <v-text-field
              prepend-inner-icon="mdi-cash"
              variant="outlined"
              density="comfortable"
              type="number"
              v-model="product.costPrice"
              label="Precio compra"
              :disabled="isReadOnly"
            />
            <v-text-field
              prepend-inner-icon="mdi-cash"
              variant="outlined"
              density="comfortable"
              type="number"
              v-model="product.salePrice"
              label="Precio venta"
              :disabled="isReadOnly"
            />
            <v-slider
              validate-on="input"
              label="Descuento del producto"
              v-model="product.discountPercentage"
              :step="1"
              max="100"
              thumb-label
              :disabled="isReadOnly"
            >
              <template v-slot:append>
                <v-text-field
                  v-model="product.discountPercentage"
                  type="number"
                  style="width: 80px"
                  density="compact"
                  hide-details
                  variant="outlined"
                />
              </template>
            </v-slider>
            <v-switch
              v-if="mode === 1"
              v-model="product.status"
              :value="2"
              :label="`Categoria ${
                product.status === 2 ? 'activa' : 'inactiva'
              }`"
              :color="product.status === 2 ? 'success' : 'red'"
              hide-details
            />
            <v-autocomplete
              density="compact"
              label="Categoría"
              variant="outlined"
              :items="categories"
              item-title="name"
              item-value="id"
              :chips="true"
              v-model="product.category"
              @update:model-value="findCategoryById()"
              :disabled="isReadOnly"
            />
            <v-autocomplete
              density="compact"
              label="Subcategorías"
              variant="outlined"
              :items="subcategories"
              item-title="name"
              item-value="id"
              :chips="true"
              v-model="product.subcategory"
              :disabled="isReadOnly || !product.category"
            />
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="mode === 1"
            color="indigo"
            variant="tonal"
            @click="submit()"
          >
            Guardar cambios
          </v-btn>
          <v-btn
            v-if="mode === 2"
            color="success"
            variant="tonal"
            @click="submit()"
          >
            Registrar
          </v-btn>
          <v-btn color="red-darken-1" variant="tonal" @click="dialog = !dialog">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
