import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

// เพิ่ม console.log เพื่อตรวจสอบว่า Service Role Key ถูกโหลดหรือไม่
console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'Not Loaded');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'Not Loaded');
console.log('Supabase Service Role Key:', supabaseServiceRoleKey ? 'Loaded' : 'Not Loaded');
if (!supabaseServiceRoleKey) {
  console.warn('VITE_SUPABASE_SERVICE_ROLE_KEY is not loaded. Admin functions may fail.');
}


let _supabase: SupabaseClient | null = null;
let _adminSupabase: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
};

export const getAdminSupabaseClient = (): SupabaseClient => {
  if (!_adminSupabase) {
    if (!supabaseServiceRoleKey) {
      throw new Error('Supabase Service Role Key must be provided for admin client.');
    }
    _adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return _adminSupabase;
};

export const supabase = getSupabaseClient();
export const adminSupabase = getAdminSupabaseClient();
