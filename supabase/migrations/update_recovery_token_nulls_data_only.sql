/*
  # Update recovery_token to prevent NULL issues (Data Only)

  This migration addresses the "converting NULL to string is unsupported" error
  by ensuring that the `recovery_token` column in `auth.users` never contains `NULL` values.
  This version focuses solely on updating existing data, as direct schema alteration
  (like setting a default) on `auth.users` is restricted.

  1. Data Migration
    - Updates all existing rows in `auth.users` where `recovery_token` is `NULL`
      to an empty string (`''`).
  2. Security
    - `SET ROLE postgres;` is used to temporarily elevate privileges, bypassing Row Level Security (RLS)
      on `auth.users` to ensure the update succeeds.
    - `RESET ROLE;` restores the default role.

  Important Note: This migration only updates existing NULL values.
  For new users, ensure that `recovery_token` is explicitly set to a non-NULL value
  (e.g., an empty string) during user creation or by Supabase's internal logic.
*/

DO $$
BEGIN
  -- Temporarily elevate privileges to bypass RLS for auth.users table
  SET ROLE postgres;

  -- Update existing NULL values to empty string
  UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;

  -- Reset role to default
  RESET ROLE;
END $$;