export default interface SaleInterface {
  products: Product[];
  totalAmount: number;
  type: number;
  enterprise: Enterprise;
  inventory: Inventory;
  client?: Client;
  id: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  id: string;
  documentNumber: string;
  documentType: number;
  status: number;
  names: string;
  surnames: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
interface Inventory {
  id: string;
}
interface Enterprise {
  id: string;
  name: string;
  email: string;
  address: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}
interface Product {
  id: string;
  name: string;
  salePrice: string;
  quantity: number;
  subtotal: number;
}
