import { supabase } from '../lib/supabase'

/** Todos os números do dashboard vêm de uma função do banco (só admin executa). */
export async function fetchDashboard(days = 14) {
  const { data, error } = await supabase.rpc('admin_dashboard', { days })
  if (error) throw error
  return data
}
