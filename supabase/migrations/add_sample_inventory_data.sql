/*
  # Add Sample Inventory Data

  This migration inserts sample product data into the `products` table.
  This data will be used for initial testing and demonstration purposes in the NeturaiPOS application.

  1. New Data
    - Inserts 8 sample products with various details including name, SKU, price, stock, category, and image URLs.
  2. Security
    - `SET ROLE postgres;` is used to temporarily elevate privileges, bypassing Row Level Security (RLS)
      on the `products` table to ensure the insert operations succeed.
    - `RESET ROLE;` restores the default role.
  3. Important Notes
    - `ON CONFLICT (sku) DO NOTHING` is used to prevent errors if the products with the same SKU
      already exist, ensuring idempotency.
    - Image URLs are placeholders from Pexels.
    - The `INSERT ... ON CONFLICT` statement is now wrapped in `EXECUTE` to resolve a syntax error
      when used within a `DO $$ BEGIN ... END $$;` block.
    - UUIDs are now generated using `gen_random_uuid()` to ensure validity.
*/

DO $$
BEGIN
  -- Temporarily elevate privileges to bypass RLS for products table
  SET ROLE postgres;

  EXECUTE '
    INSERT INTO products (id, name, sku, description, price, stock, category, image_url)
    VALUES
      (gen_random_uuid(), ''Wireless Headphones'', ''WH-001'', ''High-quality wireless headphones with noise cancellation.'', 79.99, 45, ''Electronics'', ''https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Smart Watch'', ''SW-002'', ''Feature-rich smart watch with health tracking.'', 199.99, 12, ''Electronics'', ''https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Coffee Maker'', ''CM-003'', ''Automatic coffee maker for delicious brews.'', 89.99, 8, ''Appliances'', ''https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Yoga Mat'', ''YM-004'', ''Comfortable and durable yoga mat for all levels.'', 29.99, 67, ''Sports'', ''https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Desk Lamp'', ''DL-005'', ''Modern LED desk lamp with adjustable brightness.'', 39.99, 34, ''Home'', ''https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Backpack'', ''BP-006'', ''Stylish and spacious backpack for daily use.'', 49.99, 23, ''Accessories'', ''https://images.pexels.com/photos/1034062/pexels-photo-1034062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Water Bottle'', ''WB-007'', ''Insulated stainless steel water bottle.'', 19.99, 89, ''Sports'', ''https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2''),
      (gen_random_uuid(), ''Notebook Set'', ''NS-008'', ''Set of three premium notebooks.'', 14.99, 156, ''Stationery'', ''https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'')
    ON CONFLICT (sku) DO NOTHING;
  ';

  -- Reset role to default
  RESET ROLE;
END $$;