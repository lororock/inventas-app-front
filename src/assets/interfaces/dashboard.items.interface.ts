interface Item {
    id: number;
    roles: number[];
    icon: string;
    title: string;
    path: string;
}

export default interface DashboardItem {
    roles: number[];
    title: string;
    items: Item[];
}