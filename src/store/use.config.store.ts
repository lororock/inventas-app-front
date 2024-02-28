import { defineStore } from "pinia";
import { ref } from "vue";

const useConfigStore = defineStore("config", () => {
  const inventoryId: any = ref(localStorage.getItem("inventoryId"));

  const saveInventoryId = (id: string) => {
    localStorage.setItem("inventoryId", id);
    inventoryId.value = id;
  };

  return {
    inventoryId,
    saveInventoryId,
  };
});

export default useConfigStore;
