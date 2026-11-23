import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: mostrar se as variáveis estão sendo lidas
console.log('[SUPABASE] URL:', supabaseUrl ? '✅ Configurada' : '❌ Vazia');
console.log('[SUPABASE] ANON KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Vazia');
console.log('[SUPABASE] STORE_ID:', import.meta.env.VITE_STORE_ID ? '✅ Configurada' : '❌ Vazia');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] Variáveis de ambiente:', {
    VITE_SUPABASE_URL: supabaseUrl || 'undefined',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'existe mas está oculta' : 'undefined'
  });
  throw new Error('Variáveis de ambiente Supabase não configuradas');
}

console.log('[SUPABASE] Cliente criado com sucesso!');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getStoreId = (): string => {
  const storeId = import.meta.env.VITE_STORE_ID;
  if (!storeId) {
    throw new Error('VITE_STORE_ID não configurado');
  }
  return storeId;
};
