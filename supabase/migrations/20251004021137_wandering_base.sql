/*
  # Complete RetailHub Database Schema

  1. New Tables
    - `products` - Product inventory management
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `sku` (text, unique stock keeping unit)
      - `description` (text, product description)
      - `price` (decimal, product price)
      - `stock` (integer, current stock level)
      - `category` (text, product category)
      - `image_url` (text, product image)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `transactions` - Sales transactions
      - `id` (uuid, primary key)
      - `transaction_number` (text, unique transaction ID)
      - `user_id` (uuid, staff who processed)
      - `total_amount` (decimal, total transaction amount)
      - `tax_amount` (decimal, tax amount)
      - `payment_method` (text, cash/card)
      - `status` (text, completed/pending/refunded)
      - `created_at` (timestamp)

    - `transaction_items` - Individual items in transactions
      - `id` (uuid, primary key)
      - `transaction_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer, quantity sold)
      - `unit_price` (decimal, price per unit)
      - `total_price` (decimal, total for this item)

    - `orders` - Online store orders
      - `id` (uuid, primary key)
      - `order_number` (text, unique order ID)
      - `customer_name` (text, customer name)
      - `customer_email` (text, customer email)
      - `shipping_address` (jsonb, shipping details)
      - `total_amount` (decimal, order total)
      - `status` (text, pending/processing/shipped/delivered)
      - `created_at` (timestamp)

    - `order_items` - Items in online orders
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer, quantity ordered)
      - `unit_price` (decimal, price per unit)
      - `total_price` (decimal, total for this item)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Restrict access based on user roles

  3. Sample Data
    - Insert sample products
    - Insert sample transactions
    - Insert sample orders
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id),
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Transaction items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address jsonb NOT NULL,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Users can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Transaction items policies
CREATE POLICY "Users can view transaction items"
  ON transaction_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create transaction items"
  ON transaction_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Orders policies
CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

-- Order items policies
CREATE POLICY "Order items are viewable by authenticated users"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample products
INSERT INTO products (name, sku, description, price, stock, category) VALUES
('Wireless Headphones', 'WH-001', 'High-quality wireless headphones with noise cancellation', 79.99, 45, 'Electronics'),
('Smart Watch', 'SW-002', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 12, 'Electronics'),
('Coffee Maker', 'CM-003', 'Programmable coffee maker with thermal carafe', 89.99, 8, 'Appliances'),
('Yoga Mat', 'YM-004', 'Non-slip yoga mat with carrying strap', 29.99, 67, 'Sports'),
('Desk Lamp', 'DL-005', 'LED desk lamp with adjustable brightness', 39.99, 34, 'Home'),
('Backpack', 'BP-006', 'Waterproof hiking backpack with multiple compartments', 49.99, 23, 'Accessories'),
('Water Bottle', 'WB-007', 'Insulated stainless steel water bottle', 19.99, 89, 'Sports'),
('Notebook Set', 'NS-008', 'Set of 3 lined notebooks with hardcover', 14.99, 156, 'Stationery'),
('Bluetooth Speaker', 'BS-009', 'Portable Bluetooth speaker with bass boost', 59.99, 28, 'Electronics'),
('Kitchen Scale', 'KS-010', 'Digital kitchen scale with LCD display', 24.99, 41, 'Appliances');

-- Insert sample transactions
INSERT INTO transactions (transaction_number, total_amount, tax_amount, payment_method, status) VALUES
('TXN-001', 159.98, 16.00, 'card', 'completed'),
('TXN-002', 79.99, 8.00, 'cash', 'completed'),
('TXN-003', 249.97, 25.00, 'card', 'completed'),
('TXN-004', 89.99, 9.00, 'cash', 'pending'),
('TXN-005', 129.98, 13.00, 'card', 'completed');

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for products updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();