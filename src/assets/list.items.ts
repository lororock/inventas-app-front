export const documentTypes = [
  {
    value: 0,
    label: "C.C.",
    description: "Cédula de ciudadanía",
  },
  {
    value: 1,
    label: "C.E.",
    description: "Cédula de extranjería",
  },
  {
    value: 2,
    label: "Nit",
    description: "Nit persona jurídica",
  },
  {
    value: 3,
    label: "Otro",
    description: "Otro tipo de documento",
  },
];

export const genders = [
  {
    value: true,
    label: "Masculino",
  },
  {
    value: false,
    label: "Femenino",
  },
];

export const functionsDashboard = [
  {
    rol: 1,
    title: "Modulo de compras",
    color: "primary",
    items: [
      { id: 1, type: 2, icon: "mdi-cart-plus", title: "Registro Compras" },
      { id: 2, type: 2, icon: "mdi-account-group", title: "Proveedores" },
      { id: 3, type: 2, icon: "mdi-cash-minus", title: "Cuentas por pagar" },
    ]
  },
  {
    rol: 1,
    title: "Modulo de ventas",
    color: "success",
    items: [
      { id: 4, type: 2, icon: "mdi-cash-plus", title: "Registro Ventas" },
      { id: 5, type: 2, icon: "mdi-account-group", title: "Clientes" },
      { id: 6, type: 2, icon: "mdi-cash-plus", title: "Cuentas por cobrar" },
      { id: 7, type: 2, icon: "mdi-currency-eth", title: "Movimientos" },
    ]
  },
  {
    rol: 1,
    title: "Modulo de inventario",
    color: "orange",
    items: [{ id: 8, type: 2, icon: "mdi-barcode", title: "Registro Productos" },
      { id: 9, type: 2, icon: "mdi-shape", title: "Categorias" },
      { id: 10, type: 2, icon: "mdi-text-short", title: "Marcas" },
      { id: 11, type: 2, icon: "mdi-warehouse", title: "Bodegas" },
      { id: 12, type: 2, icon: "mdi-share-all-outline", title: "Movimientos" },]
  },
  {
    rol: 1,
    title: "Modulo de usuarios",
    color: "purple",
    items: [
      {
        id: 13,
        type: 2,
        icon: "mdi-account-multiple",
        title: "Registro empleados",
      },
      {
        id: 14,
        type: 2,
        icon: "mdi-account-cog",
        title: "Actualizar empleados",
      },
      {
        id: 15,
        type: 2,
        icon: "mdi-cash-register",
        title: "Cajas",
      },
    ]
  },
];