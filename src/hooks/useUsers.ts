import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types'; // Use Profile type
import { useAuth } from './useAuth'; // Import useAuth

export function useUsers() {
  const [users, setUsers] = useState<Profile[]>([]); // Use Profile type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth(); // Get signUp function from useAuth

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      setError(error.message);
      setUsers([]);
    } else {
      setUsers(data as Profile[]); // Cast to Profile[]
    }
    setLoading(false);
  };

  // Modified addUser to use signUp from useAuth
  const addUser = async (userData: { name: string; email: string; password: string; role: 'admin' | 'manager' | 'staff'; status: 'active' | 'inactive' }) => {
    setLoading(true);
    setError(null);

    // First, sign up the user with email and password
    const { data: authData, error: authError } = await signUp(
      userData.email,
      userData.password,
      {
        name: userData.name,
        role: userData.role,
      }
    );

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return { error: authError };
    }

    // If signup is successful, the profile should have been created by the signUp function itself
    // We just need to refetch users to update the list
    await fetchUsers();
    return { data: authData.user };
  };

  const updateUser = async (id: string, userData: Partial<Profile>) => { // Use Profile type
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', id)
      .select();

    if (error) {
      setError(error.message);
      setLoading(false);
      return { error };
    } else {
      if (data) {
        setUsers((prev) => prev.map((user) => (user.id === id ? data[0] : user)));
      }
      setLoading(false);
      return { data };
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);

    // First, delete the user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return { error: authError };
    }

    // The RLS policy for profiles should allow authenticated users to delete their own profile
    // or an admin to delete any profile. For simplicity, we assume the profile will be
    // cascade deleted or handled by RLS. If not, a separate delete from 'profiles' would be needed.
    // For now, we'll just refetch to update the UI.
    await fetchUsers();
    return { data: true };
  };

  return { users, loading, error, fetchUsers, addUser, updateUser, deleteUser };
}
