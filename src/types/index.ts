export type PageType = 'dashboard' | 'pos' | 'inventory' | 'store' | 'users' | 'reports';

export interface NavigationItem {
  id: PageType;
  label: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface Transaction {
  id: string;
  date: string;
  total: number;
  items: number;
  status: 'completed' | 'pending' | 'refunded';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}
