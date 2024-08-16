import { defineStore } from "pinia";
import { ref } from "vue";
import Swal from "sweetalert2";
import router from "../router";

const useConfigStore = defineStore("config", () => {
  const inventoryId = ref<string>(
    localStorage.getItem("inventoryId") as string,
  );

  const saveInventoryId = async (id: string) => {
    localStorage.setItem("inventoryId", id);
    inventoryId.value = id;
    await Swal.fire({
      title: id === null ? "Inventario eliminado" : "Inventario configurado",
      toast: true,
      position: "top-end",
      icon: id === null ? "warning" : "success",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const validateInventoryChecked = async (inventories: any[]) => {
    if (!!inventoryId.value) {
      const inventoryFound = inventories.find(
        (inventory) => inventory.id === inventoryId.value,
      );
      if (!!inventoryFound) return;
    }
    await router.push("settings");
    localStorage.removeItem("inventoryId");
    inventoryId.value = undefined as any;
    await Swal.fire({
      title: "No ha configurado el inventario",
      toast: true,
      position: "top-end",
      icon: "error",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  return {
    inventoryId,
    saveInventoryId,
    validateInventoryChecked,
  };
});

export default useConfigStore;
