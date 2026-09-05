import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('YOUR_') &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('YOUR_')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '[VibeCraft UI] Supabase is running in mock/demo mode. To connect live Supabase Auth and PostgreSQL, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.'
  );
}
