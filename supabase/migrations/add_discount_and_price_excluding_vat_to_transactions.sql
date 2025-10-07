/*
  # Add discount_amount and price_excluding_vat to transactions table

  1. Modified Tables
    - `transactions`
      - Add `discount_amount` (numeric, default 0)
      - Add `price_excluding_vat` (numeric, default 0)
  2. Security
    - No changes to RLS policies.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE transactions ADD COLUMN discount_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'price_excluding_vat'
  ) THEN
    ALTER TABLE transactions ADD COLUMN price_excluding_vat numeric DEFAULT 0;
  END IF;
END $$;
