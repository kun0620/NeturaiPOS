/*
  # Initial Schema for NeturaiPOS

  This migration sets up the core database schema for the NeturaiPOS application, including tables for user profiles, products, transactions, and orders.

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `name` (text, not null)
      - `email` (text, unique, not null)
      - `role` (text, not null, default 'staff', check: 'admin', 'manager', 'staff')
      - `status` (text, not null, default 'active', check: 'active', 'inactive')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `sku` (text, unique, not null)
      - `description` (text)
      - `price` (numeric, not null, default 0)
      - `stock` (integer, not null, default 0)
      - `category` (text, not null, default 'Uncategorized')
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `transactions`
      - `id` (uuid, primary key)
      - `transaction_number` (text, unique, not null)
      - `user_id` (uuid, foreign key to profiles.id, nullable)
      - `total_amount` (numeric, not null, default 0)
      - `tax_amount` (numeric, not null, default 0)
      - `payment_method` (text, not null, default 'cash', check: 'cash', 'card')
      - `status` (text, not null, default 'completed', check: 'completed', 'pending', 'refunded')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `transaction_items`
      - `id` (uuid, primary key)
      - `transaction_id` (uuid, foreign key to transactions.id, not null)
      - `product_id` (uuid, foreign key to products.id, not null)
      - `quantity` (integer, not null, default 1)
      - `unit_price` (numeric, not null, default 0)
      - `total_price` (numeric, not null, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique, not null)
      - `customer_name` (text, not null)
      - `customer_email` (text, not null)
      - `shipping_address` (jsonb)
      - `total_amount` (numeric, not null, default 0)
      - `status` (text, not null, default 'pending', check: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders.id, not null)
      - `product_id` (uuid, foreign key to products.id, not null)
      - `quantity` (integer, not null, default 1)
      - `unit_price` (numeric, not null, default 0)
      - `total_price` (numeric, not null, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all new tables.
    - Create RLS policies for `profiles` to allow users to manage their own data and admins/managers to view/manage all.
    - Create RLS policies for `products` to allow authenticated users to read, and admins/managers to manage.
    - Create RLS policies for `transactions` and `transaction_items` to allow staff/managers/admins to create/view/update.
    - Create RLS policies for `orders` and `order_items` to allow staff/managers/admins to create/view/update.
    - Add a helper SQL function `get_user_role()` to simplify RLS policies based on user roles from the `profiles` table.

  3. Important Notes
    - `updated_at` columns are added with a trigger to automatically update on row changes.
    - `transaction_number` and `order_number` default to a UUID string for uniqueness.
*/

-- Helper function to get the current user's role from the profiles table
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER AS $$
  DECLARE
    user_role text;
  BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN user_role;
  END;
$$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: Users can select their own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles: Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: Admins and Managers can select all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (get_user_role() IN ('admin', 'manager'));

CREATE POLICY "Profiles: Admins can insert profiles"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "Profiles: Admins can update all profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (get_user_role() = 'admin');

CREATE POLICY "Profiles: Admins can delete profiles"
  ON profiles FOR DELETE TO authenticated
  USING (get_user_role() = 'admin');

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0 CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category text NOT NULL DEFAULT 'Uncategorized',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products: Authenticated users can select all products"
  ON products FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Products: Admins and Managers can manage products"
  ON products FOR ALL TO authenticated
  USING (get_user_role() IN ('admin', 'manager'))
  WITH CHECK (get_user_role() IN ('admin', 'manager'));

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  tax_amount numeric NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card')),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transactions: Staff, Managers, Admins can select all transactions"
  ON transactions FOR SELECT TO authenticated
  USING (get_user_role() IN ('staff', 'manager', 'admin'));

CREATE POLICY "Transactions: Staff, Managers, Admins can insert transactions"
  ON transactions FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('staff', 'manager', 'admin'));

CREATE POLICY "Transactions: Staff, Managers, Admins can update transactions"
  ON transactions FOR UPDATE TO authenticated
  USING (get_user_role() IN ('staff', 'manager', 'admin'))
  WITH CHECK (get_user_role() IN ('staff', 'manager', 'admin'));

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  total_price numeric NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transaction Items: Staff, Managers, Admins can select all transaction items"
  ON transaction_items FOR SELECT TO authenticated
  USING (get_user_role() IN ('staff', 'manager', 'admin'));

CREATE POLICY "Transaction Items: Staff, Managers, Admins can insert transaction items"
  ON transaction_items FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('staff', 'manager', 'admin'));

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address jsonb,
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders: Authenticated users can select their own orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.email() = customer_email); -- Assuming customer_email links to auth.email for self-service

CREATE POLICY "Orders: Staff, Managers, Admins can select all orders"
  ON orders FOR SELECT TO authenticated
  USING (get_user_role() IN ('staff', 'manager', 'admin'));

CREATE POLICY "Orders: Staff, Managers, Admins can insert orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('staff', 'manager', 'admin'));

CREATE POLICY "Orders: Staff, Managers, Admins can update orders"
  ON orders FOR UPDATE TO authenticated
  USING (get_user_role() IN ('staff', 'manager', 'admin'))
  WITH CHECK (get_user_role() IN ('staff', 'manager', 'admin'));

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  total_price numeric NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order Items: Authenticated users can select their order items"
  ON order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND auth.email() = orders.customer_email));

CREATE POLICY "Order Items: Staff, Managers, Admins can select all order items"
  ON order_items FOR SELECT TO authenticated
  USING (get_user_role() IN ('staff', 'manager', 'admin'));

CREATE POLICY "Order Items: Staff, Managers, Admins can insert order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('staff', 'manager', 'admin'));

-- Function to update updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_items_updated_at
BEFORE UPDATE ON transaction_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();