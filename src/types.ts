export type PageType =
  | 'dashboard'
  | 'pos'
  | 'inventory'
  | 'store'
  | 'users'
  | 'reports'
  | 'documents'
  | 'settings'; // Add 'settings' to PageType

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
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

export interface Transaction {
  id: string;
  created_at: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  price_excluding_vat: number;
  payment_method: 'cash' | 'credit_card' | 'qr_payment';
  cash_tendered?: number;
  change_due?: number;
  transaction_items: TransactionItem[]; // Changed from 'items' to 'transaction_items' to match DB
  user_id: string;
  salesperson_name?: string; // Add salesperson_name to Transaction
}

export interface CompanySettings {
  id: string;
  company_name: string;
  company_address_line1: string;
  company_address_line2: string;
  company_address_line3: string;
  tax_id: string;
  phone: string;
  website: string;
  receipt_header_text: string;
  receipt_footer_text: string;
  vat_rate: number; // Stored as a decimal (e.g., 0.07 for 7%)
  created_at: string;
  updated_at: string;
}

// New Profile interface for the public.profiles table
export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  created_at: string;
}
