/*
  # Complete RetailHub Database Schema

  1. New Tables
    - `profiles` - User profiles with roles and status
    - `products` - Product inventory management
    - `transactions` - POS transaction records
    - `transaction_items` - Items in each transaction
    - `orders` - Online store orders
    - `order_items` - Items in each order

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public access for store browsing

  3. Functions
    - Stock management functions
    - Automatic profile creation
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at timestamptz DEFAULT now(),
  username text UNIQUE,
  avatar_url text,
  role text DEFAULT 'staff',
  status text DEFAULT 'active'
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) DEFAULT 0 NOT NULL,
  stock integer DEFAULT 0 NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id),
  total_amount numeric(10,2) DEFAULT 0 NOT NULL,
  tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
  payment_method text DEFAULT 'cash' NOT NULL,
  status text DEFAULT 'completed' NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer DEFAULT 1 NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL
);

ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Transaction items policies
CREATE POLICY "Users can view transaction items"
  ON transaction_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create transaction items"
  ON transaction_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address jsonb NOT NULL,
  total_amount numeric(10,2) DEFAULT 0 NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer DEFAULT 1 NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Order items policies
CREATE POLICY "Order items are viewable by authenticated users"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role, status)
  VALUES (new.id, new.email, 'staff', 'active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET stock = stock - quantity 
  WHERE id = product_id AND stock >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample products
INSERT INTO products (name, sku, description, price, stock, category) VALUES
('Wireless Headphones', 'WH-001', 'High-quality wireless headphones with noise cancellation', 79.99, 45, 'Electronics'),
('Smart Watch', 'SW-002', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 12, 'Electronics'),
('Coffee Maker', 'CM-003', 'Programmable coffee maker with thermal carafe', 89.99, 8, 'Appliances'),
('Yoga Mat', 'YM-004', 'Non-slip yoga mat with carrying strap', 29.99, 67, 'Sports'),
('Desk Lamp', 'DL-005', 'LED desk lamp with adjustable brightness', 39.99, 34, 'Home'),
('Backpack', 'BP-006', 'Water-resistant laptop backpack', 49.99, 23, 'Accessories'),
('Water Bottle', 'WB-007', 'Insulated stainless steel water bottle', 19.99, 89, 'Sports'),
('Notebook Set', 'NS-008', 'Set of 3 lined notebooks', 14.99, 156, 'Stationery')
ON CONFLICT (sku) DO NOTHING;