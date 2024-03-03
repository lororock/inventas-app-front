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
        path: "categories",
      },
      {
        id: 1,
        roles: [1, 2, 3],
        icon: "mdi-store-outline",
        title: "Inventario",
        path: "categories",
      },
    ],
  },
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
