import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// 🔒 EMAILS AUTORIZADOS - Apenas esses usuários podem acessar o painel
const ALLOWED_EMAILS = [
  'jrocha.jaqueline@gmail.com',
  'luizgferreira13@gmail.com',
  'eberlejulio@gmail.com',
];

export const authService = {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    // Validar se o email está na lista de permitidos
    if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      throw new Error('Este email não tem permissão para acessar o sistema');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Validação dupla: verificar novamente após login
    if (data.user && !ALLOWED_EMAILS.includes(data.user.email?.toLowerCase() || '')) {
      await supabase.auth.signOut();
      throw new Error('Acesso negado');
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return data.subscription;
  },
};
