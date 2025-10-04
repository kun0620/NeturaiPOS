/*
      # Add or Update Admin User (Idempotent)

      This migration ensures the existence of an admin user with email `admin@retailhub.com` and username `admin_retailhub`.
      It is designed to be idempotent, meaning it can be run multiple times without causing errors like "duplicate key violation".

      1. User Management
        - Checks if a user with `admin@retailhub.com` already exists in `auth.users`.
        - If the user does not exist, a new user is created in `auth.users` with a hashed password.
        - **CRITICAL FIX**: Explicitly sets `confirmation_token` to an empty string (`''`) to prevent "converting NULL to string is unsupported" error from Supabase Auth service.
        - If the user already exists, their existing `id` is used.
      2. Profile Management
        - A corresponding profile is created or updated in `public.profiles` for the admin user.
        - If the profile does not exist, it is inserted.
        - If the profile already exists (identified by `id`), it is updated to ensure the `name`, `email`, `username`, `role` (set to 'admin'), and `status` are correct.
      3. Security
        - `SET ROLE postgres;` is used to temporarily elevate privileges, bypassing Row Level Security (RLS) on `auth.users` and `public.profiles` tables to ensure the operation succeeds.
        - `RESET ROLE;` restores the default role.

      Important Note: The `pgcrypto` extension must be enabled for password hashing (`gen_salt`, `crypt`) to function correctly.
    */

    DO $$
    DECLARE
      admin_user_id uuid;
      admin_email text := 'admin@retailhub.com';
      admin_password text := 'password123';
      admin_username text := 'admin_retailhub';
      hashed_password text;
    BEGIN
      -- Temporarily elevate privileges to bypass RLS for auth.users and profiles table
      SET ROLE postgres;

      -- Check if the admin user already exists in auth.users
      SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;

      IF admin_user_id IS NULL THEN
        -- User does not exist, proceed with insertion
        SELECT crypt(admin_password, gen_salt('bf', 8)) INTO hashed_password;

        INSERT INTO auth.users (
          instance_id,
          id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          last_sign_in_at,
          raw_app_meta_data,
          raw_user_meta_data,
          is_sso_user,
          created_at,
          updated_at,
          confirmation_token -- Explicitly add confirmation_token
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          admin_email,
          hashed_password,
          now(),
          now(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          '{}'::jsonb,
          FALSE,
          now(),
          now(),
          '' -- Set to empty string to avoid NULL conversion error
        )
        RETURNING id INTO admin_user_id;

        -- Insert into public.profiles table for the new user
        INSERT INTO public.profiles (
          id,
          name,
          email,
          username,
          role,
          status,
          created_at,
          updated_at
        ) VALUES (
          admin_user_id,
          'Admin User',
          admin_email,
          admin_username,
          'admin',
          'active',
          now(),
          now()
        );
      ELSE
        -- User already exists, ensure their profile is correct
        -- Update existing profile or insert if it doesn't exist (shouldn't happen if user exists)
        INSERT INTO public.profiles (
          id,
          name,
          email,
          username,
          role,
          status,
          created_at,
          updated_at
        ) VALUES (
          admin_user_id,
          'Admin User',
          admin_email,
          admin_username,
          'admin',
          'active',
          now(),
          now()
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          username = EXCLUDED.username,
          role = EXCLUDED.role,
          status = EXCLUDED.status,
          updated_at = now();
      END IF;

      -- Reset role to default
      RESET ROLE;
    END $$;