import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CompanySettings } from '../types';

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();

    if (error) {
      setError(error.message);
      setSettings(null);
    } else {
      setSettings(data as CompanySettings);
    }
    setLoading(false);
  };

  const updateCompanySettings = async (newSettings: Partial<CompanySettings>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .update(newSettings)
        .eq('id', settings?.id) // Assuming there's always one settings row with a known ID
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { error };
      }
      setSettings(data as CompanySettings);
      return { data };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, fetchCompanySettings, updateCompanySettings };
}
