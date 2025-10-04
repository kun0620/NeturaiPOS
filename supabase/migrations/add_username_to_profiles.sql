/*
      # Add username to profiles table

      1. Modified Tables
        - `profiles`
          - Added `username` (text, unique, not null)
      2. Security
        - No changes to RLS policies, as `id` remains the primary identifier for policies.
    */

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'username'
      ) THEN
        ALTER TABLE profiles ADD COLUMN username text UNIQUE;
      END IF;
    END $$;

    -- Ensure existing profiles get a default username if the column was just added
    -- This is a placeholder; in a real scenario, you might prompt users to set a username.
    -- For now, we'll use a generated one if it's null.
    UPDATE profiles
    SET username = 'user_' || substring(id::text FROM 1 FOR 8)
    WHERE username IS NULL;

    -- Make username NOT NULL after ensuring all existing rows have a value
    ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;