/*
      # Remove salesperson_name from company_settings table

      1. Modified Tables
        - `company_settings`
          - Remove `salesperson_name` column.
      2. Important Notes
        - This migration removes the `salesperson_name` column from the `company_settings` table.
        - The salesperson's name will now be derived solely from the logged-in user's `user_metadata.name` and recorded with each transaction.
    */

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'company_settings' AND column_name = 'salesperson_name'
      ) THEN
        ALTER TABLE company_settings DROP COLUMN salesperson_name;
      END IF;
    END $$;
