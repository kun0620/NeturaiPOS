/*
  # Add stock management function

  1. Functions
    - `decrement_stock` - Safely decrement product stock
*/

-- Function to safely decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET stock = stock - quantity,
      updated_at = now()
  WHERE id = product_id 
    AND stock >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql;