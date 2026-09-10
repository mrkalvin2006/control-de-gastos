import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mfsvmjdjwpnqypdssprr.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2nUJ60XJgWRSOq1idmRAcw_u4XRWMT6';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Configúralas en tu archivo .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
