import { defineStore } from "pinia";
import { ref } from "vue";
import Swal from "sweetalert2";
import router from "../router";

const useConfigStore = defineStore("config", () => {
  const inventoryId: any = ref(localStorage.getItem("inventoryId"));

  const saveInventoryId = (id: string) => {
    localStorage.setItem("inventoryId", id);
    inventoryId.value = id;
    Swal.fire({
      title: id === null ? "Inventario eliminado" : "Inventario configurado",
      toast: true,
      position: "top-end",
      icon: id === null ? "warning" : "success",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const validateInventoryChecked = async () => {
    if (!!inventoryId.value) return;
    else {
      await router.push("settings");
      await Swal.fire({
        title: "No ha configurado el inventario",
        toast: true,
        position: "top-end",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return {
    inventoryId,
    saveInventoryId,
    validateInventoryChecked,
  };
});

export default useConfigStore;
