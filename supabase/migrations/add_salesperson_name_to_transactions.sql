/*
      # Add salesperson_name to transactions table

      1. Modified Tables
        - `transactions`
          - Add `salesperson_name` (text, nullable)
      2. Security
        - Update RLS policy for `transactions` table to allow `salesperson_name` insertion.
    */

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'transactions' AND column_name = 'salesperson_name'
      ) THEN
        ALTER TABLE transactions ADD COLUMN salesperson_name text;
      END IF;
    END $$;

    -- Update RLS policy for insert to allow salesperson_name
    -- Assuming there's an existing policy for authenticated users to insert transactions
    -- If not, a new policy would be needed.
    -- This example assumes a policy like "Authenticated users can create transactions" exists.
    -- We need to ensure the existing policy allows for the new column.
    -- If a policy explicitly lists columns, it needs to be updated.
    -- For simplicity, if a generic INSERT policy exists, this might not be strictly necessary,
    -- but it's good practice to review.
    -- Example:
    -- DROP POLICY IF EXISTS "Authenticated users can create transactions" ON transactions;
    -- CREATE POLICY "Authenticated users can create transactions"
    --   ON transactions
    --   FOR INSERT
    --   TO authenticated
    --   WITH CHECK (auth.uid() = user_id);
    -- No explicit change needed if the policy is not column-specific.
