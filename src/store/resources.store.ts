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
      roles: [1, 2, 3],
      title: "Recursos",
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
        {
          id: 1,
          roles: [1, 2, 3],
          icon: "mdi-account-cash-outline",
          title: "Cuentas por cobrar",
          path: "payments",
        },
        {
          id: 1,
          roles: [1, 2, 3],
          icon: "mdi-cog",
          title: "Ajustes",
          path: "settings",
        },
      ],
    },
  ]);
  const saleTypes = ref<{ label: string; value: number }[]>([
    {
      label: "Contado",
      value: 0,
    },
    {
      label: "Crédito",
      value: 1,
    },
  ]);

  return {
    functionsDashboard: functionsDashboard.value,
    saleTypes: saleTypes.value,
  };
});

export default useResourceStore;
