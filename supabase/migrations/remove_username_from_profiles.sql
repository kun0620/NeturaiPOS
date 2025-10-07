/*
  # Remove username from profiles table

  1. Modified Tables
    - `profiles`
      - Remove `username` column
  2. Important Notes
    - This migration removes the `username` column and its unique constraint.
    - Existing data in the `username` column will be lost.
*/

-- Drop the unique constraint on username if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_username_key'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_username_key;
  END IF;
END $$;

-- Drop the username column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles DROP COLUMN username;
  END IF;
END $$;