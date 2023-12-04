export default interface EntityConfig {
  name: string;
  path: string;
  columns: columnTable[];
}

interface columnTable {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "center" | "end" | "start" | undefined;
}
