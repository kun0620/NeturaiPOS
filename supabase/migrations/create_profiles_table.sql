/*
      # Create profiles table

      1. New Tables
        - `profiles`
          - `id` (uuid, primary key, references auth.users.id)
          - `updated_at` (timestamp, nullable)
          - `username` (text, unique, nullable)
          - `avatar_url` (text, nullable)
      2. Security
        - Enable RLS on `profiles` table
        - Add policies for authenticated users to:
          - Select their own profile
          - Insert their own profile
          - Update their own profile
    */

    CREATE TABLE IF NOT EXISTS profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      updated_at timestamptz DEFAULT now(),
      username text UNIQUE,
      avatar_url text
    );

    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Public profiles are viewable by everyone."
      ON profiles FOR SELECT
      USING (true);

    CREATE POLICY "Users can insert their own profile."
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can update their own profile."
      ON profiles FOR UPDATE
      USING (auth.uid() = id);