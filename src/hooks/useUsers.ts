import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setUsers(data as User[]);
    }
    setLoading(false);
  };

  const addUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select();

    if (error) {
      setError(error.message);
      setLoading(false);
      return { error };
    } else {
      if (data) {
        setUsers((prev) => [...prev, data[0]]);
      }
      setLoading(false);
      return { data };
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
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
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return { error };
    } else {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setLoading(false);
      return { data: true };
    }
  };

  return { users, loading, error, fetchUsers, addUser, updateUser, deleteUser };
}
