import React, { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as globalSupabaseClient } from '../../lib/supabase'; // Import the singleton client

interface SupabaseContextType {
  supabase: SupabaseClient | null;
}

const SupabaseContext = createContext<SupabaseContextType>({ supabase: null });

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Directly use the globally available singleton client from src/lib/supabase.ts
  // This ensures consistency and avoids multiple client instances.
  return (
    <SupabaseContext.Provider value={{ supabase: globalSupabaseClient }}>
      {children}
    </SupabaseContext.Provider>
  );
};
