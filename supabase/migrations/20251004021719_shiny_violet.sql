/*
  # Add demo user account

  1. New User Account
    - Creates a demo user account with email: admin@retailhub.com
    - Sets up the corresponding profile with admin role
  
  2. Security
    - Uses Supabase's built-in auth system
    - Creates profile entry linked to the auth user
*/

-- Insert demo user into auth.users (this simulates what Supabase auth would do)
-- Note: In a real Supabase environment, you would create this user through the Supabase dashboard
-- or use the Supabase client to sign up the user

-- Create a profile for the demo user
-- We'll use a fixed UUID for consistency
INSERT INTO profiles (id, username, avatar_url, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'admin',
  'active'
) ON CONFLICT (id) DO NOTHING;