import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, userData: { name: string; role?: 'admin' | 'manager' | 'staff' }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name, // Add name to user_metadata during sign-up
        },
      },
    });

    if (data.user && !error) {
      // Create profile in public.profiles table
      // The RLS policy "Authenticated users can create their own profile"
      // ensures that auth.uid() matches the id being inserted.
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name: userData.name,
        email: email, // Store email from auth
        role: userData.role || 'staff',
        status: 'active',
      });

      if (profileError) {
        // If profile creation fails, you might want to delete the auth user as well
        // to prevent orphaned auth entries. This is a more advanced error handling.
        console.error('Error creating user profile:', profileError);
        return { data: null, error: profileError };
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
