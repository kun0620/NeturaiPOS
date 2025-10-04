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
  description?: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  user_id?: string;
  total_amount: number;
  tax_amount: number;
  payment_method: 'cash' | 'card';
  status: 'completed' | 'pending' | 'refunded';
  created_at: string;
  transaction_items?: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    name: string;
    sku: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: any;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    name: string;
    sku: string;
  };
}

export interface User {
  id: string;
  name: string;
  username: string; // Added username
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
