import { createClient } from '@supabase/supabase-js'

// As chaves ficam no arquivo .env (veja .env.example).
// A chave "anon" é pública por natureza: quem protege os dados são as regras (RLS) do banco.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)
export const supabase = isSupabaseConfigured ? createClient(url, key) : null
