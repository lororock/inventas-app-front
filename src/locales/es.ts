import { es } from "vuetify/locale";
const esLocale = {
  $vuetify: {
    ...es,
    badge: "Insignia",
    close: "Cerrar",
    dataIterator: {
      noResultsText: "No se encontraron registros correspondientes",
      loadingText: "Cargando items...",
      rowsPerPageText: "Items por página:",
      pageText: "{0}-{1} de {2}",
    },
    dataTable: {
      itemsPerPageText: "Filas por página:",
      ariaLabel: {
        sortDescending:
          ": Ordenado descendente. Activar para quitar la ordenación.",
        sortAscending:
          ": Ordenado ascendente. Activar para ordenar descendente.",
        sortNone: ": No ordenado. Activar para ordenar ascendente.",
      },
      sortBy: "Ordenar por",
    },
    dataFooter: {
      itemsPerPageText: "Items por página:",
      itemsPerPageAll: "Todos",
      nextPage: "Página siguiente",
      prevPage: "Página anterior",
      firstPage: "Primera página",
      lastPage: "Última página",
      pageText: "{0}-{1} de {2}",
    },
    datePicker: {
      itemsSelected: "{0} seleccionado(s)",
    },
  },
  "10": "10",
  "25": "25",
  "50": "50",
  "100": "100",
};

export default esLocale;
