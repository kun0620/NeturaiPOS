/*
      # Update confirmation_token to prevent NULL issues

      This migration addresses the "converting NULL to string is unsupported" error
      by ensuring that the `confirmation_token` column in `auth.users` never contains `NULL` values.

      1. Schema Changes
        - Sets a default value of an empty string (`''`) for the `confirmation_token` column
          in `auth.users` to prevent future `NULL` insertions.
      2. Data Migration
        - Updates all existing rows in `auth.users` where `confirmation_token` is `NULL`
          to an empty string (`''`).
      3. Security
        - `SET ROLE postgres;` is used to temporarily elevate privileges, bypassing Row Level Security (RLS)
          on `auth.users` to ensure the update succeeds.
        - `RESET ROLE;` restores the default role.
    */

    DO $$
    BEGIN
      -- Temporarily elevate privileges to bypass RLS for auth.users table
      SET ROLE postgres;

      -- Set default value for confirmation_token to prevent future NULLs
      ALTER TABLE auth.users ALTER COLUMN confirmation_token SET DEFAULT '';

      -- Update existing NULL values to empty string
      UPDATE auth.users SET confirmation_token = '' WHERE confirmation_token IS NULL;

      -- Reset role to default
      RESET ROLE;
    END $$;