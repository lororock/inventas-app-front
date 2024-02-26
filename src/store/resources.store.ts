import { defineStore } from "pinia";
import DashboardItem from "../assets/interfaces/dashboard.items.interface.ts";
import { ref } from "vue";

const useResourceStore = defineStore("resources", () => {
  const functionsDashboard = ref<DashboardItem[]>([
    {
      roles: [0],
      title: "Módulo de empresas",
      items: [
        {
          id: 1,
          roles: [0],
          icon: "mdi-domain",
          title: "Adm. empresas",
          path: "form",
        },
      ],
    },
    {
      roles: [1],
      title: "Módulo de usuarios",
      items: [
        {
          id: 2,
          roles: [1],
          icon: "mdi-account-multiple",
          title: "Adm. usuarios",
          path: "employees",
        },
      ],
    },
    {
      roles: [1, 2, 3],
      title: "Módulo de recursos",
      items: [
        {
          id: 1,
          roles: [1, 2],
          icon: "mdi-shape",
          title: "Categorias productos",
          path: "categories",
        },
        {
          id: 1,
          roles: [1, 2, 3],
          icon: "mdi-basket",
          title: "Productos/Servicios",
          path: "products",
        },
        {
          id: 1,
          roles: [1, 2, 3],
          icon: "mdi-store-outline",
          title: "Inventarios",
          path: "inventories",
        },
        {
          id: 1,
          roles: [1, 2],
          icon: "mdi-account-group",
          title: "Clientes",
          path: "clients",
        },
        {
          id: 1,
          roles: [1, 2, 3],
          icon: "mdi-sale",
          title: "Ventas",
          path: "sales",
        },
      ],
    },
  ]);

  return {
    functionsDashboard: functionsDashboard.value,
  };
});

export default useResourceStore;
