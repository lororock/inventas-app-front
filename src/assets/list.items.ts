import DashboardItem from "./interfaces/dashboard.items.interface.ts";

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

export const roles = [
  {
    value: 1,
    label: "Dueño y/o responsable del negocio",
  },
  {
    value: 2,
    label: "Cajero",
  },
  {
    value: 3,
    label: "Contador",
  },
];

export const functionsDashboard: DashboardItem[] = [
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
    roles: [1, 2],
    title: "Módulo de recursos",
    items: [
      {
        id: 1,
        roles: [1, 2],
        icon: "mdi-shape",
        title: "Categorias productos",
        path: "categories",
      },
    ],
  },
  /**
  {
    rol: 1,
    title: "Módulo de ventas",
    items: [
      { id: 4, rol: 2, icon: "mdi-cash-plus", title: "Registro Ventas" },
      { id: 5, rol: 2, icon: "mdi-account-group", title: "Clientes" },
      { id: 6, rol: 2, icon: "mdi-cash-plus", title: "Cuentas por cobrar" },
      { id: 7, rol: 2, icon: "mdi-currency-eth", title: "Movimientos" },
    ]
  },
  {
    rol: 1,
    title: "Módulo de inventario",
    items: [{ id: 8, rol: 2, icon: "mdi-barcode", title: "Registro Productos" },
      { id: 9, rol: 2, icon: "mdi-shape", title: "Categorias" },
      { id: 10, rol: 2, icon: "mdi-text-short", title: "Marcas" },
      { id: 11, rol: 2, icon: "mdi-warehouse", title: "Bodegas" },
      { id: 12, rol: 2, icon: "mdi-share-all-outline", title: "Movimientos" },]
  },
  {
    rol: 1,
    title: "Módulo de usuarios",
    items: [
      {
        id: 13,
        rol: 2,
        icon: "mdi-account-multiple",
        title: "Registro empleados",
      },
      {
        id: 14,
        rol: 2,
        icon: "mdi-account-cog",
        title: "Actualizar empleados",
      },
      {
        id: 15,
        rol: 2,
        icon: "mdi-cash-register",
        title: "Cajas",
      },
    ]
  },
      */
];

export const recommendationsFormDashboard = [
  "No compartir contraseñas entre usuarios.",
  "Cada usuario debe tener una cuenta individual.",
  "Desactivar cuentas de empleados que ya no estén activos.",
  "Utilizar contraseñas fuertes y cambiarlas regularmente.",
  "Habilitar autenticación de dos factores para mayor seguridad.",
  "Realizar auditorías de seguridad periódicas.",
  "Restringir el acceso a información sensible solo a quienes lo necesiten.",
  "Mantener el software de la plataforma actualizado para protegerse contra vulnerabilidades.",
  "Capacitar a los usuarios en buenas prácticas de seguridad.",
  "Realizar copias de seguridad de los datos importantes de manera regular.",
  "Evitar operar sobre productos o servicios que estén inactivos.",
  "Desactivar entidades inactivas para mantener la integridad de la plataforma.",
  "Registrar cada movimiento realizado en la plataforma, con acceso restringido al administrador o responsable del sistema.",
];
