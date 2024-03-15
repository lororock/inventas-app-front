export default interface EntityConfig {
  name: string;
  path: string;
  columns: columnTable[];
  formComponent?: Object | undefined | null | any;
}

export interface columnTable {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "center" | "end" | "start" | undefined;
}
