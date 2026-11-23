import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getStoreId = (): string => {
  const storeId = import.meta.env.VITE_STORE_ID;
  if (!storeId) {
    throw new Error('VITE_STORE_ID não configurado');
  }
  return storeId;
};
