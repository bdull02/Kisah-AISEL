import { createClient } from '@supabase/supabase-js';

// Supabase credentials for "Kisah Kita"
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kitoiksmrhbbpzjhcgsx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RGpCpS9efjxnUKMr52dkIQ_O7yyalHw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};
