interface Item {
    id: number;
    rol: number;
    icon: string;
    title: string;
    path: string;
}

export default interface DashboardItem {
    roles: number[];
    title: string;
    items: Item[];
}