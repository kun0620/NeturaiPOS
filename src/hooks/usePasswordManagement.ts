import { useState } from 'react';
import { supabase, adminSupabase } from '../lib/supabase'; // Import adminSupabase
import { useAuth } from './useAuth';

export const usePasswordManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Function for a user to change their own password
  const updateUserPassword = async (newPassword: string) => {
    setLoading(true);
    clearMessages();
    try {
      if (!user) {
        throw new Error('User not authenticated.');
      }
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess('Password updated successfully!');
      return { success: true, data };
    } catch (err: any) {
      console.error('Failed to update user password:', err.message);
      setError(err.message || 'Failed to update password.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Function for an admin to change another user's password
  const updateUserPasswordAsAdmin = async (userId: string, newPassword: string) => {
    setLoading(true);
    clearMessages();
    try {
      // Use the adminSupabase client for admin operations
      const { data, error: adminUpdateError } = await adminSupabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (adminUpdateError) {
        throw adminUpdateError;
      }

      setSuccess('User password updated successfully by admin!');
      return { success: true, data };
    } catch (err: any) {
      console.error('Failed to update user password as admin:', err.message);
      setError(err.message || 'Failed to update password as admin.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    updateUserPassword,
    updateUserPasswordAsAdmin,
    clearMessages,
  };
};
