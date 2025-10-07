/*
  # Add username to profiles table and ensure RLS for profile creation

  1. Modified Tables
    - `profiles`
      - Add `username` (text, unique, not null)
  2. Security
    - Ensure RLS policy for `profiles` allows authenticated users to insert their own profile.
*/

-- Add username column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username text;
  END IF;
END $$;

-- Update existing rows to have a default username if null (e.g., for existing users before this migration)
-- This step is crucial if you have existing profiles without a username.
-- For new projects, this might not be strictly necessary but is good for robustness.
UPDATE profiles SET username = 'user_' || id WHERE username IS NULL;

-- Make username column unique and not null
ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;

-- Ensure RLS is enabled for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to create their own profile
-- This policy is critical for the signUp function in useAuth.ts to work correctly.
CREATE POLICY "Authenticated users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy to allow authenticated users to view their own profile
CREATE POLICY "Authenticated users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy to allow authenticated users to update their own profile
CREATE POLICY "Authenticated users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);