import { supabase } from '../lib/supabase'

const toSlot = (row) => ({ id: row.id, startsAt: row.starts_at, status: row.status ?? 'available' })

// ---------- site público ----------
/** Próximos horários livres (o banco já esconde passados e reservados). */
export async function fetchAvailableSlots(limit = 80) {
  const { data, error } = await supabase
    .from('available_slots')
    .select('id, starts_at')
    .eq('status', 'available')
    .gt('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data.map(toSlot)
}

/** Estatística anônima do pedido de sessão (sem nome nem contato). */
export function trackScheduleRequest({ topic, period, slotId }) {
  if (!supabase) return
  supabase
    .from('schedule_requests')
    .insert({ topic: topic || null, period: period || null, slot_id: slotId || null })
    .then(() => {}, () => {})
}

// ---------- painel admin ----------
export async function fetchUpcomingSlots() {
  const { data, error } = await supabase
    .from('available_slots')
    .select('id, starts_at, status')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(500)
  if (error) throw error
  return data.map(toSlot)
}

/** Cria vários horários de uma vez; horários que já existem são ignorados. */
export async function createSlots(isoList) {
  const rows = isoList.map((iso) => ({ starts_at: new Date(iso).toISOString() }))
  const { data, error } = await supabase
    .from('available_slots')
    .upsert(rows, { onConflict: 'starts_at', ignoreDuplicates: true })
    .select('id')
  if (error) throw error
  return data.length
}

export async function setSlotStatus(id, status) {
  const { error } = await supabase.from('available_slots').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteSlots(ids) {
  const { error } = await supabase.from('available_slots').delete().in('id', ids)
  if (error) throw error
}
